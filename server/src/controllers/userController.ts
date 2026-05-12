import { Request, Response } from 'express';
import { User } from '../models/User';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { role } = req.query;
    const filter = role ? { role: String(role) } : {};
    const users = await User.find(filter).sort({ name: 1 });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
