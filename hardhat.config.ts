require('dotenv-extended').load()

// import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/ethers-v5'
import 'hardhat-typechain'

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default {
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  react: {
    providerPriority: ['web3modal', 'hardhat'],
  },
  networks: {
    hardhat: {},
    localhost: {
      url: 'http://127.0.0.1:7545',
      // accounts: [privateKey1, privateKey2, ...]
    },
    mainnet: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      gasPrice: 10000000000,
      accounts: [process.env.MAINNET_PRIVATE_KEY].filter(Boolean),
    },
    testnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [process.env.TESTNET_PRIVATE_KEY].filter(Boolean),
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
  etherscan: {
    apiKey: process.env.BSCSCAN_KEY,
  },
}
