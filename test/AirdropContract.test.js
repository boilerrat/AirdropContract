const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AirdropContract", function () {
  let airdropContract;
  let mockToken;
  let owner;
  let operator;
  let recipient1;
  let recipient2;
  let recipient3;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get signers
    [owner, operator, recipient1, recipient2, recipient3, addr1, addr2] = await ethers.getSigners();

    // Deploy mock ERC20 token
    const MockToken = await ethers.getContractFactory("MockERC20");
    mockToken = await MockToken.deploy("Mock Token", "MTK");
    await mockToken.waitForDeployment();

    // Deploy AirdropContract
    const AirdropContract = await ethers.getContractFactory("AirdropContract");
    airdropContract = await AirdropContract.deploy();
    await airdropContract.waitForDeployment();

    // Transfer tokens to airdrop contract
    const transferAmount = ethers.parseEther("10000");
    await mockToken.transfer(await airdropContract.getAddress(), transferAmount);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await airdropContract.owner()).to.equal(owner.address);
    });

    it("Should set the correct max batch size", async function () {
      expect(await airdropContract.maxBatchSize()).to.equal(100);
    });

    it("Should be unpaused by default", async function () {
      expect(await airdropContract.paused()).to.be.false;
    });
  });

  describe("Authorization", function () {
    it("Should allow owner to add authorized operator", async function () {
      await airdropContract.addAuthorizedOperator(operator.address);
      expect(await airdropContract.isAuthorizedOperator(operator.address)).to.be.true;
    });

    it("Should allow owner to remove authorized operator", async function () {
      await airdropContract.addAuthorizedOperator(operator.address);
      await airdropContract.removeAuthorizedOperator(operator.address);
      expect(await airdropContract.isAuthorizedOperator(operator.address)).to.be.false;
    });

    it("Should not allow non-owner to add operator", async function () {
      await expect(
        airdropContract.connect(addr1).addAuthorizedOperator(operator.address)
      ).to.be.revertedWithCustomError(airdropContract, "OwnableUnauthorizedAccount");
    });
  });

  describe("Airdrop Individual Amounts", function () {
    beforeEach(async function () {
      await airdropContract.addAuthorizedOperator(operator.address);
    });

    it("Should airdrop tokens with individual amounts", async function () {
      const recipients = [recipient1.address, recipient2.address, recipient3.address];
      const amounts = [
        ethers.parseEther("100"),
        ethers.parseEther("200"),
        ethers.parseEther("300")
      ];

      await airdropContract.connect(operator).airdropIndividualAmounts(
        await mockToken.getAddress(),
        recipients,
        amounts
      );

      expect(await mockToken.balanceOf(recipient1.address)).to.equal(ethers.parseEther("100"));
      expect(await mockToken.balanceOf(recipient2.address)).to.equal(ethers.parseEther("200"));
      expect(await mockToken.balanceOf(recipient3.address)).to.equal(ethers.parseEther("300"));
    });

    it("Should emit correct events", async function () {
      const recipients = [recipient1.address];
      const amounts = [ethers.parseEther("100")];

      const tx = await airdropContract.connect(operator).airdropIndividualAmounts(
        await mockToken.getAddress(),
        recipients,
        amounts
      );
      const receipt = await tx.wait();
      // Find the AirdropExecuted event
      const parsedLogs = receipt.logs
        .map(log => {
          try {
            return airdropContract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .filter(e => e !== null);
      const event = parsedLogs.find(e => e.name === "AirdropExecuted");
      expect(event).to.not.be.undefined;
      expect(event.args.tokenAddress).to.equal(await mockToken.getAddress());
      expect(event.args.recipient).to.equal(recipient1.address);
      expect(event.args.amount).to.equal(ethers.parseEther("100"));
      // Don't assert exact timestamp

      // Find the BatchAirdropExecuted event
      const batchEvent = parsedLogs.find(e => e.name === "BatchAirdropExecuted");
      expect(batchEvent).to.not.be.undefined;
      expect(batchEvent.args.tokenAddress).to.equal(await mockToken.getAddress());
      expect(batchEvent.args.totalRecipients).to.equal(1);
      expect(batchEvent.args.totalAmount).to.equal(ethers.parseEther("100"));
      // Don't assert exact timestamp
    });

    it("Should fail if arrays have different lengths", async function () {
      const recipients = [recipient1.address, recipient2.address];
      const amounts = [ethers.parseEther("100")];

      await expect(
        airdropContract.connect(operator).airdropIndividualAmounts(
          await mockToken.getAddress(),
          recipients,
          amounts
        )
      ).to.be.revertedWith("AirdropContract: Recipients and amounts arrays must have same length");
    });

    it("Should fail if amount is zero", async function () {
      const recipients = [recipient1.address];
      const amounts = [0];

      await expect(
        airdropContract.connect(operator).airdropIndividualAmounts(
          await mockToken.getAddress(),
          recipients,
          amounts
        )
      ).to.be.revertedWith("AirdropContract: Amount must be greater than 0");
    });

    it("Should fail if recipient is zero address", async function () {
      const recipients = [ethers.ZeroAddress];
      const amounts = [ethers.parseEther("100")];

      await expect(
        airdropContract.connect(operator).airdropIndividualAmounts(
          await mockToken.getAddress(),
          recipients,
          amounts
        )
      ).to.be.revertedWith("AirdropContract: Invalid recipient address");
    });

    it("Should fail if not authorized", async function () {
      const recipients = [recipient1.address];
      const amounts = [ethers.parseEther("100")];

      await expect(
        airdropContract.connect(addr1).airdropIndividualAmounts(
          await mockToken.getAddress(),
          recipients,
          amounts
        )
      ).to.be.revertedWith("AirdropContract: Not authorized");
    });
  });

  describe("Airdrop Same Amount", function () {
    beforeEach(async function () {
      await airdropContract.addAuthorizedOperator(operator.address);
    });

    it("Should airdrop tokens with same amount", async function () {
      const recipients = [recipient1.address, recipient2.address, recipient3.address];
      const amount = ethers.parseEther("100");

      await airdropContract.connect(operator).airdropSameAmount(
        await mockToken.getAddress(),
        recipients,
        amount
      );

      expect(await mockToken.balanceOf(recipient1.address)).to.equal(amount);
      expect(await mockToken.balanceOf(recipient2.address)).to.equal(amount);
      expect(await mockToken.balanceOf(recipient3.address)).to.equal(amount);
    });

    it("Should fail if amount is zero", async function () {
      const recipients = [recipient1.address];

      await expect(
        airdropContract.connect(operator).airdropSameAmount(
          await mockToken.getAddress(),
          recipients,
          0
        )
      ).to.be.revertedWith("AirdropContract: Amount must be greater than 0");
    });
  });

  describe("Withdrawal", function () {
    it("Should allow owner to withdraw tokens", async function () {
      const withdrawAmount = ethers.parseEther("1000");
      const initialBalance = await mockToken.balanceOf(owner.address);

      await airdropContract.withdrawTokens(await mockToken.getAddress(), withdrawAmount);

      expect(await mockToken.balanceOf(owner.address)).to.equal(
        initialBalance + withdrawAmount
      );
    });

    it("Should allow owner to withdraw all tokens", async function () {
      const contractBalance = await mockToken.balanceOf(await airdropContract.getAddress());
      const initialBalance = await mockToken.balanceOf(owner.address);

      await airdropContract.withdrawAllTokens(await mockToken.getAddress());

      expect(await mockToken.balanceOf(owner.address)).to.equal(
        initialBalance + contractBalance
      );
      expect(await mockToken.balanceOf(await airdropContract.getAddress())).to.equal(0);
    });

    it("Should not allow non-owner to withdraw", async function () {
      await expect(
        airdropContract.connect(addr1).withdrawTokens(await mockToken.getAddress(), ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(airdropContract, "OwnableUnauthorizedAccount");
    });
  });

  describe("Pause/Unpause", function () {
    it("Should allow owner to pause and unpause", async function () {
      await airdropContract.pause();
      expect(await airdropContract.paused()).to.be.true;

      await airdropContract.unpause();
      expect(await airdropContract.paused()).to.be.false;
    });

    it("Should not allow airdrop when paused", async function () {
      await airdropContract.pause();
      await airdropContract.addAuthorizedOperator(operator.address);

      const recipients = [recipient1.address];
      const amounts = [ethers.parseEther("100")];

      await expect(
        airdropContract.connect(operator).airdropIndividualAmounts(
          await mockToken.getAddress(),
          recipients,
          amounts
        )
      ).to.be.revertedWithCustomError(airdropContract, "EnforcedPause");
    });
  });

  describe("Batch Size", function () {
    it("Should allow owner to set max batch size", async function () {
      await airdropContract.setMaxBatchSize(200);
      expect(await airdropContract.maxBatchSize()).to.equal(200);
    });

    it("Should fail if batch size is too large", async function () {
      await expect(
        airdropContract.setMaxBatchSize(1001)
      ).to.be.revertedWith("AirdropContract: Batch size too large");
    });

    it("Should fail if batch size is zero", async function () {
      await expect(
        airdropContract.setMaxBatchSize(0)
      ).to.be.revertedWith("AirdropContract: Batch size must be greater than 0");
    });
  });

  describe("View Functions", function () {
    it("Should return correct token balance", async function () {
      const balance = await airdropContract.getTokenBalance(await mockToken.getAddress());
      expect(balance).to.equal(ethers.parseEther("10000"));
    });

    it("Should return correct operator status", async function () {
      expect(await airdropContract.isAuthorizedOperator(operator.address)).to.be.false;
      
      await airdropContract.addAuthorizedOperator(operator.address);
      expect(await airdropContract.isAuthorizedOperator(operator.address)).to.be.true;
    });
  });

  describe("ETH Withdrawal", function () {
    it("Should allow owner to withdraw ETH", async function () {
      // Send ETH to contract
      await addr1.sendTransaction({
        to: await airdropContract.getAddress(),
        value: ethers.parseEther("1")
      });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await airdropContract.withdrawETH();
      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(finalBalance).to.be.gt(initialBalance);
    });
  });
});

// Helper function to get current timestamp
async function time() {
  const blockNum = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNum);
  return block.timestamp;
} 