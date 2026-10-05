const express = require("express");
const bodyParser = require("body-parser");
const { requirePermission } = require("./rbacMiddleware");
const {
  listBanks,
  createBank,
  listChecksByBank,
  issueCheck,
} = require("./services/bankingService");

const app = express();
app.use(bodyParser.json());

// Auth stub (replace with real auth)
app.use((req, _res, next) => {
  // e.g. decode JWT, attach user to req.user
  req.user = { id: "some-user-id" };
  next();
});

// Bank profiles
app.get("/owners/:ownerId/banks", requirePermission("bank.read"), async (req, res) => {
  const banks = await listBanks(req.params.ownerId);
  res.json(banks);
});

app.post("/owners/:ownerId/banks", requirePermission("bank.write"), async (req, res) => {
  const bank = await createBank(req.params.ownerId, req.body);
  res.status(201).json(bank);
});

// Checks
app.get(
  "/owners/:ownerId/banks/:bankId/checks",
  requirePermission("check.issue"),
  async (req, res) => {
    const checks = await listChecksByBank(req.params.bankId);
    res.json(checks);
  }
);

app.post(
  "/owners/:ownerId/banks/:bankId/checks",
  requirePermission("check.issue"),
  async (req, res) => {
    const check = await issueCheck(req.params.bankId, req.body);
    res.status(201).json(check);
  }
);

app.listen(4000, () => console.log("API running on :4000"));
