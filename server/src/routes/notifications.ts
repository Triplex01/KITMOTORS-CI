import { Router, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { db, io } from '../index.js'
import { authMiddleware, adminOnly } from '../middleware/auth.js'

const router = Router()

// Admin: Create notification
router.post('/', authMiddleware, adminOnly, async (req: Request, res: Response): Promise<void> => {
  const { title, message, imageUrl, notificationType, targetType, targetId } = req.body

  if (!title || !message) {
    res.status(400).json({ error: 'Title and message required' })
    return
  }

  try {
    const notificationId = uuidv4()

    const result = await db.query(
      `INSERT INTO notifications 
       (id, admin_id, title, message, image_url, notification_type, status, target_type, target_id, sent_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       RETURNING *`,
      [
        notificationId,
        req.user?.id,
        title,
        message,
        imageUrl,
        notificationType || 'general',
        'sent',
        targetType || 'all',
        targetId,
      ]
    )

    const notification = result.rows[0]

    // Get target users
    let userIds: string[] = []

    if (targetType === 'all') {
      // Send to all users
      const usersResult = await db.query('SELECT id FROM users WHERE is_active = true')
      userIds = usersResult.rows.map((row: any) => row.id)
    } else if (targetType === 'vehicle') {
      // Send to vehicle owner
      const vehicleResult = await db.query(
        'SELECT user_id FROM vehicles WHERE id = $1',
        [targetId]
      )
      if (vehicleResult.rows.length > 0) {
        userIds = [vehicleResult.rows[0].user_id]
      }
    } else if (targetType === 'user') {
      userIds = [targetId]
    }

    // Insert notification history for each user
    for (const userId of userIds) {
      await db.query(
        `INSERT INTO notification_history 
         (id, notification_id, user_id, vehicle_id, status, delivered_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [uuidv4(), notificationId, userId, targetId, 'delivered']
      )
    }

    // Emit Socket.IO event to all connected clients
    io.emit('notification:new', {
      ...notification,
      recipientCount: userIds.length,
    })

    res.status(201).json({
      notification,
      recipientCount: userIds.length,
    })
  } catch (error) {
    console.error('Create notification error:', error)
    res.status(500).json({ error: 'Failed to create notification' })
  }
})

// Client: Get notifications
router.get('/my-notifications', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.query(
      `SELECT nh.id, nh.status, nh.delivered_at, nh.read_at,
              n.id as notification_id, n.title, n.message, n.image_url, 
              n.notification_type, n.created_at, n.sent_at
       FROM notification_history nh
       JOIN notifications n ON n.id = nh.notification_id
       WHERE nh.user_id = $1
       ORDER BY nh.created_at DESC
       LIMIT 50`,
      [req.user?.id]
    )

    res.json({ notifications: result.rows })
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({ error: 'Failed to fetch notifications' })
  }
})

// Client: Mark notification as read
router.patch('/:notificationId/read', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    await db.query(
      `UPDATE notification_history
       SET status = 'read', read_at = NOW()
       WHERE notification_id = $1 AND user_id = $2`,
      [req.params.notificationId, req.user?.id]
    )

    res.json({ success: true })
  } catch (error) {
    console.error('Mark as read error:', error)
    res.status(500).json({ error: 'Failed to update notification' })
  }
})

export default router
