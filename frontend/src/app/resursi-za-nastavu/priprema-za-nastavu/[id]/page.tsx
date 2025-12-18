"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import { Pagination } from "@mui/material";
import { Button } from "@/Components/Button";
import LessonPlanModal from "@/Components/Form/LessonPlan/LessonPlanModal/LessonPlanModal";
import { PageHeader } from "@/Components/Navigation/PageHeader";
import SearchInput from "@/Components/Inputs/SearchInput/SearchInput";
import SearchToggleInput from "@/Components/Inputs/SearchInput/SearchInput";
import { SidebarWrapper } from "@/Components/Layout/Sidebar/SidebarWrapper";
import LessonDetails from "@/Components/LessonDetails/LessonDetails";
import DeleteConfirmationModal from "@/Components/Modal/DeleteConfirmationModal/DeleteConfirmationModal";
import Preloader from "@/Components/Preloader/Preloader";
import RequireAuth from "@/Components/RequireAuth/RequireAuth";
import TeachingUnitTitle from "@/Components/TeachingUnitTitle/TeachingUnitTitle";
import { Title } from "@/Components/Texts/Title";
import { useFetchLessonPlan } from "@/Hooks/LessonPlan/getLessonPlan";
import { useAuth } from "@/Hooks/useAuth";
import { LessonPlanType } from "@/Interfaces/BaseType";
import { lessonPlanService } from "@/libs/api";
import { lessonPlanValidationSchema } from "@/app/resursi-za-nastavu/priprema-za-nastavu/[id]/Validation";
import styles from "./page.module.scss";

const LessonPlan = () => {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") || "";

  const {
    lessonPlan,
    error: onError,
    loading: onLoading,
    refetch: refetchOperative,
  } = useFetchLessonPlan();

  const [myCurrentPage, setMyCurrentPage] = useState(1);
  const [otherCurrentPage, setOtherCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { userData, isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
  const [editingLessonPlan, setEditingLessonPlan] =
    useState<LessonPlanType | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [view, setView] = useState<"form" | "upload">("form");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const lessonMatchesSearch = (lesson: LessonPlanType, query: string) => {
    const searchTarget = [
      lesson.lessonName,
      lesson.teachingTopic,
      lesson.classNumber,
      lesson.date,
      lesson.previousLesson,
      lesson.nextLesson,
      lesson.typeOfLesson,
      lesson.educationalObjectives,
      lesson.socialObjectives,
      lesson.functionalObjectives,
      lesson.teachingMethods,
      lesson.formsOfWork,
      lesson.instructionalMaterials,
      lesson.correlation,
      lesson.literature,
      lesson.introduction,
      lesson.main,
      lesson.conclusion,
      lesson.gradeAndClass,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchTarget.includes(query.toLowerCase());
  };

  const handleEdit = (lessonItem: LessonPlanType) => {
    setEditingLessonPlan(lessonItem);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await lessonPlanService.delete(deleteId);
      await refetchOperative();
    } catch (error) {
      console.error("Greška prilikom brisanja:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
      formikLessonPlan.setFieldValue("file", file);
      console.log("Selected file:", file);
    }
  };

  const handleSubmitFile = async () => {
    const { file, classNumber, date, teachingTopic, lessonName } =
      formikLessonPlan.values;

    if (!file) {
      alert("Niste izabrali fajl.");
      return;
    }

    if (!classNumber || !date || !teachingTopic || !lessonName) {
      alert("Molimo popunite sve podatke o času pre slanja fajla.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userData?.id || "");
    formData.append("subject", subject);
    formData.append("classNumber", classNumber);
    formData.append("date", date);
    formData.append("teachingTopic", teachingTopic);
    formData.append("lessonName", lessonName);

    try {
      await lessonPlanService.create(formData as any, file);
      await refetchOperative();
      handleCloseModal();
      formikLessonPlan.resetForm();
      alert("Fajl uspešno otpremljen.");
    } catch (error) {
      console.error("Greška prilikom slanja fajla:", error);
      alert("Došlo je do greške prilikom slanja fajla.");
    }
  };

  useEffect(() => {
    if (view === "form") {
      formikLessonPlan.resetForm();
    }
  }, [view]);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const toggleExpandedUnit = (id: string) => {
    setExpandedUnitId((prev) => (prev === id ? null : id));
  };

  const otherLessonPlan = useMemo(() => {
    if (!lessonPlan.length || !userData?.id) return [];
    return lessonPlan.filter(
      (t) =>
        t.subject.toLowerCase() === subject.toLowerCase() &&
        t.userId !== userData.id,
    );
  }, [lessonPlan, subject, userData?.id]);

  const formikLessonPlan = useFormik({
    enableReinitialize: true,
    initialValues: {
      date: "",
      classNumber: "",
      gradeAndClass: "",
      teachingTopic: "",
      lessonName: "",
      previousLesson: "",
      nextLesson: "",
      typeOfLesson: "",
      educationalObjectives: "",
      socialObjectives: "",
      functionalObjectives: "",
      teachingMethods: "",
      formsOfWork: "",
      instructionalMaterials: "",
      correlation: "",
      literature: "",
      introductionSmall: "",
      mainActivitySmall: "",
      conclusionSmall: "",
      introduction: "",
      main: "",
      conclusion: "",
      subject: subject,
      userId: userData?.id,
      file: null,
    },
    validationSchema: lessonPlanValidationSchema,
    onSubmit: async (values) => {
      try {
        const finalValues = {
          ...values,
          userId: userData?.id,
        };

        if (editingLessonPlan) {
          await lessonPlanService.update(editingLessonPlan.id, finalValues, selectedFile || undefined);
        } else {
          await lessonPlanService.create(finalValues, selectedFile || undefined);
        }

        await refetchOperative();
        handleCloseModal();
        setEditingLessonPlan(null);
        formikLessonPlan.resetForm();
      } catch (error) {
        console.error("Error submitting lesson plan", error);
      }
    },
  });

  const myLessonPlan = lessonPlan.filter(
    (t) =>
      t.subject.toLowerCase() === subject.toLowerCase() &&
      t.userId === userData?.id &&
      lessonMatchesSearch(t, searchQuery),
  );

  const paginatedLessonPlan = myLessonPlan.slice(
    (myCurrentPage - 1) * itemsPerPage,
    myCurrentPage * itemsPerPage,
  );

  const filteredOtherLessonPlan = otherLessonPlan.filter((t) =>
    lessonMatchesSearch(t, searchQuery),
  );

  const paginatedOtherLessonPlan = filteredOtherLessonPlan.slice(
    (otherCurrentPage - 1) * itemsPerPage,
    otherCurrentPage * itemsPerPage,
  );

  useEffect(() => {
    setMyCurrentPage(1);
    setOtherCurrentPage(1);
  }, [searchQuery]);

  if (onLoading) {
    return <Preloader page />;
  }

  if (onError) return <div>Greška u učitavanju {onError}</div>;

  return (
    <div>
      <div className={!isLoggedIn ? styles.blurWrapper : ""}>
        <PageHeader />

        {isLoggedIn && (
          <div className={styles.actionHeader}>
            <div className={styles.addButtonWrapper}>
            <Button
              title={"Dodaj pripremu za čas"}
              themes={[
                "orange",
                "standardWide",
                "standardHeight",
                "noBorderRadius",
                "maxWidth",
              ]}
              onClick={handleOpenModal}
            />

            <SearchToggleInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            </div>
          </div>
        )}

        <section className={styles.container}>
          <div className={styles.referencesWrap}>
            <div className={styles.testsWrap}>
              {paginatedLessonPlan && paginatedLessonPlan.length > 0 && (
                <>
                  <Title
                    level={3}
                    text={"Moje pripreme za čas"}
                    className={styles.title}
                  />

                  {paginatedLessonPlan.map((lesson, index) => {
                    const isExpanded = expandedUnitId === lesson.id;
                    const isFile =
                      lesson.file?.length && lesson.file?.length > 0;

                    return (
                      <div
                        key={lesson.id || index}
                        className={styles.lessonCard}
                      >
                        <TeachingUnitTitle
                          title={`${lesson.classNumber} - ${lesson.teachingTopic} - ${lesson.lessonName} - ${lesson.date}`}
                          isExpanded={isExpanded}
                          onToggle={() => {
                            if (isFile) {
                              const fileUrl = `http://127.0.0.1:8090/api/files/lesson_plan/${lesson.id}/${lesson.file}`;
                              window.open(fileUrl, "_blank");
                            } else {
                              toggleExpandedUnit(lesson.id);
                            }
                          }}
                          onEdit={() => handleEdit(lesson)}
                          onDelete={() => handleDelete(lesson.id)}
                          canEdit={lesson.userId === userData?.id}
                          isFile={!!lesson.file}
                          lesson={lesson}
                        />

                        {isExpanded && !isFile && (
                          <LessonDetails lesson={lesson} />
                        )}
                      </div>
                    );
                  })}

                  {myLessonPlan.length > itemsPerPage && (
                    <div className={styles.paginationContainer}>
                      <Pagination
                        count={Math.ceil(myLessonPlan.length / itemsPerPage)}
                        page={myCurrentPage}
                        onChange={(_, value) => setMyCurrentPage(value)}
                        color="primary"
                        shape="rounded"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className={styles.testsWrap}>
              {paginatedOtherLessonPlan &&
                paginatedOtherLessonPlan.length > 0 && (
                  <>
                    <Title
                      level={3}
                      text={"Pripreme za čas drugih autora"}
                      className={styles.title}
                    />

                    {paginatedOtherLessonPlan.map((lesson, index) => {
                      const isExpanded = expandedUnitId === lesson.id;
                      const isFile =
                        lesson.file?.length && lesson.file?.length > 0;
                      return (
                        <div
                          key={lesson.id || index}
                          className={styles.lessonCard}
                        >
                          <TeachingUnitTitle
                            title={`${lesson.classNumber} - ${lesson.teachingTopic} - ${lesson.lessonName} - ${lesson.date}`}
                            isExpanded={isExpanded}
                            onToggle={() => {
                              if (isFile) {
                                const fileUrl = `http://127.0.0.1:8090/api/files/lesson_plan/${lesson.id}/${lesson.file}`;
                                window.open(fileUrl, "_blank");
                              } else {
                                toggleExpandedUnit(lesson.id);
                              }
                            }}
                            onEdit={() => handleEdit(lesson)}
                            onDelete={() => handleDelete(lesson.id)}
                            canEdit={lesson.userId === userData?.id}
                            isFile={!!lesson.file}
                            lesson={lesson}
                          />

                          {isExpanded && <LessonDetails lesson={lesson} />}
                        </div>
                      );
                    })}

                    {otherLessonPlan.length > itemsPerPage && (
                      <div className={styles.paginationContainer}>
                        <Pagination
                          count={Math.ceil(
                            otherLessonPlan.length / itemsPerPage,
                          )}
                          page={otherCurrentPage}
                          onChange={(_, value) => setOtherCurrentPage(value)}
                          color="primary"
                          shape="rounded"
                        />
                      </div>
                    )}
                  </>
                )}
            </div>
          </div>

          <aside className={styles.sidebarWrap}>
            <SidebarWrapper />
          </aside>
        </section>

        <LessonPlanModal
          open={open}
          setOpen={setOpen}
          view={view}
          setView={setView}
          formikLessonPlan={formikLessonPlan}
          handleFileUpload={handleFileUpload}
          handleSubmitFile={handleSubmitFile}
          selectedLessonToEdit={editingLessonPlan}
        />

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          onConfirm={confirmDelete}
          title="Potvrda brisanja pripreme za čas"
          description="Da li ste sigurni da želite da obrišete ovu pripremu za čas?"
        />
      </div>

      {!isLoggedIn && <RequireAuth />}
    </div>
  );
};

export default LessonPlan;
