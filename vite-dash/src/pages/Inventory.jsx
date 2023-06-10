import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Avatar, Box, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonIcon from '@mui/icons-material/Person';
import { Formik } from 'formik';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

const ProductInventory = () => {
  // Latest Changings
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/product/allProducts`;
  const [InventoryData, setInventoryData] = useState([]);
  const themeMode = localStorage.getItem('themeMode');
  const backgroundColor = themeMode === 'Dark' ? '#1c2d38' : 'white';
  const { currentColor, currentMode } = useStateContext();
  const Pencolor = themeMode === 'Dark' ? '#1c2d38' : 'white';
  const [profileImage, setProfileImage] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  async function getAllProducts() {
    try {
      const response = await axios.get(apiUrl);
      setInventoryData(response.data);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value || prevItem[name], // Retain the previous value if the new value is empty
    }));
  };

  const handleAddItem = () => {
    // add new item to ProductInventory
    console.log('additem ', newItem);
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/product/addNewProduct`, newItem, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        const { data } = response;
        setInventoryData([...InventoryData, data]);
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
    // update existing item in ProductInventory
    console.log('update item', newItem);
    fetch(`${import.meta.env.VITE_BASE_URL}/product/updateProduct/${newItem.productID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedProductInventory = InventoryData.map((item) => (item.id === data.id ? data : item));
        setInventoryData(updatedProductInventory);
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
    // delete item from inventory
    fetch(`${import.meta.env.VITE_BASE_URL}/product/deteleProduct/${newItem.id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          const updatedProductInventory = InventoryData.filter((item) => item.id !== newItem.id);
          setInventoryData(updatedProductInventory);
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
      field: 'image',
      headerName: 'Image',
      width: 80,
      renderCell: (params) => (
        <img src={params.row.image} alt="Product" style={{ width: '100%', height: 'auto' }} />
      ),
    },
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

  console.log(InventoryData);

  const rows = InventoryData.map((user, index) => ({
    image: user.image[0],
    id: user.id,
    name: user.name,
    sku: user.sku,
    price: user.price,
    salecount: user.saleCount,
    stock: user.stock,
    category: user.category,
    shortDescription: user.shortDescription,

  }));

  const Dropzone = ({ setFieldValue }) => {
    const onDrop = React.useCallback(async (acceptedFiles) => {
      // Do something with the files
      console.log(acceptedFiles[0]);
      // eslint-disable-next-line no-use-before-define
      // const uploadedImage = await uploadToCloudinary(acceptedFiles[0]);
      const preset = 'm9lzn6nw';
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      formData.append('preset', 'm9lzn6nw');
      const results = await axios.post('https://api.cloudinary.com/v1_1/daz0bajhs/image/upload', formData, {
        params: {
          upload_preset: 'm9lzn6nw',
        },
      });

      console.log(results);
      console.log(results.data.secure_url);
      setProfileImage(results.data.secure_url);

      // setFieldValue('file', results.data.secure_url);
      // setFileUrl(URL.createObjectURL(results.data.secure_url));
      const uploadedFileArea = document.getElementById('uploadedFileArea');

      // Create an <img> element and set its source to the uploaded file URL
      const imgElement = document.createElement('img');
      imgElement.src = results.data.secure_url;

      // Append the <img> element to the uploaded file area
      uploadedFileArea.appendChild(imgElement);
    }, [setFieldValue]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
      <div {...getRootProps()} sx={{ gridColumn: 'span 1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <input {...getInputProps()} />
        <Avatar id="uploadedFileArea" sx={{ width: '100px', height: '100px', justifyContent: 'center', alignItems: 'center', borderWidth: '1px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', marginTop: '3em', marginBottom: '-2em', cursor: 'pointer' }}>
          <img src={fileUrl} />
        </Avatar>
      </div>
    );
  };

  return (
    <div>

      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-5">Product Inventory Management</h1>

        <h2 className="mt-4 text-xl">Add New Item</h2>

        <Formik>
          {
       ({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue, resetForm }) => (

         <form className="flex flex-row mt-5 items-stretch space-x-10">

           <Box sx={{ mb: 2, marginRight: '20px', marginTop: '-20px' }}>
             <Dropzone setFieldValue={setFieldValue} />

           </Box>

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
       )
}
        </Formik>
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
            onClick={() => { handleDeleteItem(); }}
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
        <Header title="Product Inventory Items" />

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

export default ProductInventory;
