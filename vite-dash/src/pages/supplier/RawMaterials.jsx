/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable radix */
import { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Web3 from 'web3';
import { useLocation } from 'react-router-dom';
import { Alert, Box, Snackbar, Typography, useTheme } from '@mui/material';
import Supplier from '../../abis/Supplier.json';
import RawMaterial from '../../abis/RawMaterial.json';

const RawMaterials = () => {
  const [rawMaterialsInfo, setRawMaterialsInfo] = useState([]);
  const [currentAccount, setcurrentAccount] = useState('');
  const [copiedValue, setCopiedValue] = useState('');
  const [openCopy, setOpenCopy] = useState(false);
  const themeMode = localStorage.getItem('themeMode');
  const theme = useTheme();
  // const textColor = themeMode === 'Dark' ? 'white' : 'black';
  const backgroundColor = themeMode === 'Dark' ? '#1c2d38' : 'white';

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
    if (currentAccount) {
      // eslint-disable-next-line no-use-before-define
      fetchRawMaterials();
    }
  }, [currentAccount, location]);

  const fetchRawMaterials = async () => {
    try {
      const web3 = new Web3(window.ethereum);

      const networkId = await web3.eth.net.getId();
      // const SupplierData = await Supplier.networks[networkId];
      const SupplierData = '0xfF94e7aAd82A54144bf300dd33AA217677bCD7f1';
      console.log('supplierdata.adress', SupplierData);

      if (SupplierData) {
        const supplier = await new web3.eth.Contract(
          Supplier.abi,
          '0xfF94e7aAd82A54144bf300dd33AA217677bCD7f1',
        );

        const packageCount = await supplier.methods
          .getPackageCountSupplier(currentAccount)
          .call();
        const allRawPackages = await Promise.all(
          Array(parseInt(packageCount))
            .fill()
            .map((ele, index) => supplier.methods
              .getPackageIdByIndexSupplier(index, currentAccount)
              .call()),
        );

        console.log('packageCount', packageCount);
        const fetchedRawMaterials = await Promise.all(
          allRawPackages.map(async (rawMaterialAddress) => {
            const rawMaterial = await new web3.eth.Contract(
              RawMaterial.abi,
              rawMaterialAddress,
            );
            console.log('rawmatriasl', rawMaterial);
            console.log('rawmaterial address', rawMaterialAddress);

            const info = await rawMaterial.methods
              .getSuppliedRawMatrials()
              .call();
            const newinfo = {
              id: rawMaterialAddress,
              ownerName: info[1],
              description: info[0],
              location: info[2],
              quantity: info[3],
              transporter: info[4],
              manufacturer: info[5],
              supplier: info[6],
            };

            return newinfo;
          }),
        );
        setRawMaterialsInfo(fetchedRawMaterials);
      } else {
        console.log('The Supplier Contract does not exist on this network!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRowClick = (params) => {
    const rowData = params.row;
    setCopiedValue(rowData.id);
    navigator.clipboard.writeText(rowData.id);
    setOpenCopy(true);
  };
  console.log('copied value', copiedValue);

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenCopy(false);
  };
  const columns = [
    { field: 'id', headerName: 'RawMaterial Address', width: 200 },
    { field: 'ownerName', headerName: 'Owner Name', width: 150 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'quantity', headerName: 'Quantity', width: 150 },
    { field: 'transporter', headerName: 'Transporter', width: 200 },
    { field: 'manufacturer', headerName: 'Manufacturer', width: 200 },
    { field: 'supplier', headerName: 'Supplier', width: 200 },
  ];

  return (

    <Box sx={{ padding: '2em' }}>
      <Box
        sx={{ width: '100%', height: '400px', marginRight: '-30em', marginTop: '2em', backgroundColor }}
        borderRadius="1.1rem"
        boxShadow={theme.shadows[4]}
      >
        <DataGrid
          rows={rawMaterialsInfo}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
          components={{ Toolbar: GridToolbar }}
          onRowClick={handleRowClick}
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
        <Snackbar open={openCopy} autoHideDuration={5000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
            Raw Material Address copied!!
          </Alert>
        </Snackbar>

      </Box>
    </Box>

  );
};

export default RawMaterials;
