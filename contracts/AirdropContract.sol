// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title AirdropContract
 * @dev A smart contract for airdropping ERC20 tokens to multiple addresses
 * @author Your Name
 */
contract AirdropContract is Ownable, ReentrancyGuard, Pausable {
    
    // Events
    event AirdropExecuted(
        address indexed tokenAddress,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );
    
    event BatchAirdropExecuted(
        address indexed tokenAddress,
        uint256 totalRecipients,
        uint256 totalAmount,
        uint256 timestamp
    );
    
    event TokenWithdrawn(
        address indexed tokenAddress,
        address indexed owner,
        uint256 amount,
        uint256 timestamp
    );
    
    // State variables
    mapping(address => bool) public authorizedOperators;
    uint256 public maxBatchSize = 100; // Maximum number of recipients per batch
    
    // Modifiers
    modifier onlyAuthorized() {
        require(
            msg.sender == owner() || authorizedOperators[msg.sender],
            "AirdropContract: Not authorized"
        );
        _;
    }
    
    modifier validToken(address _tokenAddress) {
        require(_tokenAddress != address(0), "AirdropContract: Invalid token address");
        _;
    }
    
    modifier validRecipients(address[] memory _recipients) {
        require(_recipients.length > 0, "AirdropContract: Empty recipients array");
        require(_recipients.length <= maxBatchSize, "AirdropContract: Batch too large");
        _;
    }
    
    /**
     * @dev Constructor
     */
    constructor() Ownable(msg.sender) {
        // Set the deployer as the initial owner
    }
    
    /**
     * @dev Airdrop tokens to multiple addresses with individual amounts
     * @param _tokenAddress The ERC20 token contract address
     * @param _recipients Array of recipient addresses
     * @param _amounts Array of token amounts to send to each recipient
     */
    function airdropIndividualAmounts(
        address _tokenAddress,
        address[] memory _recipients,
        uint256[] memory _amounts
    ) 
        external 
        onlyAuthorized 
        whenNotPaused 
        nonReentrant 
        validToken(_tokenAddress)
        validRecipients(_recipients)
    {
        require(
            _recipients.length == _amounts.length,
            "AirdropContract: Recipients and amounts arrays must have same length"
        );
        
        IERC20 token = IERC20(_tokenAddress);
        uint256 totalAmount = 0;
        
        // Calculate total amount needed
        for (uint256 i = 0; i < _amounts.length; i++) {
            require(_amounts[i] > 0, "AirdropContract: Amount must be greater than 0");
            require(_recipients[i] != address(0), "AirdropContract: Invalid recipient address");
            totalAmount += _amounts[i];
        }
        
        // Check if contract has sufficient tokens
        require(
            token.balanceOf(address(this)) >= totalAmount,
            "AirdropContract: Insufficient token balance"
        );
        
        // Transfer tokens to each recipient
        for (uint256 i = 0; i < _recipients.length; i++) {
            require(
                token.transfer(_recipients[i], _amounts[i]),
                "AirdropContract: Transfer failed"
            );
            
            emit AirdropExecuted(_tokenAddress, _recipients[i], _amounts[i], block.timestamp);
        }
        
        emit BatchAirdropExecuted(_tokenAddress, _recipients.length, totalAmount, block.timestamp);
    }
    
    /**
     * @dev Airdrop tokens to multiple addresses with the same amount
     * @param _tokenAddress The ERC20 token contract address
     * @param _recipients Array of recipient addresses
     * @param _amount Amount of tokens to send to each recipient
     */
    function airdropSameAmount(
        address _tokenAddress,
        address[] memory _recipients,
        uint256 _amount
    ) 
        external 
        onlyAuthorized 
        whenNotPaused 
        nonReentrant 
        validToken(_tokenAddress)
        validRecipients(_recipients)
    {
        require(_amount > 0, "AirdropContract: Amount must be greater than 0");
        
        IERC20 token = IERC20(_tokenAddress);
        uint256 totalAmount = _amount * _recipients.length;
        
        // Check if contract has sufficient tokens
        require(
            token.balanceOf(address(this)) >= totalAmount,
            "AirdropContract: Insufficient token balance"
        );
        
        // Transfer tokens to each recipient
        for (uint256 i = 0; i < _recipients.length; i++) {
            require(_recipients[i] != address(0), "AirdropContract: Invalid recipient address");
            
            require(
                token.transfer(_recipients[i], _amount),
                "AirdropContract: Transfer failed"
            );
            
            emit AirdropExecuted(_tokenAddress, _recipients[i], _amount, block.timestamp);
        }
        
        emit BatchAirdropExecuted(_tokenAddress, _recipients.length, totalAmount, block.timestamp);
    }
    
    /**
     * @dev Withdraw tokens from the contract (owner only)
     * @param _tokenAddress The ERC20 token contract address
     * @param _amount Amount of tokens to withdraw
     */
    function withdrawTokens(
        address _tokenAddress,
        uint256 _amount
    ) 
        external 
        onlyOwner 
        validToken(_tokenAddress)
    {
        require(_amount > 0, "AirdropContract: Amount must be greater than 0");
        
        IERC20 token = IERC20(_tokenAddress);
        require(
            token.balanceOf(address(this)) >= _amount,
            "AirdropContract: Insufficient token balance"
        );
        
        require(
            token.transfer(owner(), _amount),
            "AirdropContract: Transfer failed"
        );
        
        emit TokenWithdrawn(_tokenAddress, owner(), _amount, block.timestamp);
    }
    
    /**
     * @dev Withdraw all tokens of a specific type from the contract (owner only)
     * @param _tokenAddress The ERC20 token contract address
     */
    function withdrawAllTokens(
        address _tokenAddress
    ) 
        external 
        onlyOwner 
        validToken(_tokenAddress)
    {
        IERC20 token = IERC20(_tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        
        require(balance > 0, "AirdropContract: No tokens to withdraw");
        
        require(
            token.transfer(owner(), balance),
            "AirdropContract: Transfer failed"
        );
        
        emit TokenWithdrawn(_tokenAddress, owner(), balance, block.timestamp);
    }
    
    /**
     * @dev Add an authorized operator
     * @param _operator Address to authorize
     */
    function addAuthorizedOperator(address _operator) external onlyOwner {
        require(_operator != address(0), "AirdropContract: Invalid operator address");
        require(!authorizedOperators[_operator], "AirdropContract: Operator already authorized");
        
        authorizedOperators[_operator] = true;
    }
    
    /**
     * @dev Remove an authorized operator
     * @param _operator Address to remove authorization from
     */
    function removeAuthorizedOperator(address _operator) external onlyOwner {
        require(authorizedOperators[_operator], "AirdropContract: Operator not authorized");
        
        authorizedOperators[_operator] = false;
    }
    
    /**
     * @dev Set the maximum batch size
     * @param _maxBatchSize New maximum batch size
     */
    function setMaxBatchSize(uint256 _maxBatchSize) external onlyOwner {
        require(_maxBatchSize > 0, "AirdropContract: Batch size must be greater than 0");
        require(_maxBatchSize <= 1000, "AirdropContract: Batch size too large");
        
        maxBatchSize = _maxBatchSize;
    }
    
    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get the token balance of the contract
     * @param _tokenAddress The ERC20 token contract address
     * @return The token balance
     */
    function getTokenBalance(address _tokenAddress) external view returns (uint256) {
        IERC20 token = IERC20(_tokenAddress);
        return token.balanceOf(address(this));
    }
    
    /**
     * @dev Check if an address is an authorized operator
     * @param _operator Address to check
     * @return True if authorized, false otherwise
     */
    function isAuthorizedOperator(address _operator) external view returns (bool) {
        return authorizedOperators[_operator];
    }
    
    /**
     * @dev Emergency function to withdraw ETH if accidentally sent
     */
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "AirdropContract: No ETH to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "AirdropContract: ETH transfer failed");
    }
    
    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {
        // Contract can receive ETH
    }
} 