from .config_service import ConfigService
from .market_service import MarketService
from .bank_service import BankService
from .repositories import MatrixRepository

class PricingService:
    def __init__(self, config: ConfigService, market: MarketService,
                 bank: BankService, matrix_repo: MatrixRepository):
        self.config = config
        self.market = market
        self.bank = bank
        self.matrix_repo = matrix_repo

    def compute_daily_matrix(self, date):
        market = self.market.get_latest()
        bank_rates = self.bank.get_latest()
        weights = self.config.get_current_weights()
        margin_profile = self.config.get_margin_profile("STANDARD")
        property_adjs = self.config.get_property_adjustments()
        credit_tiers = self.config.get_credit_tiers()
        lending_adjs = self.config.get_lending_type_adjustments()

        product_types = ["30Y_FIXED", "15Y_FIXED", "5_1_ARM"]
        property_types = [p.property_type for p in property_adjs]
        lending_types = [l.lending_type for l in lending_adjs]

        for product in product_types:
            for prop in property_types:
                for lending in lending_types:
                    for tier in credit_tiers:
                        rate_row = self._compute_rate_row(
                            date, product, prop, lending, tier,
                            market, bank_rates, weights,
                            margin_profile, property_adjs, lending_adjs
                        )
                        self.matrix_repo.save(rate_row)

    def _compute_rate_row(self, date, product, prop, lending, tier,
                          market, bank_rates, weights,
                          margin_profile, property_adjs, lending_adjs):
        base_rate = compute_base_rate(market, weights)
        macro_adj_bps = compute_macro_adj(market, weights)
        bank_adj_bps = compute_bank_adj(bank_rates, product, base_rate)
        property_adj_bps = get_property_adj(prop, property_adjs)
        credit_adj_bps = tier.adjustment_bps
        lending_type_adj_bps = get_lending_adj(lending, lending_adjs)
        margin_bps = compute_margin(margin_profile, risk_premium_bps=lending_type_adj_bps)

        final_rate = base_rate \
            + bps_to_rate(macro_adj_bps) \
            + bps_to_rate(bank_adj_bps) \
            + bps_to_rate(property_adj_bps) \
            + bps_to_rate(credit_adj_bps) \
            + bps_to_rate(margin_bps)

        return {
            "date": date,
            "product_type": product,
            "property_type": prop,
            "lending_type": lending,
            "credit_tier": f"{tier.credit_min}-{tier.credit_max}",
            "base_rate": base_rate,
            "macro_adj_bps": macro_adj_bps,
            "bank_adj_bps": bank_adj_bps,
            "margin_bps": margin_bps,
            "property_adj_bps": property_adj_bps,
            "credit_adj_bps": credit_adj_bps,
            "lending_type_adj_bps": lending_type_adj_bps,
            "final_rate": final_rate
        }
