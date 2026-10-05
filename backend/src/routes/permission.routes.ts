import { Router } from 'express';
import { PermissionService } from '../permissions/permission.service';

const router = Router();

router.get('/', async (req, res) => {
  res.json(await PermissionService.getPermissions());
});

export default router;
