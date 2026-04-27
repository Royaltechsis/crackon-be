import { Request, Response } from 'express';
import User from '../models/User';

export const updateArtisanProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { username, email, profile } = req.body;

    const user = await User.findById(userId);
    if (!user || user.role !== 'artisan') {
      res.status(403).json({ message: 'Only artisans can update this profile' });
      return;
    }

    if (username) {
      user.username = username;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        res.status(400).json({ message: 'Email already in use' });
        return;
      }
      user.email = email;
    }

    if (profile && typeof profile === 'object') {
      user.profile = {
        ...(user.profile || {}),
        ...profile,
      };
      user.markModified('profile');
    }

    await user.save();

    const updatedUser = await User.findById(userId).select('-password');
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error: any) {
    console.error('Update artisan profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getArtisanById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user || user.role !== 'artisan') {
      res.status(404).json({ message: 'Artisan not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error: any) {
    console.error('Get artisan profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
