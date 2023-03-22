/* eslint-disable no-unexpected-multiline */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';

import { Grid, Card, TextField, Button, Table, CardContent, Typography, Collapse, CardActions } from '@mui/material';
import { useLocation, withRouter } from 'react-router-dom';
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

const Campaign = ({
  id,
  campaign_title,
  required_amount,
  location,
  category,
  description,
  progress,
  isDashboard = false,

}) => {
  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);

  // defining the see more button for each campaign
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Card sx={{ backgroundImage: 'none',
      backgroundColor: '#1c2d38',
      borderRadius: '0.55rem' }}
    >
      <CardContent>
        <Typography variant="h3" color="#00ed64" gutterBottom>
          {campaign_title}
        </Typography>
        <Typography variant="h4" color="#00ed64">
          {category}
        </Typography>
        <Typography sx={{ mb: '0.5rem', mt: '0.3rem' }} variant="h5" color="#00ed64">
          ${Number(required_amount).toFixed(2)}
        </Typography>

        {!isDashboard ? (
          <Collapse sx={{ justifyContent: 'center', backgroundColor: '#1c2d38', borderRadius: '0.55rem', mt: '0.5rem' }} in={isExpanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography variant="h5" color="#33373E">
                Description:
              </Typography>
              <Typography variant="h5" color="#20232A">
                {description}
              </Typography>
              <Typography sx={{ mt: '0.8em' }} variant="h6" color="#00ed64">
                Location:
              </Typography>
              <Typography variant="h6" color="#00ed64">
                {location}
              </Typography>
            </CardContent>
          </Collapse>
        ) : undefined}

        {!isDashboard ? (
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button variant="primary" size="small" onClick={() => setIsExpanded(!isExpanded)}>See more</Button>
          </CardActions>
        ) : undefined}

      </CardContent>
    </Card>
  );
};

const ManufacturerRawMaterial = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [rawMaterialsInfo, setRawMaterialsInfo] = useState([]);
  const [currentAccount, setcurrentAccount] = useState('');

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
  }, [currentAccount, location]);

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
        // window.location.reload(false);
      } else {
        console.log('The MedCycle Contract does not exist on this network!');
      }
    } catch (err) {
      setErrorMessage(err.message);
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card className="card" sx={{ margin: '10%', padding: '2rem' }}>
          <Formik
            initialValues={{
              rawMaterialAdress: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
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
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"

                    >
                      {loading ? 'Loading...' : 'Submit'}

                    </Button>

                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card className="card" sx={{ margin: '20px', width: '80%', height: '50vh' }}>
          <DataGrid
            rows={rawMaterialsInfo}
            columns={columns}
            pageSize={5}
            checkboxSelection
            disableSelectionOnClick
            components={{
              Toolbar: GridToolbar,
            }}
          />
          <Campaign
            id="0x5FbDB2315678afecb367f032d93F642f64180aa3"
            campaign_title="Campaign 1"
            required_amount="1000"
            location="India"
            category="Education"
            description="This is a campaign for education"
            progress="50"
            isDashboard={false}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default ManufacturerRawMaterial;

