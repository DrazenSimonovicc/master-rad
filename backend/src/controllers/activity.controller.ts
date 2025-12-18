import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllActivities = async (req: AuthRequest, res: Response) => {
  try {
    const { filter } = req.query;
    let where: any = {};

    if (filter && typeof filter === 'string') {
      const userMatch = filter.match(/user="([^"]+)"/);
      if (userMatch) {
        where.userId = userMatch[1];
      }
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ items: activities });
  } catch (error: any) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Error fetching activities' });
  }
};

export const getActivityById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const activity = await prisma.activity.findUnique({ where: { id } });
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    res.json(activity);
  } catch (error: any) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Error fetching activity' });
  }
};

export const createActivity = async (req: AuthRequest, res: Response) => {
  try {
    const data = {
      date: req.body.date,
      title: req.body.title,
      description: req.body.description,
      typeOfActivity: req.body.typeOfActivity,
      place: req.body.place,
      userId: req.body.userId || req.userId!
    };

    const activity = await prisma.activity.create({ data });
    res.status(201).json(activity);
  } catch (error: any) {
    console.error('Error creating activity:', error);
    res.status(500).json({ error: 'Error creating activity', details: error.message });
  }
};

export const updateActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.activity.findUnique({ where: { id } });
    
    if (!existing) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    if (existing.userId !== req.userId) {
      return res.status(403).json({ error: 'You can only update your own activities' });
    }

    const data = {
      date: req.body.date,
      title: req.body.title,
      description: req.body.description,
      typeOfActivity: req.body.typeOfActivity,
      place: req.body.place
    };

    const activity = await prisma.activity.update({ where: { id }, data });
    res.json(activity);
  } catch (error: any) {
    console.error('Error updating activity:', error);
    res.status(500).json({ error: 'Error updating activity', details: error.message });
  }
};

export const deleteActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.activity.findUnique({ where: { id } });
    
    if (!existing) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    if (existing.userId !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own activities' });
    }

    await prisma.activity.delete({ where: { id } });
    res.json({ message: 'Activity deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ error: 'Error deleting activity' });
  }
};
