import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { deleteFile } from '../middleware/upload.middleware';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        primaryEducation: true,
        secondaryEducation: true,
        faculty: true,
        university: true,
        currentWork: true,
        avatar: true,
        dateOfBirth: true,
        gender: true,
        topEducation: true,
        educationDegree: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({ items: users });
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        primaryEducation: true,
        secondaryEducation: true,
        faculty: true,
        university: true,
        currentWork: true,
        avatar: true,
        dateOfBirth: true,
        gender: true,
        topEducation: true,
        educationDegree: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (req.userId !== id) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }

    const data: any = {};
    
    // Only update fields that are provided (not undefined)
    if (req.body.name !== undefined) data.name = req.body.name;
    if (req.body.primaryEducation !== undefined) data.primaryEducation = req.body.primaryEducation;
    if (req.body.secondaryEducation !== undefined) data.secondaryEducation = req.body.secondaryEducation;
    if (req.body.faculty !== undefined) data.faculty = req.body.faculty;
    if (req.body.university !== undefined) data.university = req.body.university;
    if (req.body.currentWork !== undefined) data.currentWork = req.body.currentWork;
    if (req.body.dateOfBirth !== undefined) data.dateOfBirth = req.body.dateOfBirth;
    if (req.body.gender !== undefined) data.gender = req.body.gender;
    if (req.body.topEducation !== undefined) data.topEducation = req.body.topEducation;
    if (req.body.educationDegree !== undefined) data.educationDegree = req.body.educationDegree;

    // Handle avatar upload
    // upload.any() returns files in req.files array
    const files = (req as any).files as Express.Multer.File[];
    if (files && files.length > 0) {
      const avatarFile = files.find((file: Express.Multer.File) => file.fieldname === 'avatar');
      if (avatarFile) {
        const oldUser = await prisma.user.findUnique({ where: { id } });
        if (oldUser?.avatar) {
          deleteFile(`uploads/avatars/${oldUser.avatar}`);
        }
        data.avatar = avatarFile.filename;
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        primaryEducation: true,
        secondaryEducation: true,
        faculty: true,
        university: true,
        currentWork: true,
        avatar: true,
        dateOfBirth: true,
        gender: true,
        topEducation: true,
        educationDegree: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(user);
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Error updating user', details: error.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (req.userId !== id) {
      return res.status(403).json({ error: 'You can only delete your own profile' });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (user?.avatar) {
      deleteFile(`uploads/avatars/${user.avatar}`);
    }

    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};
