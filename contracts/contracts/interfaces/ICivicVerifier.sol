// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICivicVerifier {
    function verifyToken(address owner, bytes32 gatekeeperNetwork)
        external
        view
        returns (bool);
} 