import { Router } from 'express'
import { createBorrower } from '../controllers/borrower.controller'

const router = Router()

router.post('/', createBorrower)

export default router
