import { Router, Request, Response } from 'express'
import { db } from '../index.js'
import { authMiddleware, clientOnly } from '../middleware/auth.js'

const router = Router()

// Get user's vehicles
router.get('/', authMiddleware, clientOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.query(
      'SELECT * FROM vehicles WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user?.id]
    )

    res.json({ vehicles: result.rows })
  } catch (error) {
    console.error('Get vehicles error:', error)
    res.status(500).json({ error: 'Failed to fetch vehicles' })
  }
})

// Get single vehicle
router.get('/:vehicleId', authMiddleware, clientOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.query(
      'SELECT * FROM vehicles WHERE id = $1 AND user_id = $2',
      [req.params.vehicleId, req.user?.id]
    )

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Vehicle not found' })
      return
    }

    res.json({ vehicle: result.rows[0] })
  } catch (error) {
    console.error('Get vehicle error:', error)
    res.status(500).json({ error: 'Failed to fetch vehicle' })
  }
})

export default router
