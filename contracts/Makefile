.PHONY: install build test test-v coverage clean deploy deploy-dry deploy-move

# ── Setup ─────────────────────────────────────────────────────────────────────
install:
	forge install foundry-rs/forge-std OpenZeppelin/openzeppelin-contracts

# ── Build ─────────────────────────────────────────────────────────────────────
build:
	forge build

# ── Tests ─────────────────────────────────────────────────────────────────────
test:
	forge test

test-v:
	forge test -vvv

# Run a single test by name:  make test-match MATCH=test_Deposit
test-match:
	forge test --match-test $(MATCH) -vvv

# Run a single test file:  make test-file FILE=VaultManager
test-file:
	forge test --match-path test/$(FILE).t.sol -vvv

# ── Coverage ──────────────────────────────────────────────────────────────────
coverage:
	forge coverage --report lcov
	genhtml -o coverage-report lcov.info --branch-coverage

# ── EVM Deploy ────────────────────────────────────────────────────────────────
# Required env vars: RPC_URL, PRIVATE_KEY, DEPLOYER_ADDRESS,
#                    USDC_ADDRESS, AGENT_SIGNER_ADDRESS,
#                    INITIASCAN_URL, INITIASCAN_API_KEY
deploy:
	forge script script/Deploy.s.sol \
		--rpc-url $(RPC_URL) \
		--private-key $(PRIVATE_KEY) \
		--broadcast \
		--verify \
		--verifier-url $(INITIASCAN_URL) \
		--etherscan-api-key $(INITIASCAN_API_KEY)

deploy-dry:
	forge script script/Deploy.s.sol --rpc-url $(RPC_URL)

# ── MoveVM Deploy ─────────────────────────────────────────────────────────────
# Required env vars: MODULE_OWNER_KEY, L2_CHAIN_ID, L2_RPC, L2_REST,
#                    FEE_DENOM, KEEPER_ED25519_PUBKEY
deploy-move:
	bash move/deploy.sh

# ── Clean ─────────────────────────────────────────────────────────────────────
clean:
	forge clean
	rm -rf lcov.info coverage-report
