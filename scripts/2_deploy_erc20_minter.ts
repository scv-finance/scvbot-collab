import { ethers } from 'hardhat'

async function main() {
  const { chainId } = await ethers.provider.getNetwork()
  const args = require(`../args/minter-${chainId}`)
  console.log(
    `Deploying to chain ${chainId}`,
    `with args = ${JSON.stringify(args, null, 2)}...`,
  )

  const MinterContract = await ethers.getContractFactory('ERC20Minter')
  const minter = await MinterContract.deploy(...args)
  await minter.deployTransaction.wait()

  console.log('Contract deployed to:', minter.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
