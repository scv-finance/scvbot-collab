import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import Chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { ethers } from 'hardhat'
import { before } from 'mocha'
import {
  ERC20Minter,
  MockBUSD,
  MockERC20,
  MockNFT,
} from '../artifacts/typechain'

Chai.use(chaiAsPromised)

describe('ERC20Minter', function () {
  const STAKING_AMOUNT = ethers.utils.parseEther('10')
  const BOT_PRICE = ethers.utils.parseEther('10')
  const CP_REWARD = '0x8650ab7e2C53E705d484c3b98bE14C1Ba1e8D690'
  const SCV_REWARD = '0x079a889eB69013d451EcF45377258948116e2b3e'

  // instances
  let iERC20: MockERC20
  let iBUSD: MockBUSD
  let iNFT: MockNFT
  let iMinter: ERC20Minter

  // mocked wallets & addresses
  let owner: SignerWithAddress
  let pauser: SignerWithAddress
  let operator: SignerWithAddress
  let someone: SignerWithAddress
  let operatorAddress: string
  let pauserAddress: string
  let someoneAddress: string

  before(async () => {
    ;[owner, pauser, operator, someone] = await ethers.getSigners()

    pauserAddress = await pauser.getAddress()
    someoneAddress = await someone.getAddress()
    operatorAddress = await operator.getAddress()
  })

  it('Deploy Mocks', async () => {
    const MockERC20 = await ethers.getContractFactory('MockERC20')
    iERC20 = (await MockERC20.deploy()) as MockERC20
    await iERC20.deployTransaction.wait()

    const MockBUSDContract = await ethers.getContractFactory('MockBUSD')
    iBUSD = (await MockBUSDContract.deploy()) as MockBUSD
    await iBUSD.deployTransaction.wait()

    const MockNFTContract = await ethers.getContractFactory('MockNFT')
    iNFT = (await MockNFTContract.deploy()) as MockNFT
    await iNFT.deployTransaction.wait()
  })

  it('Deploy Minter', async () => {
    const MinterContract = await ethers.getContractFactory('ERC20Minter')
    iMinter = (await MinterContract.deploy(
      iERC20.address,
      STAKING_AMOUNT,
      CP_REWARD,
    )) as ERC20Minter
    await iMinter.deployTransaction.wait()

    let tx = await iMinter.setPayByToken(iBUSD.address)
    await tx.wait()
    tx = await iMinter.setNFTToken(iNFT.address)
    await tx.wait()
    tx = await iMinter.setBaseSpecId(100)
    await tx.wait()

    await expect(iMinter.price()).to.eventually.equal(BOT_PRICE)
    await expect(iMinter.payBy()).to.eventually.equal(iBUSD.address)
    await expect(iMinter.requiredToken()).to.eventually.equal(iERC20.address)
    await expect(iMinter.requiredTokenAmount()).to.eventually.equal(
      STAKING_AMOUNT,
    )
    await expect(iMinter.nftToken()).to.eventually.equal(iNFT.address)
    await expect(iMinter.paused()).to.eventually.equal(false)
  })

  it('OPERATOR_ROLE needed', async () => {
    const contract = iMinter.connect(someone)

    const msg = 'operator role'
    const addr = '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee'
    await expect(
      contract.setRequiredTokenAmount(STAKING_AMOUNT),
    ).to.be.rejectedWith(msg)
    await expect(contract.setPayByToken(addr)).to.be.rejectedWith(msg)
    await expect(contract.setPrice(BOT_PRICE)).to.be.rejectedWith(msg)
    await expect(contract.setNFTToken(addr)).to.be.rejectedWith(msg)
  })

  it('PAUSER_ROLE needed', async () => {
    const contract = iMinter.connect(someone)
    await expect(contract.pause()).to.be.rejectedWith('pauser role')
  })

  it('Grant roles', async () => {
    let contract = iMinter.connect(owner)
    const OPERATOR_ROLE = await contract.OPERATOR_ROLE()
    await contract.grantRole(OPERATOR_ROLE, operatorAddress)
    const PAUSER_ROLE = await contract.PAUSER_ROLE()
    await contract.grantRole(PAUSER_ROLE, pauserAddress)

    await expect(
      contract.hasRole(OPERATOR_ROLE, operatorAddress),
    ).to.eventually.eq(true)
    await expect(
      contract.hasRole(PAUSER_ROLE, operatorAddress),
    ).to.eventually.eq(false)
  })

  it('Update successfully with OPERATOR_ROLE', async () => {
    const amt = ethers.utils.parseEther('1')
    const contract = iMinter.connect(operator)
    await contract.setRequiredTokenAmount(amt)
    await expect(contract.requiredTokenAmount()).to.eventually.eq(amt)
  })

  it('Pause successfully with PAUSER_ROLE', async () => {
    const contract = iMinter.connect(pauser)
    await contract.pause()
    await expect(contract.paused()).to.eventually.eq(true)
  })

  it('Failed to mint when paused', async () => {
    const contract = iMinter.connect(someone)
    await expect(contract.mint()).to.be.rejectedWith('paused')
  })

  it('Unpause successfully with PAUSER_ROLE', async () => {
    const contract = iMinter.connect(pauser)
    await contract.unpause()
  })

  it('Mint token and fail for required balance', async () => {
    const contract = iMinter.connect(someone)
    await expect(contract.mint()).to.be.rejectedWith('not enough tokens')
  })

  it('Send required ERC20 to someone', async () => {
    const contract = iERC20.connect(owner)
    const amt = ethers.utils.parseEther('10')
    await contract.transfer(someoneAddress, amt)
    await expect(contract.balanceOf(someoneAddress)).to.eventually.eq(amt)

    const minter = iMinter.connect(someone)
    await expect(minter.amountInVault(someoneAddress)).to.eventually.eq(amt)
  })

  it('Mint token and fail for payBy balance', async () => {
    const contract = iMinter.connect(someone)
    await expect(contract.mint()).to.be.rejectedWith('exceeds balance')
  })

  it('Send required payBy ERC20 to someone', async () => {
    const contract = iBUSD.connect(owner)
    const amt = ethers.utils.parseEther('10')
    await contract.transfer(someoneAddress, amt)
    await expect(contract.balanceOf(someoneAddress)).to.eventually.eq(amt)
  })

  it('Mint token and fail for payBy allowance', async () => {
    const contract = iMinter.connect(someone)
    await expect(contract.mint()).to.be.rejectedWith('exceeds allowance')
  })

  it('Mint token', async () => {
    const erc20 = iBUSD.connect(someone)
    // approve for contract to transfer 10
    await erc20.approve(iMinter.address, ethers.utils.parseEther('10000'))
    // mint the token
    const contract = iMinter.connect(someone)
    await contract.mint()

    const cpShare = await contract.cpShare()

    // fixed SCV reward address
    await expect(erc20.balanceOf(SCV_REWARD)).to.eventually.eq(
      ethers.utils.parseEther((10 - cpShare).toString()),
    )
    // fixed CP reward address
    await expect(erc20.balanceOf(CP_REWARD)).to.eventually.eq(
      ethers.utils.parseEther(cpShare.toString()),
    )
    // no erc20 token left
    await expect(erc20.balanceOf(someoneAddress)).to.eventually.eq(
      ethers.utils.parseEther('0'),
    )

    // should have 1 NFT
    await expect(iNFT.balanceOf(someoneAddress)).to.eventually.eq(1)
    await expect(iNFT.tokenURI(0)).to.eventually.match(
      /^ipfs:\/\/mock\/10[0-3]\.json$/,
    )
  })
})
