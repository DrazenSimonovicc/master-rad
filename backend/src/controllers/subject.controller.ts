import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllSubjects = async (req: AuthRequest, res: Response) => {
  try {
    const subjects = await prisma.subjectAndGrade.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ items: subjects });
  } catch (error: any) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Error fetching subjects' });
  }
};

export const getSubjectById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const subject = await prisma.subjectAndGrade.findUnique({ where: { id } });
    
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    
    res.json(subject);
  } catch (error: any) {
    console.error('Error fetching subject:', error);
    res.status(500).json({ error: 'Error fetching subject' });
  }
};

export const createSubject = async (req: AuthRequest, res: Response) => {
  try {
    const data = {
      subject: req.body.subject,
      grade: req.body.grade
    };
    
    const subject = await prisma.subjectAndGrade.create({ data });
    res.status(201).json(subject);
  } catch (error: any) {
    console.error('Error creating subject:', error);
    res.status(500).json({ error: 'Error creating subject', details: error.message });
  }
};

export const updateSubject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const data = {
      subject: req.body.subject,
      grade: req.body.grade
    };
    
    const subject = await prisma.subjectAndGrade.update({
      where: { id },
      data
    });
    
    res.json(subject);
  } catch (error: any) {
    console.error('Error updating subject:', error);
    res.status(500).json({ error: 'Error updating subject', details: error.message });
  }
};

export const deleteSubject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.subjectAndGrade.delete({ where: { id } });
    res.json({ message: 'Subject deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ error: 'Error deleting subject' });
  }
};
