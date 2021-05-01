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

## Production

- [SCVxACSMinter](https://bscscan.com/address/0x7EaE203A57ffB625224d2bba6776b3e08E8Fac87#code)
