import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

export const generateToken = (userId: number, email: string, role: string): string => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

export const generateRefreshToken = (userId: number): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '30d' }
  )
}