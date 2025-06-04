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

export interface ForumNewsItemType {
  id: string;
  author_name?: string;
  current_work?: string;
  title: string;
  text: string;
  real_text: string;
  additional_text?: string;
  image_url: string | StaticImageData;
  image_description: string;
  author_position?: string;
  main_news: boolean;
  news_link: string;
  created: string;
  likes: number;
  dislikes: number;
  expand: {
    category: { category_name: string; id: string };
    user: {
      current_work: string;
      name: string;
    };
  };
  user: {
    current_work: string;
    name: string;
  };
}

export interface NewsCategoriesItemType {
  id: string;
  category_name: string;
  image: string;
  image_description: string;
}

export interface userDataType {
  id: string;
  name: string;
  email: string;
  primaryEducation?: string;
  secondaryEducation?: string;
  faculty?: string;
  university: string;
  current_work: string;
  avatar?: string;
  date_of_birth: string;
  gender: string;
  topEducation: string;
  educationDegree: string;
}

export interface OperativePlansItemType {
  id: string;
  subject: string;
  grade: string;
  month: string;
  school_year: string;
  teacher: string;
}

export interface GlobalPlansItemType {
  id: string;
  subject: string;
  grade: string;
  school_year: string;
  teacher: string;
}

export interface ClassBasicInfo {
  id: string;
  teaching_topic: string;
  lesson_number: string;
  lesson_title: string;
  type_of_lesson: string;
  forms_of_work: string;
  teaching_methods: string;
  teaching_techniques: string;
  correlation: string;
  subject: string;
  instructional_materials: string;
  educational_objects: string;
  literature: string;
  notes: string;
}

export interface GlobalPlansSubjectType {
  id: string;
  class_theme: string;
  learning_objectives: string;
  month: string;
  processing_class: number;
  review_class: number;
  evaluation_class: number;
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
  teaching_unit: string;
  date: string;
  id: string;
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
  teaching_unit: string;
  id: string;
}

export interface LessonPlanType {
  id: string;
  date: string;
  class_number: string;
  grade_and_class: string;
  subject: string;
  teaching_topic: string;
  lesson_name: string;
  previous_lesson: string;
  next_lesson: string;
  type_of_lesson: string;
  educational_objectives: string;
  social_objectives: string;
  functional_objectives: string;
  teaching_methods: string;
  forms_of_work: string;
  instructional_materials: string;
  correlation: string;
  literature: string;
  introduction_small: string;
  main_activity_small: string;
  conclusion_small: string;
  introduction: string;
  main: string;
  conclusion: string;
}

export interface ActivityType {
  id: string;
  date: string;
  title: string;
  description: string;
  type_of_activity: string;
  place: string;
}

export interface ClassScheduleType {
  id: string;
  subject: string[] | string;
  dayName: string;
}

export interface AnnouncementsType {
  id: string;
  title: string;
  description?: string;
  date: string;
  link1?: string;
  link1description?: string;
  link2?: string;
  link2description?: string;
  created: string;
}
