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
  await deployMock('MockACS')
  await deployMock('MockBUSD')
  await deployMock('MockNFT')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
