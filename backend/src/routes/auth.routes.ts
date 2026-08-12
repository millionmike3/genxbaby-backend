import { Router } from 'express';
import { AuthService } from '../auth/auth.service';

const router = Router();

router.post('/login', async (req, res) => {
  const result = await AuthService.login(req.body.email, req.body.password);
  res.json(result);
});

router.post('/register', async (req, res) => {
  const result = await AuthService.register(req.body);
  res.json(result);
});

export default router;
