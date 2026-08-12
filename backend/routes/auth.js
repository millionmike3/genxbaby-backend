const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

// Generate tokens
function generateTokens(user) {
  const accessToken = jwt.sign(
    { sub: user.id, ownerId: user.ownerId },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const { accessToken, refreshToken } = generateTokens(user);

  // Store refresh token in httpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/", // MUST match logout path
  });

  // Access token returned to frontend
  res.json({ token: accessToken });
});

// REFRESH ACCESS TOKEN
router.post("/refresh", async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { accessToken } = generateTokens(user);

    res.json({ token: accessToken });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // MUST match login cookie path
    });

    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Logout failed" });
  }
});

// GET PROFILE
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        ownerId: true,
        name: true,
      },
    });

    return res.json(user);
  } catch (err) {
    console.error("Profile error:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
});

// UPDATE PROFILE
router.post("/update-profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const { name } = req.body;

    await prisma.user.update({
      where: { id: payload.sub },
      data: { name },
    });

    return res.json({ message: "Profile updated" });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;
