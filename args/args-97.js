const ethers = require('ethers')
module.exports = [
  '0x3bc609B02efE36A439209707aa4f9c8AAa4d032d', // vault
  '0x3bc609B02efE36A439209707aa4f9c8AAa4d032d', // controller
  ethers.utils.parseEther('5'), // staking amount
  '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee', // buy with token
  ethers.utils.parseEther('1'), // price
  '0xE56cb54F32097d02f33E1d07bE74C70f82eDF378', // nft token
  900, // start index of specId
]
