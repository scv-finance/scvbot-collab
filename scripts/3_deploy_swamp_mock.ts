import { ethers } from 'hardhat'

async function main() {
  const { chainId } = await ethers.provider.getNetwork()
  console.log(`Deploying to chain ${chainId}`)

  const Contract = await ethers.getContractFactory('MockSwampFarm')
  const minter = await Contract.deploy()
  console.log(`Waiting for transaction ${minter.deployTransaction.hash}`)
  await minter.deployTransaction.wait()

  console.log('Contract deployed to:', minter.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
