// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {StrategyRegistry}    from "../src/StrategyRegistry.sol";
import {RiskEngine}          from "../src/RiskEngine.sol";
import {VaultManager}        from "../src/VaultManager.sol";
import {KeeperExecutor}      from "../src/KeeperExecutor.sol";
import {InitiaDEXLPStrategy} from "../src/strategies/InitiaDEXLPStrategy.sol";

/// @notice Production deployment for NEURALIS — The Agent Economy Appchain.
///
/// Deployment order:
///   1. StrategyRegistry
///   2. RiskEngine(registry)
///   3. VaultManager(usdc, registry, riskEngine)
///   4. KeeperExecutor(vaultManager, agentSigner)
///   5. Grant KEEPER_ROLE → KeeperExecutor
///   6. Deploy InitiaDEXLPStrategy (real yield via Uniswap V2 DEX)
///   7. Register strategy in registry
///   8. Write deployments.json
///
/// Required env vars (copy contracts/.env.example → contracts/.env):
///   PRIVATE_KEY            — deployer private key
///   DEPLOYER_ADDRESS       — deployer public address
///   USDC_ADDRESS           — bridged USDC on the NEURALIS EVM chain
///   AGENT_SIGNER_ADDRESS   — public address of the AI-agent signing key
///   DEX_ROUTER_ADDRESS     — Uniswap V2 compatible router on NEURALIS
///   DEX_PAIR_ADDRESS       — USDC/tokenB LP pair contract address
///   DEX_TOKEN_B_ADDRESS    — second token in the USDC/tokenB LP pair
///   DEX_INITIAL_APY        — initial APY estimate in bps (e.g. 500 = 5%)
///   DEX_INITIAL_RISK       — initial risk score 0-100 (e.g. 25)
///   INITIASCAN_URL         — block explorer API URL (for --verify)
///   INITIASCAN_API_KEY     — block explorer API key
contract Deploy is Script {
    function run() external {
        address deployer    = vm.envAddress("DEPLOYER_ADDRESS");
        address usdc        = vm.envAddress("USDC_ADDRESS");
        address agentSigner = vm.envAddress("AGENT_SIGNER_ADDRESS");
        address dexRouter   = vm.envAddress("DEX_ROUTER_ADDRESS");
        address dexPair     = vm.envAddress("DEX_PAIR_ADDRESS");
        address tokenB      = vm.envAddress("DEX_TOKEN_B_ADDRESS");
        uint256 initialAPY  = vm.envUint("DEX_INITIAL_APY");
        uint8   initialRisk = uint8(vm.envUint("DEX_INITIAL_RISK"));

        vm.startBroadcast();

        // ── 1. StrategyRegistry ──────────────────────────────────────────────
        StrategyRegistry registry = new StrategyRegistry(deployer);
        console2.log("StrategyRegistry :", address(registry));

        // ── 2. RiskEngine ────────────────────────────────────────────────────
        RiskEngine riskEngine = new RiskEngine(address(registry), deployer);
        console2.log("RiskEngine       :", address(riskEngine));

        // ── 3. VaultManager ──────────────────────────────────────────────────
        VaultManager vaultManager = new VaultManager(
            IERC20(usdc),
            address(registry),
            address(riskEngine),
            deployer
        );
        console2.log("VaultManager     :", address(vaultManager));

        // ── 4. KeeperExecutor ────────────────────────────────────────────────
        KeeperExecutor keeperExecutor = new KeeperExecutor(
            address(vaultManager),
            agentSigner,
            deployer
        );
        console2.log("KeeperExecutor   :", address(keeperExecutor));

        // ── 5. Grant KEEPER_ROLE ─────────────────────────────────────────────
        vaultManager.grantRole(vaultManager.KEEPER_ROLE(), address(keeperExecutor));
        console2.log("KEEPER_ROLE granted to KeeperExecutor");

        // ── 6. InitiaDEXLPStrategy ───────────────────────────────────────────
        InitiaDEXLPStrategy dexStrategy = new InitiaDEXLPStrategy(
            dexRouter,
            dexPair,
            usdc,
            tokenB,
            address(vaultManager),
            initialAPY,
            initialRisk,
            deployer
        );
        console2.log("InitiaDEXLPStrategy:", address(dexStrategy));

        // ── 7. Register strategy (max 35%) ───────────────────────────────────
        registry.addStrategy(address(dexStrategy), 3500);
        console2.log("InitiaDEXLPStrategy registered");

        vm.stopBroadcast();

        // ── 8. Write deployments.json ────────────────────────────────────────
        string memory json = "deployments";
        vm.serializeAddress(json, "strategyRegistry", address(registry));
        vm.serializeAddress(json, "riskEngine",       address(riskEngine));
        vm.serializeAddress(json, "vaultManager",     address(vaultManager));
        vm.serializeAddress(json, "keeperExecutor",   address(keeperExecutor));
        vm.serializeAddress(json, "dexStrategy",      address(dexStrategy));
        vm.serializeAddress(json, "usdc",             usdc);
        string memory output = vm.serializeUint(json, "chainId", block.chainid);

        vm.writeJson(output, "./deployments.json");
        console2.log("deployments.json written.");
    }
}
