import {
  Box,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { Formik } from "formik";
import { styled } from "@mui/material/styles";
import * as yup from "yup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Header from "../../components/Header";
import { useContext, useState } from "react";
import { MapContext } from "../../contexts/Map.context";

import React from "react";
const Report = () => {
  const [category, setCategory] = useState("War");
  const [fileURI, setFileURI] = useState();

  const { markers, updateMarkers } = useContext(MapContext);

  const handleFormSubmit = (values) => {
    const updatedValues = {
      ...values,
      latitude: 54.6943,
      longitude: 25.2836,
      img: fileURI,
      category: category,
    };
    updateMarkers(updatedValues)

    setCategory("War")
    setFileURI(null)
    values.description = ""
    values.location = ""
    
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURI = URL.createObjectURL(file);
      setFileURI(fileURI);
    }
  };

  const handleCategory = (event) => {
    setCategory(event.target.value);
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <Box display="grid" gap="30px" m="20px">
      <Header title="Add Report" subtitle="Create a New Report" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="30px">
              <FormControl variant="filled" fullWidth>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={category}
                  label="category"
                  onChange={handleCategory}
                  error={!!touched.category && !!errors.category}
                  displayEmpty
                >
                  <MenuItem value={"War"}>War</MenuItem>
                  <MenuItem value={"Shelter"}>Shelter</MenuItem>
                  <MenuItem value={"Help"}>Help</MenuItem>
                  <MenuItem value={"Medical Help"}>Medical Help</MenuItem>
                </Select>
              </FormControl>
              <TextField
                multiline
                variant="filled"
                type="text"
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
              />
              <TextField
                multiline
                variant="filled"
                type="text"
                label="Location"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.location}
                name="location"
                error={!!touched.location && !!errors.location}
                helperText={touched.location && errors.location}
              />
              <Button
                component="label"
                variant="outlined"
                color="secondary"
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <VisuallyHiddenInput type="file" />
              </Button>
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                onSubmit={handleFormSubmit}
              >
                Create
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  description: yup.string().required("required"),
  location: yup.string().required("required"),
});

const initialValues = {
  description: "",
  location: "",
};

export default Report;
