# SCVxACryptoS Minter

This is a collaboration between SCV.finance and AcryptoS.com.

- Users with a certain amount of ACS tokens in the vault are eligible for
  minting one special edition SCV bot.
- All 4 different types of bots (with different rarirty) are provided.
- The bot can be used to access SCV.finance's DeFi portfolio as a Pro user.

## Develop

```bash
$ npm i
$ npm run compile
$ npm test
```

## Deploy & Verify

```bash
$ npx hardhat run --network testnet scripts/1_deploy_minter.js
$ npx hardhat verify --network testnet --constructor-args args/args-97.js 0x62...
```

## Testnet

- [SwampMinter](https://testnet.bscscan.com/address/0x4225C4DAdD6D0363C5641ff7D571e9A068037FF1#code)
- [SCVBot](https://testnet.bscscan.com/address/0xe043eabed8b19d21363618e38e0ef8120c0de326)
- [NFTSpecV1](https://testnet.bscscan.com/address/0xab3fb83537931767b6dda82dbd10a954f9267a74)

## Mainnet

- [SCVxACSMinter](https://bscscan.com/address/0x7EaE203A57ffB625224d2bba6776b3e08E8Fac87#code)
- [ERC20Minter](https://bscscan.com/address/0x71a09D1a2cAEDd5ac00Ef3865F9E7f33D2CAa3Fc#code)
