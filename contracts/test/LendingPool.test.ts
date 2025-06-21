import { ethers } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("LendingPool", function () {
    let deployer: HardhatEthersSigner;
    let user: HardhatEthersSigner;

    // --- Contract Instances ---
    let susdToken: any;
    let stCoreToken: any;
    let lendingPool: any;
    let mockPriceFeed: any;
    let mockCivicVerifier: any;

    beforeEach(async function () {
        [deployer, user] = await ethers.getSigners();

        // Deploy our actual contracts
        const SatsfiUSD = await ethers.getContractFactory("SatsfiUSD");
        susdToken = await SatsfiUSD.deploy();

        const StakedCore = await ethers.getContractFactory("StakedCore");
        stCoreToken = await StakedCore.deploy();

        // Deploy our mock contracts from the `contracts/test` directory
        const MockPriceFeed = await ethers.getContractFactory("MockV3Aggregator");
        mockPriceFeed = await MockPriceFeed.deploy(2000 * 1e8); // 8 decimals from contract, price of $2000

        // This next line will fail, but it will prove the aggregator is working
        const MockCivicVerifier = await ethers.getContractFactory("MockCivicVerifier");
        mockCivicVerifier = await MockCivicVerifier.deploy();
        
        const gatekeeperNetwork = ethers.encodeBytes32String("test-network");

        const LendingPool = await ethers.getContractFactory("LendingPool");
        lendingPool = await LendingPool.deploy(
            await susdToken.getAddress(),
            await stCoreToken.getAddress(),
            await mockPriceFeed.getAddress(),
            await mockCivicVerifier.getAddress(),
            gatekeeperNetwork
        );
    });

    it("Should deploy and set the owner", async function () {
        expect(await lendingPool.owner()).to.equal(deployer.address);
    });
}); 