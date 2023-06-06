import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Header } from '../../components';
import { useStateContext } from '../../contexts/ContextProvider';

const ManufacturerInventory = () => {
  // Latest Changings
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/manufacturer/allManufacturers`;
  const [manufacturerInventoryData, setManufacturerInventoryData] = useState([]);
  const themeMode = localStorage.getItem('themeMode');
  const backgroundColor = themeMode === 'Dark' ? '#1c2d38' : 'white';
  const { currentColor, currentMode } = useStateContext();
  const Pencolor = themeMode === 'Dark' ? '#1c2d38' : 'white';
  async function getAllProducts() {
    try {
      const response = await axios.get(apiUrl);
      setManufacturerInventoryData(response.data);
      console.log(response.data); // data
    } catch (error) {
      console.error(error);
    }
  }

  const [newItem, setNewItem] = useState({
    name: '',
    id: '',
    sku: '',
    price: '',
    stock: '',
    category: '',
    shortDescription: '',
  });

  useEffect(() => {
    // // fetch inventory data from API

    getAllProducts();

    // fetch('http://localhost:9002/product/allProducts')
    //     .then(response => response.json())
    //     .then(data => setInventoryData(data))
    //     .catch(error => console.error(error));
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(name);
    console.log(value);
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = () => {
    // add new item to ManufacturerInventory
    console.log('additem ', newItem);
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/manufacturer/addNewManufacturer`, newItem, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        const { data } = response;
        setManufacturerInventoryData([...manufacturerInventoryData, data]);
        setNewItem({
          name: '',
          id: '',
          sku: '',
          price: '',
          stock: '',
          category: '',
          shortDescription: '',
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUpdateItem = () => {
    // update existing item in ManufacturerInventory
    console.log('update item', newItem);
    fetch(`${import.meta.env.VITE_BASE_URL}/manufacturer/updateManufacturer/${newItem.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedManufacturerInventory = manufacturerInventoryData.map((item) => (item.id === data.id ? data : item));
        setManufacturerInventoryData(updatedManufacturerInventory);
        setNewItem({
          name: '',
          id: '',
          sku: '',
          price: '',
          stock: '',
          category: '',
          shortDescription: '',
        });
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteItem = () => {
    // delete item from ManufacturerInventory
    fetch(`${import.meta.env.VITE_BASE_URL}/manufacturer/deteleManufacturer/${newItem.id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          const updatedManufacturerInventory = manufacturerInventoryData.filter((item) => item.id !== newItem.id);
          setManufacturerInventoryData(updatedManufacturerInventory);
          setNewItem({
            name: '',
            id: '',
            sku: '',
            price: '',
            stock: '',
            category: '',
          });
        }
      })
      .catch((error) => console.error(error));
  };

  //   MUI Data Grid

  const columns = [
    {
      field: 'id',
      headerName: 'ProductID',
      width: 80,
      // renderCell: (params) => (setRowID(params.row.id)),
    },
    { field: 'name', headerName: 'Name', width: 100 },
    { field: 'sku', headerName: 'SKU', width: 100 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'salecount', headerName: 'Sale Count', width: 130 },
    { field: 'stock', headerName: 'Stock', width: 100 },
    { field: 'category', headerName: 'Category', width: 150 },
    {
      field: 'shortDescription',
      headerName: 'Short Description',
      width: 250,
      // renderCell: renderGetObjID,
    },
  ];

  console.log(manufacturerInventoryData);

  const rows = manufacturerInventoryData.map((user, index) => ({

    id: user.id,
    name: user.name,
    sku: user.sku,
    price: user.price,
    salecount: user.saleCount,
    stock: user.stock,
    category: user.category,
    shortDescription: user.shortDescription,

  }));

  return (
    <div>

      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-5">Manufacturer Inventory Management</h1>

        <h2 className="mt-4 text-xl">Add New Item</h2>
        <form className="flex flex-row mt-5 items-stretch space-x-10">
          <label className="flex flex-col mb-4">
            ProductID:
            <input
              className="p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2"
              type="number"
              name="id"
              value={newItem.id}
              onChange={handleInputChange}
            />
          </label>
          <label className="flex flex-col mb-4">
            Name:
            <input
              className="p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2"
              type="text"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
            />
          </label>
          <label className="flex flex-col mb-4">
            SKU:
            <input
              className="p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2"
              type="text"
              name="sku"
              value={newItem.sku}
              onChange={handleInputChange}
            />
          </label>
        </form>
        <form className="flex flex-row mt-5 items-stretch space-x-10">
          {/* {"\n"} */}
          <label className="flex flex-col mb-4">
            Price:
            <input
              className="p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2"
              type="text"
              name="price"
              value={newItem.price}
              onChange={handleInputChange}
            />
          </label>
          <label className="flex flex-col mb-4">
            Stock Quantity:
            <input
              className="p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2"
              type="text"
              name="stock"
              value={newItem.stock}
              onChange={handleInputChange}
            />
          </label>
          <label className="flex flex-col mb-4">
            Category:
            <input
              className="p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2"
              type="text"
              name="category"
              value={newItem.category}
              onChange={handleInputChange}
            />
          </label>
          <label className="flex flex-col mb-4">
            Short Description:
            <input
              className="p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2"
              type="text"
              name="shortDescription"
              value={newItem.shortDescription}
              onChange={handleInputChange}
            />
          </label>

          {/* <button type="button" className='mt-3 p-3 font text-base rounded-lg text-white border-0 cursor-pointer hover:bg-green-700 pt-30' onClick={handleAddItem}>Add Item</button> */}
        </form>
        <div className="flex flex-row items-stretch space-x-10 mt-10">
          <button
            className="rounded-md"
            color="white"
            style={{ backgroundColor: currentColor, padding: '18px', color: 'white', marginTop: '10px', borderRadius: '10px' }}
            onClick={handleAddItem}
          >
            Add New Product
          </button>
          <button
            className="rounded-md"
            color="white"
            style={{ backgroundColor: currentColor, padding: '18px', color: 'white', marginTop: '10px', borderRadius: '10px' }}
            onClick={() => { handleDeleteItem(newItem.id); }}
          >Remove Product
          </button>
          <button
            className="rounded-md"
            color="white"
            style={{ backgroundColor: currentColor, padding: '18px', color: 'white', marginTop: '10px', borderRadius: '10px' }}
            onClick={handleUpdateItem}
          >Update Product
          </button>
        </div>
        {/* add some styling to make it look better */}
        {/* <style jsx>{``}</style> */}

      </div>

      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header title="Manufacturer Inventory Items" />

        {/* MUI Data Grid */}
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

        {/* <GridComponent
          dataSource={inventoryData}
          enableHover={false}
          allowPaging
          pageSettings={{ pageCount: 5 }}
          selectionSettings={selectionsettings}
          toolbar={toolbarOptions}
                    // toolbarClick={clickHandler}
          editSettings={editing}
          allowSorting
        >
          <ColumnsDirective> */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {/* {inventoryGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
          </ColumnsDirective>
          <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter]} />
        </GridComponent> */}
      </div>
    </div>
  );
};

export default ManufacturerInventory;
