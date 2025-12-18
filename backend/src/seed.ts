import prisma from './config/database';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create sample forum categories
    const categories = await Promise.all([
      prisma.forumCategory.create({
        data: {
          categoryName: 'Osnovna škola',
          image: 'osnovna.jpg',
          imageDescription: 'Osnovna škola kategorija'
        }
      }),
      prisma.forumCategory.create({
        data: {
          categoryName: 'Srednja škola',
          image: 'srednja.jpg',
          imageDescription: 'Srednja škola kategorija'
        }
      }),
      prisma.forumCategory.create({
        data: {
          categoryName: 'Fakultet',
          image: 'faculty.jpg',
          imageDescription: 'Fakultet kategorija'
        }
      }),
      prisma.forumCategory.create({
        data: {
          categoryName: 'Online obuke',
          image: 'online.jpg',
          imageDescription: 'Online obuke kategorija'
        }
      })
    ]);

    console.log('✅ Created forum categories');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: adminPassword,
        name: 'Admin',
        role: 'ADMIN',
        currentWork: 'Administrator',
        gender: 'Muški'
      }
    });

    console.log('✅ Created admin user (email: admin@example.com, password: admin123)');

    // Create sample user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test Korisnik',
        role: 'USER',
        currentWork: 'Nastavnik',
        gender: 'Muški'
      }
    });

    console.log('✅ Created test user (email: test@example.com, password: password123)');

    // Create sample subjects
    const subjects = await Promise.all([
      prisma.subjectAndGrade.create({
        data: {
          subject: 'Matematika',
          grade: '5'
        }
      }),
      prisma.subjectAndGrade.create({
        data: {
          subject: 'Srpski jezik',
          grade: '5'
        }
      }),
      prisma.subjectAndGrade.create({
        data: {
          subject: 'Engleski jezik',
          grade: '6'
        }
      })
    ]);

    console.log('✅ Created sample subjects');

    // Create sample announcement
    await prisma.announcement.create({
      data: {
        title: 'Dobrodošli na portal',
        description: 'Dobrodošli na obrazovni portal za učitelje i nastavnike!',
        date: new Date().toISOString()
      }
    });

    console.log('✅ Created sample announcement');

    // Create sample lesson plan
    await prisma.lessonPlan.create({
      data: {
        date: '2024-01-15',
        classNumber: '1',
        gradeAndClass: '5-1',
        subject: 'Matematika',
        teachingTopic: 'Algebra',
        lessonName: 'Jednačine prvog stepena',
        typeOfLesson: 'Nova lekcija',
        userId: user.id
      }
    });

    console.log('✅ Created sample lesson plan');

    // Create sample test
    await prisma.test.create({
      data: {
        subject: 'Matematika',
        teachingUnit: 'Algebra',
        date: '2024-02-01',
        task1: 'Reši jednačinu: 2x + 5 = 15',
        task2: 'Reši jednačinu: 3x - 7 = 20',
        userId: user.id
      }
    });

    console.log('✅ Created sample test');

    // Create sample homework
    await prisma.homework.create({
      data: {
        subject: 'Srpski jezik',
        teachingUnit: 'Glagoli',
        task1: 'Napiši 10 glagola u prezentu',
        task2: 'Napiši 10 glagola u perfekat',
        userId: user.id
      }
    });

    console.log('✅ Created sample homework');

    // Create sample activity
    await prisma.activity.create({
      data: {
        date: '2024-03-15',
        title: 'Školsko takmičenje',
        description: 'Takmičenje iz matematike za sve razrede',
        typeOfActivity: 'Takmičenje',
        place: 'Školska sala',
        userId: user.id
      }
    });

    console.log('✅ Created sample activity');

    // Create sample class schedule
    await prisma.classSchedule.create({
      data: {
        subject: 'Matematika',
        dayName: 'Ponedeljak',
        userId: user.id
      }
    });

    console.log('✅ Created sample class schedule');

    // Create sample operative plan
    await prisma.operativePlan.create({
      data: {
        subject: 'Matematika',
        grade: '5',
        month: 'Januar',
        schoolYear: '2023/2024',
        teacher: 'Marko Marković'
      }
    });

    console.log('✅ Created sample operative plan');

    // Create sample global plan
    await prisma.globalPlan.create({
      data: {
        subject: 'Matematika',
        grade: '5',
        schoolYear: '2023/2024',
        teacher: 'Marko Marković'
      }
    });

    console.log('✅ Created sample global plan');

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();


