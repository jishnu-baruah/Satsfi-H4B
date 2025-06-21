// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../contracts/interfaces/IChainlinkAggregator.sol";

/**
 * @title MockV3Aggregator
 * @dev A mock contract for the Chainlink V3 Aggregator for testing purposes.
 */
contract MockV3Aggregator is IChainlinkAggregator {
    uint8 public constant decimals = 8;
    int256 public latestAnswer;

    constructor(int256 _initialAnswer) {
        latestAnswer = _initialAnswer;
    }

    function latestRoundData()
        external
        view
        override
        returns (
            uint80, // roundId
            int256, // answer
            uint256, // startedAt
            uint256, // updatedAt
            uint80 // answeredInRound
        )
    {
        return (1, latestAnswer, block.timestamp, block.timestamp, 1);
    }
} 