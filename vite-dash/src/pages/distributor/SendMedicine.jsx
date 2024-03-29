/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */

import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, styled, FormControl, TableContainer, Table, TableHead, TableRow, TableCell, Typography, Paper, TableBody, useMediaQuery, useTheme, Box, Snackbar, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Web3 from 'web3';
import MedCycle from '../../abis/MedCycle.json';
import Distributor from '../../abis/Distributor.json';
import Medicine from '../../abis/Medicine.json';
import RawMaterial from '../../abis/RawMaterial.json';

const validationSchema = Yup.object({
  batchId: Yup.string().required('Medicine Address is required'),
  shipper: Yup.string().required('Transporter Address is required'),
  retailer: Yup.string().required('Pharmacist Address is required'),
});

const SendMedicine = () => {
//   const history = useHistory();

  const [allManuMedicineInfo, setAllManuMedicineInfo] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendSuccessSnack, setSendSuccessSnack] = useState(false);
  const [SendFailSnack, setSendFailSnack] = useState(false);
  const [currentAccount, setcurrentAccount] = useState('');
  const themeMode = localStorage.getItem('themeMode');
  const isNonMobile = useMediaQuery('(min-width: 1000px)');
  const theme = useTheme();
  const textColor = themeMode === 'Dark' ? 'white' : 'black';
  const backgroundColor = themeMode === 'Dark' ? '#1c2d38' : 'white';
  const placeholderColor = themeMode === 'Dark' ? '#fff' : undefined;
  const inputTextColor = themeMode === 'Dark' ? '#fff' : undefined;

  const location = useLocation();

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

  useEffect(() => {
    if (currentAccount) {
      fetchData();
    }
  }, [currentAccount, location]);

  const fetchData = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      // const accounts = await web3.eth.getAccounts();
      const networdId = await web3.eth.net.getId();
      const MedCycleData = MedCycle.networks[networdId];
      if (MedCycleData) {
        const medCycle = await new web3.eth.Contract(
          MedCycle.abi,
          '0x4B730a1257122014Aa1cF93079020c1f4EB124CC',
        );
        const packageCount = await medCycle.methods
          .getBatchesCountDistributorToRetailer(currentAccount)
          .call();
        const allPackages = await Promise.all(
          // eslint-disable-next-line radix
          Array(parseInt(packageCount))
            .fill()
            .map((ele, index) => medCycle.methods
              .getBatchesIdByIndexDistributorToRetailer(index, currentAccount)
              .call()),
        );

        const newAllManuMedicineInfo = await Promise.all(
          allPackages.map(async (distAddress) => {
            const distributor = await new web3.eth.Contract(
              Distributor.abi,
              distAddress,
            );
            const batchId = await distributor.methods.batchId().call();
            const medicine = await new web3.eth.Contract(
              Medicine.abi,
              batchId,
            );
            const info = await medicine.methods.getMediceInfo().call();
            const medicineStatus = await medicine.methods
              .getMedicineStatus()
              .call();

            const rawMaterial = await new web3.eth.Contract(
              RawMaterial.abi,
              info[2],
            );
            const rawinfo = await rawMaterial.methods
              .getSuppliedRawMatrials()
              .call();

            return {
              ownerAddress: info[0],
              description: info[1],
              rawmaterialAddress: info[2],
              quantity: info[3],
              transporter: info[4],
              distributor: info[5],
              medicineAddress: batchId,
              rawmaterialOwnerName: rawinfo[1],
              rawmaterialDescription: rawinfo[0],
              rawmaterialLocation: rawinfo[2],
              rawmaterialQuantity: rawinfo[3],
              rawmaterialTransporter: rawinfo[4],
              rawmaterialManufacturer: rawinfo[5],
              rawmaterialSupplier: rawinfo[6],
              distAddress,
              medicineStatus,
            };
          }),
        );

        setAllManuMedicineInfo(newAllManuMedicineInfo);
      } else {
        console.log('MedCycle contract does not exist on this network');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMedicine = async (values, { setSubmitting, setErrors }) => {
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const networdId = await web3.eth.net.getId();
      const MedCycleData = MedCycle.networks[networdId];
      if (networdId) {
        const medCycle = await new web3.eth.Contract(
          MedCycle.abi,
          '0x4B730a1257122014Aa1cF93079020c1f4EB124CC',
        );
        await medCycle.methods
          .transferMedicineDistributorToRetailer(values.batchId, values.shipper, values.retailer)
          .send({ from: currentAccount });
        // setErrors({ submit: 'Medicine sent successfully' });
        setSendSuccessSnack(true);
        setSubmitting(false);
      } else {
        window.alert('MedCycle contract not deployed to detected network.');
      }
    } catch (err) {
      console.log(err);
      setSendFailSnack(true);
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSendSuccessSnack(false);
    setSendFailSnack(false);
  };

  return (

    <Box display="flex" justifyContent="center" alignItems="center" height="50vh" marginTop="10%" marginBottom="10%">
      <Box width="50%" p="2rem" borderRadius="1.5rem" boxShadow={theme.shadows[4]} sx={{ backgroundColor }}>
        <Box textAlign="center">
          <Typography fontWeight="500" variant="h5" sx={{ mb: '1.5rem' }} fontSize="24px" color={textColor}>Send Medicine</Typography>
          <Formik
            initialValues={{
              batchId: '',
              shipper: '',
              retailer: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSendMedicine}
          >
            {({ values, isSubmitting, errors, touched, handleChange, handleBlur }) => (
              <Form>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="batchId"
                  label="Medicine Address"
                  name="batchId"
                  value={values.batchId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.batchId && Boolean(errors.batchId)}
                  helperText={touched.batchId && errors.batchId}
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
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="shipper"
                  label="Transporter Address"
                  name="shipper"
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
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="retailer"
                  label="Pharmacist Address"
                  name="retailer"
                  value={values.retailer}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.retailer && Boolean(errors.retailer)}
                  helperText={touched.retailer && errors.retailer}
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
                    color="primary"
                    disabled={isSubmitting}
                    sx={{ width: '40%' }}
                  >
                    Send Medicine
                  </Button>
                </Box>
                <Typography color="error" align="center">
                  {errors.submit}
                </Typography>
              </Form>
            )}
          </Formik>
        </Box>
        <Snackbar open={sendSuccessSnack} autoHideDuration={5000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
            Medicine sent successfully!
          </Alert>
        </Snackbar>
        <Snackbar open={SendFailSnack} autoHideDuration={5000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} severity="error" sx={{ width: '100%' }}>
            Medicine sent failed! Something went wrong.
          </Alert>
        </Snackbar>
      </Box>
    </Box>

  );
};

export default SendMedicine;
