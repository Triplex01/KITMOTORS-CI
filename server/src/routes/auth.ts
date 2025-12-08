import { Router, Request, Response } from 'express'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../index.js'
import { generateToken } from '../middleware/auth.js'
import { AuthUser, LoginRequest } from '../types/index.js'

const router = Router()

// In-memory storage (fallback when DB is not available)
const mockUsers: Map<string, any> = new Map()

// Helper to check if DB is available
async function isDatabaseAvailable(): Promise<boolean> {
  try {
    await db.query('SELECT 1')
    return true
  } catch {
    return false
  }
}

// Client Registration
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { email, password, firstName, lastName, phone } = req.body

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required' })
    return
  }

  try {
    const dbAvailable = await isDatabaseAvailable()
    
    if (dbAvailable) {
      // Use database
      const existingUser = await db.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      )

      if (existingUser.rows.length > 0) {
        res.status(409).json({ error: 'Email already registered' })
        return
      }

      const hashedPassword = await bcryptjs.hash(password, 10)
      const userId = uuidv4()

      await db.query(
        'INSERT INTO users (id, email, password_hash, first_name, last_name, phone) VALUES ($1, $2, $3, $4, $5, $6)',
        [userId, email, hashedPassword, firstName, lastName, phone]
      )

      const user: AuthUser = {
        id: userId,
        email,
        firstName,
        lastName,
        userType: 'client',
      }

      const token = generateToken(user)
      res.status(201).json({ token, user })
    } else {
      // Use in-memory storage
      if (mockUsers.has(email)) {
        res.status(409).json({ error: 'Email already registered' })
        return
      }

      const hashedPassword = await bcryptjs.hash(password, 10)
      const userId = uuidv4()

      mockUsers.set(email, {
        id: userId,
        email,
        password_hash: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        phone,
      })

      const user: AuthUser = {
        id: userId,
        email,
        firstName,
        lastName,
        userType: 'client',
      }

      const token = generateToken(user)
      console.log('✅ Mock user registered:', email)
      res.status(201).json({ token, user })
    }
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// Client Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password, userType } = req.body as LoginRequest

  if (!email || !password || !userType) {
    res.status(400).json({ error: 'Email, password, and userType required' })
    return
  }

  try {
    const dbAvailable = await isDatabaseAvailable()

    if (dbAvailable) {
      // Use database
      let query = ''
      let params: string[] = []

      if (userType === 'client') {
        query = 'SELECT id, email, first_name, last_name, password_hash FROM users WHERE email = $1'
        params = [email]
      } else {
        query = 'SELECT id, email, full_name, role, password_hash FROM admin_users WHERE email = $1'
        params = [email]
      }

      const result = await db.query(query, params)

      if (result.rows.length === 0) {
        res.status(401).json({ error: 'Invalid credentials' })
        return
      }

      const user = result.rows[0]
      const passwordMatch = await bcryptjs.compare(password, user.password_hash)

      if (!passwordMatch) {
        res.status(401).json({ error: 'Invalid credentials' })
        return
      }

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        fullName: user.full_name,
        role: user.role,
        userType,
      }

      const token = generateToken(authUser)
      res.json({ token, user: authUser })
    } else {
      // Use in-memory storage
      const user = mockUsers.get(email)

      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' })
        return
      }

      const passwordMatch = await bcryptjs.compare(password, user.password_hash)

      if (!passwordMatch) {
        res.status(401).json({ error: 'Invalid credentials' })
        return
      }

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        userType: 'client',
      }

      const token = generateToken(authUser)
      console.log('✅ Mock user logged in:', email)
      res.json({ token, user: authUser })
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Get current user
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'No token provided' })
    return
  }

  try {
    // Verify token and return user (in real app, use middleware)
    const user = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    res.json({ user })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

export default router
