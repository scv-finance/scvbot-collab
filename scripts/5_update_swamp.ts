import { ethers } from 'hardhat'
import { SwampMinter } from '../artifacts/typechain'

async function main() {
  const { chainId } = await ethers.provider.getNetwork()
  const args = require(`../args/swamp-${chainId}`)
  console.log(
    `Deploying to chain ${chainId}`,
    `with args = ${JSON.stringify(args, null, 2)}...`,
  )

  const MinterContract = await ethers.getContractFactory('SwampMinter')
  const minter = MinterContract.attach(
    '0x9B0128D10c300Fe01a40E09EefE8D401d9Db10b1',
  ) as SwampMinter

  let tx = await minter.setBaseSpecId(23)
  console.log(`tx hash = ${tx.hash}`)
  await tx.wait()

  console.log('Updated SwampMinter', minter.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
