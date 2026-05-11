import { Request, Response } from 'express';
import { User } from '../models/User';

export const authGoogle = async (req: Request, res: Response) => {
  try {
    const { email, name, picture } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const managerMail = process.env.managerMail;
      const role = email === managerMail ? 'manager' : 'engineer';
      const initials = name ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
      const id = email; // Using email as the ID

      user = new User({
        id,
        name: name || email,
        email,
        role,
        initials,
        maxHours: role === 'engineer' ? 100 : 0
      });

      await user.save();
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      initials: user.initials,
      picture: picture // Pass picture back down to the client since it's dynamic
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
