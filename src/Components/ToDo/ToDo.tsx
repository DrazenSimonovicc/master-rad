"use client";
import React, { FC, useState } from "react";
import { useFetchToDo } from "@/Hooks/getToDo";
import axios from "axios";
import { CalendarActivityCard } from "@/Components/Card/CalendarActivityCard/CalendarActivityCard";
import { Modal } from "@/Components/Modal";
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "@/app/page.module.scss";

// ToDo component
//TODO:
//srediti kako ce da izgleda kartica
//dizajn kartice
//proveriti edit
//srediti tipove za formik
//videti da li isti tipovi mogu da se koriste ovde i u kartici
//da li itemi iz dropdowna da value da se pise ovako ili da se promeni na item 1,item 2 itd...

export const ToDo: FC = () => {
  const { toDo, updateToDo, error, loading } = useFetchToDo();
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  // Validation schema with Yup
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    date: Yup.string().required("Date is required"),
    activity_status: Yup.string().required("Activity status is required"),
    category: Yup.string().required("Category is required"),
    image: Yup.mixed().nullable(), // For handling the image upload
  });

  const handleSubmit = async (values: any) => {
    const {
      title,
      description,
      date,
      priority,
      activity_status,
      category,
      file,
      image,
    } = values;

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date", date);
      formData.append("priority", priority.toString());
      formData.append("activity_status", activity_status);
      formData.append("category", category);
      if (file) formData.append("file", file);
      if (image) formData.append("image", image); // Add image to form data

      const response = await axios.post(
        "http://127.0.0.1:8090/api/collections/todo/records",
        formData,
      );

      updateToDo(response.data);
      setOpen(false); // Close the modal after submission
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  //TODO:ne radi, ne daje nove elemente iz todoa kada se obrise

  const handleDelete = async (id: string) => {
    try {
      // Delete the to-do item from PocketBase
      await axios.delete(
        `http://127.0.0.1:8090/api/collections/todo/records/${id}`,
      );

      // Update the to-do list by filtering out the deleted item
      // Use updateToDo to replace the to-do list with the updated one
      updateToDo((prevToDo) => prevToDo.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Handle edit
  const handleEdit = (id: string) => {
    const item = toDo.find((todo) => todo.id === id);
    if (item) {
      setEditItem(item);
      setOpen(true);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log(toDo, "todo");

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          cursor: "pointer",
        }}
      >
        {toDo.map((a, index) => (
          <CalendarActivityCard
            key={index}
            id={a.id}
            title={a.title}
            description={a.description}
            time={a.created}
            date={a.date}
            activity_status={a.activity_status}
            category={a.category}
            priority={a.priority}
            hasAttachment={a.file && a.file !== undefined}
            image={a.image} // Pass the image to the CalendarActivityCard component
            onEdit={handleEdit} // Pass edit handler
            onDelete={handleDelete} // Pass delete handler
          />
        ))}
      </div>

      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        color="primary"
        className={styles.openModalButton}
      >
        Open Edit Modal
      </Button>

      <Modal
        title="Edit Item"
        isOpen={open}
        setIsOpen={setOpen}
        description="This is the edit modal description"
        theme={"halfScreen"}
      >
        <Formik
          enableReinitialize={true} // This tells Formik to reinitialize the form when the values change
          initialValues={{
            title: editItem?.title || "",
            description: editItem?.description || "",
            date: editItem?.date || "",
            priority: editItem?.priority || false,
            activity_status: editItem?.activity_status || "",
            category: editItem?.category || "",
            file: null,
            image: null, // Initialize image field as null
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <FormControl fullWidth margin="normal">
                <Field
                  name="title"
                  label="Enter title"
                  as={TextField}
                  fullWidth
                  helperText={<ErrorMessage name="title" />}
                />
              </FormControl>

              <FormControl fullWidth margin="normal">
                <Field
                  name="description"
                  label="Enter description"
                  as={TextField}
                  fullWidth
                  helperText={<ErrorMessage name="description" />}
                />
              </FormControl>

              <FormControl fullWidth margin="normal">
                <Field
                  name="date"
                  label="Pick a date"
                  type="date"
                  as={TextField}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  helperText={<ErrorMessage name="date" />}
                />
              </FormControl>

              <FormControlLabel
                control={
                  <Field name="priority" type="checkbox" as={Checkbox} />
                }
                label="Mark as priority"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Field as={Select} name="category" fullWidth>
                  <MenuItem value={"Edukacija i Profesionalni razvoj"}>
                    Edukacija i Profesionalni razvoj
                  </MenuItem>
                  <MenuItem value={"Sastanci"}>Sastanci</MenuItem>
                  <MenuItem value={"Učenje i Nastava"}>
                    Učenje i Nastava
                  </MenuItem>
                  <MenuItem value={"Organizacija i Upravljanje"}>
                    Organizacija i Upravljanje
                  </MenuItem>
                  <MenuItem value={"Učenici i Nastavnici"}>
                    Učenici i Nastavnici
                  </MenuItem>
                  <MenuItem value={"Vanškolske aktivnosti"}>
                    Vanškolske aktivnosti
                  </MenuItem>
                  <MenuItem value={"Stručni rad i istraživanje"}>
                    Stručni rad i istraživanje
                  </MenuItem>
                  <MenuItem value={"Obavezne aktivnosti i Zakonodavne obaveze"}>
                    Obavezne aktivnosti i Zakonodavne obaveze
                  </MenuItem>
                  <MenuItem value={"Podrška i Dobrobit"}>
                    Podrška i Dobrobit
                  </MenuItem>
                  <MenuItem value={"Infrastruktura i Održavanje"}>
                    Infrastruktura i Održavanje
                  </MenuItem>
                  <MenuItem value={"Interni i Eksterni audit"}>
                    Interni i Eksterni audit
                  </MenuItem>
                  <MenuItem value={"Mreža i komunikacija"}>
                    Mreža i komunikacija
                  </MenuItem>
                </Field>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Activity status</InputLabel>
                <Field as={Select} name="activity_status" fullWidth>
                  <MenuItem value={"aktivna"}>aktivna</MenuItem>
                  <MenuItem value={"predstojeća"}>predstojeća</MenuItem>
                  <MenuItem value={"završena"}>završena</MenuItem>
                </Field>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="file-upload">Upload File</InputLabel>
                <input
                  type="file"
                  id="file-upload"
                  onChange={(event: any) => {
                    setFieldValue("file", event.currentTarget.files[0]);
                  }}
                />
              </FormControl>

              {/* Image Upload */}
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="image-upload">Upload Image</InputLabel>
                <input
                  type="file"
                  id="image-upload"
                  onChange={(event: any) => {
                    setFieldValue("image", event.currentTarget.files[0]);
                  }}
                />
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};
