import { ethers } from 'hardhat'
import { ISCVNFT } from '../artifacts/typechain'
import csvParse from 'async-csv'
import fs from 'fs/promises'

async function readCSV() {
  const data = await fs.readFile('./args/bscnews.csv', { encoding: 'utf-8' })
  const rows = await csvParse.parse(data, { columns: true })

  const topUsers = new Set<string>()
  for (const row of rows) {
    const from = row['From']
    if (topUsers.size >= 50) break
    if (from === '0x079a889eb69013d451ecf45377258948116e2b3e') continue

    topUsers.add(from)
  }

  return [...topUsers]
}

async function main() {
  const { chainId } = await ethers.provider.getNetwork()
  console.log(`Deploying to chain ${chainId}`)

  const users = await readCSV()

  console.log(`Airdropping ${users.length} users`)
  console.log(users)

  // airdrop to top 50 users
  const botAddress =
    chainId === 97
      ? '0xe043eabed8b19d21363618e38e0ef8120c0de326'
      : '0xFe3EeA9f826E56cA5702aaD50659D801E4Ea9320'
  const bot = (await ethers.getContractAt('ISCVNFT', botAddress)) as ISCVNFT
  for (const user of users) {
    console.log(`Airdropping ${user}`)
    const tx = await bot.mint(user, 72)
    await tx.wait()
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
