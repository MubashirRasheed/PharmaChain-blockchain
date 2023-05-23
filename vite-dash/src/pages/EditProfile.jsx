import React, { useState } from 'react';
import { Form, Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { Avatar, Button, TextField, Box, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import { setLogin, setUpdateUser } from '../state';

const validationSchema = Yup.object().shape({
  fullname: Yup.string().required('Full Name is required'),
  location: Yup.string().required('Location is required'),
  password: Yup.string().required('Password is required'),
  email: Yup.string().email('Email is invalid').required('Email is required'),
});

const EditProfile = () => {
  const user = useSelector((state) => state.user);
  const [profileImage, setProfileImage] = useState(user.picturePath);
  const [fileUrl, setFileUrl] = useState(user.picturePath);
  const themeMode = localStorage.getItem('themeMode');
  const placeholderColor = themeMode === 'Dark' ? '#fff' : undefined;
  const inputTextColor = themeMode === 'Dark' ? '#fff' : undefined;
  const disabledTextColor = themeMode === 'Dark' ? '#fff0f082' : undefined;

  const theme = useTheme();
  const textColor = themeMode === 'Dark' ? 'white' : 'black';
  const backgroundColor = themeMode === 'Dark' ? '#1c2d38' : 'white';

  const initialValues = {
    fullname: user.fullname || '',
    location: user.location || '',
    ethAddress: user.ethAddress || '',
    password: '',
    email: user.email || '',
    role: user.role || '',
  };

  const updateSchema = Yup.object().shape({
    fullname: Yup.string().required('Full Name is required'),
    location: Yup.string().required('Location is required'),
    password: Yup.string().required('Password is required'),
    email: Yup.string().required('Email is required'),
  });

  const users = useSelector((state) => state.user);
  const chatID = useSelector((state) => state.chatID);
  console.log('user redux', users);
  console.log('chat redux', chatID);
  console.log('chat redux', chatID.chatID.id);
  const dispatch = useDispatch();

  const handleFormSubmit = async (values) => {
    console.log(values);
    const { fullname, location, ethAddress, email, role, password } = values;
    const data = {
      fullname,
      location,
      ethAddress,
      picturePath: profileImage,
      role,
      email,
      password,
    };
    console.log(data);
    console.log(user._id);
    const id = user._id;
    console.log('chat redux', chatID.chatID.id);
    const userChatID = chatID.chatID.id;

    try {
      const response = await axios.post(`http://localhost:9002/auth/updateProfile/${id}`, data);
      console.log('update response', response);
      // dispatch(user(response.data));
      // dispatch(setUpdateUser({ user: response.data }));

      const { fullname, chatId } = response.data;
      console.log(fullname, chatId);
      const chatUpdate = await axios.patch(`https://api.chatengine.io/users/${userChatID}/`, {
        username: fullname,
        secret: chatId,
      }, {
        headers: {
          'Private-Key': import.meta.env.VITE_PRIVATE_KEY,
        },
      });
      console.log(chatUpdate);
    } catch (error) {
      console.log(error);
    }
  };

  // const response = await axios.post('http://localhost:5000/api/users/update', data);
  // console.log(response);

  const Dropzone = ({ setFieldValue }) => {
    const onDrop = React.useCallback(async (acceptedFiles) => {
      // Do something with the files
      console.log(acceptedFiles[0]);
      // eslint-disable-next-line no-use-before-define
      // const uploadedImage = await uploadToCloudinary(acceptedFiles[0]);
      const preset = 'm9lzn6nw';
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      formData.append('preset', 'm9lzn6nw');
      const results = await axios.post('https://api.cloudinary.com/v1_1/daz0bajhs/image/upload', formData, {
        params: {
          upload_preset: 'm9lzn6nw',
        },
      });

      console.log(results);
      console.log(results.data.secure_url);
      setProfileImage(results.data.secure_url);

      setFieldValue('file', acceptedFiles[0]);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    }, [setFieldValue]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
      <div {...getRootProps()} sx={{ gridColumn: 'span 1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <input {...getInputProps()} />
        <Avatar sx={{ width: '100px', height: '100px', justifyContent: 'center', alignItems: 'center', borderWidth: '1px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', marginTop: '3em', marginBottom: '-2em', cursor: 'pointer' }}>
          {fileUrl ? <img src={fileUrl} alt="file preview" /> : isDragActive ? <CloudUploadIcon color="primary" sx={{ fontSize: '3rem' }} />
            : (
              <div sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <PersonIcon sx={{ fontSize: '3rem' }} />
                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                  Upload Here
                </Typography>
              </div>
            )}
        </Avatar>
      </div>
    );
  };

  return (

    <Box display="flex" justifyContent="center" alignItems="center" padding="5em" height="100%">
      <Box width="80%" p="2rem" borderRadius="1.5rem" boxShadow={theme.shadows[4]} sx={{ backgroundColor }}>
        <Box textAlign="center">
          <Typography fontWeight="500" variant="h5" sx={{ mb: '1.5rem' }} fontSize="24px" color={textColor}>Update Profile</Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={updateSchema}
            onSubmit={handleFormSubmit}
          >
            {
       ({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue, resetForm }) => (

         <Form>

           <Box sx={{ mb: 2 }}>
             <Dropzone setFieldValue={setFieldValue} />

           </Box>
           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

             <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
               <TextField
                 name="fullname"
                 label="Full Name"
                 variant="outlined"
                 margin="normal"
                 value={values.fullname}
                 onChange={handleChange}
                 error={touched.fullname && Boolean(errors.fullname)}
                 helperText={touched.fullname && errors.fullname}
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
                 sx={{ width: '45%' }}
               />
               <TextField
                 name="location"
                 label="Location"
                 variant="outlined"
                 margin="normal"
                 value={values.location}
                 onChange={handleChange}
                 error={touched.location && Boolean(errors.location)}
                 helperText={touched.location && errors.location}
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
                 sx={{ width: '45%' }}
               />
             </Box>

             <TextField
               name="ethAddress"
               label="ETH Address"
               variant="outlined"
               disabled
               margin="normal"
               value={values.ethAddress}
               onChange={handleChange}
               error={touched.ethAddress && Boolean(errors.ethAddress)}
               helperText={touched.ethAddress && errors.ethAddress}
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
               sx={{ width: '100%', '& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled': { WebkitTextFillColor: disabledTextColor } }}
             />
             <TextField
               name="email"
               label="Email"
               variant="outlined"
               margin="normal"
               value={values.email}
               onChange={handleChange}
               error={touched.email && Boolean(errors.email)}
               helperText={touched.email && errors.email}
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
               sx={{ width: '100%' }}
             />
             <TextField
               name="password"
               label="Password"
               variant="outlined"
               margin="normal"
               value={values.password}
               onChange={handleChange}
               error={touched.password && Boolean(errors.password)}
               helperText={touched.password && errors.password}
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
               sx={{ width: '100%' }}
             />
             <TextField
               name="role"
               label="Role"
               disabled
               variant="outlined"
               margin="normal"
               value={values.role}
               onChange={handleChange}
               error={touched.role && Boolean(errors.role)}
               helperText={touched.role && errors.role}
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
               sx={{ width: '100%', '& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled': { WebkitTextFillColor: disabledTextColor } }}
             />

             <Button
               type="submit"
               variant="contained"
               sx={{ mt: 2 }}
             >
               Update Profile
             </Button>
           </Box>
         </Form>
       )
}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default EditProfile;
