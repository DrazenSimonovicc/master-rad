import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// Helper to convert empty strings to null (but preserve HTML tags)
const toNullableString = (value: any) => {
  if (!value || value === '') return null;
  const textContent = value.replace(/<[^>]*>/g, '').trim();
  return textContent !== '' ? value : null;
};

export const getAllHomework = async (req: AuthRequest, res: Response) => {
  try {
    const homework = await prisma.homework.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ items: homework });
  } catch (error: any) {
    console.error('Error fetching homework:', error);
    res.status(500).json({ error: 'Error fetching homework' });
  }
};

export const getHomeworkById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const homework = await prisma.homework.findUnique({ where: { id } });
    
    if (!homework) {
      return res.status(404).json({ error: 'Homework not found' });
    }
    
    res.json(homework);
  } catch (error: any) {
    console.error('Error fetching homework:', error);
    res.status(500).json({ error: 'Error fetching homework' });
  }
};

export const createHomework = async (req: AuthRequest, res: Response) => {
  try {
    const data = {
      task1: toNullableString(req.body.task1),
      task2: toNullableString(req.body.task2),
      task3: toNullableString(req.body.task3),
      task4: toNullableString(req.body.task4),
      task5: toNullableString(req.body.task5),
      task6: toNullableString(req.body.task6),
      task7: toNullableString(req.body.task7),
      task8: toNullableString(req.body.task8),
      task9: toNullableString(req.body.task9),
      task10: toNullableString(req.body.task10),
      subject: req.body.subject,
      teachingUnit: req.body.teachingUnit,
      userId: req.body.userId || req.userId!
    };

    const homework = await prisma.homework.create({ data });
    res.status(201).json(homework);
  } catch (error: any) {
    console.error('Error creating homework:', error);
    res.status(500).json({ error: 'Error creating homework', details: error.message });
  }
};

export const updateHomework = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.homework.findUnique({ where: { id } });
    
    if (!existing) {
      return res.status(404).json({ error: 'Homework not found' });
    }
    
    if (existing.userId !== req.userId) {
      return res.status(403).json({ error: 'You can only update your own homework' });
    }

    const data = {
      task1: toNullableString(req.body.task1),
      task2: toNullableString(req.body.task2),
      task3: toNullableString(req.body.task3),
      task4: toNullableString(req.body.task4),
      task5: toNullableString(req.body.task5),
      task6: toNullableString(req.body.task6),
      task7: toNullableString(req.body.task7),
      task8: toNullableString(req.body.task8),
      task9: toNullableString(req.body.task9),
      task10: toNullableString(req.body.task10),
      subject: req.body.subject,
      teachingUnit: req.body.teachingUnit
    };

    const homework = await prisma.homework.update({ where: { id }, data });
    res.json(homework);
  } catch (error: any) {
    console.error('Error updating homework:', error);
    res.status(500).json({ error: 'Error updating homework', details: error.message });
  }
};

export const deleteHomework = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.homework.findUnique({ where: { id } });
    
    if (!existing) {
      return res.status(404).json({ error: 'Homework not found' });
    }
    
    if (existing.userId !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own homework' });
    }

    await prisma.homework.delete({ where: { id } });
    res.json({ message: 'Homework deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting homework:', error);
    res.status(500).json({ error: 'Error deleting homework' });
  }
};
