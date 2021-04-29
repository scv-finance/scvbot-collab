import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import Chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { ethers } from 'hardhat'
import { before } from 'mocha'
import {
  MockACS,
  MockBUSD,
  MockNFT,
  SCVxACSMinter,
} from '../artifacts/typechain'

Chai.use(chaiAsPromised)

describe('SCV x ACS', function () {
  const STAKING_AMOUNT = ethers.utils.parseEther('5')
  const BOT_PRICE = ethers.utils.parseEther('10')

  // instances
  let iVault: MockACS
  let iERC20: MockBUSD
  let iNFT: MockNFT
  let iMinter: SCVxACSMinter
  // mocked wallets & addresses
  let owner: SignerWithAddress
  let pauser: SignerWithAddress
  let someone: SignerWithAddress
  let ownerAddress: string
  let pauserAddress: string
  let someoneAddress: string

  before(async () => {
    ;[owner, pauser, someone] = await ethers.getSigners()
    ownerAddress = await owner.getAddress()
    pauserAddress = await pauser.getAddress()
    someoneAddress = await someone.getAddress()
  })

  it('Deploy Mocks', async () => {
    const MockACSContract = await ethers.getContractFactory('MockACS')
    let contract = await MockACSContract.deploy()
    let tx = await contract.deployed()
    iVault = (tx as any) as MockACS
    await tx.deployTransaction.wait()

    const MockBUSDContract = await ethers.getContractFactory('MockBUSD')
    contract = await MockBUSDContract.deploy()
    tx = await contract.deployed()
    iERC20 = (tx as any) as MockBUSD
    await tx.deployTransaction.wait()

    const MockNFTContract = await ethers.getContractFactory('MockNFT')
    contract = await MockNFTContract.deploy()
    tx = await contract.deployed()
    iNFT = (tx as any) as MockNFT
    await tx.deployTransaction.wait()
  })

  it('Deploy NFT', async () => {
    const SCVxACSContract = await ethers.getContractFactory('SCVxACSMinter')
    const contract = await SCVxACSContract.deploy(
      iVault.address,
      iVault.address,
      STAKING_AMOUNT,
      iERC20.address,
      BOT_PRICE,
      iNFT.address,
      100,
    )

    const tx = await contract.deployed()
    iMinter = (tx as any) as SCVxACSMinter
    await tx.deployTransaction.wait()

    await expect(iMinter.botPrice()).to.eventually.equal(BOT_PRICE)
    await expect(iMinter.buyWithToken()).to.eventually.equal(iERC20.address)
    await expect(iMinter.nftToken()).to.eventually.equal(iNFT.address)
    await expect(iMinter.requiredTokenAmount()).to.eventually.equal(
      STAKING_AMOUNT,
    )
    await expect(iMinter.paused()).to.eventually.equal(false)
  })

  it('Owner role needed', async () => {
    const contract = iMinter.connect(someone)

    await expect(contract.setAmount(STAKING_AMOUNT)).to.be.rejectedWith(
      'admin role',
    )
    await expect(
      contract.setBuyWithToken('0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee'),
    ).to.be.rejectedWith('admin role')
    await expect(contract.setPrice(BOT_PRICE)).to.be.rejectedWith('admin role')
  })

  it('Pauser role needed', async () => {
    const contract = iMinter.connect(someone)
    await expect(contract.pause()).to.be.rejectedWith('pauser role')
  })

  it('Update successfully as owner', async () => {
    const amt = ethers.utils.parseEther('1')
    const contract = iMinter.connect(owner)

    await contract.setAmount(amt)
    await expect(contract.requiredTokenAmount()).to.eventually.eq(amt)
  })

  it('Pause successfully with PAUSER_ROLE', async () => {
    let contract = iMinter.connect(owner)
    const PAUSER_ROLE = await contract.PAUSER_ROLE()
    await contract.grantRole(PAUSER_ROLE, pauserAddress)

    contract = iMinter.connect(pauser)
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

  it('Mint token and fail for balance', async () => {
    const contract = iMinter.connect(someone)
    await expect(contract.mint()).to.be.rejectedWith('exceeds balance')
  })

  it('Send ERC20 to someone', async () => {
    const contract = iERC20.connect(owner)
    const amt = ethers.utils.parseEther('10')
    await contract.transfer(someoneAddress, amt)
    await expect(contract.balanceOf(someoneAddress)).to.eventually.eq(amt)
  })

  it('Mint token and fail for allowance', async () => {
    const contract = iMinter.connect(someone)
    await expect(contract.mint()).to.be.rejectedWith('exceeds allowance')
  })

  it('Mint token', async () => {
    const erc20 = iERC20.connect(someone)
    // approve for contract to transfer 10
    await erc20.approve(iMinter.address, ethers.utils.parseEther('10'))
    // mint the token
    const contract = iMinter.connect(someone)
    await contract.mint()

    // fixed SCV reward address
    await expect(
      erc20.balanceOf('0x079a889eB69013d451EcF45377258948116e2b3e'),
    ).to.eventually.eq(ethers.utils.parseEther('2'))
    // fixed ACS reward address
    await expect(
      erc20.balanceOf('0x8650ab7e2C53E705d484c3b98bE14C1Ba1e8D690'),
    ).to.eventually.eq(ethers.utils.parseEther('8'))
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
