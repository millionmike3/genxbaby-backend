// src/routes/admin.ts
router.get("/underwriting/apps", async (req, res) => {
  const apps = await listApplications();
  res.json(apps);
});
