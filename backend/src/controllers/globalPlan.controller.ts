import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllGlobalPlans = async (req: AuthRequest, res: Response) => {
  try {
    const plans = await prisma.globalPlan.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ items: plans });
  } catch (error: any) {
    console.error('Error fetching global plans:', error);
    res.status(500).json({ error: 'Error fetching global plans' });
  }
};

export const getGlobalPlanById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const plan = await prisma.globalPlan.findUnique({ where: { id } });
    
    if (!plan) {
      return res.status(404).json({ error: 'Global plan not found' });
    }
    
    res.json(plan);
  } catch (error: any) {
    console.error('Error fetching global plan:', error);
    res.status(500).json({ error: 'Error fetching global plan' });
  }
};

export const createGlobalPlan = async (req: AuthRequest, res: Response) => {
  try {
    const data = {
      subject: req.body.subject,
      grade: req.body.grade,
      schoolYear: req.body.schoolYear,
      teacher: req.body.teacher
    };

    const plan = await prisma.globalPlan.create({ data });
    res.status(201).json(plan);
  } catch (error: any) {
    console.error('Error creating global plan:', error);
    res.status(500).json({ error: 'Error creating global plan', details: error.message });
  }
};

export const updateGlobalPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const data = {
      subject: req.body.subject,
      grade: req.body.grade,
      schoolYear: req.body.schoolYear,
      teacher: req.body.teacher
    };

    const plan = await prisma.globalPlan.update({ where: { id }, data });
    res.json(plan);
  } catch (error: any) {
    console.error('Error updating global plan:', error);
    res.status(500).json({ error: 'Error updating global plan', details: error.message });
  }
};

export const deleteGlobalPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.globalPlan.delete({ where: { id } });
    res.json({ message: 'Global plan deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting global plan:', error);
    res.status(500).json({ error: 'Error deleting global plan' });
  }
};

// Global Plan Subjects
export const getAllGlobalPlanSubjects = async (req: AuthRequest, res: Response) => {
  try {
    const subjects = await prisma.globalPlanSubject.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ items: subjects });
  } catch (error: any) {
    console.error('Error fetching global plan subjects:', error);
    res.status(500).json({ error: 'Error fetching global plan subjects' });
  }
};

export const createGlobalPlanSubject = async (req: AuthRequest, res: Response) => {
  try {
    const data = {
      classTheme: req.body.classTheme,
      learningObjectives: req.body.learningObjectives,
      month: req.body.month,
      processingClass: parseInt(req.body.processingClass),
      reviewClass: parseInt(req.body.reviewClass),
      evaluationClass: parseInt(req.body.evaluationClass),
      subject: req.body.subject
    };

    const subject = await prisma.globalPlanSubject.create({ data });
    res.status(201).json(subject);
  } catch (error: any) {
    console.error('Error creating global plan subject:', error);
    res.status(500).json({ error: 'Error creating global plan subject', details: error.message });
  }
};
