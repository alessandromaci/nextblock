// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {InsuranceVault} from "../src/InsuranceVault.sol";
import {PolicyRegistry} from "../src/PolicyRegistry.sol";
import {MockOracle} from "../src/MockOracle.sol";

/// @title Keeper - Autonomous Claim Settlement Agent
/// @notice Reads oracle prices and automatically triggers eligible on-chain claims.
///         Demonstrates the "agentic commerce" pattern: autonomous bots monitoring
///         on-chain conditions and settling insurance claims without human intervention.
///
///         Run: forge script script/Keeper.s.sol --rpc-url $RPC_URL --broadcast
///
/// @dev This script:
///   1. Reads current oracle data (BTC price, flight status)
///   2. Iterates through all vault policies
///   3. For ON_CHAIN policies: checks if trigger condition is met
///   4. If trigger met: calls checkClaim() to auto-settle
///   5. Logs all actions for transparency
contract Keeper is Script {
    // Configure these addresses for your deployment
    // Arc Testnet deployment (2026-02-07)
    address constant MOCK_ORACLE = 0x9b7A5665Bea2DB15DF9Db0d32e8F07F9c949E5FC;
    address constant POLICY_REG  = 0x2276a1076931De26FA4F1470ebC6b2820Fb087d3;

    // All 8 vault addresses (Arc Testnet)
    address[8] vaultAddrs = [
        0x20080df6160fd21753848B1418c6D3f4620Ce774, // A: Balanced Core
        0x4f1093EFF03541A3a496f645a2Fe8739C03A4f39, // B: Digital Asset Shield
        0x04FE9406e5F3B7F43df07F19D660B03F9780945D, // C: Parametric Shield
        0x8DF0a6d4d3f4139C82EBE474145Faaf0693e1416, // D: Conservative Yield
        0x5826884A2CA07724cE8935979216d3710aF2Ed3c, // E: Catastrophe & Specialty
        0x221968156e585e5E36aEcbF256Ed121222Cdd5C0, // F: Traditional Lines
        0x1402f1B21bc3660BFba7bFc49524B6860302b99f, // G: Technology & Specialty
        0xE9b18074aC47402Df4d44D57B04Ee7EE094A8d5A  // H: Multi-Line Diversified
    ];

    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        console.log("=== NextBlock Keeper - Autonomous Claim Settlement Agent ===");
        console.log("Keeper address:", vm.addr(deployerKey));
        console.log("");

        // Step 1: Read oracle state
        MockOracle oracle = MockOracle(MOCK_ORACLE);
        int256 btcPrice;
        uint256 btcUpdatedAt;
        {
            bool flightDelayed;
            uint256 flightUpdatedAt;
            (btcPrice, btcUpdatedAt) = oracle.getBtcPrice();
            (flightDelayed, flightUpdatedAt) = oracle.getFlightStatus();

            console.log("--- Oracle State ---");
            console.log("BTC Price: $%s", uint256(btcPrice) / 1e8);
            console.log("BTC Last Updated:", btcUpdatedAt);
            console.log("Flight Delayed:", flightDelayed);
            console.log("Flight Last Updated:", flightUpdatedAt);
            console.log("");
        }

        // Step 2: Scan all vaults for triggerable claims
        PolicyRegistry registry = PolicyRegistry(POLICY_REG);
        uint256 claimsTriggered = 0;

        vm.startBroadcast(deployerKey);

        for (uint256 v = 0; v < vaultAddrs.length; v++) {
            claimsTriggered += _scanVault(
                InsuranceVault(vaultAddrs[v]),
                registry,
                btcPrice,
                btcUpdatedAt
            );
        }

        vm.stopBroadcast();

        console.log("");
        console.log("=== Keeper Run Complete ===");
        console.log("Claims triggered: %s", claimsTriggered);
    }

    function _scanVault(
        InsuranceVault vault,
        PolicyRegistry registry,
        int256 btcPrice,
        uint256 btcUpdatedAt
    ) internal returns (uint256 triggered) {
        string memory vaultName = vault.vaultName();
        uint256[] memory policyIds = vault.getPolicyIds();

        console.log("--- Scanning Vault: %s ---", vaultName);
        console.log("  Policies: %s", policyIds.length);

        for (uint256 p = 0; p < policyIds.length; p++) {
            triggered += _checkPolicy(vault, registry, policyIds[p], btcPrice, btcUpdatedAt);
        }
    }

    function _checkPolicy(
        InsuranceVault vault,
        PolicyRegistry registry,
        uint256 policyId,
        int256 btcPrice,
        uint256 btcUpdatedAt
    ) internal returns (uint256) {
        PolicyRegistry.Policy memory policy = registry.getPolicy(policyId);

        // Only check ON_CHAIN policies (permissionless trigger)
        if (policy.verificationType != PolicyRegistry.VerificationType.ON_CHAIN) {
            return 0;
        }

        // Check if already claimed in this vault
        (,,,,bool claimed,) = vault.vaultPolicies(policyId);
        if (claimed) {
            console.log("  Policy %s: already claimed, skipping", policyId);
            return 0;
        }

        // Check trigger condition: BTC price <= threshold
        if (btcPrice <= policy.triggerThreshold && btcUpdatedAt > 0) {
            console.log("  Policy %s: TRIGGER CONDITION MET!", policyId);

            try vault.checkClaim(policyId) {
                console.log("    -> Claim TRIGGERED successfully!");
                return 1;
            } catch {
                console.log("    -> Claim trigger failed (may be expired or already processed)");
            }
        } else {
            console.log("  Policy %s: no trigger (price above threshold)", policyId);
        }

        return 0;
    }
}
