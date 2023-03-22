/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
import { Badge, Box, Modal, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { useLocation } from 'react-router-dom';
import Web3 from 'web3';
import MedCycle from '../../abis/MedCycle.json';
import Distributor from '../../abis/Distributor.json';
import Medicine from '../../abis/Medicine.json';
import RawMaterial from '../../abis/RawMaterial.json';

const AllSentMedicines = () => {
  const [allManuMedicineInfo, setAllManuMedicineInfo] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentAccount, setcurrentAccount] = useState('');
  const [open, setOpen] = useState(false);
  const themeMode = localStorage.getItem('themeMode');
  const isNonMobile = useMediaQuery('(min-width: 1000px)');
  const theme = useTheme();
  const textColor = themeMode === 'Dark' ? 'white' : 'black';
  const backgroundColor = themeMode === 'Dark' ? '#1c2d38' : 'white';

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
          MedCycleData.address,
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
              {/* <Badge
                badgeContent={medicine.medicineStatus}
                color="primary"
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  margin: '10px',
                  color: 'white',
                  backgroundColor: 'green',
                  borderRadius: '5px',
                  padding: '5px',
                }}
              /> */}
              <Typography
                variant="h6"
                style={{
                  color: textColor,
                }}
              >
                {medicine.distAddress}
              </Typography>
              <Typography
                variant="h6"
                style={{
                  color: textColor,
                }}
              >
                {medicine.description}
              </Typography>
              <Typography
                variant="subtitle1"
                style={{
                  color: textColor,
                }}
              >
                {medicine.rawmaterialDescription}
              </Typography>
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
                  width: isNonMobile ? '50%' : '90%',
                  bgcolor: 'background.paper',
                  border: '2px solid #000',
                  boxShadow: 24,
                  p: 4,
                }}
              >
                 <QRCode value={JSON.stringify(medicine)} />
                <Typography variant="h4" textAlign="center" margin="5px" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>Medicine Details</Typography>

                <br />
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black', display: 'flex' }}>
                  <Box component="h6" fontWeight="bold" marginBottom="3px" marginRight="10px">Medicine Address: </Box>
                  {medicine.medicineAddress}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black', display: 'flex' }}>
                  <Box component="h6" fontWeight="bold" marginBottom="3px" marginRight="10px">Medicine Description: </Box>
                  {medicine.description}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: themeMode === 'Dark' ? '#E5E7EB' : 'black' }}>ContractAddress: {medicine.distAddress}</Typography>
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
        <Typography
          variant="h6"
          style={{
            color: textColor,
          }}
        >
          No Medicine Found
        </Typography>
      )}
    </>

  );
};

export default AllSentMedicines;
