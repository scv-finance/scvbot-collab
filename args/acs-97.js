const ethers = require('ethers')
module.exports = [
  '0x3bc609B02efE36A439209707aa4f9c8AAa4d032d', // vault
  '0x3bc609B02efE36A439209707aa4f9c8AAa4d032d', // controller
  ethers.utils.parseEther('5'), // staking amount
  '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee', // buy with token
  ethers.utils.parseEther('1'), // price
  '0xe043EAbed8B19d21363618E38E0eF8120c0de326', // nft token
  3, // start index of specId
]
