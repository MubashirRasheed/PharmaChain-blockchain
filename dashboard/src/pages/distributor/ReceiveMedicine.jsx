/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import { Box, Button, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import * as Yup from 'yup';
import Medicine from '../../abis/Medicine.json';

const ReceiveMedicine = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentAccount, setcurrentAccount] = useState('');
  const themeMode = localStorage.getItem('themeMode');
  const isNonMobile = useMediaQuery('(min-width: 1000px)');
  const theme = useTheme();
  const textColor = themeMode === 'Dark' ? 'white' : 'black';
  const backgroundColor = themeMode === 'Dark' ? '#1c2d38' : 'white';

  const validationSchema = Yup.object().shape({
    batchId: Yup.string().required('Required'),
    retailer: Yup.string().required('Required'),
  });

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

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const web3 = new Web3(window.ethereum);
      const medicine = await new web3.eth.Contract(
        Medicine.abi,
        values.batchId,
      );
      await medicine.methods
        .receivePackageDistributor(values.retailer)
        .send({ from: currentAccount });
      console.log('Received Package Successfully!!!!');
    } catch (err) {
      setErrors({ errorMessage: err.message });
      console.log('Error in receiving package:', err.message);
    }
    setSubmitting(false);

    // try {
    //   setLoading(true);
    //   setErrorMessage('');
    //   const web3 = new Web3(window.ethereum);
    //   // const accounts = await web3.eth.getAccounts();
    //   const networkId = await web3.eth.net.getId();
    //   const MedCycleData = await MedCycle.networks[networkId];
    //   if (MedCycleData) {
    //     const medCycle = await new web3.eth.Contract(
    //       MedCycle.abi,
    //       MedCycleData.address,
    //     );
    //     try {
    //       const {
    //         description,
    //         rawmaterialaddress,
    //         quantity,
    //         shipper,
    //         distributor,
    //       } = values;
    //       await medCycle.methods
    //         .manufactureMedicine(
    //           description,
    //           rawmaterialaddress,
    //           quantity,
    //           shipper,
    //           distributor,
    //         )
    //         .send({ from: currentAccount });
    //       setErrorMessage('');
    //       setLoading(false);
    //     } catch (err) {
    //       setErrorMessage(err.message);
    //       setLoading(false);
    //     }
    //   } else {
    //     setErrorMessage('The Supplier Contract does not exist on this network!');
    //     setLoading(false);
    //   }
    // } catch (err) {
    //   setErrorMessage(err.message);
    //   setLoading(false);
    // }
    // setSubmitting(false);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="50vh" marginTop="10%" marginBottom="10%">
      <Box width="50%" p="2rem" borderRadius="1.5rem" boxShadow={theme.shadows[4]} sx={{ backgroundColor }}>
        <Box textAlign="center">
          <Typography fontWeight="500" variant="h5" sx={{ mb: '1.5rem' }} fontSize="24px" color={textColor}>Receive Medicine</Typography>

          <Formik
            initialValues={{
              batchId: '',
              retailer: '',
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
                    id="batchId"
                    name="batchId"
                    label="Batch ID"
                    value={values.batchId}
                    onChange={handleChange}
                    error={touched.batchId && Boolean(errors.batchId)}
                    helperText={touched.batchId && errors.batchId}
                  />
                  <TextField
                    fullWidth
                    id="retailer"
                    name="retailer"
                    label="Pharmacist"
                    value={values.retailer}
                    onChange={handleChange}
                    error={touched.retailer && Boolean(errors.retailer)}
                    helperText={touched.retailer && errors.retailer}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ marginTop: '20px' }}
                  >
                    Receive
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

export default ReceiveMedicine;
