/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

import { Backdrop, Badge, Box, Button, Modal, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import Web3 from 'web3';
import { useLocation } from 'react-router-dom';

import MedCycle from '../../abis/MedCycle.json';
import Medicine from '../../abis/Medicine.json';
import RawMaterial from '../../abis/RawMaterial.json';
import QRCode from 'qrcode.react';

const NewMedicines = () => {
  const [allManuMedicineInfo, setAllManuMedicineInfo] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMedicineInfo, setSelectedMedicineInfo] = useState({});
  const [currentAccount, setcurrentAccount] = useState('');
  const [copiedValue, setCopiedValue] = useState('');
  const [openCopy, setOpenCopy] = useState(false);
  const themeMode = localStorage.getItem('themeMode');

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
    if (currentAccount) {
      fetchMedicineData();
    }
  }, [currentAccount, location]);

  const fetchMedicineData = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      //   const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const MedCycleData = await MedCycle.networks[networkId];
      const medCycle = await new web3.eth.Contract(MedCycle.abi, MedCycleData.address);
      const packageCount = await medCycle.methods.getManufacturedMedicineCountManufacturer(currentAccount).call();
      const allManuMedicine = await Promise.all(
        // eslint-disable-next-line radix
        Array(parseInt(packageCount))
          .fill()
          .map((ele, index) => medCycle.methods.getManufacturedMedicineIdByIndexManufacturer(index, currentAccount).call()),
      );
      const newMedicineData = await Promise.all(
        allManuMedicine.map(async (medicineAddress) => {
          const medicine = await new web3.eth.Contract(Medicine.abi, medicineAddress);
          const info = await medicine.methods.getMediceInfo().call();
          const medicineStatus = await medicine.methods.getMedicineStatus().call();
          const rawMaterial = await new web3.eth.Contract(RawMaterial.abi, info[2]);
          const rawinfo = await rawMaterial.methods.getSuppliedRawMatrials().call();
          return {
            ownerAddress: info[0],
            description: info[1],
            rawmaterialAddress: info[2],
            quantity: info[3],
            transporter: info[4],
            distributor: info[5],
            medicineAddress,
            rawmaterialOwnerName: rawinfo[1],
            rawmaterialDescription: rawinfo[0],
            rawmaterialLocation: rawinfo[2],
            rawmaterialQuantity: rawinfo[3],
            rawmaterialTransporter: rawinfo[4],
            rawmaterialManufacturer: rawinfo[5],
            rawmaterialSupplier: rawinfo[6],
            medicineStatus,
          };
        }),
      );
      console.log(newMedicineData);
      setAllManuMedicineInfo(newMedicineData);
      console.log(allManuMedicineInfo);
    } catch (error) {
      console.log(error);
    //   toast.error(error.message);
    }

    console.log(allManuMedicineInfo);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      {allManuMedicineInfo.length > 0 ? (
        allManuMedicineInfo.map((medicine) => (
          <div key={medicine.medicineAddress} style={{ marginTop: '2%' }}>
            <Box
              key={medicine.medicineAddress}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                // justifyContent: 'space-between',
                // alignItems: 'center',
                margin: 2,
                p: 2,
                borderRadius: 1,
                border: 1,
                borderColor: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
                background: themeMode === 'Dark' ? '#1c2d38' : '#FFFFFF',
                width: '90%',
              }}
              onClick={handleOpen}
            >
              <Badge
                badgeContent="delivered"
                color={medicine.medicineStatus === 'Approved' ? 'success' : 'error'}
                sx={{ position: 'relative', marginRight: 2, float: 'right' }}
              />
              <Typography variant="h5" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>{medicine.medicineAddress}</Typography>
              <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#718096' : 'black' }}>{medicine.description}</Typography>
            </Box>
            <Modal
              open={open}
              onClose={handleClose}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 700,
                  bgcolor: themeMode === 'Dark' ? '#1c2d38' : '#FFFFFF',
                  border: '2px solid #000',
                  boxShadow: 24,
                  p: 4,
                }}
              >
               
                 <QRCode value={JSON.stringify(medicine)} />
                <Typography variant="h4" textAlign="center" margin="5px" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>Medicine Details</Typography>
                {/* <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>
                  <Box component="h6" fontWeight="bold" marginBottom="5px">Manufacturer Address:</Box>
                  {medicine.rawmaterialManufacturer}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>
                  <Box component="h6" fontWeight="bold" marginBottom="5px">Manufacturer Name:</Box>
                  {medicine.rawmaterialOwnerName}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>
                  <Box component="h6" fontWeight="bold" marginBottom="5px">Manufacturer Location:</Box>
                  {medicine.rawmaterialLocation}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>
                  <Box component="h6" fontWeight="bold" marginBottom="5px">Manufacturer Description:</Box>
                  {medicine.rawmaterialDescription}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>
                  <Box component="h6" fontWeight="bold" marginBottom="5px">Manufacturer Quantity:</Box>
                  {medicine.rawmaterialQuantity}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>
                  <Box component="h6" fontWeight="bold" marginBottom="5px">Manufacturer Transporter:</Box>
                  {medicine.rawmaterialTransporter}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>
                  <Box component="h6" fontWeight="bold" marginBottom="5px">Manufacturer Supplier:</Box>
                  {medicine.rawmaterialSupplier}
                </Typography> */}

                <br />
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black', display: 'flex' }}>
                  <Box component="h6" fontWeight="bold" marginBottom="3px" marginRight="10px">Medicine Address: </Box>
                  {medicine.medicineAddress}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black', display: 'flex' }}>
                  <Box component="h6" fontWeight="bold" marginBottom="3px" marginRight="10px">Medicine Description: </Box>
                  {medicine.description}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>Medicine Status: {medicine.medicineStatus}</Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>Raw Material Address: {medicine.rawmaterialAddress}</Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>Raw Material Description: {medicine.rawmaterialDescription}</Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>Raw Material Owner Name: {medicine.rawmaterialOwnerName}</Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>Raw Material Location: {medicine.rawmaterialLocation}</Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>Raw Material Quantity: {medicine.rawmaterialQuantity}</Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>Raw Material Transporter: {medicine.rawmaterialTransporter}</Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>Manufacturer Address: {medicine.rawmaterialManufacturer}</Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>Medicine Transporter Address: {medicine.transporter}</Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>Medicine distributor Address: {medicine.distributor}</Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>Raw Material Supplier: {medicine.rawmaterialSupplier}</Typography>
              </Box>
            </Modal>
          </div>
        ))
      ) : (
        <Typography variant="h5">No Medicine Found</Typography>
      )}
    </>
  );
};
//             }
//       <Box
//         sx={{
//           p: 2,
//           borderRadius: 1,
//           border: 1,
//           borderColor: 'primary.main',
//           cursor: 'pointer',
//           '&:hover': {
//             backgroundColor: 'primary.light',
//           },
//           background: '#1c2d38',
//           width: '350px',
//         }}
//         onClick={handleOpen}
//       >
//         <Badge
//           badgeContent="delivered"
//           // eslint-disable-next-line no-constant-condition
//           color={'Approved' ? 'success' : 'error'}
//           sx={{ position: 'relative', marginRight: 2, float: 'right' }}
//         />
//         <Typography variant="h5">234243234</Typography>
//         <Typography variant="subtitle1">
//           sdffffffffff
//         </Typography>
//       </Box>
//       <Modal open={open} onClose={handleClose}>
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             bgcolor: 'background.paper',
//             boxShadow: 24,
//             p: 4,
//             minWidth: '50vw',
//             maxHeight: '90vh',
//             overflowY: 'scroll',
//             borderRadius: 1,
//           }}
//         >
//           <Typography variant="h4">23424234</Typography>
//           <Typography variant="subtitle1">
//             dddddddddddddd
//           </Typography>
//           <Typography variant="h6">Raw Material Info:</Typography>
//           <Typography variant="body1">
//             Raw Material Owner: 33333333333
//           </Typography>
//           <Typography variant="body1">
//             Raw Material Description: dddd
//           </Typography>
//           <Typography variant="body1">
//             Raw Material Location: dddd
//           </Typography>
//           <Typography variant="body1">
//             Raw Material Quant
//           </Typography>
//           <Typography variant="body1">
//             Raw Material Transporter
//           </Typography>
//           <Typography variant="body1">
//             Raw Material Manufacturer
//           </Typography>
//           <Typography variant="body1">
//             Raw Material Supplier
//           </Typography>
//           <Typography variant="h6">Medicine Info:</Typography>
//           <Typography variant="body1">
//             Medicine Address
//           </Typography>
//           <Typography variant="body1">
//             Quantity
//           </Typography>
//           <Typography variant="body1">
//             Medicine Ow
//           </Typography>
//           <Typography variant="body1">
//             Medicine Description
//           </Typography>
//           <Typography variant="body1">
//             Medicine Locat
//           </Typography>
//           <Typography variant="body1">
//             Medicine Transporter
//           </Typography>
//           <Typography variant="body1">
//             Medicine Manufacturer:
//           </Typography>
//           <Typography variant="body1">
//             Medicine Suppl
//           </Typography>
//           <Typography variant="body1">
//             Medicine Distributor
//           </Typography>
//           <Typography variant="body1">
//             Medicine Retai
//           </Typography>
//           <Typography variant="body1">
//             Medicine Consu
//           </Typography>
//           <Typography variant="body1">
//             Medicine S
//           </Typography>
//           <Typography variant="body1">
//             Medicine Batch Number
//           </Typography>
//           <Typography variant="body1">
//             Medicine Expiry Dat
//           </Typography>

//         </Box>

//       </Modal>
//     </>
//   );
// };

export default NewMedicines;
