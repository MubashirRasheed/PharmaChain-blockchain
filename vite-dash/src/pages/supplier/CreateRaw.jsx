/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

import { Alert, Box, Button, Container, Snackbar, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Web3 from 'web3';
import Supplier from '../../abis/Supplier.json';

const validationSchema = Yup.object().shape({
  description: Yup.string().required('Description is required'),
  ownerName: Yup.string().required('Owner name is required'),
  location: Yup.string().required('Location is required'),
  quantity: Yup.number()
    .typeError('Quantity must be a number')
    .required('Quantity is required'),
  shipper: Yup.string().required('Transporter is required'),
  manufacturer: Yup.string().required('Manufacturer is required'),
});

const CreateRaw = () => {
  const [currentAccount, setcurrentAccount] = useState('');
  const [rawSuccessSnack, setRawSuccessSnack] = useState(false);
  const [rawFailSnack, setRawFailSnack] = useState(false);
  const themeMode = localStorage.getItem('themeMode');
  const isNonMobile = useMediaQuery('(min-width: 1000px)');
  const theme = useTheme();
  const textColor = themeMode === 'Dark' ? 'white' : 'black';
  const backgroundColor = themeMode === 'Dark' ? '#1c2d38' : 'white';
  const placeholderColor = themeMode === 'Dark' ? '#fff' : undefined;
  const inputTextColor = themeMode === 'Dark' ? '#fff' : undefined;

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
    // const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    // setcurrentAccount(accounts[0]);
    // window.location.reload();

  //   if (c.length) {
  //     setcurrentAccount(accounts[0]);
  //   } else {
  //     console.log('No account found');
  //   }
  // };
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [currentAccount]);
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const SupplierData = await Supplier.networks[networkId];
      if (SupplierData) {
        const supplier = await new web3.eth.Contract(
          Supplier.abi,
          SupplierData.address,
        );
        await supplier.methods
          .createRawPackage(
            values.description,
            values.ownerName,
            values.location,
            values.quantity,
            values.shipper,
            values.manufacturer,
          )
          .send({ from: currentAccount });
        console.log('Successfully created a new package!!');
        setRawSuccessSnack(true);
      }
    } catch (err) {
      setErrors({ errorMessage: err.message });
      setRawFailSnack(true);
    }
    setSubmitting(false);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setRawSuccessSnack(false);
    setRawFailSnack(false);
  };

  return (
  // <Container maxWidth="sm" sx={{ marginTop: '20px' }}>

    //   <Box
    //     sx={{
    //       display: 'flex',
    //       flexDirection: 'column',
    //       alignItems: 'center',
    //     }}
    //   >
    <Box sx={{ padding: '7em', marginBottom: '10%', marginTop: '3%' }}>
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh" marginTop="10%" marginBottom="10%">
        <Box width="50%" p="2rem" borderRadius="1.5rem" boxShadow={theme.shadows[4]} sx={{ backgroundColor }}>
          <Box textAlign="center">
            <Typography fontWeight="500" variant="h5" sx={{ mb: '1.5rem' }} fontSize="24px" color={textColor}>Create Raw Package</Typography>

            <Formik
              initialValues={{
                description: '',
                ownerName: '',
                location: '',
                quantity: '',
                shipper: '',
                manufacturer: '',
              }}
              validationSchema={validationSchema}
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
                      id="ownerName"
                      name="ownerName"
                      label="Name"
                      value={values.ownerName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.ownerName && Boolean(errors.ownerName)}
                      helperText={touched.ownerName && errors.ownerName}
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
                      id="location"
                      name="location"
                      label="Location"
                      value={values.location}
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                    />
                    <TextField
                      id="description"
                      name="description"
                      label="Description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                      id="quantity"
                      name="quantity"
                      label="Quantity"
                      value={values.quantity}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.quantity && Boolean(errors.quantity)}
                      helperText={touched.quantity && errors.quantity}
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
                      id="shipper"
                      name="shipper"
                      label="Transporter"
                      value={values.shipper}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.shipper && Boolean(errors.shipper)}
                      helperText={touched.shipper && errors.shipper}
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
                      id="manufacturer"
                      name="manufacturer"
                      label="Manufacturer"
                      value={values.manufacturer}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.manufacturer && Boolean(errors.manufacturer)}
                      helperText={touched.manufacturer && errors.manufacturer}
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
                    <Box>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{ marginTop: '20px', width: '40%', justifyContent: 'center', alignItems: 'center' }}
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
      <Snackbar open={rawSuccessSnack} autoHideDuration={5000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
          Raw Material Package Created Successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={rawFailSnack} autoHideDuration={5000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity="error" sx={{ width: '100%' }}>
          Raw Material Package Creation Failed!
        </Alert>
      </Snackbar>
    </Box>

  );
};

export default CreateRaw;

