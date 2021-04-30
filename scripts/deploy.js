import fs from 'fs'

// used to deploy mocks
async function deployMock(contract) {
  const MockContract = await global.ethers.getContractFactory(contract)
  const iMock = await MockContract.deploy()
  const tx = await iMock.deployed()
  const receipt = await tx.deployTransaction.wait()
  console.log({ receipt })
  console.log('Contract deployed to:', iMock.address)
}

async function main() {
  const STAKING_AMOUNT = ethers.utils.parseEther('5')
  const BOT_PRICE = ethers.utils.parseEther('10')

  const addresses = fs.readFileSync(`./addresses.json`)
  const { chainId } = await global.ethers.provider.getNetwork()
  const { BUSD, ACSController, ACSVault, SCVNFT } = addresses[chainId]

  if (!(BUSD && ACSController && ACSVault && SCVNFT)) {
    console.error('Not enough address info in ./addresses.json')
    return
  }

  const MinterContract = await global.ethers.getContractFactory('SCVxACSMinter')
  const SCVxACSMinter = await MinterContract.deploy(
    ACSVault,
    ACSController,
    STAKING_AMOUNT,
    BUSD,
    BOT_PRICE,
    SCVNFT,
    100,
  )
  const tx = await SCVxACSMinter.deployed()
  const receipt = await tx.deployTransaction.wait()
  console.log(receipt)
  console.log('Contract deployed to:', SCVxACSMinter.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
