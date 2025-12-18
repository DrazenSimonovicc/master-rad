import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { deleteFile } from '../middleware/upload.middleware';

// Forum Categories
export const getAllCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await prisma.forumCategory.findMany();
    res.json({ items: categories });
  } catch (error: any) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Error fetching categories' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const data = {
      categoryName: req.body.categoryName,
      image: req.file?.filename || req.body.image,
      imageDescription: req.body.imageDescription
    };

    const category = await prisma.forumCategory.create({ data });
    res.status(201).json(category);
  } catch (error: any) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Error creating category', details: error.message });
  }
};

// Forum News
export const getAllForumNews = async (req: AuthRequest, res: Response) => {
  try {
    const { expand } = req.query;
    const includeRelations = expand && typeof expand === 'string' && expand.includes('user,category');

    const forumNews = await prisma.forumNews.findMany({
      include: includeRelations ? {
        user: {
          select: {
            id: true,
            name: true,
            currentWork: true,
            avatar: true
          }
        },
        category: true
      } : undefined,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format response to match expected structure
    const formattedNews = forumNews.map((news: any) => ({
      ...news,
      expand: includeRelations && news.user && news.category ? {
        user: news.user,
        category: news.category
      } : undefined,
      created: news.createdAt.toISOString()
    }));

    res.json({ items: formattedNews });
  } catch (error: any) {
    console.error('Get forum news error:', error);
    res.status(500).json({ error: 'Error fetching forum news' });
  }
};

export const getForumNewsById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { expand } = req.query;
    const includeRelations = expand && typeof expand === 'string' && expand.includes('user,category');

    const news = await prisma.forumNews.findUnique({
      where: { id },
      include: includeRelations ? {
        user: {
          select: {
            id: true,
            name: true,
            currentWork: true,
            avatar: true
          }
        },
        category: true
      } : undefined
    });

    if (!news) {
      return res.status(404).json({ error: 'Forum news not found' });
    }

    const formatted = {
      ...news,
      expand: includeRelations && (news as any).user && (news as any).category ? {
        user: (news as any).user,
        category: (news as any).category
      } : undefined,
      created: news.createdAt.toISOString()
    };

    res.json(formatted);
  } catch (error: any) {
    console.error('Get forum news error:', error);
    res.status(500).json({ error: 'Error fetching forum news' });
  }
};

export const createForumNews = async (req: AuthRequest, res: Response) => {
  try {
    const data: any = {
      authorName: req.body.authorName,
      currentWork: req.body.currentWork,
      title: req.body.title,
      text: req.body.text,
      realText: req.body.realText || null,
      additionalText: req.body.additionalText || null,
      imageDescription: req.body.imageDescription,
      authorPosition: req.body.authorPosition || null,
      mainNews: req.body.mainNews === 'true' || req.body.mainNews === true,
      newsLink: req.body.newsLink || null,
      likes: 0,
      dislikes: 0,
      userId: req.userId!,
      categoryId: req.body.category
    };

    if (req.file) {
      data.imageUrl = req.file.filename;
    }

    const news = await prisma.forumNews.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            currentWork: true,
            avatar: true
          }
        },
        category: true
      }
    });

    res.status(201).json({
      ...news,
      expand: {
        user: news.user,
        category: news.category
      },
      created: news.createdAt.toISOString()
    });
  } catch (error: any) {
    console.error('Create forum news error:', error);
    res.status(500).json({ error: 'Error creating forum news', details: error.message });
  }
};

export const updateForumNews = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingNews = await prisma.forumNews.findUnique({ where: { id } });
    if (!existingNews) {
      return res.status(404).json({ error: 'Forum news not found' });
    }

    if (existingNews.userId !== req.userId) {
      return res.status(403).json({ error: 'You can only update your own posts' });
    }

    const data: any = {
      authorName: req.body.authorName,
      currentWork: req.body.currentWork,
      title: req.body.title,
      text: req.body.text,
      realText: req.body.realText || null,
      additionalText: req.body.additionalText || null,
      imageDescription: req.body.imageDescription,
      authorPosition: req.body.authorPosition || null,
      mainNews: req.body.mainNews === 'true' || req.body.mainNews === true,
      newsLink: req.body.newsLink || null,
      categoryId: req.body.category
    };

    if (req.file) {
      if (existingNews.imageUrl) {
        deleteFile(`uploads/forum-images/${existingNews.imageUrl}`);
      }
      data.imageUrl = req.file.filename;
    }

    const news = await prisma.forumNews.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            currentWork: true,
            avatar: true
          }
        },
        category: true
      }
    });

    res.json({
      ...news,
      expand: {
        user: news.user,
        category: news.category
      },
      created: news.createdAt.toISOString()
    });
  } catch (error: any) {
    console.error('Update forum news error:', error);
    res.status(500).json({ error: 'Error updating forum news', details: error.message });
  }
};

export const deleteForumNews = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingNews = await prisma.forumNews.findUnique({ where: { id } });
    if (!existingNews) {
      return res.status(404).json({ error: 'Forum news not found' });
    }

    if (existingNews.userId !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own posts' });
    }

    if (existingNews.imageUrl) {
      deleteFile(`uploads/forum-images/${existingNews.imageUrl}`);
    }

    await prisma.forumNews.delete({ where: { id } });

    res.json({ message: 'Forum news deleted successfully' });
  } catch (error: any) {
    console.error('Delete forum news error:', error);
    res.status(500).json({ error: 'Error deleting forum news' });
  }
};
