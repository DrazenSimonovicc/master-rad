import { Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// ==================== DASHBOARD STATS ====================
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      totalForumPosts,
      totalLessonPlans,
      totalActivities,
      totalAnnouncements,
      recentUsers,
      recentForumPosts
    ] = await Promise.all([
      prisma.user.count(),
      prisma.forumNews.count(),
      prisma.lessonPlan.count(),
      prisma.activity.count(),
      prisma.announcement.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      }),
      prisma.forumNews.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          authorName: true,
          createdAt: true,
          category: {
            select: { categoryName: true }
          }
        }
      })
    ]);

    res.json({
      stats: {
        totalUsers,
        totalForumPosts,
        totalLessonPlans,
        totalActivities,
        totalAnnouncements
      },
      recentUsers,
      recentForumPosts
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};

// ==================== USER MANAGEMENT ====================
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '10', search = '', role = '' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    
    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { name: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          currentWork: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              forumNews: true,
              lessonPlans: true,
              homeworks: true,
              tests: true,
              activities: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        primaryEducation: true,
        secondaryEducation: true,
        faculty: true,
        university: true,
        currentWork: true,
        avatar: true,
        dateOfBirth: true,
        gender: true,
        topEducation: true,
        educationDegree: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            forumNews: true,
            lessonPlans: true,
            homeworks: true,
            tests: true,
            activities: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name, role = 'USER' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role as Role
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { email, name, role, ...otherData } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData: any = { ...otherData };
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (role) updateData.role = role;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        currentWork: true,
        updatedAt: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (id === req.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.user.delete({ where: { id } });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// ==================== FORUM CATEGORIES MANAGEMENT ====================
export const getAllForumCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await prisma.forumCategory.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { forumNews: true }
        }
      }
    });

    res.json(categories);
  } catch (error) {
    console.error('Get forum categories error:', error);
    res.status(500).json({ error: 'Failed to fetch forum categories' });
  }
};

export const createForumCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { categoryName, image, imageDescription } = req.body;

    if (!categoryName || !image || !imageDescription) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const category = await prisma.forumCategory.create({
      data: {
        categoryName,
        image,
        imageDescription
      }
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Create forum category error:', error);
    res.status(500).json({ error: 'Failed to create forum category' });
  }
};

export const updateForumCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { categoryName, image, imageDescription } = req.body;

    const category = await prisma.forumCategory.update({
      where: { id },
      data: {
        categoryName,
        image,
        imageDescription
      }
    });

    res.json(category);
  } catch (error) {
    console.error('Update forum category error:', error);
    res.status(500).json({ error: 'Failed to update forum category' });
  }
};

export const deleteForumCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if category has posts
    const category = await prisma.forumCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { forumNews: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (category._count.forumNews > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with existing posts',
        postsCount: category._count.forumNews
      });
    }

    await prisma.forumCategory.delete({ where: { id } });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete forum category error:', error);
    res.status(500).json({ error: 'Failed to delete forum category' });
  }
};

// ==================== FORUM POSTS MANAGEMENT ====================
export const getAllForumPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '10', search = '', categoryId = '' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { text: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [posts, total] = await Promise.all([
      prisma.forumNews.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          category: {
            select: {
              id: true,
              categoryName: true
            }
          }
        }
      }),
      prisma.forumNews.count({ where })
    ]);

    res.json({
      posts,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get forum posts error:', error);
    res.status(500).json({ error: 'Failed to fetch forum posts' });
  }
};

export const deleteForumPost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.forumNews.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await prisma.forumNews.delete({ where: { id } });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete forum post error:', error);
    res.status(500).json({ error: 'Failed to delete forum post' });
  }
};

export const updateForumPost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const post = await prisma.forumNews.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        category: {
          select: {
            id: true,
            categoryName: true
          }
        }
      }
    });

    res.json(post);
  } catch (error) {
    console.error('Update forum post error:', error);
    res.status(500).json({ error: 'Failed to update forum post' });
  }
};

// ==================== ANNOUNCEMENTS MANAGEMENT ====================
export const getAllAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.announcement.count()
    ]);

    res.json({
      announcements,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
};

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, date, link1, link1Description, link2, link2Description } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        description,
        date,
        link1,
        link1Description,
        link2,
        link2Description
      }
    });

    res.status(201).json(announcement);
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
};

export const updateAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const announcement = await prisma.announcement.update({
      where: { id },
      data: updateData
    });

    res.json(announcement);
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.announcement.delete({ where: { id } });

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
};

// ==================== SUBJECTS & GRADES MANAGEMENT ====================
export const getAllSubjectsAndGrades = async (req: AuthRequest, res: Response) => {
  try {
    const subjectsAndGrades = await prisma.subjectAndGrade.findMany({
      orderBy: [{ subject: 'asc' }, { grade: 'asc' }]
    });

    res.json(subjectsAndGrades);
  } catch (error) {
    console.error('Get subjects and grades error:', error);
    res.status(500).json({ error: 'Failed to fetch subjects and grades' });
  }
};

export const createSubjectAndGrade = async (req: AuthRequest, res: Response) => {
  try {
    const { subject, grade } = req.body;

    if (!subject || !grade) {
      return res.status(400).json({ error: 'Subject and grade are required' });
    }

    const subjectAndGrade = await prisma.subjectAndGrade.create({
      data: { subject, grade }
    });

    res.status(201).json(subjectAndGrade);
  } catch (error) {
    console.error('Create subject and grade error:', error);
    res.status(500).json({ error: 'Failed to create subject and grade' });
  }
};

export const updateSubjectAndGrade = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { subject, grade } = req.body;

    const subjectAndGrade = await prisma.subjectAndGrade.update({
      where: { id },
      data: { subject, grade }
    });

    res.json(subjectAndGrade);
  } catch (error) {
    console.error('Update subject and grade error:', error);
    res.status(500).json({ error: 'Failed to update subject and grade' });
  }
};

export const deleteSubjectAndGrade = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.subjectAndGrade.delete({ where: { id } });

    res.json({ message: 'Subject and grade deleted successfully' });
  } catch (error) {
    console.error('Delete subject and grade error:', error);
    res.status(500).json({ error: 'Failed to delete subject and grade' });
  }
};

// ==================== LESSON PLANS MANAGEMENT ====================
export const getAllLessonPlans = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '10', search = '', userId = '' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    
    if (search) {
      where.OR = [
        { lessonName: { contains: search as string, mode: 'insensitive' } },
        { subject: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (userId) {
      where.userId = userId;
    }

    const [plans, total] = await Promise.all([
      prisma.lessonPlan.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      }),
      prisma.lessonPlan.count({ where })
    ]);

    res.json({
      plans,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get lesson plans error:', error);
    res.status(500).json({ error: 'Failed to fetch lesson plans' });
  }
};

export const deleteLessonPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.lessonPlan.delete({ where: { id } });
    res.json({ message: 'Lesson plan deleted successfully' });
  } catch (error) {
    console.error('Delete lesson plan error:', error);
    res.status(500).json({ error: 'Failed to delete lesson plan' });
  }
};

// ==================== TESTS MANAGEMENT ====================
export const getAllTests = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '10', search = '' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (search) {
      where.OR = [
        { subject: { contains: search as string, mode: 'insensitive' } },
        { teachingUnit: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [tests, total] = await Promise.all([
      prisma.test.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, email: true, name: true }
          }
        }
      }),
      prisma.test.count({ where })
    ]);

    res.json({
      tests,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
};

export const deleteTest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.test.delete({ where: { id } });
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error('Delete test error:', error);
    res.status(500).json({ error: 'Failed to delete test' });
  }
};

// ==================== HOMEWORKS MANAGEMENT ====================
export const getAllHomeworks = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '10', search = '' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (search) {
      where.OR = [
        { subject: { contains: search as string, mode: 'insensitive' } },
        { teachingUnit: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [homeworks, total] = await Promise.all([
      prisma.homework.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, email: true, name: true }
          }
        }
      }),
      prisma.homework.count({ where })
    ]);

    res.json({
      homeworks,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get homeworks error:', error);
    res.status(500).json({ error: 'Failed to fetch homeworks' });
  }
};

export const deleteHomework = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.homework.delete({ where: { id } });
    res.json({ message: 'Homework deleted successfully' });
  } catch (error) {
    console.error('Delete homework error:', error);
    res.status(500).json({ error: 'Failed to delete homework' });
  }
};

// ==================== ACTIVITIES MANAGEMENT ====================
export const getAllActivities = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '10', search = '' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { place: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, email: true, name: true }
          }
        }
      }),
      prisma.activity.count({ where })
    ]);

    res.json({
      activities,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

export const deleteActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.activity.delete({ where: { id } });
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
};

// ==================== CLASS SCHEDULES MANAGEMENT ====================
export const getAllClassSchedules = async (req: AuthRequest, res: Response) => {
  try {
    const schedules = await prisma.classSchedule.findMany({
      orderBy: [{ dayName: 'asc' }, { subject: 'asc' }]
    });

    res.json(schedules);
  } catch (error) {
    console.error('Get class schedules error:', error);
    res.status(500).json({ error: 'Failed to fetch class schedules' });
  }
};

export const deleteClassSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.classSchedule.delete({ where: { id } });
    res.json({ message: 'Class schedule deleted successfully' });
  } catch (error) {
    console.error('Delete class schedule error:', error);
    res.status(500).json({ error: 'Failed to delete class schedule' });
  }
};

// ==================== OPERATIVE PLANS MANAGEMENT ====================
export const getAllOperativePlans = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [plans, total] = await Promise.all([
      prisma.operativePlan.findMany({
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.operativePlan.count()
    ]);

    res.json({
      plans,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get operative plans error:', error);
    res.status(500).json({ error: 'Failed to fetch operative plans' });
  }
};

export const deleteOperativePlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.operativePlan.delete({ where: { id } });
    res.json({ message: 'Operative plan deleted successfully' });
  } catch (error) {
    console.error('Delete operative plan error:', error);
    res.status(500).json({ error: 'Failed to delete operative plan' });
  }
};

// ==================== GLOBAL PLANS MANAGEMENT ====================
export const getAllGlobalPlans = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [plans, total] = await Promise.all([
      prisma.globalPlan.findMany({
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.globalPlan.count()
    ]);

    res.json({
      plans,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get global plans error:', error);
    res.status(500).json({ error: 'Failed to fetch global plans' });
  }
};

export const deleteGlobalPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.globalPlan.delete({ where: { id } });
    res.json({ message: 'Global plan deleted successfully' });
  } catch (error) {
    console.error('Delete global plan error:', error);
    res.status(500).json({ error: 'Failed to delete global plan' });
  }
};

