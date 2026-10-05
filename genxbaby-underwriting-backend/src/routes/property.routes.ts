import { Router } from 'express'
import { createProperty } from '../controllers/property.controller'

const router = Router()

router.post('/', createProperty)

export default router
