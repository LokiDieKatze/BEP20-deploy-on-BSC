/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { deployed } = require('./deployed');
const INITIAL_SUPPLY = ethers.utils.parseEther('8000');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  // We get the contract to deploy
  const WETH = await hre.ethers.getContractFactory('WETH');
  const weth = await WETH.deploy(INITIAL_SUPPLY);

  await weth.deployed();

  // Afficher l'adresse de déploiement
  await deployed('WETH', hre.network.name, weth.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
