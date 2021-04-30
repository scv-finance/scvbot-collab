require('dotenv-extended').load()

// import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/ethers-v5'
// import 'hardhat-deploy'
// import 'hardhat-deploy-ethers'
import 'hardhat-typechain'

// import { task } from 'hardhat/config'

// // This is a sample Hardhat task. To learn how to create your own go to
// // https://hardhat.org/guides/create-task.html
// task('verify-scv', 'Verify SCVxACS')
//   .addParam('contract', 'The contract address of SCVxACSMinter')
//   .setAction(async (args, hre) => {
//     const contractAddress = args.contract
//     const chainId = hre.network.config.chainId
//     const params = require('./params.json')
//     const { BUSD, ACSController, ACSVault, SCVNFT, Staking, Price } = params[
//       chainId
//     ]
//     if (!(BUSD && ACSController && ACSVault && SCVNFT && Staking && Price)) {
//       console.error('Not enough address info in ./params.json')
//       return
//     }

//     await hre.run('verify:verify', {
//       address: contractAddress,
//       constructorArguments: [
//         ACSVault,
//         ACSController,
//         hre.ethers.utils.parseEther(Staking),
//         BUSD,
//         hre.ethers.utils.parseEther(Price),
//         SCVNFT,
//         100,
//       ],
//     })
//   })

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
      gasPrice: 5000000000,
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
