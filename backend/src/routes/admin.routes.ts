import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import * as adminController from '../controllers/admin.controller';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// ==================== DASHBOARD ====================
router.get('/stats', adminController.getDashboardStats);

// ==================== USER MANAGEMENT ====================
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// ==================== FORUM CATEGORIES ====================
router.get('/forum-categories', adminController.getAllForumCategories);
router.post('/forum-categories', adminController.createForumCategory);
router.put('/forum-categories/:id', adminController.updateForumCategory);
router.delete('/forum-categories/:id', adminController.deleteForumCategory);

// ==================== FORUM POSTS ====================
router.get('/forum-posts', adminController.getAllForumPosts);
router.put('/forum-posts/:id', adminController.updateForumPost);
router.delete('/forum-posts/:id', adminController.deleteForumPost);

// ==================== ANNOUNCEMENTS ====================
router.get('/announcements', adminController.getAllAnnouncements);
router.post('/announcements', adminController.createAnnouncement);
router.put('/announcements/:id', adminController.updateAnnouncement);
router.delete('/announcements/:id', adminController.deleteAnnouncement);

// ==================== SUBJECTS & GRADES ====================
router.get('/subjects-and-grades', adminController.getAllSubjectsAndGrades);
router.post('/subjects-and-grades', adminController.createSubjectAndGrade);
router.put('/subjects-and-grades/:id', adminController.updateSubjectAndGrade);
router.delete('/subjects-and-grades/:id', adminController.deleteSubjectAndGrade);

// ==================== LESSON PLANS ====================
router.get('/lesson-plans', adminController.getAllLessonPlans);
router.delete('/lesson-plans/:id', adminController.deleteLessonPlan);

// ==================== TESTS ====================
router.get('/tests', adminController.getAllTests);
router.delete('/tests/:id', adminController.deleteTest);

// ==================== HOMEWORKS ====================
router.get('/homeworks', adminController.getAllHomeworks);
router.delete('/homeworks/:id', adminController.deleteHomework);

// ==================== ACTIVITIES ====================
router.get('/activities', adminController.getAllActivities);
router.delete('/activities/:id', adminController.deleteActivity);

// ==================== CLASS SCHEDULES ====================
router.get('/class-schedules', adminController.getAllClassSchedules);
router.delete('/class-schedules/:id', adminController.deleteClassSchedule);

// ==================== OPERATIVE PLANS ====================
router.get('/operative-plans', adminController.getAllOperativePlans);
router.delete('/operative-plans/:id', adminController.deleteOperativePlan);

// ==================== GLOBAL PLANS ====================
router.get('/global-plans', adminController.getAllGlobalPlans);
router.delete('/global-plans/:id', adminController.deleteGlobalPlan);

export default router;

