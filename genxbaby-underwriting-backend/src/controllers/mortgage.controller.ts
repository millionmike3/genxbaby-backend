import { Request, Response } from 'express'
import { mortgageService } from '../services/mortgage.service'

export async function createMortgage(req: Request, res: Response) {
  try {
    const mortgage = await mortgageService.create(req.body)
    res.status(201).json(mortgage)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}
