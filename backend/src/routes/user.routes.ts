import { Router } from 'express';
import { requireAuth } from '../auth/auth.middleware';
import { UserService } from '../users/user.service';

const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  const profile = await UserService.getProfile(req.user.id);
  res.json(profile);
});

export default router;
