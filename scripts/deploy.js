const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying AirdropContract...");

  // Get the contract factory
  const AirdropContract = await ethers.getContractFactory("AirdropContract");
  
  // Deploy the contract
  const airdropContract = await AirdropContract.deploy();
  
  // Wait for deployment to complete
  await airdropContract.waitForDeployment();
  
  const contractAddress = await airdropContract.getAddress();
  
  console.log("AirdropContract deployed to:", contractAddress);
  console.log("Owner:", await airdropContract.owner());
  console.log("Max batch size:", await airdropContract.maxBatchSize());
  
  // Verify the contract on BaseScan (if API key is provided)
  if (process.env.BASESCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await airdropContract.deploymentTransaction().wait(6);
    
    console.log("Verifying contract on BaseScan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified on BaseScan!");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 