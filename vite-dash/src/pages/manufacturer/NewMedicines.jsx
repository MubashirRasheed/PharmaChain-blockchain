/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

import { Alert, Backdrop, Badge, Box, Button, IconButton, Modal, Skeleton, Snackbar, TextField, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Web3 from 'web3';
import { useLocation } from 'react-router-dom';

import QRCode1 from 'qrcode.react';
import QRCode from 'qrcode';
import MedCycle from '../../abis/MedCycle.json';
import Medicine from '../../abis/Medicine.json';
import RawMaterial from '../../abis/RawMaterial.json';
import { shortenAddress } from '../../utils/shortenAddress';

const NewMedicines = () => {
  const [allManuMedicineInfo, setAllManuMedicineInfo] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMedicineInfo, setSelectedMedicineInfo] = useState({});
  const [currentAccount, setcurrentAccount] = useState('');
  const [copiedValue, setCopiedValue] = useState('');
  const [openCopy, setOpenCopy] = useState(false);
  const themeMode = localStorage.getItem('themeMode');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);
  const [qrCodeData, setQRCodeData] = useState('');
  const [copySncak, setCopySnack] = useState(false);

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
      const medCycle = await new web3.eth.Contract(MedCycle.abi, '0x4B730a1257122014Aa1cF93079020c1f4EB124CC');
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
      // eslint-disable-next-line array-callback-return

      console.log(allManuMedicineInfo[1]);
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
  const m = 'Medicine';
  useEffect(() => {
    console.log(allManuMedicineInfo);
  }, []);

  const generateQR = async (text) => {
    try {
      return await QRCode.toDataURL(text);
    } catch (err) {
      console.error(err);
      return null; // or any default value you want to use
    }
  };

  function QRCodeImage(props) {
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

    useEffect(() => {
      async function generateQRCode() {
        try {
          const url = await QRCode.toDataURL(props.value);
          setQrCodeDataUrl(url);
        } catch (error) {
          console.error(error);
        }
      }
      generateQRCode();
    }, [props.value]);
    return (
      <img style={{ height: '200px', width: '200px' }} src={qrCodeDataUrl} alt="QR code" />
    );
  }
  const handleDownloadQR = async (medicine) => {
    const dataUrl = await QRCode.toDataURL(JSON.stringify(medicine), { errorCorrectionLevel: 'H' });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qrcode.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setCopySnack(false);
  };

  return (
    <>
      {allManuMedicineInfo.length > 0 ? (
        allManuMedicineInfo.map((medicine) => {
          { /* const dataUrl = await qr(JSON.stringify(medicine)); */ }
          { /* const struturedQR = `
          Description: ${medicine.description}
          Medicine Address: ${medicine.medicineAddress}
          Owner: ${medicine.ownerAddress}
          RawMaterial: ${medicine.rawmaterialAddress}
          Quantity: ${medicine.quantity}
          Transporter: ${medicine.transporter}
          Distributor: ${medicine.distributor}
          RawMaterial Owner: ${medicine.rawmaterialOwnerName}
          RawMaterial Description: ${medicine.rawmaterialDescription}
          RawMaterial Location: ${medicine.rawmaterialLocation}
          RawMaterial Transporter: ${medicine.rawmaterialTransporter}
          RawMaterial Manufacturer: ${medicine.rawmaterialManufacturer}
          RawMaterial Supplier: ${medicine.rawmaterialSupplier}
          `; */ }
          const structuredQR = `
          === Medicine Details ===
Description:          ${medicine.description}
Medicine Address:     ${medicine.medicineAddress}
Owner:                ${medicine.ownerAddress}
Quantity:             ${medicine.quantity}
Transporter:          ${medicine.transporter}
Distributor:          ${medicine.distributor}

        === Raw Material Details ===
Owner Name:           ${medicine.rawmaterialOwnerName}
Description:          ${medicine.rawmaterialDescription}
Location:             ${medicine.rawmaterialLocation}
Transporter:          ${medicine.rawmaterialTransporter}
Manufacturer:         ${medicine.rawmaterialManufacturer}
Supplier:             ${medicine.rawmaterialSupplier}
`;

          const badgeText = medicine.medicineStatus === '0' ? 'At Manufacturer'
            : medicine.medicineStatus === '1' ? 'Picked for Distributor'
              : medicine.medicineStatus === '2' ? 'Delivered to Distributor'
                : medicine.medicineStatus === '3' ? 'Picked for Pharmacist'
                  : medicine.medicineStatus === '4' ? 'Delivered to Pharmacist' : '';

          const badgeColor = medicine.medicineStatus === '0' ? 'primary'
            : medicine.medicineStatus === '1' ? 'warning'
              : medicine.medicineStatus === '2' ? 'success'
                : medicine.medicineStatus === '3' ? 'warning'
                  : medicine.medicineStatus === '4' ? 'success' : '';
          console.log('badge color ', badgeColor, badgeText);
          return (

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
                  borderRadius: '20px',
                  border: 1,
                  borderColor: themeMode === 'Dark' ? '#515054' : '#cac9cf',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: themeMode === 'Dark' ? '#2d3940' : '#f1f1f1',
                  },
                  background: themeMode === 'Dark' ? '#1c2d38' : '#FFFFFF',
                  width: '90%',
                }}
                onClick={handleOpen}
              >

                <Badge
                  key={medicine.medicineAddress}
                  badgeContent={badgeText}
                  color={badgeColor}
                  sx={{ position: 'relative',
                    marginRight: 6,
                    float: 'right',
                    '& .css-106c1u2-MuiBadge-badge': {
                      marginRight: '30px',
                    } }}
                />

                <Typography variant="h5" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black', textTransform: 'capitalize' }}>{medicine.description}</Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#718096' : 'black' }}>{medicine.rawmaterialDescription}</Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#718096' : 'black' }}>{shortenAddress(medicine.medicineAddress)}</Typography>

              </Box>
              <Modal
                open={open}
                onClose={handleClose}
              >
                {/* <Box
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
                    overflow: 'scroll',
                  }}
                > */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 700,
                    bgcolor: themeMode === 'Dark' ? '#1c2d38' : '#FFFFFF',
                    border: '2px solid #000',
                    borderRadius: '20px',
                    boxShadow: 24,
                    p: 4,
                    maxHeight: 500, // set a fixed height for the Box component
                    overflow: 'auto !important', // add !important rule to the overflow property
                  }}
                >

                  {/* <QRCode1 style={{ width: '200px', height: '200px' }} value={JSON.stringify(medicine)} /> */}
                  <Typography variant="h4" textAlign="center" margin="5px" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>Medicine Details</Typography>

                  <br />
                  <Box className="flex flex-row" marginBottom="2px">
                    <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black', display: 'flex' }}>
                      <Box component="h6" fontWeight="bold" marginBottom="3px" marginRight="10px">Medicine Address: </Box>
                      {medicine.medicineAddress}
                    </Typography>
                    <Tooltip title="Copy" placement="top" arrow>
                      <IconButton
                        onClick={() => {
                          navigator.clipboard.writeText(medicine.medicineAddress);
                          setCopySnack(true);
                          // You can also set a state variable or show a toast message to indicate successful copy
                        }}
                      >
                        <ContentCopyIcon sx={{ color: themeMode === 'Dark' ? 'white' : 'black', padding: '0px', marginLeft: '5px' }} />
                      </IconButton>
                    </Tooltip>

                  </Box>
                  <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black', display: 'flex' }}>
                    <Box component="h5" fontWeight="bold" marginBottom="3px" marginRight="10px">Medicine Description: </Box>
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

                  <Box
                    marginTop="6%"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {/* <QRCodeImage value={JSON.stringify(medicine)} /> */}
                    <QRCodeImage value={structuredQR} />
                    {/* <QRCodeImage value={qm} /> */}

                    <Button
                      sx={{
                        color: themeMode === 'Dark' ? 'white' : 'black',
                        border: '1px solid',
                        borderColor: themeMode === 'Dark' ? 'white' : 'black',
                        margin: '10px',
                        marginTop: '20px',
                      }}
                      variant="outlined"
                      onClick={() => handleDownloadQR(medicine)}
                    >Download QR Code
                    </Button>
                  </Box>

                </Box>
              </Modal>
              <Snackbar open={copySncak} autoHideDuration={5000} onClose={handleSnackClose}>
                <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
                  Medicine Address copied to clipboard!
                </Alert>
              </Snackbar>

            </div>
          );
        })
      ) : (

        <Box

          sx={{
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'space-between',
            // alignItems: 'center',
            margin: 2,
            p: 2,
            borderRadius: '20px',
            border: 1,
            borderColor: themeMode === 'Dark' ? '#515054' : '#cac9cf',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: themeMode === 'Dark' ? '#2d3940' : '#f1f1f1',
            },
            background: themeMode === 'Dark' ? '#1c2d38' : '#FFFFFF',
            width: '90%',
          }}
        >
          <Typography variant="h4" textAlign="center" margin="5px">
            <Skeleton variant="text" width="40%" />
          </Typography>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="90%" />
        </Box>

      )}
    </>
  );
};
export default NewMedicines;
