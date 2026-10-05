import { Router } from 'express'
import { createMortgage } from '../controllers/mortgage.controller'

const router = Router()

router.post('/', createMortgage)

export default router
