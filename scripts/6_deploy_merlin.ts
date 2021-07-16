import { ethers } from 'hardhat'

async function main() {
  const { chainId } = await ethers.provider.getNetwork()
  console.log(`Deploying to chain ${chainId}`)

  const MinterContract = await ethers.getContractFactory('MerlinMinter')
  const minter = await MinterContract.deploy()
  console.log(`Waiting for transaction ${minter.deployTransaction.hash}`)
  await minter.deployTransaction.wait()

  console.log('Contract deployed to:', minter.address)
  console.log('!!!Remember to add MINT_ROLE!!!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
