import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';

import { ordersData, contextMenuItems, ordersGrid, medicinesGrid } from '../data/dummy';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

const Medicines = () => {
  // Latest Changings
  const toolbarOptions = ['Delete', 'Edit', 'Update', 'Print'];
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/medicine/allMedicines`;
  const [medicineData, setMedicineData] = useState([]);
  const { currentColor, currentMode } = useStateContext();

  const [newItem, setNewItem] = useState({
    CustomerName: '',
    TotalAmount: '',
    OrderItems: '',
    Status: '',
    MedicineID: '',
    ProductImageUrl: '',
  });

  async function getAllProducts() {
    try {
      const response = await axios.get(apiUrl);
      setMedicineData(response.data);
      console.log(`medicine data${response.data}`); // data
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    // // fetch Medicine data from API

    getAllProducts();

    // fetch('http://localhost:9002/medicine/allMedicines')
    //     .then(response => response.json())
    //     .then(data => setMedicineData(data))
    //     .catch(error => console.error(error));
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = () => {
    // add new item to medicine
    console.log('additem ', newItem);
    fetch(`${import.meta.env.VITE_BASE_URL}/medicine/addNewMedicine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => response.json())
      .then((data) => {
        setIedicineData([...medicineData, data]);
        setNewItem({ CustomerName: '', TotalAmount: '', OrderItems: '', Status: '', MedicineID: '', ProductImageUrl: '' });
      })
      .catch((error) => console.error(error));
  };

  const handleUpdateItem = (updatedItem) => {
    // update existing item in medicine
    fetch(`${import.meta.env.VITE_BASE_URL}/medicine/updateMedicine/${updatedItem.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedItem),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedMedicine = medicineData.map((item) => (item.id === data.id ? data : item));
        setMedicineData(updatedMedicine);
        setNewItem({ CustomerName: '', TotalAmount: '', OrderItems: '', Status: '', MedicineID: '', ProductImageUrl: '' });
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteItem = (itemId) => {
    // delete item from medicine
    fetch(`${import.meta.env.VITE_BASE_URL}/medicine/deteleMedicine/${itemId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          const updatedMedicine = medicineData.filter((item) => item.id !== itemId);
          setMedicineData(updatedMedicine);
          setNewItem({ CustomerName: '', TotalAmount: '', OrderItems: '', Status: '', MedicineID: '', ProductImageUrl: '' });
        }
      })
      .catch((error) => console.error(error));
  };

  const editing = { allowDeleting: true, allowEditing: true };
  return (

    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">

      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-5">Medicine Management</h1>

        <h2 className="mt-4 text-xl">Add New Item</h2>
        <form className="flex flex-row mt-5 items-stretch space-x-10">
          <label className="flex flex-col mb-4">
            Name:
            <input
              className="p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2"
              type="text"
              name="CustomerName"
              value={newItem.CustomerName}
              onChange={handleInputChange}
            />
          </label>

          <label className="flex flex-col mb-4">
            Status:
            <input
              className="p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2"
              type="text"
              name="Status"
              value={newItem.Status}
              onChange={handleInputChange}
            />
          </label>
          <label className="flex flex-col mb-4">
            TotalAmount:
            <input
              className="p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2"
              type="text"
              name="TotalAmount"
              value={newItem.TotalAmount}
              onChange={handleInputChange}
            />
          </label>
        </form>
        <form className="flex flex-row mt-5 items-stretch space-x-10">
          {/* {"\n"} */}

          <label className="flex flex-col mb-4">
            OrderItems:
            <input
              className="p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2"
              type="text"
              name="OrderItems"
              value={newItem.OrderItems}
              onChange={handleInputChange}
            />
          </label>
          <label className="flex flex-col mb-4">
            MedicineID:
            <input
              className="p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2"
              type="number"
              name="MedicineID"
              value={newItem.MedicineID}
              onChange={handleInputChange}
            />
          </label>
          <label className="flex flex-col mb-4">
            Image Url:
            <input
              className="p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2"
              type="text"
              name="ProductImageUrl"
              value={newItem.ProductImageUrl}
              onChange={handleInputChange}
            />
          </label>

          {/* <button type="button" className='mt-3 p-3 font text-base rounded-lg text-white border-0 cursor-pointer hover:bg-green-700 pt-30' onClick={handleAddItem}>Add Item</button> */}
        </form>
        <div className="flex flex-row items-stretch space-x-10 mt-10">
          <button
            className="rounded-md"
            color="white"
            style={{ backgroundColor: currentColor, padding: '18px', color: 'white', marginTop: '10px' }}
            borderRadius="10px"
            onClick={handleAddItem}
          >Add New Medicine
          </button>
          <button
            className="rounded-md"
            color="white"
            style={{ backgroundColor: currentColor, padding: '18px', color: 'white', marginTop: '10px' }}
            borderRadius="10px"
            onClick={handleDeleteItem}
          >Remove Medicine
          </button>
          <button
            className="rounded-md"
            color="white"
            style={{ backgroundColor: currentColor, padding: '18px', color: 'white', marginTop: '10px' }}
            borderRadius="10px"
            onClick={handleUpdateItem}
          >Update Medicine
          </button>
        </div>

      </div>

      <Header title="Medicines" />

      <GridComponent
        id="gridcomp"
        dataSource={ordersData}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        toolbar={toolbarOptions}
        contextMenuItems={contextMenuItems}
        editSettings={editing}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {ordersGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport]} />
      </GridComponent>
    </div>
  );
};
export default Medicines;
