-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "primary_education" TEXT,
    "secondary_education" TEXT,
    "faculty" TEXT,
    "university" TEXT,
    "current_work" TEXT,
    "avatar" TEXT,
    "date_of_birth" TEXT,
    "gender" TEXT,
    "top_education" TEXT,
    "education_degree" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_categories" (
    "id" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "image_description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forum_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_news" (
    "id" TEXT NOT NULL,
    "author_name" TEXT,
    "current_work" TEXT,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "real_text" TEXT,
    "additional_text" TEXT,
    "image_url" TEXT NOT NULL,
    "image_description" TEXT NOT NULL,
    "author_position" TEXT,
    "main_news" BOOLEAN NOT NULL DEFAULT false,
    "news_link" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forum_news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_plans" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "class_number" TEXT NOT NULL,
    "grade_and_class" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "teaching_topic" TEXT NOT NULL,
    "lesson_name" TEXT NOT NULL,
    "previous_lesson" TEXT,
    "next_lesson" TEXT,
    "type_of_lesson" TEXT,
    "educational_objectives" TEXT,
    "social_objectives" TEXT,
    "functional_objectives" TEXT,
    "teaching_methods" TEXT,
    "forms_of_work" TEXT,
    "instructional_materials" TEXT,
    "correlation" TEXT,
    "literature" TEXT,
    "introduction_small" TEXT,
    "main_activity_small" TEXT,
    "conclusion_small" TEXT,
    "introduction" TEXT,
    "main" TEXT,
    "conclusion" TEXT,
    "file" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homeworks" (
    "id" TEXT NOT NULL,
    "task1" TEXT,
    "task2" TEXT,
    "task3" TEXT,
    "task4" TEXT,
    "task5" TEXT,
    "task6" TEXT,
    "task7" TEXT,
    "task8" TEXT,
    "task9" TEXT,
    "task10" TEXT,
    "subject" TEXT NOT NULL,
    "teaching_unit" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homeworks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tests" (
    "id" TEXT NOT NULL,
    "task1" TEXT,
    "task2" TEXT,
    "task3" TEXT,
    "task4" TEXT,
    "task5" TEXT,
    "task6" TEXT,
    "task7" TEXT,
    "task8" TEXT,
    "task9" TEXT,
    "task10" TEXT,
    "subject" TEXT NOT NULL,
    "teaching_unit" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type_of_activity" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_schedules" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "day_name" TEXT NOT NULL,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TEXT NOT NULL,
    "link1" TEXT,
    "link1_description" TEXT,
    "link2" TEXT,
    "link2_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operative_plans" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "school_year" TEXT NOT NULL,
    "teacher" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operative_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "global_plans" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "school_year" TEXT NOT NULL,
    "teacher" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "global_plan_subjects" (
    "id" TEXT NOT NULL,
    "class_theme" TEXT NOT NULL,
    "learning_objectives" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "processing_class" INTEGER NOT NULL,
    "review_class" INTEGER NOT NULL,
    "evaluation_class" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_plan_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects_and_grades" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_and_grades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "forum_news" ADD CONSTRAINT "forum_news_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_news" ADD CONSTRAINT "forum_news_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "forum_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_plans" ADD CONSTRAINT "lesson_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests" ADD CONSTRAINT "tests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
