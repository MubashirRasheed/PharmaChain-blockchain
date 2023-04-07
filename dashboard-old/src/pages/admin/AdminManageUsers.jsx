/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable radix */
import React, { useState, useEffect, forwardRef } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { toast } from 'react-toastify';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { Button, Menu, MenuItem } from '@mui/material';
import Web3 from 'web3';
// import dotenv from 'dotenv';
import Admin from '../../abis/Admin.json';

// dotenv.config();

const AdminManageUsers = () => {
  const AdminAddress = process.env.REACT_APP_ADMIN_CONTRACT_ADDRESS;
  console.log(AdminAddress);
  const Alert = forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);
  const [open, setOpen] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [refresh, setRefresh] = useState(false);
  const themeMode = localStorage.getItem('themeMode');

  useEffect(() => {
    // const fetchData = async () => {
    //   // const web3 = window.web3;
    //   const web3 = new Web3(window.ethereum);
    //   const networkId = await web3.eth.net.getId();
    //   const AdminData = await Admin.networks[networkId];
    //   if (AdminData) {
    //     const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
    //     const userCount = await admin.methods.getUsersCount().call();
    //     const allUsers = await Promise.all(
    //       Array(parseInt(userCount))
    //         .fill()
    //         .map((ele, index) => admin.methods.getUserByIndex(index).call()),
    //     );
    //     setAllUsers(allUsers);
    //   } else {
    //     console.log('The Admin Contract does not exist on this network!');
    //   }
    // };
    const fetchData = async () => {
      // Initialize Web3 instance
      const web3 = new Web3(window.ethereum);

      // Get accounts from MetaMask wallet
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create contract instance

      const adminContract = new web3.eth.Contract(Admin.abi, AdminAddress);

      // Call getUser function from contract

      const userCount = await adminContract.methods.getUsersCount().call({ from: accounts[0] });
      const allUserss = await Promise.all(
        Array(parseInt(userCount))
          .fill()
          .map((ele, index) => adminContract.methods.getUserByIndex(index).call({ from: accounts[0] })),
      );
      setAllUsers(allUserss);
      console.log(allUserss);
      console.log(allUsers);
    };
    fetchData();
  }, [refresh]);

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

  const handleReassignRole = (event, user) => {
    setAnchorEl(event.currentTarget);
    setCurrentUser(user);
  };

  const handleRoleChange = async (role) => {
    // const web3 = window.web3;
    const web3 = new Web3(window.ethereum);
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    try {
      if (AdminData) {
        const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
        await admin.methods
          .reassignRole(currentUser.ethereumAddress, role)
          .send({ from: window.ethereum.selectedAddress });

        setCurrentUser({});
        setAnchorEl(null);
        setOpen(true);

        //   toast.success('Role reassigned successfully!');
        setRefresh(!refresh);
      } else {
        console.log('The Admin Contract does not exist on this network!');
      }
    } catch (error) {
      console.log(error);
      setOpenFailed(true);
    }
  };

  const handleRevokeRole = async (id) => {
    const web3 = new Web3(window.ethereum);
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);

      await admin.methods
        .revokeRole(allUsers[id][2])
        .send({ from: window.ethereum.selectedAddress });

      console.log('Role revoked successfully!');
      setRefresh(!refresh);
    } else {
      console.log('The Admin Contract does not exist on this network!');
    }
  };

  const renderReassignRoleButton = (params) => (
    <Button
      variant="outlined"
      size="small"
      onClick={(event) => handleReassignRole(event, params.row)}
    >
      Reassign Role
    </Button>
  );

  const renderRevokeRoleButton = (params) => (

    <Button
      variant="outlined"
      size="small"
      onClick={() => handleRevokeRole(params.id)}
    >
      Revoke Role
    </Button>
  );

  const columns = [
    { field: 'id', headerName: 'S. No.', width: 50 },
    { field: 'name', headerName: 'Name', width: 100 },
    { field: 'location', headerName: 'Location', width: 100 },
    { field: 'ethereumAddress', headerName: 'Ethereum Address', width: 350 },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      valueFormatter: (params) => {
        const roles = [
          'No Role',
          'Supplier',
          'Transporter',
          'Manufacturer',
          'Distributor',
          'Retailer',
          'Revoked',
        ];
        return roles[params.value];
      },
    },
    {
      field: 'reassignRole',
      headerName: 'Reassign Role',
      width: 150,
      disableExport: true,
      renderCell: renderReassignRoleButton,
    },
    {
      field: 'revokeRole',
      headerName: 'Revoke Role',
      width: 150,
      disableExport: true,
      renderCell: renderRevokeRoleButton,
    },
  ];

  const rows = allUsers.map((user, index) => ({
    id: index,
    name: user[0],
    location: user[1],
    ethereumAddress: user[2],
    role: user[3],
    reassignRole: user[4],
    revokeRole: user[5],
  }));

  return (
    <div style={{ height: 500, width: '100%' }}>
      <h1>All Users</h1>
      <DataGrid
        columns={columns}
        rows={rows}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        checkboxSelection
        disableSelectionOnClick
        components={{ Toolbar: GridToolbar }}
        getRowId={(row) => row.id}
        key={JSON.stringify(rows)}
        sx={{
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
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleRoleChange(1)}>Supplier</MenuItem>
        <MenuItem onClick={() => handleRoleChange(2)}>Transporter</MenuItem>
        <MenuItem onClick={() => handleRoleChange(3)}>Manufacturer</MenuItem>
        <MenuItem onClick={() => handleRoleChange(4)}>Distributor</MenuItem>
        <MenuItem onClick={() => handleRoleChange(5)}>Retailer</MenuItem>
      </Menu>
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
    </div>
  );
};

export default AdminManageUsers;

