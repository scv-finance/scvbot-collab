import { ethers } from 'hardhat'
import { ISCVNFT } from '../artifacts/typechain'

async function main() {
  const { chainId } = await ethers.provider.getNetwork()
  console.log(`Deploying to chain ${chainId}`)

  // deploy TenMinter
  const TenMinter = await ethers.getContractFactory('TenMinter')
  const minter = await TenMinter.deploy()
  console.log(`Waiting for transaction ${minter.deployTransaction.hash}`)
  await minter.deployTransaction.wait()
  console.log('Contract deployed to:', minter.address)

  const minterAddress = minter.address

  // grant mint role to TenMinter
  const botAddress = '0xFe3EeA9f826E56cA5702aaD50659D801E4Ea9320'
  const bot1 = (await ethers.getContractAt('ISCVNFT', botAddress)) as ISCVNFT
  console.log(`Granting MINT_ROLE to ${minterAddress}`)
  await bot1.grantRole(await bot1.MINT_ROLE(), minterAddress)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
