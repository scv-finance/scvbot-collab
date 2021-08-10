import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import Chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { ethers } from 'hardhat'
import { before } from 'mocha'
import {
  BSCNewsMinter,
  MockBUSD,
  MockERC20,
  MockNFT,
} from '../artifacts/typechain'

Chai.use(chaiAsPromised)

describe('BSCNewsMinter', function () {
  const BOT_PRICE = ethers.utils.parseEther('10')
  const SCV_REWARD = '0x079a889eB69013d451EcF45377258948116e2b3e'

  // instances
  let iERC20: MockERC20
  let iBUSD: MockBUSD
  let iNFT: MockNFT
  let iMinter: BSCNewsMinter

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
    const MinterContract = await ethers.getContractFactory('BSCNewsMinter')
    iMinter = (await MinterContract.deploy()) as BSCNewsMinter
    await iMinter.deployTransaction.wait()
    await expect(iMinter.cpReward()).to.eventually.equal('0x0000000000000000000000000000000000000000')
    await expect(iMinter.cpShare()).to.eventually.equal(0)
    await expect(iMinter.maxAmount()).to.eventually.equal(500)
    await expect(iMinter.mintedAmount()).to.eventually.equal(0)
    await expect(iMinter.requiredTokenAmount()).to.eventually.equal(0)

    let tx = await iMinter.setPayByToken(iBUSD.address)
    await tx.wait()
    tx = await iMinter.setNFTToken(iNFT.address)
    await tx.wait()
    tx = await iMinter.setBaseSpecId(100)
    await tx.wait()

    await expect(iMinter.price()).to.eventually.equal(BOT_PRICE)
    await expect(iMinter.payBy()).to.eventually.equal(iBUSD.address)
    await expect(iMinter.requiredTokenAmount()).to.eventually.equal(0)
    await expect(iMinter.nftToken()).to.eventually.equal(iNFT.address)
    await expect(iMinter.paused()).to.eventually.equal(false)
  })

  it('OPERATOR_ROLE needed', async () => {
    const STAKING_AMOUNT = ethers.utils.parseEther('10')
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
    const amt0 = ethers.utils.parseEther('0')
    const amt1 = ethers.utils.parseEther('1')
    const contract = iMinter.connect(operator)
    await contract.setRequiredTokenAmount(amt1)
    await expect(contract.requiredTokenAmount()).to.eventually.eq(amt1)
    await contract.setRequiredTokenAmount(amt0)
    await expect(contract.requiredTokenAmount()).to.eventually.eq(amt0)
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

  it('Mint token and fail for not enough nfts', async() => {
    const amt = ethers.utils.parseEther('0')
    const minter = iMinter.connect(someone)
    await expect(minter.amountInVault(someoneAddress)).to.eventually.eq(amt)

    const erc20 = iBUSD.connect(owner)
    await erc20.transfer(someoneAddress, ethers.utils.parseEther('100'))
    await expect(iMinter.connect(someone).setMaxAmount(1)).to.be.rejectedWith('must have operator role to set max amount')
    await iMinter.connect(operator).setMaxAmount(1)
    await expect(minter.mint()).to.be.rejectedWith('not enough nfts')
  })
})
