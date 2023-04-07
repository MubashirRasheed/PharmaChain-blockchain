/* eslint-disable consistent-return */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, Snackbar, useMediaQuery, useTheme } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Web3 from 'web3';
import Transporter from '../../abis/Transporter.json';

const TransporterDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [destination, setDestination] = useState(0);
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

  const handleSubmit = async (values) => {
    console.log(values.batchId, values.distributorId, destination);
    setLoading(true);
    try {
      const web3 = new Web3(window.ethereum);

      const networkId = await web3.eth.net.getId();
      const TransporterData = await Transporter.networks[networkId];
      if (TransporterData) {
        const transporter = await new web3.eth.Contract(
          Transporter.abi,
          TransporterData.address,
        );
        let { batchId, distributorId } = values;
        // eslint-disable-next-line eqeqeq
        if (!distributorId || distributorId == 'undefined') distributorId = batchId;
        console.log(batchId, distributorId, destination);
        await transporter.methods
          .loadConsignment(batchId, destination, distributorId)
          .send({ from: currentAccount });
        console.log('Package picked successfully!!');
      } else {
        console.log('The Transporter Contract does not exist on this network!');
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
    setLoading(false);
  };

  const destinationOptions = [
    {
      key: '1',
      text: 'Raw Material',
      value: '1',
    },
    {
      key: '2',
      text: 'Medicine',
      value: '2',
    },
    {
      key: '3',
      text: 'Distributor',
      value: '3',
    },
  ];

  const formik = useFormik({
    initialValues: {
      batchId: '',
      distributorId: '',
    },
    validationSchema: Yup.object({
      batchId: Yup.string().required('Required'),
    }),
    onSubmit: handleSubmit,
  });

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setErrorMessage('');
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="50vh" marginTop="10%" marginBottom="10%">
      <Box width="50%" p="7rem" borderRadius="1.5rem" boxShadow={theme.shadows[4]} sx={{ backgroundColor }}>
        <Box textAlign="center">
          <Typography fontWeight="500" variant="h5" sx={{ mb: '1.5rem' }} fontSize="24px" color={textColor}>Pick up Package</Typography>
        </Box>
        <Box sx={{ mb: 4 }}>
          <form onSubmit={formik.handleSubmit}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="destination-label">Pick-Up Point</InputLabel>
              <Select
                labelId="destination-label"
                id="destination"
                value={destination}
                label="Pick-Up Point"
                onChange={handleDestinationChange}
              >
                {destinationOptions.map((option) => (
                  <MenuItem key={option.key} value={option.value}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                id="batchId"
                name="batchId"
                label="Medicine Address"
                value={formik.values.batchId}
                onChange={formik.handleChange}
                error={formik.touched.batchId && Boolean(formik.errors.batchId)}
                helperText={formik.touched.batchId && formik.errors.batchId}
              />
            </FormControl>
            {destination === '3' && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                id="distributorId"
                name="distributorId"
                label="Contract Address"
                value={formik.values.distributorId}
                onChange={formik.handleChange}
                error={formik.touched.distributorId && Boolean(formik.errors.distributorId)}
                helperText={formik.touched.distributorId && formik.errors.distributorId}
              />
            </FormControl>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Pick Package
            </Button>
          </form>
        </Box>
        <Snackbar
          open={errorMessage !== ''}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={errorMessage}
        />
      </Box>
    </Box>

  );
};

export default TransporterDashboard;

