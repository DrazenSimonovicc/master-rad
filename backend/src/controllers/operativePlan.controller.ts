import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllOperativePlans = async (req: AuthRequest, res: Response) => {
  try {
    const plans = await prisma.operativePlan.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ items: plans });
  } catch (error: any) {
    console.error('Error fetching operative plans:', error);
    res.status(500).json({ error: 'Error fetching operative plans' });
  }
};

export const getOperativePlanById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const plan = await prisma.operativePlan.findUnique({ where: { id } });
    
    if (!plan) {
      return res.status(404).json({ error: 'Operative plan not found' });
    }
    
    res.json(plan);
  } catch (error: any) {
    console.error('Error fetching operative plan:', error);
    res.status(500).json({ error: 'Error fetching operative plan' });
  }
};

export const createOperativePlan = async (req: AuthRequest, res: Response) => {
  try {
    const data = {
      subject: req.body.subject,
      grade: req.body.grade,
      month: req.body.month,
      schoolYear: req.body.schoolYear,
      teacher: req.body.teacher
    };

    const plan = await prisma.operativePlan.create({ data });
    res.status(201).json(plan);
  } catch (error: any) {
    console.error('Error creating operative plan:', error);
    res.status(500).json({ error: 'Error creating operative plan', details: error.message });
  }
};

export const updateOperativePlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const data = {
      subject: req.body.subject,
      grade: req.body.grade,
      month: req.body.month,
      schoolYear: req.body.schoolYear,
      teacher: req.body.teacher
    };

    const plan = await prisma.operativePlan.update({ where: { id }, data });
    res.json(plan);
  } catch (error: any) {
    console.error('Error updating operative plan:', error);
    res.status(500).json({ error: 'Error updating operative plan', details: error.message });
  }
};

export const deleteOperativePlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.operativePlan.delete({ where: { id } });
    res.json({ message: 'Operative plan deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting operative plan:', error);
    res.status(500).json({ error: 'Error deleting operative plan' });
  }
};
