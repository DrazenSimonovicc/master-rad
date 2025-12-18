import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// Helper to convert empty strings to null (but preserve HTML tags)
const toNullableString = (value: any) => {
  if (!value || value === '') return null;
  const textContent = value.replace(/<[^>]*>/g, '').trim();
  return textContent !== '' ? value : null;
};

export const getAllTests = async (req: AuthRequest, res: Response) => {
  try {
    const tests = await prisma.test.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ items: tests });
  } catch (error: any) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ error: 'Error fetching tests' });
  }
};

export const getTestById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const test = await prisma.test.findUnique({ where: { id } });
    
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    res.json(test);
  } catch (error: any) {
    console.error('Error fetching test:', error);
    res.status(500).json({ error: 'Error fetching test' });
  }
};

export const createTest = async (req: AuthRequest, res: Response) => {
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
      date: req.body.date,
      userId: req.body.userId || req.userId!
    };

    const test = await prisma.test.create({ data });
    res.status(201).json(test);
  } catch (error: any) {
    console.error('Error creating test:', error);
    res.status(500).json({ error: 'Error creating test', details: error.message });
  }
};

export const updateTest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.test.findUnique({ where: { id } });
    
    if (!existing) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    if (existing.userId !== req.userId) {
      return res.status(403).json({ error: 'You can only update your own tests' });
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
      teachingUnit: req.body.teachingUnit,
      date: req.body.date
    };

    const test = await prisma.test.update({ where: { id }, data });
    res.json(test);
  } catch (error: any) {
    console.error('Error updating test:', error);
    res.status(500).json({ error: 'Error updating test', details: error.message });
  }
};

export const deleteTest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.test.findUnique({ where: { id } });
    
    if (!existing) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    if (existing.userId !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own tests' });
    }

    await prisma.test.delete({ where: { id } });
    res.json({ message: 'Test deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting test:', error);
    res.status(500).json({ error: 'Error deleting test' });
  }
};
