import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ items: announcements });
  } catch (error: any) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Error fetching announcements' });
  }
};

export const getAnnouncementById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const announcement = await prisma.announcement.findUnique({ where: { id } });
    
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    res.json(announcement);
  } catch (error: any) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({ error: 'Error fetching announcement' });
  }
};

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const data = {
      title: req.body.title,
      description: req.body.description || null,
      date: req.body.date,
      link1: req.body.link1 || null,
      link1Description: req.body.link1Description || null,
      link2: req.body.link2 || null,
      link2Description: req.body.link2Description || null
    };

    const announcement = await prisma.announcement.create({ data });
    res.status(201).json(announcement);
  } catch (error: any) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Error creating announcement', details: error.message });
  }
};

export const updateAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const data = {
      title: req.body.title,
      description: req.body.description || null,
      date: req.body.date,
      link1: req.body.link1 || null,
      link1Description: req.body.link1Description || null,
      link2: req.body.link2 || null,
      link2Description: req.body.link2Description || null
    };
    
    const announcement = await prisma.announcement.update({
      where: { id },
      data
    });
    
    res.json(announcement);
  } catch (error: any) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ error: 'Error updating announcement', details: error.message });
  }
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.announcement.delete({ where: { id } });
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Error deleting announcement' });
  }
};
