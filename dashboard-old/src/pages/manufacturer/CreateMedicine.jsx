/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import { Formik, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
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
  const [currentAccount, setcurrentAccount] = useState('');
  const themeMode = localStorage.getItem('themeMode');
  const isNonMobile = useMediaQuery('(min-width: 1000px)');
  const theme = useTheme();
  const textColor = themeMode === 'Dark' ? 'white' : 'black';
  const backgroundColor = themeMode === 'Dark' ? '#1c2d38' : 'white';

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
      if (MedCycleData) {
        const medCycle = await new web3.eth.Contract(
          MedCycle.abi,
          MedCycleData.address,
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
        } catch (err) {
          setErrorMessage(err.message);
          setLoading(false);
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

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="50vh" marginTop="10%" marginBottom="10%">
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
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ marginTop: '20px' }}
                  >
                    Create
                  </Button>
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

export default CreateMedicine;
