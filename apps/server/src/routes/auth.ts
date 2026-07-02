import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';
import { MOCK_USERS } from '../mockDb';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fitness_arena_secret_key_beast_mode';

// @route   POST api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req: AuthRequest, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  // Mock DB fallback check
  if (process.env.MOCK_DB === 'true') {
    try {
      const existingUser = MOCK_USERS.find((u) => u.email === email.toLowerCase().trim());
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists (Demo Mode)' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'mock_user_' + Date.now(),
        name,
        email: email.toLowerCase().trim(),
        passwordHash: hashedPassword,
        role: 'member',
        membership: {
          plan: 'None' as any,
          status: 'inactive' as any,
        },
        createdAt: new Date(),
      };

      MOCK_USERS.push(newUser);
      const token = jwt.sign({ userId: newUser._id, role: newUser.role }, JWT_SECRET, {
        expiresIn: '7d',
      });

      return res.status(201).json({
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          membership: newUser.membership,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: 'Mock signup error', error: (err as Error).message });
    }
  }

  // Normal MongoDB Flow
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ userId: savedUser._id, role: savedUser.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        membership: savedUser.membership,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during signup', error: (error as Error).message });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user and get token
router.post('/login', async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  // Mock DB fallback check
  if (process.env.MOCK_DB === 'true') {
    try {
      const user = MOCK_USERS.find((u) => u.email === email.toLowerCase().trim());
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials (Demo Mode)' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials (Demo Mode)' });
      }

      const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
        expiresIn: '7d',
      });

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          membership: user.membership,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: 'Mock login error', error: (err as Error).message });
    }
  }

  // Normal MongoDB Flow
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials (email not found)' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials (incorrect password)' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        membership: user.membership,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: (error as Error).message });
  }
});

// @route   GET api/auth/profile
// @desc    Get user profile
router.get('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  if (process.env.MOCK_DB === 'true') {
    const user = MOCK_USERS.find((u) => u._id === req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found (Demo Mode)' });
    }
    const { passwordHash, ...safeUser } = user;
    return res.json(safeUser);
  }

  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile', error: (error as Error).message });
  }
});

// @route   POST api/auth/membership
// @desc    Purchase / Update membership
router.post('/membership', authenticate, async (req: AuthRequest, res: Response) => {
  const { plan } = req.body;

  if (!plan) {
    return res.status(400).json({ message: 'Please specify a membership plan' });
  }

  if (process.env.MOCK_DB === 'true') {
    const user = MOCK_USERS.find((u) => u._id === req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found (Demo Mode)' });
    }

    const durationDays = plan === 'Beast Starter' ? 30 : plan === 'Power Lifter' ? 90 : plan === 'Olympian Pro' ? 365 : 0;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + durationDays);

    user.membership = {
      plan: plan as any,
      status: plan === 'None' ? 'inactive' : 'active',
      startDate: plan === 'None' ? undefined : startDate,
      endDate: plan === 'None' ? undefined : endDate,
    };

    return res.json({
      message: 'Membership updated successfully (Demo Mode)',
      membership: user.membership,
    });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const durationDays = plan === 'Beast Starter' ? 30 : plan === 'Power Lifter' ? 90 : plan === 'Olympian Pro' ? 365 : 0;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + durationDays);

    user.membership = {
      plan,
      status: plan === 'None' ? 'inactive' : 'active',
      startDate: plan === 'None' ? undefined as any : startDate,
      endDate: plan === 'None' ? undefined as any : endDate,
    };

    const updatedUser = await user.save();
    res.json({
      message: 'Membership updated successfully',
      membership: updatedUser.membership,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating membership', error: (error as Error).message });
  }
});

export default router;
