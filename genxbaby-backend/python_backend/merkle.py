import hashlib
from typing import List


def _hash_leaf(value: str) -> bytes:
    return hashlib.sha256(value.encode("utf-8")).digest()


def _hash_pair(a: bytes, b: bytes) -> bytes:
    return hashlib.sha256(a + b).digest()


def build_merkle_root(values: List[str]) -> str:
    if not values:
        raise ValueError("Cannot build Merkle root from empty list")

    level = [_hash_leaf(v) for v in values]

    while len(level) > 1:
        next_level = []
        for i in range(0, len(level), 2):
            left = level[i]
            right = level[i + 1] if i + 1 < len(level) else left
            next_level.append(_hash_pair(left, right))
        level = next_level

    return "0x" + level[0].hex()


def build_merkle_root_for_properties(property_ids: List[int]) -> str:
    values = [str(pid) for pid in property_ids]
    return build_merkle_root(values)
