# ERC20 Airdrop Smart Contract

A secure and gas-efficient smart contract for airdropping ERC20 tokens to multiple addresses on the Base network. This contract supports both individual amounts per recipient and uniform amounts for all recipients.

## Features

- ✅ **Batch Airdrops**: Send tokens to multiple addresses in a single transaction
- ✅ **Individual Amounts**: Set different token amounts for each recipient
- ✅ **Uniform Amounts**: Send the same amount to all recipients
- ✅ **Access Control**: Owner and authorized operators can execute airdrops
- ✅ **Safety Features**: Pausable, reentrancy protection, and input validation
- ✅ **Gas Efficient**: Optimized for minimal gas consumption
- ✅ **Base Network Ready**: Configured for deployment on Base mainnet and testnet

## Contract Functions

### Core Airdrop Functions

- `airdropIndividualAmounts(address _tokenAddress, address[] _recipients, uint256[] _amounts)`: Airdrop different amounts to each recipient
- `airdropSameAmount(address _tokenAddress, address[] _recipients, uint256 _amount)`: Airdrop the same amount to all recipients

### Management Functions

- `addAuthorizedOperator(address _operator)`: Add an authorized operator (owner only)
- `removeAuthorizedOperator(address _operator)`: Remove an authorized operator (owner only)
- `setMaxBatchSize(uint256 _maxBatchSize)`: Set maximum batch size (owner only)
- `pause()` / `unpause()`: Pause/unpause the contract (owner only)

### Withdrawal Functions

- `withdrawTokens(address _tokenAddress, uint256 _amount)`: Withdraw specific amount of tokens (owner only)
- `withdrawAllTokens(address _tokenAddress)`: Withdraw all tokens of a specific type (owner only)
- `withdrawETH()`: Withdraw ETH if accidentally sent (owner only)

### View Functions

- `getTokenBalance(address _tokenAddress)`: Get contract's token balance
- `isAuthorizedOperator(address _operator)`: Check if address is authorized
- `maxBatchSize()`: Get current maximum batch size
- `paused()`: Check if contract is paused

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Private key for deployment (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Base Network RPC URLs
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# BaseScan API Key for contract verification
BASESCAN_API_KEY=your_basescan_api_key_here

# Optional: Enable gas reporting
REPORT_GAS=true
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Run Tests

```bash
npm test
```

## Deployment

### Deploy to Base Sepolia (Testnet)

```bash
npm run deploy:base-sepolia
```

### Deploy to Base Mainnet

```bash
npm run deploy:base
```

### Verify Contract on BaseScan

After deployment, the contract will be automatically verified if you have a BaseScan API key configured.

## Usage Examples

### 1. Airdrop Individual Amounts

```javascript
const recipients = [
  "0x1234567890123456789012345678901234567890",
  "0x2345678901234567890123456789012345678901",
  "0x3456789012345678901234567890123456789012"
];

const amounts = [
  ethers.parseEther("100"),  // 100 tokens to first recipient
  ethers.parseEther("200"),  // 200 tokens to second recipient
  ethers.parseEther("300")   // 300 tokens to third recipient
];

await airdropContract.airdropIndividualAmounts(
  tokenAddress,
  recipients,
  amounts
);
```

### 2. Airdrop Same Amount

```javascript
const recipients = [
  "0x1234567890123456789012345678901234567890",
  "0x2345678901234567890123456789012345678901",
  "0x3456789012345678901234567890123456789012"
];

const amount = ethers.parseEther("100"); // 100 tokens to each recipient

await airdropContract.airdropSameAmount(
  tokenAddress,
  recipients,
  amount
);
```

### 3. Add Authorized Operator

```javascript
await airdropContract.addAuthorizedOperator("0x1234567890123456789012345678901234567890");
```

### 4. Withdraw Tokens

```javascript
// Withdraw specific amount
await airdropContract.withdrawTokens(tokenAddress, ethers.parseEther("1000"));

// Withdraw all tokens
await airdropContract.withdrawAllTokens(tokenAddress);
```

## Security Features

- **Access Control**: Only owner and authorized operators can execute airdrops
- **Reentrancy Protection**: Prevents reentrancy attacks
- **Pausable**: Contract can be paused in emergency situations
- **Input Validation**: Comprehensive validation of all inputs
- **Batch Size Limits**: Configurable maximum batch size to prevent gas issues
- **Zero Address Checks**: Prevents sending tokens to zero address
- **Amount Validation**: Ensures amounts are greater than zero

## Gas Optimization

- **Batch Processing**: Multiple transfers in single transaction
- **Efficient Loops**: Optimized for minimal gas consumption
- **Early Reverts**: Fail fast on invalid inputs
- **Minimal Storage**: Only essential state variables

## Network Information

### Base Mainnet
- **Chain ID**: 8453
- **RPC URL**: https://mainnet.base.org
- **Explorer**: https://basescan.org

### Base Sepolia (Testnet)
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## Support

For questions or support, please open an issue on GitHub or contact the development team. 