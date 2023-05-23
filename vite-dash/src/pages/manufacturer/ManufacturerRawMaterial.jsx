/* eslint-disable no-unexpected-multiline */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';

import { Grid, Card, TextField, Button, Table, CardContent, Typography, Collapse, CardActions, Box, useTheme, Snackbar, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
// import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import RawMaterialRow from '../../components/RawMaterialRow';
import Web3 from 'web3';
import MedCycle from '../../abis/MedCycle.json';
import RawMaterial from '../../abis/RawMaterial.json';

const validationSchema = Yup.object({
  rawMaterialAdress: Yup.string().required('Raw material address is required'),
});

const ManufacturerRawMaterial = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [rawSuccessSnack, setRawSuccessSnack] = useState(false);
  const [rawFailedSnack, setRawFailedSnack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rawMaterialsInfo, setRawMaterialsInfo] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [currentAccount, setcurrentAccount] = useState('');
  const themeMode = localStorage.getItem('themeMode');
  const theme = useTheme();
  // const textColor = themeMode === 'Dark' ? 'white' : 'black';
  const backgroundColor = themeMode === 'Dark' ? '#1c2d38' : 'white';
  const placeholderColor = themeMode === 'Dark' ? '#fff' : undefined;
  const inputTextColor = themeMode === 'Dark' ? '#fff' : undefined;
  const textColor = themeMode === 'Dark' ? 'white' : 'black';

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
        console.log(web3.eth.getAccounts);
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

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    fetchData();
  }, [currentAccount, location, refresh]);

  const fetchData = async () => {
    try {
      const web3 = new Web3(window.ethereum);

      // const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const MedCycleData = await MedCycle.networks[networkId];
      if (MedCycleData) {
        const medCycle = await new web3.eth.Contract(
          MedCycle.abi,
          MedCycleData.address,
        );
        const packageCount = await medCycle.methods.getPackagesCountManufacturer(currentAccount).call();
        console.log('packageCount', packageCount);
        const allRawPackages = await Promise.all(
          // eslint-disable-next-line radix
          Array(parseInt(packageCount))
            .fill()
            .map((ele, index) => medCycle.methods
              .getPackageIdByIndexManufacturer(index, currentAccount)
              .call()),
        );
        console.log('allRawPackages', allRawPackages);
        // const rawMaterials = await Promise.all(
        //   allRawPackages.map(async (rawMaterialAddress) => {
        //     const rawMaterial = await new window.web3.eth.Contract(
        //       RawMaterial.abi,
        //       rawMaterialAddress,
        //     );
        //     console.log('rawmateraladdress', rawMaterialAddress);
        //     console.log('rawMaterial 01', rawMaterial);
        //     const info = await rawMaterial.methods
        //       .getSuppliedRawMatrials()
        //       .call();
        //     return {
        //       ownerName: info[1],
        //       description: info[0],
        //       location: info[2],
        //       quantity: info[3],
        //       transporter: info[4],
        //       manufacturer: info[5],
        //       supplier: info[6],
        //       rawPackageAddress: rawMaterialAddress,
        //     };
        //   }),
        // );

        const rawMaterials = await Promise.all(
          allRawPackages.map(async (rawMaterialAddress, index) => {
            try {
              const rawMaterial = await new web3.eth.Contract(
                RawMaterial.abi,
                rawMaterialAddress,
              );
              console.log('rawmateraladdress', rawMaterialAddress);
              console.log('rawMaterial', rawMaterial);
              const info = await rawMaterial.methods.getSuppliedRawMatrials().call();
              return {
                id: index,
                ownerName: info[1],
                description: info[0],
                location: info[2],
                quantity: info[3],
                transporter: info[4],
                manufacturer: info[5],
                supplier: info[6],
                rawPackageAddress: rawMaterialAddress,
              };
            } catch (error) {
              console.log('Error:', error);
            }
          }),
        );
        console.log('rawMaterials', rawMaterials);

        console.log('rawMaterials', rawMaterials);
        setRawMaterialsInfo(rawMaterials);
      } else {
        console.log('The MEDCycle Contract does not exist on this network!');
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values, values.rawMaterialAdress);
    if (values.rawMaterialAdress === '') {
      setErrorMessage('Raw material address cannot be NULL');
      return;
    }
    setLoading(true);
    const web3 = new Web3(window.ethereum);

    try {
      // const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const MedCycleData = await MedCycle.networks[networkId];
      if (MedCycleData) {
        const medCycle = await new web3.eth.Contract(
          MedCycle.abi,
          MedCycleData.address,
        );
        await medCycle.methods
          .rawPackageReceived(values.rawMaterialAdress)
          .send({ from: currentAccount });
        console.log('Package received successfully!!');
        setRawSuccessSnack(true);
        setRefresh(!refresh);
        // window.location.reload(false);
      } else {
        console.log('The MedCycle Contract does not exist on this network!');
      }
    } catch (err) {
      setErrorMessage(err.message);
      setRawFailedSnack(true);
    }
    setSubmitting(false);
    setLoading(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'ownerName', headerName: 'Owner Name', width: 150 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'quantity', headerName: 'Quantity', width: 100 },
    { field: 'transporter', headerName: 'Transporter', width: 150 },
    { field: 'manufacturer', headerName: 'Manufacturer', width: 150 },
    { field: 'supplier', headerName: 'Supplier', width: 150 },
    { field: 'rawPackageAddress', headerName: 'Raw Package Address', width: 150 },
  ];

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setRawFailedSnack(false);
    setRawSuccessSnack(false);
  };

  return (
    <Box sx={{ padding: '2em' }}>
      <Box
        sx={{ width: '100%', height: '150vh', marginRight: '-30em', marginTop: '2em', backgroundColor }}
        borderRadius="1.1rem"
        boxShadow={theme.shadows[4]}
      >
        <Typography fontWeight="500" variant="h5" sx={{ m: '1.5rem', pt: '1.5rem' }} fontSize="24px" color={textColor}>
          Receive Raw Materials
        </Typography>
        <Formik
          initialValues={{
            rawMaterialAdress: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>

              <TextField
                name="rawMaterialAdress"
                label="Raw Material Address"
                variant="outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.rawMaterialAdress}
                error={touched.rawMaterialAdress && Boolean(errors.rawMaterialAdress)}
                helperText={touched.rawMaterialAdress && errors.rawMaterialAdress}
                fullWidth
                sx={{ padding: '0.5em' }}
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

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', marginTop: '2em' }}
              >
                {loading ? 'Loading...' : 'Receive'}

              </Button>

            </Form>
          )}
        </Formik>
        <Box sx={{ padding: '1em' }}>
          <Box
            sx={{ width: '100%', height: '100vh', marginRight: '-30em', backgroundColor }}
            borderRadius="1.1rem"
            // boxShadow={theme.shadows[4]}

          >

            <DataGrid
              rows={rawMaterialsInfo}
              columns={columns}
              pageSize={5}
              checkboxSelection
              disableSelectionOnClick
              components={{
                Toolbar: GridToolbar,
              }}
              sx={{
                borderRadius: '1.1rem',
                borderColor: backgroundColor,
                '& .MuiDataGrid-filterIcon': {
                  color: themeMode === 'Dark' ? 'white' : 'inherit',
                },
                '& .MuiDataGrid-cell': {
                  color: themeMode === 'Dark' ? '#fff' : 'inherit',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  color: themeMode === 'Dark' ? '#fff' : 'inherit',
                },
                '& .MuiDataGrid-footerContainer': {
                  color: themeMode === 'Dark' ? '#fff' : 'inherit',
                },
                '& .MuiDataGrid-columnHeaderTitleContainer': {
                  color: themeMode === 'Dark' ? '#fff' : 'inherit',
                },
                '& .MuiDataGrid-columnHeader': {
                  color: themeMode === 'Dark' ? '#fff' : 'inherit',
                },
                '& .css-78c6dr-MuiToolbar-root-MuiTablePagination-toolbar': {
                  color: themeMode === 'Dark' ? '#fff' : 'inherit',
                },

              }}
            />
          </Box>
        </Box>
        <Snackbar open={rawSuccessSnack} autoHideDuration={5000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
            Raw Material Received Successfully!
          </Alert>
        </Snackbar>
        <Snackbar open={rawFailedSnack} autoHideDuration={5000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} severity="error" sx={{ width: '100%' }}>
            Raw Material Receiving Failed! Transporter not yet picked up the raw material!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ManufacturerRawMaterial;

