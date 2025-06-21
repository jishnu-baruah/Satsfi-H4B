// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../contracts/interfaces/ICivicVerifier.sol";

/**
 * @title MockCivicVerifier
 * @dev A mock contract for the Civic Verifier for testing purposes.
 */
contract MockCivicVerifier is ICivicVerifier {
    mapping(address => bool) public hasPass;

    /**
     * @dev Allows tests to set whether a user has a pass.
     */
    function setPassStatus(address _user, bool _status) external {
        hasPass[_user] = _status;
    }

    function verifyToken(address owner, bytes32)
        external
        view
        override
        returns (bool)
    {
        return hasPass[owner];
    }
} 