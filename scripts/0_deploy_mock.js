// used to deploy mocks
async function deployMock(contract) {
  const MockContract = await global.ethers.getContractFactory(contract)
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
