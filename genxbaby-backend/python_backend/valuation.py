def estimate_digital_asset_value(asset_type: str, identifier: str, metadata: str | None):
    """
    Simple valuation logic (Phase 8 baseline).
    You can replace this with ML, API calls, or traffic analysis later.
    """

    # Domain valuation
    if asset_type == "domain":
        base = 50000  # $500.00 baseline
        if identifier.endswith(".com"):
            base += 25000
        if len(identifier.split(".")[0]) <= 5:
            base += 50000
        return base

    # Social handle valuation
    if asset_type == "social":
        try:
            meta = eval(metadata) if metadata else {}
            followers = meta.get("followers", 0)
            return followers * 2  # $0.02 per follower baseline
        except:
            return 10000

    # Website valuation
    if asset_type == "website":
        try:
            meta = eval(metadata) if metadata else {}
            monthly_revenue = meta.get("monthly_revenue", 0)
            return monthly_revenue * 24  # 24x monthly revenue
        except:
            return 50000

    # Default
    return 10000
