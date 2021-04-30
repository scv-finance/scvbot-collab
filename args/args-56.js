const ethers = require('ethers')
module.exports = [
  '0x7679381507af0c8DE64586A458161aa58D3A4FC3', // vault
  '0xeb8f15086274586f95c551890A29077a5b6e5e55', // controller
  ethers.utils.parseEther('5'), // staking amount
  '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', // buy with token
  ethers.utils.parseEther('1'), // price
  '0xE56cb54F32097d02f33E1d07bE74C70f82eDF378', // nft token
  900, // start index of specId
]
