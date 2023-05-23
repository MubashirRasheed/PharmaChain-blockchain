import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';

import { ordersData, contextMenuItems, ordersGrid, medicinesGrid, contractsData } from '../data/dummy';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

const Contracts = () => {
  // Latest Changings
  const toolbarOptions = ['Delete', 'Edit', 'Update', 'Print'];
  const apiUrl = 'http://localhost:9002/contracts/allContracts';
  const [contractsData, setContractsData] = useState([]);
  const { currentColor, currentMode } = useStateContext();

  const [newItem, setNewItem] = useState({
    CustomerName: '',
    TotalAmount: '',
    OrderItems: '',
    Status: '',
    ContractID: '',
    ProductImageUrl: '',
  });

  async function getAllProducts() {
    try {
      const response = await axios.get(apiUrl);
      setContractsData(response.data);
      console.log(`Contracts data${response.data}`); // data
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    // // fetch Contracts data from API

    getAllProducts();

    // fetch('http://localhost:9002/Contracts/allContracts')
    //     .then(response => response.json())
    //     .then(data => setContractsData(data))
    //     .catch(error => console.error(error));
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = () => {
    // add new item to Contracts
    console.log('additem ', newItem);
    fetch('http://localhost:9002/contracts/addNewContracts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => response.json())
      .then((data) => {
        setIedicineData([...contractsData, data]);
        setNewItem({ CustomerName: '', TotalAmount: '', OrderItems: '', Status: '', ContractID: '', ProductImageUrl: '' });
      })
      .catch((error) => console.error(error));
  };

  const handleUpdateItem = (updatedItem) => {
    // update existing item in medicine
    fetch(`http://localhost:9002/contracts/updateContracts/${updatedItem.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedItem),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedContracts = contractsData.map((item) => (item.id === data.id ? data : item));
        setContractsData(updatedContracts);
        setNewItem({ CustomerName: '', TotalAmount: '', OrderItems: '', Status: '', ContractID: '', ProductImageUrl: '' });
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteItem = (itemId) => {
    // delete item from Cntracts
    fetch(`http://localhost:9002/contracts/deteleContracts/${itemId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          const updatedContracts = contractsData.filter((item) => item.id !== itemId);
          setContractsData(updatedContracts);
          setNewItem({ CustomerName: '', TotalAmount: '', OrderItems: '', Status: '', ContractID: '', ProductImageUrl: '' });
        }
      })
      .catch((error) => console.error(error));
  };

  const editing = { allowDeleting: true, allowEditing: true };
  return (

    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">

      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-5">Contracts Management</h1>

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
            ContractID:
            <input
              className="p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2"
              type="number"
              name="ContractID"
              value={newItem.ContractID}
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
          >Add New Contracts
          </button>
          <button
            className="rounded-md"
            color="white"
            style={{ backgroundColor: currentColor, padding: '18px', color: 'white', marginTop: '10px' }}
            borderRadius="10px"
            onClick={handleDeleteItem}
          >Remove Contracts
          </button>
          <button
            className="rounded-md"
            color="white"
            style={{ backgroundColor: currentColor, padding: '18px', color: 'white', marginTop: '10px' }}
            borderRadius="10px"
            onClick={handleUpdateItem}
          >Update Contracts
          </button>
        </div>

      </div>

      <Header title="Contracts" />

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
          {medicinesGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport]} />
      </GridComponent>
    </div>
  );
};
export default Contracts;
