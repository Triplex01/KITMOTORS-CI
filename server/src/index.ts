import express from 'express'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import 'express-async-errors'

import { Pool } from 'pg'
import authRoutes from './routes/auth.js'
import vehicleRoutes from './routes/vehicles.js'
import notificationRoutes from './routes/notifications.js'
import { setupSocketHandlers } from './socket/handlers.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  },
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Database connection pool
export const db = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'luxe_drive_hub',
})

// Test database connection (optional - don't block server startup)
db.query('SELECT NOW()')
  .then((res) => {
    console.log('✅ Database connected:', res.rows[0])
  })
  .catch((err) => {
    console.warn('⚠️  Database connection failed (running in mock mode):', err.message)
    console.log('💡 To enable database: Install PostgreSQL and configure .env')
  })

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/notifications', notificationRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Socket.IO handlers
setupSocketHandlers(io)

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500,
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

const PORT = process.env.PORT || 3000

httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║   🏎️  Luxe Drive Hub Server Running       ║
║   🌐 http://localhost:${PORT}                 ║
║   📊 Admin: http://localhost:5174         ║
║   👥 Client: http://localhost:5173        ║
╚═══════════════════════════════════════════╝
  `)
})

export { io }
