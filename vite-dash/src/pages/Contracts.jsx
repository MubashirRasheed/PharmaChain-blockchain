/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable radix */
import React, { useState, useEffect, forwardRef } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { toast } from 'react-toastify';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, Modal, Tooltip, useTheme } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useStripe } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import Payment from './Payment';

// dotenv.config();

const Contracts = () => {
  const Alert = forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);
  const [selectContractId, setSelectContractId] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [contractData, setContractData] = useState([]);
  const themeMode = localStorage.getItem('themeMode');
  const [matchedUser, setMatchedUser] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState('');
  const [selectedPaymentId, setSelectedPaymentId] = useState('');
  const theme = useTheme();
  // const textColor = themeMode === 'Dark' ? 'white' : 'black';
  const backgroundColor = themeMode === 'Dark' ? '#1c2d38' : 'white';
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const stripe = useStripe();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // Initialize Web3 instance

      const result = await axios.get('http://localhost:9002/contract/getContract', {
        headers: { 'x-auth-token': token },
      });
      setContractData(result.data);
    };
    fetchData();
  }, [refresh]);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret',
    );

    const paymentIntentId = new URLSearchParams(window.location.search).get(
      'payment_intent',
    );
    console.log('paymentIntentId', paymentIntentId);

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(async ({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case 'succeeded':
          console.log('selectedContractId', localStorage.getItem('selectContractId'));
          console.log('Payment succeeded!');
          const { amount } = contractData.find((contract) => contract._id === localStorage.getItem('selectContractId'));
          console.log('revenue', amount);
          const update = await axios.put('http://localhost:9002/contract/update', {
            contractId: localStorage.getItem('selectContractId'),
            paymentStatus: 'Paid',
            revenue: amount,

          }, {
            headers: { 'x-auth-token': token },
          });
          // const receipt = await axios.post(`http://localhost:9002/contract/receipt/${paymentIntentId}`, {
          //   headers: { 'x-auth-token': token },
          // });
          console.log(update);
          // console.log('receipt', receipt);
          // setReceiptUrl(receipt.data.url);
          // console.log('receiptUrl', receiptUrl);
          setRefresh(!refresh);
          break;
        case 'processing':
          console.log('Your payment is processing.');
          const update2 = await axios.put('http://localhost:9002/contract/update', {
            contractId: localStorage.getItem('selectContractId'),
            paymentStatus: 'Processing',
          }, {
            headers: { 'x-auth-token': token },
          });
          break;
        case 'requires_payment_method':
          console.log('Your payment was not successful, please try again.');
          const update3 = await axios.put('http://localhost:9002/contract/update', {
            contractId: localStorage.getItem('selectContractId'),
            paymentStatus: 'Failed',
          }, {
            headers: { 'x-auth-token': token },
          });
          break;
        default:
          console.log('Something went wrong.');
          break;
      }
    });
  }, [stripe]);
  const handleSnackClick = () => {
    setOpen(true);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setOpenFailed(false);
  };

  const handleGetContractId = (contractId) => {
    console.log('Contract ID:', contractId);
    setSelectContractId(contractId);
    localStorage.setItem('selectContractId', contractId);
    setModalOpen(true);

    // Other logic here...
  };

  const getPaymentId = async (params) => {
    const { paymentId } = params.row;
    // console.log('Payment ID in get payment id:', d);
    const receipt = await axios.post(`http://localhost:9002/contract/receipt/${paymentId}`, {
      headers: { 'x-auth-token': token },
    });

    window.open(receipt.data.url, '_blank');
  };

  const handlepaymentid = async (paymentId) => {
    setSelectedPaymentId(paymentId.row.paymentId);
    const receipt = await axios.post(`http://localhost:9002/contract/receipt/${paymentId.row.paymentId}`, {
      headers: { 'x-auth-token': token },
    });

    console.log('receipt', receipt.data.url);
    window.open(receipt.data.url, '_blank');
  };

  const renderGetContractIdButton = (params) => {
    const selectedContractId = params.row.contractId;
    const selectedContract = contractData.find(
      (contract) => contract.contractId === selectedContractId,
    );
    const contractId = selectedContract ? selectedContract._id : '';
    const isCreatedByCurrentUser = user._id === params.row.contractCreatedFor;
    setMatchedUser(isCreatedByCurrentUser);
    if (isCreatedByCurrentUser) {
      // return null; // Don't render the button if user ID matches contractCreatedFor ID
      return null;
    }

    return (
      <Button
        variant="contained"
        size="small"
        onClick={() => handleGetContractId(contractId)}
        disabled={params.row.paymentStatus.status === 'Paid'}
        sx={{
          textTransform: 'capitalize',
        }}
      >
        Pay Contract
      </Button>
    );
  };

  const columns = [
    { field: 'contractId', headerName: 'Contract ID', width: 150 },
    { field: 'contractDate', headerName: 'Contract Date', width: 150 },

    { field: 'bidderName', headerName: 'Bidder Name', width: matchedUser ? 130 : 100 },
    // { field: 'job', headerName: 'Job', width: 200 },
    { field: 'jobTitle', headerName: 'Job Title', width: matchedUser ? 130 : 100 },
    { field: 'amount', headerName: 'Amount', width: matchedUser ? 120 : 90 },
    { field: 'location', headerName: 'Location', width: matchedUser ? 120 : 90 },

    {
      field: 'paymentStatus',
      headerName: 'Payment Status',
      width: matchedUser ? 150 : 130,
      renderCell: (params) => (
        <Tooltip title="View Receipt" placement="top">
          <Chip
            label={params.value.status}
            style={{ backgroundColor: params.value.color, width: '70%', textTransform: 'capitalize' }}
            onClick={() => handlepaymentid(params)}
          />
        </Tooltip>
      ),
    },
    {
      field: 'Pay Contract',
      headerName: matchedUser ? '' : 'Pay Contract',
      width: matchedUser ? 0 : 150,
      disableExport: true,
      renderCell: renderGetContractIdButton,
    },
    // { field: 'createdAt', headerName: 'Created At', width: 200 },
    // { field: 'updatedAt', headerName: 'Updated At', width: 200 },
    { field: 'paymentId', headerName: 'Payment ID', width: 200 },
    { field: 'contractCreatedBy', headerName: 'Contract Created By', width: 150 },
    { field: 'contractCreatedFor', headerName: 'Contract Created For', width: 150 },

  ];

  // const rows = contractData.map((contract, index) => ({
  //   id: index,
  //   contractId: contract.contractId,
  //   contractDate: new Date(contract.contractDate).toLocaleString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }),
  //   contractCreatedBy: contract.contractCreatedBy,
  //   contractCreatedFor: contract.contractCreatedFor,
  //   bidderName: contract.bidderName,
  //   job: contract.jobTitle,
  //   jobTitle: contract.jobTitle,
  //   amount: contract.amount,
  //   paymentId: contract.paymentId,
  //   paymentStatus: contract.paymentStatus,
  //   createdAt: contract.createdAt,
  //   updatedAt: contract.updatedAt,
  //   location: contract.location,
  // }));

  const rows = contractData.map((contract, index) => {
    let badgeColor = '';
    switch (contract.paymentStatus) {
      case 'pending':
        badgeColor = '#ffa260';
        break;
      case 'Failed':
        badgeColor = 'red';
        break;
      case 'Paid':
        badgeColor = '#31f3c1';
        break;
      default:
        badgeColor = 'gray';
    }

    const paymentStatus = {
      badgeColor,
      status: contract.paymentStatus,
    };

    const chipStyle = {
      backgroundColor: badgeColor,
      borderRadius: '4px',
      padding: '2px 8px',
      color: 'white',
      fontSize: '0.8rem',
    };

    const chipLabel = contract.paymentStatus.charAt(0).toUpperCase() + contract.paymentStatus.slice(1);

    return {
      id: index,
      contractId: contract.contractId,
      contractDate: new Date(contract.contractDate).toLocaleString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }),
      contractCreatedBy: contract.contractCreatedBy,
      contractCreatedFor: contract.contractCreatedFor,
      // contractCreatedBy: user.fullname,
      // contractCreatedFor: contract.bidderName,
      bidderName: contract.bidderName,
      // job: contract.jobTitle,
      jobTitle: contract.jobTitle,
      amount: `$ ${contract.amount} USD`,
      paymentId: contract.paymentId,
      // paymentStatus,
      paymentStatus: {
        status: contract.paymentStatus,
        color: badgeColor,
      },
      // createdAt: contract.createdAt,
      // updatedAt: contract.updatedAt,
      location: contract.location,
    };
  });

  return (
    // <Box sx={{ padding: '2em' }}>
    //   <Box
    //     sx={{ width: '100%', height: '80vh', marginRight: '-30em', marginTop: '2em', backgroundColor }}
    //     borderRadius="1.1rem"
    //     boxShadow={theme.shadows[4]}
    //   >
    <Box sx={{ padding: '2em' }}>
      <Box
        sx={{ width: '100%', height: '80vh', marginRight: '-100em', marginTop: '2em', backgroundColor }}
        borderRadius="1.1rem"
        boxShadow={theme.shadows[4]}
      >
        <DataGrid
          initialState={{
            columns: {
              columnVisibilityModel: {
              // Hide columns status and traderName, the other columns will remain visible
                contractCreatedFor: false,
                contractCreatedBy: false,
                paymentId: false,
              },
            },
          }}
          columns={columns}
          rows={rows}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          key={JSON.stringify(rows)}
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
        {/* <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <TestContract contractId={selectContractId} />
        </Modal> */}

        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          disableBackdropClick
          sx={{ '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
            backgroundColor: themeMode === 'Dark' ? '#000f15' : 'white',
          },
          }}
        >
          <DialogTitle sx={{ color: themeMode === 'Dark' ? 'white' : 'black' }}>Pay Contract</DialogTitle>
          <DialogContent>
            <Payment
              contractId={selectContractId}

            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={open} autoHideDuration={5000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
            Role Reassigned Successfully!
          </Alert>
        </Snackbar>
        <Snackbar open={openFailed} autoHideDuration={5000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} severity="error" sx={{ width: '100%' }}>
            Role Reassignment Failed!
          </Alert>
        </Snackbar>;
      </Box>
    </Box>
  );
};

export default Contracts;

