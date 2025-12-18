import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { deleteFile } from '../middleware/upload.middleware';

export const getAllLessonPlans = async (req: AuthRequest, res: Response) => {
  try {
    const { filter } = req.query;
    let where: any = {};

    if (filter && typeof filter === 'string') {
      const userMatch = filter.match(/user="([^"]+)"/);
      if (userMatch) {
        where.userId = userMatch[1];
      }
    }

    const lessonPlans = await prisma.lessonPlan.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({ items: lessonPlans });
  } catch (error: any) {
    console.error('Get lesson plans error:', error);
    res.status(500).json({ error: 'Error fetching lesson plans' });
  }
};

export const getLessonPlanById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const lessonPlan = await prisma.lessonPlan.findUnique({ where: { id } });

    if (!lessonPlan) {
      return res.status(404).json({ error: 'Lesson plan not found' });
    }

    res.json(lessonPlan);
  } catch (error: any) {
    console.error('Get lesson plan error:', error);
    res.status(500).json({ error: 'Error fetching lesson plan' });
  }
};

export const createLessonPlan = async (req: AuthRequest, res: Response) => {
  try {
    const data = {
      date: req.body.date,
      classNumber: req.body.classNumber,
      gradeAndClass: req.body.gradeAndClass,
      subject: req.body.subject,
      teachingTopic: req.body.teachingTopic,
      lessonName: req.body.lessonName,
      previousLesson: req.body.previousLesson || null,
      nextLesson: req.body.nextLesson || null,
      typeOfLesson: req.body.typeOfLesson || null,
      educationalObjectives: req.body.educationalObjectives || null,
      socialObjectives: req.body.socialObjectives || null,
      functionalObjectives: req.body.functionalObjectives || null,
      teachingMethods: req.body.teachingMethods || null,
      formsOfWork: req.body.formsOfWork || null,
      instructionalMaterials: req.body.instructionalMaterials || null,
      correlation: req.body.correlation || null,
      literature: req.body.literature || null,
      introductionSmall: req.body.introductionSmall || null,
      mainActivitySmall: req.body.mainActivitySmall || null,
      conclusionSmall: req.body.conclusionSmall || null,
      introduction: req.body.introduction || null,
      main: req.body.main || null,
      conclusion: req.body.conclusion || null,
      file: req.file?.filename || null,
      userId: req.body.userId || req.userId!
    };

    const lessonPlan = await prisma.lessonPlan.create({ data });
    res.status(201).json(lessonPlan);
  } catch (error: any) {
    console.error('Create lesson plan error:', error);
    res.status(500).json({ error: 'Error creating lesson plan', details: error.message });
  }
};

export const updateLessonPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingPlan = await prisma.lessonPlan.findUnique({ where: { id } });
    if (!existingPlan) {
      return res.status(404).json({ error: 'Lesson plan not found' });
    }

    if (existingPlan.userId !== req.userId) {
      return res.status(403).json({ error: 'You can only update your own lesson plans' });
    }

    const data: any = {
      date: req.body.date,
      classNumber: req.body.classNumber,
      gradeAndClass: req.body.gradeAndClass,
      subject: req.body.subject,
      teachingTopic: req.body.teachingTopic,
      lessonName: req.body.lessonName,
      previousLesson: req.body.previousLesson || null,
      nextLesson: req.body.nextLesson || null,
      typeOfLesson: req.body.typeOfLesson || null,
      educationalObjectives: req.body.educationalObjectives || null,
      socialObjectives: req.body.socialObjectives || null,
      functionalObjectives: req.body.functionalObjectives || null,
      teachingMethods: req.body.teachingMethods || null,
      formsOfWork: req.body.formsOfWork || null,
      instructionalMaterials: req.body.instructionalMaterials || null,
      correlation: req.body.correlation || null,
      literature: req.body.literature || null,
      introductionSmall: req.body.introductionSmall || null,
      mainActivitySmall: req.body.mainActivitySmall || null,
      conclusionSmall: req.body.conclusionSmall || null,
      introduction: req.body.introduction || null,
      main: req.body.main || null,
      conclusion: req.body.conclusion || null
    };

    if (req.file) {
      if (existingPlan.file) {
        deleteFile(`uploads/lesson-files/${existingPlan.file}`);
      }
      data.file = req.file.filename;
    }

    const lessonPlan = await prisma.lessonPlan.update({ where: { id }, data });
    res.json(lessonPlan);
  } catch (error: any) {
    console.error('Update lesson plan error:', error);
    res.status(500).json({ error: 'Error updating lesson plan', details: error.message });
  }
};

export const deleteLessonPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingPlan = await prisma.lessonPlan.findUnique({ where: { id } });
    if (!existingPlan) {
      return res.status(404).json({ error: 'Lesson plan not found' });
    }

    if (existingPlan.userId !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own lesson plans' });
    }

    if (existingPlan.file) {
      deleteFile(`uploads/lesson-files/${existingPlan.file}`);
    }

    await prisma.lessonPlan.delete({ where: { id } });
    res.json({ message: 'Lesson plan deleted successfully' });
  } catch (error: any) {
    console.error('Delete lesson plan error:', error);
    res.status(500).json({ error: 'Error deleting lesson plan' });
  }
};
