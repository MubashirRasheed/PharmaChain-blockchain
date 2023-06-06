/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import { Formik, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import { json } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import Web3 from 'web3';
// import MedCycle from '../../abis/MedCycle.json';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  deliveryTime: Yup.date().required('Delivery time is required').min(new Date(), 'Delivery time must be in future'),
});

const PostJob = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentAccount, setcurrentAccount] = useState('');
  const themeMode = localStorage.getItem('themeMode');
  const isNonMobile = useMediaQuery('(min-width: 1000px)');
  const theme = useTheme();
  const textColor = themeMode === 'Dark' ? 'white' : 'black';
  const backgroundColor = themeMode === 'Dark' ? '#1c2d38' : 'white';
  const placeholderColor = themeMode === 'Dark' ? '#fff' : undefined;
  const inputTextColor = themeMode === 'Dark' ? '#fff' : undefined;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  //   console.log(tomorrow.toISOString());
  const [dvalue, setValues] = useState(null);
  const token = useSelector((state) => state.token);
  console.log(token);

  const handleDateChange = (newValue) => {
    setValues(newValue);
  };
  //   console.log(dvalue.$d.toDateString());
  //    const finalDate =
  if (dvalue && dvalue.$d && typeof dvalue.$d.toISOString === 'function') {
    console.log(dvalue.$d.toGMTString());
  } else {
    console.log(dvalue);
  }
  //   console.log(dvalue.$d.toISOString());
  //   console.log(dvalue.$d.toGMTString());

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
    //   console.log(values);
      const data = { ...values, deliveryTime: dvalue.$d.toGMTString() };
      const { title, description, price, deliveryTime } = values;
      console.log(data);

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/job-post/Post`, data, {
        headers: {
          'x-auth-token': token,
        },
      });
      console.log(response);

      console.log(dvalue.$d.toISOString());
    } catch (error) {
      setErrors({ submit: error.message });
      console.log(error);
    }

    setSubmitting(false);
  };

  return (

    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" marginTop="5%" marginBottom="5%">
      <Box width="50%" p="2rem" borderRadius="1.5rem" boxShadow={theme.shadows[4]} sx={{ backgroundColor }}>
        <Box textAlign="center">
          <Typography fontWeight="500" variant="h5" sx={{ mb: '1.5rem' }} fontSize="24px" color={textColor}>Post Job</Typography>

          <Formik
            initialValues={{

              title: '',
              description: '',
              price: '',
              deliveryTime: '',

            }}
            // validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (

              <Form>
                <Box
                  display="grid"
                  gap="30px"
                //   gridTemplateColumns="repeat(4,minamax(0,1fr))"
                  sx={{ '& > div': { gridColumn: 'span 4' } }}
                >
                  <TextField
                    fullWidth
                    id="title"
                    name="title"
                    label="Title"
                    value={values.title}
                    onChange={handleChange}
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                    InputProps={{
                      style: {
                        color: inputTextColor,
                      },
                    }}
                    InputLabelProps={{
                      style: {
                        color: placeholderColor,
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    value={values.description}
                    onChange={handleChange}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                    InputProps={{
                      style: {
                        color: inputTextColor,
                      },
                    }}
                    InputLabelProps={{
                      style: {
                        color: placeholderColor,
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    id="price"
                    name="price"
                    label="Price"
                    value={values.price}
                    onChange={handleChange}
                    error={touched.price && Boolean(errors.price)}
                    helperText={touched.price && errors.price}
                    InputProps={{
                      style: {
                        color: inputTextColor,
                      },
                    }}
                    InputLabelProps={{
                      style: {
                        color: placeholderColor,
                      },
                    }}
                  />
                  <DatePicker
                    fullWidth
                    id="deliveryTime"
                    name="deliveryTime"
                    label="Delivery Time"
                    value={dvalue}
                    onChange={handleDateChange}
                    // defaultValue={tomorrow.toISOString()}
                    // label="Delivery Time"
                    // value={dvalue}
                    // // eslint-disable-next-line no-param-reassign
                    // onChange={handleDateChange}
                    // renderInput={(params) => <TextField {...params} />}
                    sx={{ '& .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root': { color: inputTextColor } }}

                  />

                  <Box display="flex" justifyContent="center" alignItems="center" marginTop="2rem">
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      sx={{ width: '40%' }}
                    >
                      Create
                    </Button>
                  </Box>
                  <ErrorMessage name="errorMessage" component="div" />
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default PostJob;
