import { StaticImageData } from "next/image";

export interface NavigationItemType {
  title: string;
  link?: string;
  submenu?: SubmenuItemType[];
  id: number;
}

export interface SubmenuItemType {
  title: string;
  link: string;
  id: number;
}

export interface BreadcrumbItemType {
  level1: string;
  level2?: string;
  level3?: string;
  level4?: string;
  level1url: string;
  level2url?: string;
  level3url?: string;
  level4url?: string;
  searchText?: string;
}

export interface ImageType {
  url: string;
  alt: string;
  linkUrl?: string;
}

export interface NewsCategoriesItemType {
  id: string;
  categoryName: string;
  image: string;
  imageDescription: string;
}

export interface ForumNewsItemType {
  id: string;
  authorName?: string;
  currentWork?: string;
  title: string;
  text: string;
  realText: string;
  additionalText?: string;
  imageUrl: string | StaticImageData;
  imageDescription: string;
  authorPosition?: string;
  mainNews: boolean;
  newsLink: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  expand: {
    category: NewsCategoriesItemType;
    user: {
      currentWork: string;
      name: string;
    };
  };
  user: {
    currentWork: string;
    name: string;
  };
}

export interface userDataType {
  id: string;
  name: string;
  email: string;
  primaryEducation?: string;
  secondaryEducation?: string;
  faculty?: string;
  university: string;
  currentWork: string;
  avatar?: string;
  dateOfBirth: string;
  gender: string;
  topEducation: string;
  educationDegree: string;
}

export interface OperativePlansItemType {
  id: string;
  subject: string;
  grade: string;
  month: string;
  schoolYear: string;
  teacher: string;
}

export interface GlobalPlansItemType {
  id: string;
  subject: string;
  grade: string;
  schoolYear: string;
  teacher: string;
}

export interface ClassBasicInfo {
  id: string;
  teachingTopic: string;
  lessonNumber: string;
  lessonTitle: string;
  typeOfLesson: string;
  formsOfWork: string;
  teachingMethods: string;
  teachingTechniques: string;
  correlation: string;
  subject: string;
  instructionalMaterials: string;
  educationalObjects: string;
  literature: string;
  notes: string;
}

export interface GlobalPlansSubjectType {
  id: string;
  classTheme: string;
  learningObjectives: string;
  month: string;
  processingClass: number;
  reviewClass: number;
  evaluationClass: number;
  subject: string;
}

export interface SubjectAndGrade {
  id: string;
  subject: string;
  grade: string;
}

export type HomeworkSubject = SubjectAndGrade;
export type TestsSubject = SubjectAndGrade;
export type LessonPlanSubject = SubjectAndGrade;

export interface TestItemType {
  task1: string;
  task2: string;
  task3: string;
  task4: string;
  task5: string;
  task6: string;
  task7: string;
  task8: string;
  task9: string;
  task10: string;
  subject: string;
  teachingUnit: string;
  date: string;
  id: string;
  userId: string;
}

export interface HomeworkItemType {
  task1: string;
  task2: string;
  task3: string;
  task4: string;
  task5: string;
  task6: string;
  task7: string;
  task8: string;
  task9: string;
  task10: string;
  subject: string;
  teachingUnit: string;
  id: string;
  userId: string;
}

export interface LessonPlanType {
  id: string;
  date: string;
  classNumber: string;
  gradeAndClass: string;
  subject: string;
  teachingTopic: string;
  lessonName: string;
  previousLesson: string;
  nextLesson: string;
  typeOfLesson: string;
  educationalObjectives: string;
  socialObjectives: string;
  functionalObjectives: string;
  teachingMethods: string;
  formsOfWork: string;
  instructionalMaterials: string;
  correlation: string;
  literature: string;
  introductionSmall: string;
  mainActivitySmall: string;
  conclusionSmall: string;
  introduction: string;
  main: string;
  conclusion: string;
  userId: string;
  file?: string;
}

export interface ActivityType {
  id: string;
  date: string;
  title: string;
  description: string;
  typeOfActivity: string;
  place: string;
  userId: string;
}

export interface ClassScheduleType {
  id: string;
  subject: string[] | string;
  dayName: string;
  userId?: string;
}

export interface AnnouncementsType {
  id: string;
  title: string;
  description?: string;
  date: string;
  link1?: string;
  link1Description?: string;
  link2?: string;
  link2Description?: string;
  createdAt: string;
}
