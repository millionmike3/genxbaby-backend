-- 1. Market data
CREATE TABLE market_data (
    id              SERIAL PRIMARY KEY,
    timestamp       TIMESTAMPTZ NOT NULL,
    ten_year_yield  NUMERIC(6,4) NOT NULL,
    mbs_yield       NUMERIC(6,4),
    cpi             NUMERIC(6,3),
    pce             NUMERIC(6,3),
    unemployment_rate NUMERIC(5,3),
    wage_growth     NUMERIC(5,3)
);

-- 2. Bank rates
CREATE TABLE bank_rates (
    id           SERIAL PRIMARY KEY,
    timestamp    TIMESTAMPTZ NOT NULL,
    bank_name    TEXT NOT NULL,
    product_type TEXT NOT NULL, -- e.g. 30Y_FIXED
    rate         NUMERIC(6,3) NOT NULL,
    apr          NUMERIC(6,3),
    points       NUMERIC(5,3)
);

-- 3. Macro weights
CREATE TABLE gx_config_weights (
    id                 SERIAL PRIMARY KEY,
    effective_date     DATE NOT NULL,
    alpha_inflation    NUMERIC(8,4) NOT NULL,
    beta_unemployment  NUMERIC(8,4) NOT NULL,
    gamma_wage         NUMERIC(8,4) NOT NULL,
    base_spread_mbs    NUMERIC(6,4) NOT NULL,
    active             BOOLEAN DEFAULT TRUE
);

-- 4. Margin profiles
CREATE TABLE gx_margin_profiles (
    id                SERIAL PRIMARY KEY,
    profile_name      TEXT UNIQUE NOT NULL,
    target_profit_bps INTEGER NOT NULL,
    risk_premium_bps  INTEGER NOT NULL,
    min_margin_bps    INTEGER NOT NULL,
    max_margin_bps    INTEGER NOT NULL,
    active            BOOLEAN DEFAULT TRUE
);

-- 5. Property-type adjustments
CREATE TABLE property_type_adjustments (
    id                  SERIAL PRIMARY KEY,
    property_type       TEXT NOT NULL, -- SFR, CONDO, MULTI_FAMILY, COMMERCIAL, etc.
    adjustment_bps      INTEGER NOT NULL,
    effective_date      DATE NOT NULL,
    active              BOOLEAN DEFAULT TRUE
);

-- 6. Credit-tier adjustments
CREATE TABLE credit_tier_adjustments (
    id              SERIAL PRIMARY KEY,
    credit_min      INTEGER NOT NULL,
    credit_max      INTEGER NOT NULL,
    adjustment_bps  INTEGER NOT NULL,
    effective_date  DATE NOT NULL,
    active          BOOLEAN DEFAULT TRUE
);

-- 7. Lending-type adjustments
CREATE TABLE lending_type_adjustments (
    id                 SERIAL PRIMARY KEY,
    lending_type       TEXT NOT NULL, -- CONVENTIONAL, FHA, VA, DSCR, HARD_MONEY, etc.
    adjustment_bps     INTEGER NOT NULL,
    risk_premium_bps   INTEGER NOT NULL,
    speed_premium_bps  INTEGER DEFAULT 0,
    effective_date     DATE NOT NULL,
    active             BOOLEAN DEFAULT TRUE
);

-- 8. Daily lending matrix
CREATE TABLE gx_daily_lending_matrix (
    id                     SERIAL PRIMARY KEY,
    date                   DATE NOT NULL,
    product_type           TEXT NOT NULL,
    property_type          TEXT NOT NULL,
    lending_type           TEXT NOT NULL,
    credit_tier            TEXT NOT NULL, -- e.g. "680-699"
    base_rate              NUMERIC(6,3) NOT NULL,
    macro_adj_bps          INTEGER NOT NULL,
    bank_adj_bps           INTEGER NOT NULL,
    margin_bps             INTEGER NOT NULL,
    property_adj_bps       INTEGER NOT NULL,
    credit_adj_bps         INTEGER NOT NULL,
    lending_type_adj_bps   INTEGER NOT NULL,
    final_rate             NUMERIC(6,3) NOT NULL
);

-- 9. Config audit log
CREATE TABLE gx_config_audit (
    id              SERIAL PRIMARY KEY,
    config_type     TEXT NOT NULL, -- 'MARGIN_PROFILE', 'PROPERTY_ADJ', etc.
    config_id       INTEGER,
    changed_by      TEXT NOT NULL,
    change_summary  TEXT NOT NULL,
    previous_value  JSONB,
    new_value       JSONB,
    changed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
