from typing import Optional
from web3 import Web3

# Configure your Polygon Amoy RPC
POLYGON_AMOY_RPC = "https://rpc-amoy.polygon.technology"
ANCHOR_CONTRACT_ADDRESS = "0xYourAnchorContract"
ANCHOR_CONTRACT_ABI = []  # fill with actual ABI

PRIVATE_KEY = "0xYourPrivateKey"
ACCOUNT_ADDRESS = "0xYourAccountAddress"


def get_web3() -> Web3:
    return Web3(Web3.HTTPProvider(POLYGON_AMOY_RPC))


def anchor_merkle_root_on_polygon(merkle_root: str) -> Optional[str]:
    """
    Stub: send a transaction to anchor merkle_root on Polygon Amoy.
    Returns tx_hash as hex string.
    """
    w3 = get_web3()
    if not w3.is_connected():
        # In production, raise or log
        return None

    contract = w3.eth.contract(
        address=Web3.to_checksum_address(ANCHOR_CONTRACT_ADDRESS),
        abi=ANCHOR_CONTRACT_ABI,
    )

    nonce = w3.eth.get_transaction_count(ACCOUNT_ADDRESS)
    tx = contract.functions.anchorMerkleRoot(merkle_root).build_transaction(
        {
            "from": ACCOUNT_ADDRESS,
            "nonce": nonce,
            "gas": 300000,
            "gasPrice": w3.to_wei("1", "gwei"),
        }
    )

    signed = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    return tx_hash.hex()
