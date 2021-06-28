//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

///@title A Wrapped Ether Token
///@author Sarah M.
///@notice ERC-20 contract simulating wETHER

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract WETH is ERC20 {
        using Address for address payable;

    uint256 private _totalSupply;
    address private _tokenHolder;

    ///@param initialSupply the initial amount of WETH to be released and minted
    ///@notice the initialSupply will me minted to the address of the deployer
    constructor (uint256 initialSupply) ERC20("Wrapped Ether", "WETH") {
        _tokenHolder = msg.sender;
        _mint(_tokenHolder, initialSupply);
    }

    event  Deposited(address indexed dst, uint256 amount);
    event  Withdrawn(address indexed src, uint256 amount);

    ///@dev receive function allows the contract to receive ETHER
    receive() external payable {
        deposit();
    }

    ///@notice you can send ETHER through this function in exchange for WETH
    ///@dev public deposit function calls private valueIn and emits Deposited
    function deposit() public payable {
        _valueIn();
        emit Deposited(msg.sender, msg.value);
    }    
    
    ///@notice enter the amount of WETH to be exchanged against ETHER that will be transferred to your address
    ///@dev public withdraw function calls private valueOut function and emits Withdrawn
    function withdraw() public payable {
        require(balanceOf(msg.sender) >= msg.value, "The withdrawn amount can not exceed your balance");
        _valueOut();
        emit Withdrawn(msg.sender, msg.value);
    }

    ///@dev valueIn function allows to buy WETH when function deposit is called: it mints the WETH to buyer and burns the same amount from tokenHolder
    function _valueIn() private {
        _mint(msg.sender, msg.value);
        _burn(_tokenHolder, msg.value);
    }
    
    ///@dev valueOut function allows to sell WETH when function withdraw is called: it burns the WETH from owner and mints the same amount to tokenHolder
    function _valueOut() private {
        _burn(msg.sender, msg.value);
        _mint(_tokenHolder, msg.value);
    }
}
