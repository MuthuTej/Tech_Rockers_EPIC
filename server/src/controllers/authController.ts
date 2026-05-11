import { Request, Response } from 'express';
import { User } from '../models/User';

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { email, name, picture } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const managerMail = (process.env.managerMail || '').trim();
    const role = email.trim() === managerMail ? 'manager' : 'engineer';
    const initials = name
      ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
      : email.substring(0, 2).toUpperCase();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        id: email,
        email,
        name: name || email,
        picture: picture || '',
        role,
        initials,
        maxHours: role === 'manager' ? 0 : 120,
      });
    } else {
      user.name    = name    || user.name;
      user.picture = picture || user.picture;
      user.role    = role;
      user.initials = initials;
      await user.save();
    }

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
