import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllClassSchedules = async (req: AuthRequest, res: Response) => {
  try {
    const schedules = await prisma.classSchedule.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ items: schedules });
  } catch (error: any) {
    console.error('Error fetching class schedules:', error);
    res.status(500).json({ error: 'Error fetching class schedules' });
  }
};

export const getClassScheduleById = async (req: AuthRequest, res: Response) => {
  try {
    const { id} = req.params;
    const schedule = await prisma.classSchedule.findUnique({ where: { id } });
    
    if (!schedule) {
      return res.status(404).json({ error: 'Class schedule not found' });
    }
    
    res.json(schedule);
  } catch (error: any) {
    console.error('Error fetching class schedule:', error);
    res.status(500).json({ error: 'Error fetching class schedule' });
  }
};

export const createClassSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const data = {
      subject: req.body.subject,
      dayName: req.body.dayName,
      userId: req.body.userId || req.userId
    };

    const schedule = await prisma.classSchedule.create({ data });
    res.status(201).json(schedule);
  } catch (error: any) {
    console.error('Error creating class schedule:', error);
    res.status(500).json({ error: 'Error creating class schedule', details: error.message });
  }
};

export const updateClassSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const data = {
      subject: req.body.subject,
      dayName: req.body.dayName,
      userId: req.body.userId || req.userId
    };

    const schedule = await prisma.classSchedule.update({ where: { id }, data });
    res.json(schedule);
  } catch (error: any) {
    console.error('Error updating class schedule:', error);
    res.status(500).json({ error: 'Error updating class schedule', details: error.message });
  }
};

export const deleteClassSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.classSchedule.delete({ where: { id } });
    res.json({ message: 'Class schedule deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting class schedule:', error);
    res.status(500).json({ error: 'Error deleting class schedule' });
  }
};
