import React, { useState, useEffect } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter } from '@syncfusion/ej2-react-grids';
import axios from 'axios';
import product2 from "../data/product2.jpg";
import { inventoryData, inventoryGrid } from '../data/dummy';
import { Header, Button } from '../components';
import { useStateContext } from '../contexts/ContextProvider';


const Inventory = () => {

    //Latest Changings
    const apiUrl = 'http://localhost:9002/product/allProducts';
    const [inventoryData, setInventoryData] = useState([]);

    async function getAllProducts() {
        try {
            const response = await axios.get(apiUrl);
            setInventoryData(response.data);
            console.log(response.data); // data 
        } catch (error) {
            console.error(error);
        }
    }

    const { currentColor, currentMode } = useStateContext();
    const selectionsettings = { persistSelection: true };
    const toolbarOptions = ['Delete', 'Edit', 'Update', 'Print'];
    const editing = { allowDeleting: true, allowEditing: true };

    const [newItem, setNewItem] = useState({
        ProductName: '',
        ProjectName: '',
        Status: '',
        Quantity: '',
        Price: '',
        ProductID: '',
    });

    useEffect(() => {
        // // fetch inventory data from API

        getAllProducts();

        // fetch('http://localhost:9002/product/allProducts')
        //     .then(response => response.json())
        //     .then(data => setInventoryData(data))
        //     .catch(error => console.error(error));
    }, []);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleAddItem = () => {
        // add new item to inventory
        console.log('additem ', newItem);
        fetch('http://localhost:9002/product/addNewProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        })
            .then(response => response.json())
            .then(data => {
                setInventoryData([...inventoryData, data]);
                setNewItem({ ProductName: '', Quantity: '', Price: '', ProjectName: '', Status: '', ProductID: '' });
            })
            .catch(error => console.error(error));
    };

    const handleUpdateItem = updatedItem => {
        // update existing item in inventory
        fetch(`http://localhost:9002/product/updateProduct/${updatedItem.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedItem)
        })
            .then(response => response.json())
            .then(data => {
                const updatedInventory = inventoryData.map(item =>
                    item.id === data.id ? data : item
                );
                setInventoryData(updatedInventory);
                setNewItem({ ProductName: '', Quantity: '', Price: '', ProjectName: '', Status: '', ProductID: '' });
            })
            .catch(error => console.error(error));
    };

    const handleDeleteItem = itemId => {
        // delete item from inventory
        fetch(`http://localhost:9002/product/deteleProduct/${itemId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    const updatedInventory = inventoryData.filter(item => item.id !== itemId);
                    setInventoryData(updatedInventory);
                    setNewItem({ ProductName: '', Quantity: '', Price: '', ProjectName: '', Status: '', ProductID: '' });
                }
            })
            .catch(error => console.error(error));
    };

    return (
        <div>

            <div className="flex flex-col items-center">
                <h1 className='text-3xl font-bold mb-5'>Inventory Management</h1>


                <h2 className='mt-4 text-xl'>Add New Item</h2>
                <form className='flex flex-row mt-5 items-stretch space-x-10'>
                    <label className='flex flex-col mb-4'>
                        Name:
                        <input
                            className='p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2'
                            type="text"
                            name="ProductName"
                            value={newItem.ProductName}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label className='flex flex-col mb-4'>
                        Project Name:
                        <input
                            className='p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2'
                            type="text"
                            name="ProjectName"
                            value={newItem.ProjectName}
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
                </form>
                <form className='flex flex-row mt-5 items-stretch space-x-10'>
                    {/* {"\n"} */}
                    <label className='flex flex-col mb-4'>
                        Quantity:
                        <input
                            className='p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2'
                            type="text"
                            name="Quantity"
                            value={newItem.Quantity}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label className='flex flex-col mb-4'>
                        Price:
                        <input
                            className='p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2'
                            type="text"
                            name="Price"
                            value={newItem.Price}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label className='flex flex-col mb-4'>
                        ProductID:
                        <input
                            className='p-1 text-base rounded-md border-1 border-solid border-[#ccc] mt-2'
                            type="number"
                            name="ProductID"
                            value={newItem.ProductID}
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
                    >Add New Product</button>
                    <button
                        className='rounded-md'
                        color="white"
                        style={{ backgroundColor: currentColor, padding: "18px", color: "white", marginTop: "10px" }}
                        borderRadius="10px"
                        onClick={handleDeleteItem}
                    >Remove Product</button>
                    <button
                        className='rounded-md'
                        color="white"
                        style={{ backgroundColor: currentColor, padding: "18px", color: "white", marginTop: "10px" }}
                        borderRadius="10px"
                        onClick={handleUpdateItem}
                    >Update Product</button>
                </div>
                {/* add some styling to make it look better */}
                {/* <style jsx>{``}</style> */}

            </div>

            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header title="Inventory Items" />
                <GridComponent
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
                    <ColumnsDirective>
                        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                        {inventoryGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
                    </ColumnsDirective>
                    <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter]} />
                </GridComponent>
            </div>
        </div>
    );
}

export default Inventory;