/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, Button, Card, FormControl, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useFormik, Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Web3 from 'web3';
import MedCycle from '../../abis/MedCycle.json';

const UpdateStatus = () => {
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
    status: Yup.string().required('Required'),
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

  const handleSubmit = async (values, { setSubmitting }) => {
    const { batchId, status } = values;

    try {
      // const accounts = await web3.eth.getAccounts();
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const MedCycleData = await MedCycle.networks[networkId];
      if (networkId) {
        const medCycle = await new web3.eth.Contract(MedCycle.abi, '0x4B730a1257122014Aa1cF93079020c1f4EB124CC');
        await medCycle.methods.updateSaleStatus(batchId, status).send({ from: currentAccount });
        console.log('Status Updated Successfully!!!!!');
      } else {
        console.log('MedCycle contract does not exist on this network!!!');
      }
    } catch (err) {
      console.log(err.message);
    }

    setSubmitting(false);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="50vh" marginTop="10%" marginBottom="10%">
      <Box width="50%" p="2rem" borderRadius="1.5rem" boxShadow={theme.shadows[4]} sx={{ backgroundColor }}>
        <Box textAlign="center">
          <Typography fontWeight="500" variant="h5" sx={{ mb: '1.5rem' }} fontSize="24px" color={textColor}>Receive Medicine</Typography>

          <Formik
            initialValues={{
              batchId: '',
              status: '',
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
                    label="Medicine Address"
                    value={values.batchId}
                    onChange={handleChange}
                    error={touched.batchId && Boolean(errors.batchId)}
                    helperText={touched.batchId && errors.batchId}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="status-label">Update Status</InputLabel>
                    <Select
                      fullWidth
                      labelId="status-label"
                      id="status"
                      name="status"
                      label="Update Status"
                      value={values.status}
                      onChange={handleChange}
                      error={touched.status && Boolean(errors.status)}
                      helperText={touched.status && errors.status}
                    >
                      <MenuItem value={0}>Not Found</MenuItem>
                      <MenuItem value={1}>At Pharmacy</MenuItem>
                      <MenuItem value={2}>Sold</MenuItem>
                      <MenuItem value={3}>Expired</MenuItem>
                      <MenuItem value={4}>Damaged</MenuItem>
                    </Select>
                  </FormControl>
                  {errors.formSubmit && (
                  <Box sx={{ marginBottom: '1rem' }}>
                    <p style={{ color: 'red' }}>{errors.formSubmit}</p>
                  </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Update Status
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

export default UpdateStatus;
