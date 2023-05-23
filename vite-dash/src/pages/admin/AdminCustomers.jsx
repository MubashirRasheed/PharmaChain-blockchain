import React,  { useEffect, useState }  from 'react';
import axios from 'axios';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter } from '@syncfusion/ej2-react-grids';

import { customersData, customersGrid } from '../../data/dummy';
import { Header } from '../../components';
import { useStateContext } from '../../contexts/ContextProvider';

const AdminCustomers = () => {
  const selectionsettings = { persistSelection: true };
  const editing = { allowDeleting: true, allowEditing: true };


    //Latest Changings
    const toolbarOptions = ['Delete', 'Edit', 'Update', 'Print'];
    const apiUrl = 'http://localhost:9002/customer/allCustomers';
    const [customerData, setCustomerData] = useState([]);

    const { currentColor, currentMode } = useStateContext();
  
  
    const [newItem, setNewItem] = useState({
      CustomerName: '',
      CustomerID: '',
      CustomerEmail: '',
      Status: '',
      CustomerID: '',
      CustomerUrl: '',
      Weeks: '',
    });
  
  
    async function getAllProducts() {
      try {
        const response = await axios.get(apiUrl);
        setCustomerData(response.data);
        console.log("customer data" + response.data); // data 
      } catch (error) {
        console.error(error);
      }
    }
    useEffect(() => {
      // // fetch customer data from API
  
      getAllProducts();
  
      // fetch('http://localhost:9002/customer/allcustomers')
      //     .then(response => response.json())
      //     .then(data => setcustomerData(data))
      //     .catch(error => console.error(error));
    }, []);
  
  
    const handleInputChange = event => {
      const { name, value } = event.target;
      setNewItem({ ...newItem, [name]: value });
    };
  
    const handleAddItem = () => {
      // add new item to customer
      console.log('additem ', newItem);
      fetch('http://localhost:9002/customer/addNewCustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      })
        .then(response => response.json())
        .then(data => {
          setIedicineData([...customerData, data]);
          setNewItem({ CustomerName: '', CustomerEmail: '', Weeks: '', Status: '', CustomerID: '', CustomerUrl: '' });
        })
        .catch(error => console.error(error));
    };
  
    const handleUpdateItem = updatedItem => {
      // update existing item in customer
      fetch(`http://localhost:9002/customer/updateCustomer/${updatedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItem)
      })
        .then(response => response.json())
        .then(data => {
          const updatedCustomer = customerData.map(item =>
            item.id === data.id ? data : item
          );
          setCustomerData(updatedCustomer);
          setNewItem({ CustomerName: '', CustomerEmail: '', Weeks: '', Status: '', CustomerID: '', CustomerUrl: '' });
        })
        .catch(error => console.error(error));
    };
  
    const handleDeleteItem = itemId => {
      // delete item from Customer
      fetch(`http://localhost:9002/customer/deteleCustomer/${itemId}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            const updatedCustomer = customerData.filter(item => item.id !== itemId);
            setCustomerData(updatedCustomer);
            setNewItem({ CustomerName: '', CustomerEmail: '', Weeks: '', Status: '', CustomerID: '', CustomerUrl: '' });
          }
        })
        .catch(error => console.error(error));
    };


  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">

<div className="flex flex-col items-center">
        <h1 className='text-3xl font-bold mb-5'>Customer Management</h1>


        <h2 className='mt-4 text-xl'>Add New Item</h2>
        <form className='flex flex-row mt-5 items-stretch space-x-10'>
          <label className='flex flex-col mb-4'>
            Customer Name:
            <input
              className='p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2'
              type="text"
              name="CustomerName"
              value={newItem.CustomerName}
              onChange={handleInputChange}
            />
          </label>
         
          <label className='flex flex-col mb-4'>
            Status:
            <input
              className='p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2'
              type="text"
              name="Status"
              value={newItem.Status}
              onChange={handleInputChange}
            />
          </label>
          <label className='flex flex-col mb-4'>
            CustomerEmail:
            <input
              className='p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2'
              type="text"
              name="CustomerEmail"
              value={newItem.CustomerEmail}
              onChange={handleInputChange}
            />
          </label>
        </form>
        <form className='flex flex-row mt-5 items-stretch space-x-10'>
          {/* {"\n"} */}

          <label className='flex flex-col mb-4'>
            Weeks:
            <input
              className='p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2'
              type="text"
              name="Weeks"
              value={newItem.Weeks}
              onChange={handleInputChange}
            />
          </label>
          <label className='flex flex-col mb-4'>
            CustomerID:
            <input
              className='p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2'
              type="number"
              name="CustomerID"
              value={newItem.CustomerID}
              onChange={handleInputChange}
            />
          </label>
           <label className='flex flex-col mb-4'>
            Image Url:
            <input
              className='p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2'
              type="text"
              name="CustomerUrl"
              value={newItem.CustomerUrl}
              onChange={handleInputChange}
            />
          </label>

          {/* <button type="button" className='mt-3 p-3 font text-base rounded-lg text-white border-0 cursor-pointer hover:bg-green-700 pt-30' onClick={handleAddItem}>Add Item</button> */}
        </form>
        <div className='flex flex-row items-stretch space-x-10 mt-10'>
          <button
            className='rounded-md'
            color="white"
            style={{ backgroundColor: currentColor, padding: "18px", color: "white", marginTop: "10px" }}
            borderRadius="10px"
            onClick={handleAddItem}
          >Add New Customer</button>
          <button
            className='rounded-md'
            color="white"
            style={{ backgroundColor: currentColor, padding: "18px", color: "white", marginTop: "10px" }}
            borderRadius="10px"
            onClick={handleDeleteItem}
          >Remove Customer</button>
          <button
            className='rounded-md'
            color="white"
            style={{ backgroundColor: currentColor, padding: "18px", color: "white", marginTop: "10px" }}
            borderRadius="10px"
            onClick={handleUpdateItem}
          >Update Customer</button>
        </div>

      </div>


      <Header  title="Customers" />
      <GridComponent
        dataSource={customersData}
        enableHover={false}
        allowPaging
        pageSettings={{ pageCount: 5 }}
        selectionSettings={selectionsettings}
        toolbar={toolbarOptions}
        editSettings={editing}
        allowSorting
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {customersGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter]} />
      </GridComponent>
    </div>
  );
};

export default AdminCustomers;
