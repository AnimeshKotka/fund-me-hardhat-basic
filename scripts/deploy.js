// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const SimpleStorageFactory = await hre.ethers.getContractFactory(
    "SimpleStorage"
  );
  console.log("Deploying code..");
  const simpleStorage = await SimpleStorageFactory.deploy();

  await simpleStorage.deployed();

  console.log(`Code deployed to ${simpleStorage.address}`);

  // hre.network.config returns if the code runs on test net of actual chain
  if (hre.network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await simpleStorage.deployTransaction.wait(6); // with this we can wait upto 6 blocks in chain mine
    await varify(simpleStorage.address, []);
  }

  const currentValue = await simpleStorage.retrive();
  console.log(`Current Value is: ${currentValue}`);

  // Update the current value
  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrive();
  console.log(`Updated Value is: ${updatedValue}`);
}

async function varify(contractAddr, args) {
  console.log("Varifying your contract...");
  try {
    hre.run("verify:verify", {
      address: contractAddr,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => {
    return process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
