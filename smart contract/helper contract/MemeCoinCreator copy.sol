 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface IUniswapV2Factory {
    function createPair(address tokenA, address tokenB) external returns (address pair);
}

interface IUniswapV2Router02 {
    function WETH() external pure returns (address);
    
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
}

contract MemeToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    string private _logoUrl;
    uint256 private _maxSupply;
    bool private _burnEnabled;
    bool private _mintingEnabled;
    bool public liquidityPoolCreated;
    bool public mintingRevoked;
    
    uint256 public constant BURN_FEE = 0.01 ether;
    uint256 public constant MINT_FEE = 0.02 ether;
    uint256 public constant LIQUIDITY_POOL_FEE = 0.05 ether;
    uint256 public constant REVOKE_MINT_FEE = 0.03 ether;
    
    address public feeCollector;
    IUniswapV2Router02 public uniswapV2Router;
    address public uniswapV2Pair;
    
    event LiquidityPoolCreated(address pair, uint256 liquidityAdded);
    event MintingRevoked();
    event TokensBurned(address indexed burner, uint256 amount);
    event TokensMinted(address indexed minter, uint256 amount);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 maxSupply,
        string memory logoUrl,
        bool burnEnabled,
        address owner,
        address _feeCollector,
        address _routerAddress
    ) ERC20(name, symbol) onlyOwner() {
        require(maxSupply >= initialSupply, "Max supply must be >= initial supply");
        _logoUrl = logoUrl;
        _maxSupply = maxSupply;
        _burnEnabled = burnEnabled;
        _mintingEnabled = true;
        feeCollector = _feeCollector;
        
        uniswapV2Router = IUniswapV2Router02(_routerAddress);
        
        _mint(owner, initialSupply);
    }
    
    modifier whenMintingEnabled() {
        require(_mintingEnabled && !mintingRevoked, "Minting is disabled or revoked");
        _;
    }
    
    function mintTokens(uint256 amount) external payable nonReentrant whenMintingEnabled {
        require(msg.value >= MINT_FEE, "Insufficient mint fee");
        require(totalSupply() + amount <= _maxSupply, "Would exceed max supply");
        
        payable(feeCollector).transfer(MINT_FEE);
        if (msg.value > MINT_FEE) {
            payable(msg.sender).transfer(msg.value - MINT_FEE);
        }
        
        _mint(msg.sender, amount);
        emit TokensMinted(msg.sender, amount);
    }
    
    /* function burn(uint256 amount) public override payable nonReentrant {
        require(_burnEnabled, "Token burning is not enabled");
        require(msg.value >= BURN_FEE, "Insufficient burn fee");
        
        payable(feeCollector).transfer(BURN_FEE);
        if (msg.value > BURN_FEE) {
            payable(msg.sender).transfer(msg.value - BURN_FEE);
        }
        
        super.burn(amount);
        emit TokensBurned(msg.sender, amount);
    } */
    
    function createLiquidityPool(uint256 tokenAmount) external payable nonReentrant onlyOwner {
        require(!liquidityPoolCreated, "Liquidity pool already created");
        require(msg.value >= LIQUIDITY_POOL_FEE, "Insufficient liquidity pool fee");
        require(tokenAmount > 0, "Token amount must be greater than 0");
        require(balanceOf(msg.sender) >= tokenAmount, "Insufficient token balance");
        
        // Transfer the fee
        payable(feeCollector).transfer(LIQUIDITY_POOL_FEE);
        
        // Create the pair if it doesn't exist
        if (uniswapV2Pair == address(0)) {
            uniswapV2Pair = IUniswapV2Factory(uniswapV2Router.WETH())
                .createPair(address(this), uniswapV2Router.WETH());
        }
        
        // Approve router to spend tokens
        _approve(msg.sender, address(uniswapV2Router), tokenAmount);
        
        // Add liquidity
        uint256 ethForLiquidity = msg.value - LIQUIDITY_POOL_FEE;
        (uint256 tokenUsed, uint256 ethUsed, uint256 liquidity) = uniswapV2Router.addLiquidityETH{
            value: ethForLiquidity
        }(
            address(this),
            tokenAmount,
            0, // Accept any amount of tokens
            0, // Accept any amount of ETH
            msg.sender,
            block.timestamp + 300 // 5 minute deadline
        );
        
        liquidityPoolCreated = true;
        emit LiquidityPoolCreated(uniswapV2Pair, liquidity);
        
        // Return unused ETH if any
        if (ethForLiquidity > ethUsed) {
            payable(msg.sender).transfer(ethForLiquidity - ethUsed);
        }
    }
    
    function revokeMinting() external payable nonReentrant onlyOwner {
        require(!mintingRevoked, "Minting already revoked");
        require(msg.value >= REVOKE_MINT_FEE, "Insufficient revoke fee");
        
        payable(feeCollector).transfer(REVOKE_MINT_FEE);
        if (msg.value > REVOKE_MINT_FEE) {
            payable(msg.sender).transfer(msg.value - REVOKE_MINT_FEE);
        }
        
        mintingRevoked = true;
        _mintingEnabled = false;
        emit MintingRevoked();
    }
    
    // View functions
    function getLogo() public view returns (string memory) {
        return _logoUrl;
    }
    
    function getMaxSupply() public view returns (uint256) {
        return _maxSupply;
    }
    
    function isBurnEnabled() public view returns (bool) {
        return _burnEnabled;
    }
    
    function isMintingEnabled() public view returns (bool) {
        return _mintingEnabled && !mintingRevoked;
    }
    
    function getFees() public pure returns (
        uint256 burnFee,
        uint256 mintFee,
        uint256 liquidityPoolFee,
        uint256 revokeMintFee
    ) {
        return (BURN_FEE, MINT_FEE, LIQUIDITY_POOL_FEE, REVOKE_MINT_FEE);
    }
    
    // Emergency function to recover stuck ETH (only owner)
    function rescueETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

contract MemeTokenFactory is ReentrancyGuard {
    using Strings for uint256;
    
    uint256 public constant CREATION_FEE = 0.05 ether;
    address public feeCollector;
    address public immutable uniswapRouter;
    
    mapping(address => bool) public createdTokens;
    
    event TokenCreated(
        address tokenAddress,
        string name,
        string symbol,
        uint256 initialSupply,
        uint256 maxSupply,
        string logoUrl,
        bool burnEnabled
    );
    
    constructor(address _uniswapRouter) {
        require(_uniswapRouter != address(0), "Invalid router address");
        feeCollector = msg.sender;
        uniswapRouter = _uniswapRouter;
    }
    
    function createToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 maxSupply,
        string memory logoUrl,
        bool burnEnabled
    ) public payable nonReentrant returns (address) {
        require(msg.value >= CREATION_FEE, "Insufficient payment");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(initialSupply > 0, "Initial supply must be > 0");
        require(maxSupply >= initialSupply, "Max supply must be >= initial supply");
        require(bytes(logoUrl).length > 0, "Logo URL cannot be empty");
        
        // Deploy new token contract
        MemeToken newToken = new MemeToken(
            name,
            symbol,
            initialSupply,
            maxSupply,
            logoUrl,
            burnEnabled,
            msg.sender,
            feeCollector,
            uniswapRouter
        );
        
        createdTokens[address(newToken)] = true;
        
        // Transfer creation fee to fee collector
        payable(feeCollector).transfer(msg.value);
        
        emit TokenCreated(
            address(newToken),
            name,
            symbol,
            initialSupply,
            maxSupply,
            logoUrl,
            burnEnabled
        );
        
        return address(newToken);
    }
    
    function updateFeeCollector(address newCollector) public {
        require(msg.sender == feeCollector, "Only fee collector can update");
        require(newCollector != address(0), "Invalid address");
        feeCollector = newCollector;
    }
    
    function getCreationFee() public pure returns (uint256) {
        return CREATION_FEE;
    }
    
    function isTokenCreatedByFactory(address tokenAddress) public view returns (bool) {
        return createdTokens[tokenAddress];
    }
}