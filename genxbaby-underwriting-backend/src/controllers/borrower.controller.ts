import { Request, Response } from 'express'
import { borrowerService } from '../services/borrower.service'

export async function createBorrower(req: Request, res: Response) {
  try {
    const borrower = await borrowerService.create(req.body)
    res.status(201).json(borrower)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}
