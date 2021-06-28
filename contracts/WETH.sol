//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract WETH is ERC20 {
        using Address for address payable;

    uint256 private _totalSupply;
    address private _tokenHolder;

    constructor (uint256 initialSupply) ERC20("Wrapped Ether", "WETH") {
        _tokenHolder = msg.sender;
        _mint(_tokenHolder, initialSupply);
    }

    event  Deposited(address indexed dst, uint256 amount);
    event  Withdrawn(address indexed src, uint256 amount);

    receive() external payable {
        deposit();
    }

    function deposit() public payable {
        _valueIn();
        emit Deposited(msg.sender, msg.value);
    }    
    
    function withdraw() public payable {
        require(balanceOf(msg.sender) >= msg.value);
        _valueOut();
        emit Withdrawn(msg.sender, msg.value);
    }

    function _valueIn() private {
        _mint(msg.sender, msg.value);
        _burn(_tokenHolder, msg.value);
    }
    
    function _valueOut() private {
        _burn(msg.sender, msg.value);
        _mint(_tokenHolder, msg.value);
    }
}
