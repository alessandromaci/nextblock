// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {MockOracle} from "../src/MockOracle.sol";
import {PolicyRegistry} from "../src/PolicyRegistry.sol";
import {ClaimReceipt} from "../src/ClaimReceipt.sol";
import {InsuranceVault} from "../src/InsuranceVault.sol";
import {VaultFactory} from "../src/VaultFactory.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title DemoSetup
/// @notice Deploys everything, creates 2 vaults, registers 3 policies, funds premiums.
///         Run: forge script script/DemoSetup.s.sol --rpc-url $RPC_URL --broadcast
///         For Anvil: forge script script/DemoSetup.s.sol --rpc-url http://localhost:8545 --broadcast
/// @dev Uses two wallets:
///         Wallet 1 (deployer/admin): All platform roles
///         Wallet 2 (investor): Investor only, funded with MockUSDC
contract DemoSetup is Script {
    // --- Policy Constants ---
    uint256 constant COVERAGE_P1 = 50_000e6;   // $50K
    uint256 constant PREMIUM_P1  = 2_500e6;     // $2,500
    uint256 constant DURATION_P1 = 90 days;
    int256  constant THRESHOLD_P1 = 80_000e8;   // $80,000 in 8-decimal format

    uint256 constant COVERAGE_P2 = 15_000e6;    // $15K
    uint256 constant PREMIUM_P2  = 1_200e6;     // $1,200
    uint256 constant DURATION_P2 = 60 days;

    uint256 constant COVERAGE_P3 = 40_000e6;    // $40K
    uint256 constant PREMIUM_P3  = 2_400e6;     // $2,400
    uint256 constant DURATION_P3 = 180 days;

    // --- Deployed Contracts ---
    MockUSDC public usdc;
    MockOracle public oracle;
    PolicyRegistry public registry;
    ClaimReceipt public claimReceipt;
    VaultFactory public factory;
    InsuranceVault public vaultA;
    InsuranceVault public vaultB;

    function run() external {
        // --- Get deployer private key ---
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        // Investor address (can be configured via env, defaults to second Anvil account)
        address investor;
        try vm.envAddress("INVESTOR_ADDRESS") returns (address addr) {
            investor = addr;
        } catch {
            // Default: Anvil account #1 (0x70997970C51812dc3A010C7d01b50e0d17dc79C8)
            investor = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
        }

        // Vault Manager B address (can be configured via env)
        address managerB;
        try vm.envAddress("MANAGER_B_ADDRESS") returns (address addr) {
            managerB = addr;
        } catch {
            managerB = deployer; // Default: same as deployer for hackathon
        }

        console.log("=== NextBlock Demo Setup ===");
        console.log("Deployer/Admin:", deployer);
        console.log("Investor:", investor);
        console.log("Manager B:", managerB);
        console.log("");

        vm.startBroadcast(deployerKey);

        // ============================================
        // Phase 1: Deploy standalone contracts
        // ============================================
        console.log("--- Phase 1: Deploy Contracts ---");

        usdc = new MockUSDC();
        console.log("MockUSDC:", address(usdc));

        oracle = new MockOracle();
        console.log("MockOracle:", address(oracle));

        claimReceipt = new ClaimReceipt();
        console.log("ClaimReceipt:", address(claimReceipt));

        registry = new PolicyRegistry();
        console.log("PolicyRegistry:", address(registry));

        // ============================================
        // Phase 2: Deploy factory + vaults
        // ============================================
        console.log("");
        console.log("--- Phase 2: Deploy Factory + Vaults ---");

        factory = new VaultFactory(
            address(usdc),
            address(registry),
            address(oracle),
            address(claimReceipt)
        );
        console.log("VaultFactory:", address(factory));

        // Vault A: "Balanced Core" -- 20% buffer, 0.5% fee, managed by deployer
        address vaultAAddr = factory.createVault(
            "NextBlock Balanced Core",
            "nxbBAL",
            "Balanced Core",
            deployer,       // vault manager = deployer for hackathon
            2000,           // 20% buffer
            50              // 0.5% management fee
        );
        vaultA = InsuranceVault(vaultAAddr);
        console.log("Vault A (Balanced Core):", vaultAAddr);

        // Vault B: "DeFi Alpha" -- 15% buffer, 1% fee, managed by managerB
        address vaultBAddr = factory.createVault(
            "NextBlock DeFi Alpha",
            "nxbALPHA",
            "DeFi Alpha",
            managerB,       // vault manager = managerB
            1500,           // 15% buffer
            100             // 1% management fee
        );
        vaultB = InsuranceVault(vaultBAddr);
        console.log("Vault B (DeFi Alpha):", vaultBAddr);

        // Authorize vaults as ClaimReceipt minters
        claimReceipt.setAuthorizedMinter(vaultAAddr, true);
        claimReceipt.setAuthorizedMinter(vaultBAddr, true);
        console.log("ClaimReceipt minters authorized");

        // ============================================
        // Phase 3: Register + activate policies
        // ============================================
        console.log("");
        console.log("--- Phase 3: Register Policies ---");

        // P1: BTC Price Protection (ON_CHAIN)
        uint256 p1 = registry.registerPolicy(
            "BTC Price Protection",
            PolicyRegistry.VerificationType.ON_CHAIN,
            COVERAGE_P1,
            PREMIUM_P1,
            DURATION_P1,
            deployer,       // insurer = deployer for hackathon
            THRESHOLD_P1
        );
        console.log("P1 (BTC Protection) registered, id:", p1);

        // P2: Flight Delay (ORACLE_DEPENDENT)
        uint256 p2 = registry.registerPolicy(
            "Flight Delay",
            PolicyRegistry.VerificationType.ORACLE_DEPENDENT,
            COVERAGE_P2,
            PREMIUM_P2,
            DURATION_P2,
            deployer,       // insurer = deployer
            0               // no threshold for oracle-dependent
        );
        console.log("P2 (Flight Delay) registered, id:", p2);

        // P3: Commercial Fire (OFF_CHAIN)
        uint256 p3 = registry.registerPolicy(
            "Commercial Fire",
            PolicyRegistry.VerificationType.OFF_CHAIN,
            COVERAGE_P3,
            PREMIUM_P3,
            DURATION_P3,
            deployer,       // insurer = deployer
            0               // no threshold for off-chain
        );
        console.log("P3 (Commercial Fire) registered, id:", p3);

        // Activate all
        registry.activatePolicy(p1);
        registry.activatePolicy(p2);
        registry.activatePolicy(p3);
        console.log("All policies activated");

        // ============================================
        // Phase 4: Add policies to vaults + fund premiums
        // ============================================
        console.log("");
        console.log("--- Phase 4: Add Policies + Fund Premiums ---");

        // Vault A: P1 (40%) + P2 (20%) + P3 (40%)
        vaultA.addPolicy(p1, 4000);
        vaultA.addPolicy(p2, 2000);
        vaultA.addPolicy(p3, 4000);
        console.log("Vault A policies: P1(40%), P2(20%), P3(40%)");

        // Vault B: P1 (60%) + P2 (40%)
        // If managerB is different from deployer, they need to call addPolicy
        if (managerB == deployer) {
            vaultB.addPolicy(p1, 6000);
            vaultB.addPolicy(p2, 4000);
        }
        console.log("Vault B policies: P1(60%), P2(40%)");

        // Mint USDC for premiums
        uint256 totalPremiums = PREMIUM_P1 + PREMIUM_P2 + PREMIUM_P3 + PREMIUM_P1 + PREMIUM_P2;
        usdc.mint(deployer, totalPremiums);
        console.log("Minted premium USDC:", totalPremiums);

        // Fund Vault A premiums
        usdc.approve(vaultAAddr, PREMIUM_P1 + PREMIUM_P2 + PREMIUM_P3);
        vaultA.depositPremium(p1, PREMIUM_P1);
        vaultA.depositPremium(p2, PREMIUM_P2);
        vaultA.depositPremium(p3, PREMIUM_P3);
        console.log("Vault A premiums funded: $6,100");

        // Fund Vault B premiums
        usdc.approve(vaultBAddr, PREMIUM_P1 + PREMIUM_P2);
        vaultB.depositPremium(p1, PREMIUM_P1);
        vaultB.depositPremium(p2, PREMIUM_P2);
        console.log("Vault B premiums funded: $3,700");

        // ============================================
        // Phase 5: Setup demo state
        // ============================================
        console.log("");
        console.log("--- Phase 5: Setup Demo State ---");

        // Set roles on both vaults (deployer = all roles for hackathon)
        vaultA.setOracleReporter(deployer);
        vaultA.setInsurerAdmin(deployer);
        vaultB.setOracleReporter(deployer);
        vaultB.setInsurerAdmin(deployer);
        console.log("Vault roles set (deployer = all roles)");

        // Oracle is initialized in constructor (BTC = $85K, flight = false)
        console.log("Oracle initialized: BTC=$85,000, flight=not delayed");

        // Mint USDC to investor ($50K)
        usdc.mint(investor, 50_000e6);
        console.log("Investor funded: $50,000 USDC");

        // Mint some USDC to deployer for additional demos
        usdc.mint(deployer, 50_000e6);
        console.log("Admin funded: $50,000 USDC");

        vm.stopBroadcast();

        // ============================================
        // Summary
        // ============================================
        console.log("");
        console.log("=== Deployment Complete ===");
        console.log("");
        console.log("Contract Addresses:");
        console.log("  MockUSDC:       ", address(usdc));
        console.log("  MockOracle:     ", address(oracle));
        console.log("  PolicyRegistry: ", address(registry));
        console.log("  ClaimReceipt:   ", address(claimReceipt));
        console.log("  VaultFactory:   ", address(factory));
        console.log("  Vault A:        ", vaultAAddr);
        console.log("  Vault B:        ", vaultBAddr);
        console.log("");
        console.log("Policies:");
        console.log("  P1: BTC Price Protection (ON_CHAIN, $50K, 90d)");
        console.log("  P2: Flight Delay (ORACLE, $15K, 60d)");
        console.log("  P3: Commercial Fire (OFF_CHAIN, $40K, 180d)");
        console.log("");
        console.log("Demo Wallets:");
        console.log("  Admin/Platform: ", deployer);
        console.log("  Investor:       ", investor);
    }
}
