import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, uniId: user.uni_id, isAdmin: user.is_admin },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '24h' }
  );
};

export const register = async (req: Request, res: Response) => {
  const { email, password, name, uniId } = req.body;

  try {
    // Check if user exists
    const userCheck = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate handle
    const handle = `Student-${Math.floor(Math.random() * 10000)}`;

    // Create user
    const newUser = await query(
      'INSERT INTO users (email, password_hash, name, uni_id, status, handle) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, name, uni_id, status, handle, is_admin',
      [email, hashedPassword, name, uniId, 'pending', handle]
    );

    const user = newUser.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: { user, token }
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check user
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    // Remove password from response
    delete user.password_hash;

    res.json({
      success: true,
      data: { user, token }
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userResult = await query(
      'SELECT id, email, name, uni_id, status, handle, is_admin FROM users WHERE id = $1',
      [req.user?.id]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: userResult.rows[0]
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { handle, name } = req.body;
  const userId = req.user?.id;

  try {
    const updateResult = await query(
      'UPDATE users SET handle = COALESCE($1, handle), name = COALESCE($2, name) WHERE id = $3 RETURNING id, email, name, uni_id, status, handle, is_admin',
      [handle, name, userId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: updateResult.rows[0]
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
