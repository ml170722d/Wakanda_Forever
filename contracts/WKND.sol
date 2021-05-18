// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.16 <0.9.0;

import "./ERC20Token.sol";

contract WKND is ERC20Token {
// contract WKND is ERC20 {
    string public constant name = "ElectionToken";
    string public constant symbol = "WKND";
    uint8 public constant decimals = 0;

    uint256 public constant INITIAL_SUPPLY = 6 * (10 ** uint256(6));

    constructor() public {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}