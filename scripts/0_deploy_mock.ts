import { ethers } from 'hardhat'

// used to deploy mocks
async function deployMock(contract: string) {
  const MockContract = await ethers.getContractFactory(contract)
  const iMock = await MockContract.deploy()
  const tx = await iMock.deployed()
  const receipt = await tx.deployTransaction.wait()
  console.log({ receipt })
  console.log(`Contract ${contract} deployed to: ${iMock.address}`)
  return iMock.address
}

async function main() {
  await deployMock('MockACS')
  await deployMock('MockNFT')
  // There are B-USD on testnet that can be used
  // await deployMock('MockBUSD')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
