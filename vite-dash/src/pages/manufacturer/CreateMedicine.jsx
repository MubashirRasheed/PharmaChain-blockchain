/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import { Formik, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { Alert, Box, Button, Snackbar, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import Web3 from 'web3';
import MedCycle from '../../abis/MedCycle.json';

const validationSchema = Yup.object().shape({
  description: Yup.string().required('Description is required'),
  rawmaterialaddress: Yup.string().required('Raw Material Address is required'),
  quantity: Yup.string().required('Quantity is required'),
  shipper: Yup.string().required('Transporter is required'),
  distributor: Yup.string().required('Distributor is required'),
});

const CreateMedicine = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [medicineSuccessSnack, setMedicineSuccessSnack] = useState(false);
  const [medicineFailSnack, setMedicineFailSnack] = useState(false);
  const [currentAccount, setcurrentAccount] = useState('');
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
      setLoading(true);
      setErrorMessage('');
      const web3 = new Web3(window.ethereum);
      // const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const MedCycleData = await MedCycle.networks[networkId];
      if (networkId) {
        const medCycle = await new web3.eth.Contract(
          MedCycle.abi,
          '0x4B730a1257122014Aa1cF93079020c1f4EB124CC',
        );
        try {
          const {
            description,
            rawmaterialaddress,
            quantity,
            shipper,
            distributor,
          } = values;
          await medCycle.methods
            .manufactureMedicine(
              description,
              rawmaterialaddress,
              quantity,
              shipper,
              distributor,
            )
            .send({ from: currentAccount });
          setErrorMessage('');
          setLoading(false);
          setMedicineSuccessSnack(true);
        } catch (err) {
          setErrorMessage(err.message);
          setLoading(false);
          setMedicineFailSnack(true);
        }
      } else {
        setErrorMessage('The Supplier Contract does not exist on this network!');
        setLoading(false);
      }
    } catch (err) {
      setErrorMessage(err.message);
      setLoading(false);
    }
    setSubmitting(false);
  };
  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMedicineSuccessSnack(false);
    setMedicineFailSnack(false);
  };

  return (

    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" marginTop="5%" marginBottom="5%">
      <Box width="50%" p="2rem" borderRadius="1.5rem" boxShadow={theme.shadows[4]} sx={{ backgroundColor }}>
        <Box textAlign="center">
          <Typography fontWeight="500" variant="h5" sx={{ mb: '1.5rem' }} fontSize="24px" color={textColor}>Create Medicine</Typography>

          <Formik
            initialValues={{
              description: '',
              rawmaterialaddress: '',
              quantity: '',
              shipper: '',
              distributor: '',
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
                    id="quantity"
                    name="quantity"
                    label="Quantity"
                    value={values.quantity}
                    onChange={handleChange}
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
                    fullWidth
                    id="rawmaterialaddress"
                    name="rawmaterialaddress"
                    label="Raw Material Address"
                    value={values.rawmaterialaddress}
                    onChange={handleChange}
                    error={touched.rawmaterialaddress && Boolean(errors.rawmaterialaddress)}
                    helperText={touched.rawmaterialaddress && errors.rawmaterialaddress}
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
                    id="shipper"
                    name="shipper"
                    label="Transporter"
                    value={values.shipper}
                    onChange={handleChange}
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
                    fullWidth
                    id="distributor"
                    name="distributor"
                    label="Distributor"
                    value={values.distributor}
                    onChange={handleChange}
                    error={touched.distributor && Boolean(errors.distributor)}
                    helperText={touched.distributor && errors.distributor}
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

      <Snackbar open={medicineSuccessSnack} autoHideDuration={5000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
          Medicine Created Successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={medicineFailSnack} autoHideDuration={5000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity="error" sx={{ width: '100%' }}>
          Medicine Creation Failed! Make sure Raw material address is correct.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateMedicine;
