import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { AuthUser } from '../types/index.js'

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export const generateToken = (user: AuthUser): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string): AuthUser | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser
  } catch (error) {
    return null
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Missing token' })
    return
  }

  const user = verifyToken(token)
  if (!user) {
    res.status(401).json({ error: 'Invalid token' })
    return
  }

  req.user = user
  next()
}

export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.userType !== 'admin') {
    res.status(403).json({ error: 'Admin access required' })
    return
  }
  next()
}

export const clientOnly = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.userType !== 'client') {
    res.status(403).json({ error: 'Client access required' })
    return
  }
  next()
}
