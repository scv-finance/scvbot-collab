async function main() {
  const { chainId } = await global.ethers.provider.getNetwork()
  const params = require('../params.json')
  const { BUSD, ACSController, ACSVault, SCVNFT, Staking, Price } = params[
    chainId
  ]

  if (!(BUSD && ACSController && ACSVault && SCVNFT && Staking && Price)) {
    console.error('Not enough address info in ./params.json')
    return
  }

  const MinterContract = await global.ethers.getContractFactory('SCVxACSMinter')
  const SCVxACSMinter = await MinterContract.deploy(
    ACSVault,
    ACSController,
    ethers.utils.parseEther(Staking),
    BUSD,
    ethers.utils.parseEther(Price),
    SCVNFT,
    100,
  )
  const tx = await SCVxACSMinter.deployed()
  const receipt = await tx.deployTransaction.wait()
  console.log(receipt)
  console.log('Contract deployed to:', SCVxACSMinter.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
