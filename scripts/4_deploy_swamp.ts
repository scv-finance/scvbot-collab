import { ethers } from 'hardhat'

async function main() {
  const { chainId } = await ethers.provider.getNetwork()
  const args = require(`../args/swamp-${chainId}`)
  console.log(
    `Deploying to chain ${chainId}`,
    `with args = ${JSON.stringify(args, null, 2)}...`,
  )

  const MinterContract = await ethers.getContractFactory('SwampMinter')
  const minter = await MinterContract.deploy(...args)
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
