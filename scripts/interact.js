const { ethers } = require("hardhat");

async function main() {
  console.log("=== AirdropContract Interaction Examples ===\n");

  // Get the deployed contract address (you'll need to update this after deployment)
  const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
  const tokenAddress = "YOUR_TOKEN_ADDRESS";

  // Get the contract instance
  const AirdropContract = await ethers.getContractFactory("AirdropContract");
  const airdropContract = AirdropContract.attach(contractAddress);

  // Get signers
  const [owner, operator, recipient1, recipient2, recipient3] = await ethers.getSigners();

  console.log("Contract Address:", contractAddress);
  console.log("Owner:", owner.address);
  console.log("Token Address:", tokenAddress);
  console.log("Max Batch Size:", await airdropContract.maxBatchSize());
  console.log("Contract Paused:", await airdropContract.paused());
  console.log("");

  // Example 1: Add an authorized operator
  console.log("1. Adding authorized operator...");
  try {
    const tx = await airdropContract.addAuthorizedOperator(operator.address);
    await tx.wait();
    console.log("✅ Operator added:", operator.address);
  } catch (error) {
    console.log("❌ Failed to add operator:", error.message);
  }
  console.log("");

  // Example 2: Check token balance
  console.log("2. Checking contract token balance...");
  try {
    const balance = await airdropContract.getTokenBalance(tokenAddress);
    console.log("✅ Contract token balance:", ethers.formatEther(balance), "tokens");
  } catch (error) {
    console.log("❌ Failed to get balance:", error.message);
  }
  console.log("");

  // Example 3: Airdrop individual amounts
  console.log("3. Airdropping individual amounts...");
  const recipients = [recipient1.address, recipient2.address, recipient3.address];
  const amounts = [
    ethers.parseEther("100"),
    ethers.parseEther("200"),
    ethers.parseEther("300")
  ];

  try {
    const tx = await airdropContract.connect(operator).airdropIndividualAmounts(
      tokenAddress,
      recipients,
      amounts
    );
    await tx.wait();
    console.log("✅ Individual airdrop successful!");
    console.log("   - Recipient 1:", recipient1.address, "-> 100 tokens");
    console.log("   - Recipient 2:", recipient2.address, "-> 200 tokens");
    console.log("   - Recipient 3:", recipient3.address, "-> 300 tokens");
  } catch (error) {
    console.log("❌ Individual airdrop failed:", error.message);
  }
  console.log("");

  // Example 4: Airdrop same amount
  console.log("4. Airdropping same amount to all recipients...");
  const sameAmount = ethers.parseEther("50");
  const newRecipients = [recipient1.address, recipient2.address];

  try {
    const tx = await airdropContract.connect(operator).airdropSameAmount(
      tokenAddress,
      newRecipients,
      sameAmount
    );
    await tx.wait();
    console.log("✅ Same amount airdrop successful!");
    console.log("   - Each recipient received 50 tokens");
  } catch (error) {
    console.log("❌ Same amount airdrop failed:", error.message);
  }
  console.log("");

  // Example 5: Check operator status
  console.log("5. Checking operator status...");
  try {
    const isOperator = await airdropContract.isAuthorizedOperator(operator.address);
    console.log("✅ Operator status:", isOperator ? "Authorized" : "Not authorized");
  } catch (error) {
    console.log("❌ Failed to check operator status:", error.message);
  }
  console.log("");

  // Example 6: Withdraw tokens (owner only)
  console.log("6. Withdrawing tokens from contract...");
  const withdrawAmount = ethers.parseEther("100");
  
  try {
    const tx = await airdropContract.withdrawTokens(tokenAddress, withdrawAmount);
    await tx.wait();
    console.log("✅ Withdrawal successful! Amount:", ethers.formatEther(withdrawAmount), "tokens");
  } catch (error) {
    console.log("❌ Withdrawal failed:", error.message);
  }
  console.log("");

  console.log("=== Interaction Complete ===");
}

// Helper function to format addresses for display
function formatAddress(address) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }); 