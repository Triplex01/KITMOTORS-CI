import { Server as SocketIOServer, Socket } from 'socket.io'
import { db } from '../index.js'
import { v4 as uuidv4 } from 'uuid'

interface UserSession {
  userId: string
  userType: 'client' | 'admin'
  vehicleIds?: string[]
}

const connectedUsers = new Map<string, UserSession>()

export const setupSocketHandlers = (io: SocketIOServer) => {
  io.on('connection', (socket: Socket) => {
    console.log(`✅ User connected: ${socket.id}`)

    // ==========================================
    // AUTHENTICATION
    // ==========================================
    socket.on('user:login', async (data: { userId: string; userType: 'client' | 'admin' }) => {
      const { userId, userType } = data

      // Store user session
      connectedUsers.set(socket.id, { userId, userType })

      // Save session to DB
      await db.query(
        `INSERT INTO sessions (id, ${userType === 'client' ? 'user_id' : 'admin_id'}, socket_id, user_type, ip_address)
         VALUES ($1, $2, $3, $4, $5)`,
        [uuidv4(), userId, socket.id, userType, socket.handshake.address]
      )

      console.log(`👤 ${userType} logged in:`, userId)

      // If client, fetch and send their vehicles
      if (userType === 'client') {
        try {
          const vehicleResult = await db.query(
            'SELECT id, vin, license_plate, make, model FROM vehicles WHERE user_id = $1',
            [userId]
          )

          const vehicleIds = vehicleResult.rows.map((row: any) => row.id)
          connectedUsers.set(socket.id, { userId, userType, vehicleIds })

          // Join rooms for each vehicle
          vehicleIds.forEach((vehicleId: string) => {
            socket.join(`vehicle:${vehicleId}`)
          })

          socket.emit('vehicle:list', vehicleResult.rows)
        } catch (error) {
          console.error('Failed to load vehicles:', error)
        }
      }

      socket.emit('user:login-success', { userId, userType })
    })

    // ==========================================
    // ADMIN: SEND NOTIFICATIONS
    // ==========================================
    socket.on('notification:send', async (data: any) => {
      const userSession = connectedUsers.get(socket.id)

      if (!userSession || userSession.userType !== 'admin') {
        socket.emit('error', { message: 'Admin access required' })
        return
      }

      const { title, message, targetType, targetId, vehicleIds } = data

      try {
        // Determine recipients
        let recipients: string[] = []

        if (targetType === 'all') {
          // Send to all connected clients
          const clientSockets = Array.from(connectedUsers.entries())
            .filter(([_, session]) => session.userType === 'client')
            .map(([socketId, _]) => socketId)

          recipients = clientSockets
        } else if (targetType === 'vehicle' && vehicleIds) {
          // Send to specific vehicles
          recipients = Array.from(connectedUsers.entries())
            .filter(
              ([_, session]) =>
                session.userType === 'client' && session.vehicleIds?.some((vid) => vehicleIds.includes(vid))
            )
            .map(([socketId, _]) => socketId)
        } else if (targetType === 'user' && targetId) {
          // Send to specific user
          recipients = Array.from(connectedUsers.entries())
            .filter(([_, session]) => session.userId === targetId)
            .map(([socketId, _]) => socketId)
        }

        // Send notification to recipients
        recipients.forEach((recipientSocketId) => {
          io.to(recipientSocketId).emit('notification:received', {
            id: uuidv4(),
            title,
            message,
            type: 'admin-notification',
            timestamp: new Date(),
            targetType,
            vehicleIds,
          })
        })

        // Confirm to admin
        socket.emit('notification:sent', {
          recipientCount: recipients.length,
          targetType,
        })

        console.log(`📢 Notification sent to ${recipients.length} users`)
      } catch (error) {
        console.error('Send notification error:', error)
        socket.emit('error', { message: 'Failed to send notification' })
      }
    })

    // ==========================================
    // CLIENT: RECEIVE NOTIFICATIONS
    // ==========================================
    socket.on('notification:acknowledge', (data: { notificationId: string }) => {
      const userSession = connectedUsers.get(socket.id)

      if (!userSession) return

      console.log(`✓ Notification acknowledged by ${userSession.userId}`)

      socket.emit('notification:acknowledged', { id: data.notificationId })
    })

    // ==========================================
    // VEHICLE UPDATES
    // ==========================================
    socket.on('vehicle:update-request', async (data: any) => {
      const userSession = connectedUsers.get(socket.id)

      if (!userSession || userSession.userType !== 'admin') {
        socket.emit('error', { message: 'Admin access required' })
        return
      }

      const { vehicleId, updateType, title, description } = data

      // Get vehicle owner
      const vehicleResult = await db.query(
        'SELECT user_id FROM vehicles WHERE id = $1',
        [vehicleId]
      )

      if (vehicleResult.rows.length === 0) {
        socket.emit('error', { message: 'Vehicle not found' })
        return
      }

      const ownerId = vehicleResult.rows[0].user_id

      // Find client socket
      const clientSocket = Array.from(connectedUsers.entries()).find(
        ([_, session]) => session.userId === ownerId
      )?.[0]

      if (clientSocket) {
        io.to(clientSocket).emit('vehicle:update-request', {
          vehicleId,
          updateType,
          title,
          description,
          timestamp: new Date(),
        })

        console.log(`🔧 Vehicle update sent to ${ownerId}`)
      }
    })

    socket.on('vehicle:update-response', async (data: any) => {
      const userSession = connectedUsers.get(socket.id)

      if (!userSession || userSession.userType !== 'client') {
        socket.emit('error', { message: 'Client access required' })
        return
      }

      const { vehicleId, approved, reason } = data

      // Notify all admins
      io.emit('vehicle:update-response', {
        userId: userSession.userId,
        vehicleId,
        approved,
        reason,
        timestamp: new Date(),
      })

      console.log(`✓ Vehicle update response from ${userSession.userId}`)
    })

    // ==========================================
    // DISCONNECT
    // ==========================================
    socket.on('disconnect', async () => {
      const userSession = connectedUsers.get(socket.id)

      if (userSession) {
        console.log(`❌ User disconnected: ${userSession.userId}`)

        // Update session in DB
        await db.query('UPDATE sessions SET disconnected_at = NOW() WHERE socket_id = $1', [socket.id])

        connectedUsers.delete(socket.id)
      }
    })

    // ==========================================
    // HEARTBEAT (keep-alive)
    // ==========================================
    socket.on('ping', () => {
      socket.emit('pong')
    })
  })

  console.log('🔌 Socket.IO handlers initialized')
}
