import React,  { useEffect, useState }  from 'react';
import axios from 'axios';

import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter } from '@syncfusion/ej2-react-grids';

import { customersData, customersGrid } from '../data/dummy';
import { Header } from '../components';

const Customers = () => {
  const selectionsettings = { persistSelection: true };
  const editing = { allowDeleting: true, allowEditing: true };


   //Latest Changings
   const toolbarOptions = ['Delete', 'Edit', 'Update', 'Print'];
   const apiUrl = 'http://localhost:9002/customer/allCustomers';
   const [customersData, setCustomersData] = useState([]);
 
   async function getAllProducts() {
       try {
           const response = await axios.get(apiUrl);
           setCustomersData(response.data);
           console.log("customers data" +response.data); // data 
       } catch (error) {
           console.error(error);
       }
   }
   useEffect(() => {
     // // fetch inventory data from API
 
     getAllProducts();
 
     // fetch('http://localhost:9002/medicine/allMedicines')
     //     .then(response => response.json())
     //     .then(data => setInventoryData(data))
     //     .catch(error => console.error(error));
 }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header title="Users" />
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

export default Customers;
