import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  MenuItem,
  MenuList,
  Select,
  Snackbar,
  Alert,
  InputLabel,
  FormControl,
  Avatar,
} from '@mui/material';
import axios from 'axios';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SelectInput from '@mui/material/Select/SelectInput';
import Web3 from 'web3';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonIcon from '@mui/icons-material/Person';
// import { v2 as cloudinary } from 'cloudinary';
import { positions } from '@mui/system';
import { usePostLoginMutation, usePostSignUpMutation } from '../state/api';
import { setLogin, setChatID } from '../state/index';
import Admin from '../abis/Admin.json';
// import CloudUpload from '@mui/icons-material';
// import PersonIcon from '@material-ui/icons/Person';

// import ProfilePictureDropzone from '../components/Profileupload';

const AdminAddress = import.meta.env.VITE_ADMIN_CONTRACT_ADDRESS;
// import FlexBetween from '../../components/FlexBetween';
console.log(AdminAddress);
const registerSchema = Yup.object().shape({
  fullname: Yup.string().required('FullName is required'),
  location: Yup.string().required('Location is required'),
  license: Yup.string().required('License is required'),
  ethAddress: Yup.string().required('ETH wallet address is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
  role: Yup.string().required('Role is required'),
});

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const initialValuesRegister = {
  fullname: '',
  location: '',
  license: '',
  ethAddress: '',
  email: '',
  password: '',
  role: '',
};

const initialValuesLogin = {
  email: '',
  password: '',
};

// const [open, setOpen] = useState(false);

const forms = () => {
  const [currentAccount, setcurrentAccount] = useState('');
  const [pageType, setPageType] = useState('login');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery('(min-width: 600px)');
  const isLogin = pageType === 'login';
  const isRegister = pageType === 'register';
  const themeMode = localStorage.getItem('themeMode');
  const placeholderColor = themeMode === 'Dark' ? '#fff' : undefined;
  const inputTextColor = themeMode === 'Dark' ? '#fff' : undefined;
  const [triggerLogin, setTriggerLogin] = usePostLoginMutation();
  const [triggerSignup] = usePostSignUpMutation();
  // const placeholderColor = themeMode === 'Dark' ? '#fff' : '#000';
  const [registerFailSnack, setRegisterFailSnack] = useState(false);
  const [invalidCredentialsSnack, setInvalidCredentialsSnack] = useState(false);
  const [userExistsSnack, setUserExistsSnack] = useState(false);
  const [registerSuccessSnackbar, setRegisterSuccessSnackbar] = useState(false);

  const [open, setOpen] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);
  const [fieldValue, setFieldValue] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  const Dropzone = ({ setFieldValue }) => {
    const onDrop = useCallback(async (acceptedFiles) => {
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
        <Avatar sx={{ width: '100px', height: '100px', justifyContent: 'center', alignItems: 'center', borderColor: themeMode === 'Light' ? '#3c424b' : undefined, borderWidth: '1px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', marginTop: '3em', marginBottom: '-2em', cursor: 'pointer' }}>
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

  // cloudinary.config({
  //   cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  //   api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
  //   api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
  // });

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  console.log('🚀 ~ file: loginForm.jsx:122 ~ forms ~ cloudName:', cloudName);

  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
  const apiSecret = import.meta.env.VITE_APP_CLOUDINARY_API_SECRET;

  const uploadToCloudinary = async (file) => {
    try {
      // Upload the file to Cloudinary
      // const result = await cloudinary.v2.uploader.upload(file, {
      //   folder: 'profileImages',
      //   resource_type: 'auto',

      // });
      const preset = 'm9lzn6nw';
      const formData = new FormData();
      formData.append('file', file);
      formData.append('preset', preset);
      const result = await axios.post(`${import.meta.env.VITE_BASE_URL}/upload/img`, formData);
      console.log(result);

      // const result = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, file, {
      //   params: {
      //     upload_preset: 'profileImages',
      //     api_key: apiKey,
      //     api_secret: apiSecret,
      //   },
      //   headers: {
      //     'Content-Type': 'plain/text',
      //     'Access-Control-Allow-Origin': '*',

      //     // Required for CORS support to work
      //     // 'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS

      //     // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',

      // Return the Cloudinary URL of the uploaded image
    } catch (error) {
      console.error(error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  };

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert('Please install Metamask');

    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Instantiate Web3 object
        const web3 = new Web3(window.ethereum);
        // Get the current account
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        console.log(accounts[0]);
        setcurrentAccount(accounts[0]);
        console.log('Connected to wallet:', currentAccount);
        return currentAccount;
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      console.error('No web3 provider detected');
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [currentAccount]);

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install Metamask');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    setcurrentAccount(accounts[0]);
    // window.location.reload();
  };
  const Register = async (values, onSubmitProps) => {
    const { fullname, location, ethAddress, email, password, role } = values;
    const registerValues = {
      fullname, location, ethAddress, email, password, role,
    };
    console.log(registerValues.fullname);

    try {
      // Register user through external API call

      let roleNumber;
      switch (registerValues.role) {
        case 'rawMaterialSupplier':
          roleNumber = 1;
          break;
        case 'manufacturer':
          roleNumber = 3;
          break;
        case 'transporter':
          roleNumber = 2;
          break;
        case 'distributor':
          roleNumber = 4;
          break;
        case 'pharmacist':
          roleNumber = 5;
          break;
        default:
          roleNumber = 0; // set to 0 if role is not recognized
      }
      const web3 = new Web3(window.ethereum);

      const adminContract = new web3.eth.Contract(Admin.abi, AdminAddress);

      const contractData = await adminContract.methods.registerUser(registerValues.ethAddress, registerValues.fullname, registerValues.location, roleNumber).send({ from: currentAccount });
      console.log(contractData);
      console.log('User registered on the blockchain:', contractData);

      console.log(registerValues.location);

      setPageType('login');
        <Snackbar autoHideDuration={6000}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Registered successfully. Please login.
          </Alert>
        </Snackbar>;
    } catch (error) {
      console.error('Error registering user:', error);
      onSubmitProps.setSubmitting(false);
      onSubmitProps.setErrors(error);
    }

    onSubmitProps.resetForm();
  };

  const Registerx = async (values, onSubmitProps) => {
    console.log('valuest at registerx function to check 500 bad', values);
    const { fullname, location, license, ethAddress, email, password, role, chatId } = values;
    const user = {
      fullname, location, license, ethAddress, email, password, picturePath: profileImage || 'https://res.cloudinary.com/daz0bajhs/image/upload/v1681034983/profpic/default-user-profile-picture_hvoncb_uho4qw.png', role, chatId,
    };
    // const registerValues = {
    //   fullname, location, ethAddress, email, password, role,
    // };
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/auth/register`,
      JSON.stringify(user),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const data = await response.JSON();
    if (data) {
      setPageType('login');
      setRegisterSuccessSnackbar(true);
      // navigate('/');
    } else {
      onSubmitProps.setSubmitting(false);
      onSubmitProps.setErrors(data.errors);
    }
    onSubmitProps.resetForm();
  };

  const Login = async (values, onSubmitProps) => {
    const { email, password } = values;
    console.log(email, password);
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/auth/login`,
      JSON.stringify({ email, password }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(response.data);
    console.log(response.status);

    if (response.data.error && response.data.error.includes('User does not exist')) {
      setOpen(true);
    } else if (response.data.error && response.data.error.includes('Invalid credentials')) {
      setOpenFailed(true);
    }

    const loggedInUser = await response.data;
    console.log('User chat ID AT REGISTERX', loggedInUser.user.chatId);
    const { fullname } = loggedInUser.user;
    const { chatId } = loggedInUser.user;
    // chat login disabled temporarily subscribition expired
    const chk = await triggerLogin({ fullname, chatId });
    // console.log('chk', chk.data.response.id);
    console.log('chk', chk.data.response);
    // triggerLogin(loggedInUser);

    onSubmitProps.resetForm();
    if (loggedInUser) {
      dispatch(setLogin({ user: loggedInUser.user, token: loggedInUser.token }));
      // dispatch(setChatID({ chatID: chk.data.response }));

      // navigate('/home');

      switch (await loggedInUser.user.role) {
        case 'rawMaterialSupplier':
          navigate('/supplierDashboard');
          break;
        case 'admin':
          navigate('/adminDashboard');
          break;
        case 'manufacturer':
          navigate('/manufacturerDashboard');
          break;
        case 'transporter':
          navigate('/transporterPickPackage');
          break;
        case 'distributor':
          navigate('/distributorDashboard');
          break;
        case 'pharmacist':
          navigate('/pharmacistDashboard');
          break;
        default:
          navigate('/');
      }

      onSubmitProps.setSubmitting(false);
      onSubmitProps.setErrors(loggedInUser.errors);
    }
  };

  // const handleChatLogin = async (values, onSubmitProps) => {
  //   const { fullname, chatId } = values;
  //   console.log('at login above', fullname, chatId);
  //   // const { fullname } = values;
  //   // const { chatId } = values;
  //   console.log('at login', fullname, chatId);
  //   triggerLogin({ fullname, chatId });
  // };

  const handleChatRegister = async (values, onSubmitProps) => {
    console.log('at handle chat register', values);
    console.log('at handle chat register', onSubmitProps);
    console.log(values.fullname, values.chatId);
    const { fullname } = values;
    const { chatId } = values;

    triggerSignup({ fullname, chatId });
  };

  const handlefunc = async (values, onSubmitProps) => {
    // handleChatRegister();
    // Registerx();
    // handleChatRegister();
    // Register();
    // console.log('both functons run at handle func');

    try {
      Registerx(values, onSubmitProps);
      handleChatRegister(values, onSubmitProps);
      await Register(values, onSubmitProps);
      setRegisterSuccessSnackbar(true);
      console.log('all functions run at handle func');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  // const handlefuncLogin = async (values, onSubmitProps) => {
  //   // handleChatRegister();
  //   // Registerx();
  //   // handleChatRegister();
  //   // Register();
  //   // console.log('both functons run at handle func');

  //   try {
  //     Login(values, onSubmitProps);
  //     handleChatLogin(values, onSubmitProps);
  //     console.log('all functions run at handle funcLogin');
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  const handleFormSubmit = async (values, onSubmitProps) => {
    console.log('values at handle form dubmit', values, values.chatId);
    try {
      if (isLogin) {
        // await Login(values, onSubmitProps);
        await Login(values, onSubmitProps);
        console.log('login run at handle form submit');
      } else if (isRegister) {
      // await handleChatRegister(values, onSubmitProps);
        await handlefunc(values, onSubmitProps);
        // commented for chat below 2 lines and remove handle func
        // await Register(values, onSubmitProps);
        // await Registerx(values, onSubmitProps);
        console.log('both functons run at handle form submit');
      }
    } catch (error) {
      console.log(error);
      console.log(error.response.data.msg);
      switch (error.response.data.msg) {
        case 'User does not exist':
          setRegisterFailSnack(true);
          break;
        case 'Invalid credentials':
          setInvalidCredentialsSnack(true);
          break;
        case 'User already exists':
          setUserExistsSnack(true);
          break;
        default:
          break;
      }

      // alert(error);
    }

    // if (isLogin) await Login(values, onSubmitProps);
    // if (isRegister) await Register(values, onSubmitProps);
    // console.log(values);
  };

  const Roles = [
    {
      v: 'rawMaterialSupplier',
      label: 'Raw Material Supplier',
    },
    {
      v: 'transporter',
      label: 'Transporter',
    },
    {
      v: 'manufacturer',
      label: 'Manufacturer',
    },
    {
      v: 'distributor',
      label: 'Distributor',
    },
    {
      v: 'pharmacist',
      label: 'Pharmacist',
    },
  ];

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      setOpen(false);
      setOpenFailed(false);
      setRegisterFailSnack(false);
      setInvalidCredentialsSnack(false);
    }
  };

  return (
    <Box>
      <Formik
        initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
        validationSchema={isLogin ? loginSchema : registerSchema}
        onSubmit={handleFormSubmit}
      >

        {
           ({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue, resetForm }) => (
             <Form>

               <Box
                 display="grid"
                 gap="30px"
                 gridTemplateColumns="repeat(4,minamax(0,1fr))"
                 sx={{ '& > div': { gridColumn: 'span 8' } }}
               >
                 {isRegister && (
                 <>

                   {/* <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
                     {profileImage ? (
                       <Avatar src={URL.createObjectURL(profileImage)} sx={{ width: 100, height: 100, cursor: 'pointer' }} onClick={() => setOpen(true)} />
                     ) : (
                       <Avatar sx={{ width: 100, height: 100, cursor: 'pointer' }} onClick={() => setOpen(true)} />
                     )}
                   </Box>
                   <Box sx={{ gridColumn: 'span 1' }}>
                     <ProfilePictureDropzone setFieldValue={setFieldValue} />
                   </Box> */}
                   <Box sx={{ justifyContent: 'center', alignItems: 'center' }}>
                     <Dropzone setFieldValue={setFieldValue} />
                   </Box>
                   <TextField
                     label="Full Name"
                     onBlur={handleBlur}
                     onChange={handleChange}
                     value={values.fullname}
                     name="fullname"
                     error={Boolean(touched.fullname) && Boolean(errors.fullname)}
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
                     sx={{ gridColumn: 'span 2' }}
                   />

                   <TextField
                     label="Location"
                     onBlur={handleBlur}
                     onChange={handleChange}
                     value={values.location}
                     name="location"
                     error={Boolean(touched.location) && Boolean(errors.location)}
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
                     sx={{ gridColumn: 'span 2' }}
                   />
                   <TextField
                     label="License Number"
                     onBlur={handleBlur}
                     onChange={handleChange}
                     value={values.license}
                     name="license"
                     error={Boolean(touched.license) && Boolean(errors.license)}
                     helperText={touched.license && errors.license}
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
                     sx={{ gridColumn: 'span 2' }}
                   />
                   <TextField
                     label="ETH Address"
                     onBlur={handleBlur}
                     onChange={handleChange}
                     value={values.ethAddress}
                     name="ethAddress"
                     error={Boolean(touched.ethAddress) && Boolean(errors.ethAddress)}
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
                     sx={{ gridColumn: 'span 2' }}
                   />

                   <TextField
                     label="Email"
                     onBlur={handleBlur}
                     onChange={handleChange}
                     value={values.email}
                     name="email"
                     error={Boolean(touched.email) && Boolean(errors.email)}
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
                     sx={{ gridColumn: 'span 2' }}
                   />

                   <TextField
                     label="Password"
                     type="Password"
                     onBlur={handleBlur}
                     onChange={handleChange}
                     value={values.password}
                     name="password"
                     error={Boolean(touched.password) && Boolean(errors.password)}
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
                     sx={{ gridColumn: 'span 2' }}
                   />

                   <TextField
                     label="Confirm Password"
                     type="Password"
                     onBlur={handleBlur}
                     onChange={handleChange}
                     value={values.chatId}
                     name="chatId"
                     error={Boolean(touched.chatId) && Boolean(errors.chatId)}
                     helperText={touched.chatId && errors.chatId}
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
                     sx={{ gridColumn: 'span 2' }}
                   />
                   {/* <InputLabel id="role-select-label">Role</InputLabel> */}
                   <FormControl fullWidth sx={{ mb: 2 }}>
                     <InputLabel sx={{ color: inputTextColor }} id="role-select-label">Role</InputLabel>
                     <Select
                       label="Role"

                    //  onBlur={handleBlur}
                       labelId="role-select-label"
                       onChange={handleChange('role')}
                       value={values.role || ''}
                       name="role"
                       error={Boolean(touched.role) && Boolean(errors.role)}
                       helperText={touched.role && errors.role}
                       sx={{ gridColumn: 'span 2', color: inputTextColor, '& .MuiSelect-select:focus': { backgroundColor: 'transparent' } }}
                       fullWidth
                     >
                       {Roles.map((option) => (
                         <MenuItem key={option.v} value={option.v}>
                           {option.label}
                         </MenuItem>
                       ))}
                     </Select>
                   </FormControl>

                 </>
                 )}
                 {isLogin && (
                 <>
                   <TextField
                     label="Email"
                     onBlur={handleBlur}
                     onChange={handleChange}
                     value={values.email}
                     name="email"
                     error={Boolean(touched.email) && Boolean(errors.email)}
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
                     sx={{ gridColumn: 'span 2' }}
                   />

                   <TextField
                     label="Password"
                     type="Password"
                     onBlur={handleBlur}
                     onChange={handleChange}
                     value={values.password}
                     name="password"
                     error={Boolean(touched.password) && Boolean(errors.password)}
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
                     sx={{ gridColumn: 'span 2' }}
                   />
                 </>
                 )}
               </Box>

               {/* BUTTONS */}
               <Box>
                 <Button
                   variant="contained"
                   type="submit"
                   sx={{ m: '2rem 0', p: '1rem', width: '50%' }}
                   disabled={isSubmitting}
                  //  onClick={isLogin ? () => {} : handlefunc}
                  //  onClick={handleFormSubmit}
                 >
                   {isLogin ? 'LOGIN' : 'REGISTER'}
                 </Button>
                 <Typography
                   onClick={() => {
                     setPageType(isLogin ? 'register' : 'login');
                     resetForm();
                   }}
                   sx={{ cursor: 'pointer', textDecoration: 'underline', color: placeholderColor }}
                 >
                   {isLogin ? "Don't have an account? Sign Up here." : 'Already have an account? Login here'}

                 </Typography>

               </Box>
             </Form>
           )
}

      </Formik>

      <Snackbar open={registerFailSnack} autoHideDuration={5000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity="error" sx={{ width: '100%' }}>
          User does not exist Please Register!
        </Alert>
      </Snackbar>
      <Snackbar open={invalidCredentialsSnack} autoHideDuration={5000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity="error" sx={{ width: '100%' }}>
          Password is incorrect!
        </Alert>
      </Snackbar>
      <Snackbar open={userExistsSnack} autoHideDuration={5000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity="error" sx={{ width: '100%' }}>
          Email is already registered!
        </Alert>
      </Snackbar>
      <Snackbar open={registerSuccessSnackbar} autoHideDuration={5000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
          Registered Successfully please login!
        </Alert>
      </Snackbar>

    </Box>

  );
};

export default forms;

