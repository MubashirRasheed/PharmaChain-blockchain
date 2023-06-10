import React, { useEffect, useState } from 'react';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, Search, Page } from '@syncfusion/ej2-react-grids';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import { employeesData, employeesGrid } from '../data/dummy';
import { Header } from '../components';

const Employees = () => {
  const themeMode = localStorage.getItem('themeMode');
  const backgroundColor = themeMode === 'Dark' ? '#1c2d38' : 'white';
  const [employeeData, setEmployeeData] = useState([]);
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/employee/allEmployees`;

  const toolbarOptions = ['Search'];

  const editing = { allowDeleting: true, allowEditing: true };

  async function getAllProducts() {
    try {
      const response = await axios.get(apiUrl);
      setEmployeeData(response.data);
      console.log(response.data); // data
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAllProducts();
  }, []);

  //   MUI Data Grid

  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 60,
      renderCell: (params) => (
        <img src={params.row.image} alt="Product" style={{ width: '100%', height: 'auto' }} />
      ),
    },
    {
      field: 'id',
      headerName: 'User  ID',
      width: 80,
      // renderCell: (params) => (setRowID(params.row.id)),
    },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'title', headerName: 'Title', width: 190 },
    { field: 'hiredata', headerName: 'Hire Date', width: 150 },
    { field: 'country', headerName: 'Country', width: 130 },
    { field: 'reportsTo', headerName: 'Reports To', width: 100 },

  ];

  console.log(employeeData);

  const rows = employeeData.map((user, index) => ({
    image: user.UserImageUrl,
    id: user.UserID,
    name: user.Name,
    title: user.Title,
    hiredata: user.HireDate,
    country: user.Country,
    reportsTo: user.ReportsTo,

  }));

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Employees" />

      MUI Data Grid
      <div style={{ height: '100vh' }}>
        <DataGrid
          initialState={{
            columns: {
              columnVisibilityModel: {
                // Hide columns status and traderName, the other columns will remain visible
                contractCreatedFor: false,
                contractCreatedBy: false,
              },
            },
          }}
          columns={columns}
          rows={rows}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
          components={{ Toolbar: GridToolbar }}
            // onRowSelected={() => {setRowID(params.getValue('id'))}}
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
      </div>

    </div>
  );
};
export default Employees;
