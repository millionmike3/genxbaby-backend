import { Router } from 'express';
import { RoleService } from '../roles/role.service';

const router = Router();

router.get('/', async (req, res) => {
  res.json(await RoleService.getRoles());
});

export default router;
