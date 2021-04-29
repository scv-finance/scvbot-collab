require('dotenv-extended').load()
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@typechain/ethers-v5'
import 'hardhat-deploy'
import 'hardhat-deploy-ethers'
import 'hardhat-typechain'
import { task } from 'hardhat/config'

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(await account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default {
  solidity: '0.7.6',
  react: {
    providerPriority: ['web3modal', 'hardhat'],
  },
  networks: {
    hardhat: {},
    localhost: {
      url: 'http://127.0.0.1:7545',
      // accounts: [privateKey1, privateKey2, ...]
    },
    goerli: {
      url: 'https://rpc.slock.it/goerli',
      accounts: [process.env.PRIVATE_KEY_GOERLI].filter(Boolean),
    },
    rinkeby: {
      url: process.env.RPC_ENDPOINT_RINKEBY || '',
      accounts: [process.env.PRIVATE_KEY_RINKEBY].filter(Boolean),
    },
    mainnet: {
      url: process.env.RPC_ENDPOINT_MAINNET || '',
      accounts: [process.env.PRIVATE_KEY_MAINNET].filter(Boolean),
    },
  },
  paths: {
    react: './generated/hardhat',
    deployments: './generated/deployments/',
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  typechain: {
    outDir: './artifacts/typechain',
    target: 'ethers-v5',
  },
}
