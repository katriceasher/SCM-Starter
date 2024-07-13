// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  // Ensure the ABI is correctly imported
  const CharityDonationABI = require("../artifacts/contracts/CharityDonation.sol/CharityDonation.json").abi;

  // Deploy the contract
  const CharityDonationFactory = await ethers.getContractFactory("CharityDonation", CharityDonationABI);
  const CharityDonation = await CharityDonationFactory.deploy();  // Deploy the contract
  await CharityDonation.deployed();  // Wait for deployment confirmation

  console.log(`CharityDonation contract deployed to: ${CharityDonation.address}`);  // Log deployment address

  // Example: interact with the deployed contract
  const goalAmount = 100;
  await CharityDonation.defineGoal(goalAmount);  // Example interaction: define the goal amount
  console.log(`Initial goal defined: ${goalAmount} ETH`);  // Log the initial goal amount
}

// Ensure the script properly handles errors
main()
  .then(() => process.exit(0))  // Exit with success code if script runs without errors
  .catch((error) => {
    console.error(error);  // Log any errors that occur during script execution
    process.exit(1);  // Exit with error code
  });
