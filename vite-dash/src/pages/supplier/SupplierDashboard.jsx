import React, { useEffect, useState } from 'react';
import { BsBoxSeam, BsCurrencyDollar } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import { IoIosMore } from 'react-icons/io';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

import axios from 'axios';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { HiOutlineRefresh } from 'react-icons/hi';
import { FiBarChart } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { TiTick } from 'react-icons/ti';
import { Stacked, Pie, Button, LineChart, SparkLine } from '../../components';
import { earningData, medicalproBranding, recentTransactions, weeklyStats, dropdownData, SparklineAreaData, ecomPieChartData } from '../../data/dummy';
import { useStateContext } from '../../contexts/ContextProvider';
import product9 from '../../data/product9.jpg';

const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent id="time" fields={{ text: 'Time', value: 'Id' }} style={{ border: 'none', color: (currentMode === 'Dark') && 'white' }} value="1" dataSource={dropdownData} popupHeight="220px" popupWidth="120px" />
  </div>
);

const SupplierDashbaord = () => {
  const { currentColor, currentMode } = useStateContext();
  const [inventoryData, setInventoryData] = useState([]);
  const [contractData, setContractData] = useState([]);

  const token = useSelector((state) => state.token);

  async function getAllProducts() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/supplier/allSuppliers`);
      setInventoryData(response.data);
      // console.log(response.data); // data
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      // Initialize Web3 instance

      const result = await axios.get(`${import.meta.env.VITE_BASE_URL}/contract/getContract`, {
        headers: { 'x-auth-token': token },
      });
      console.log(result.data);
      setContractData(result.data);
    };
    fetchData();

    getAllProducts();
  }, []);

  // Filter contracts based on payment status
  // console.log(contractData);
  const paidContracts = contractData.filter((contract) => contract.paymentStatus === 'Paid');
  const pendingContracts = contractData.filter((contract) => contract.paymentStatus === 'pending');

  // Get the total number of paid contracts and pending contracts
  const totalPaidContracts = paidContracts.length;
  const totalPendingContracts = pendingContracts.length;

  const sumPaidAmounts = contractData
    .filter((contract) => contract.paymentStatus === 'Paid')
    .reduce((sum, contract) => sum + contract.revenue, 0);

  // Calculate the sum of amounts for contracts with paymentStatus: "pending"
  const sumPendingAmounts = contractData
    .filter((contract) => contract.paymentStatus === 'pending')
    .reduce((sum, contract) => sum + contract.amount, 0);

  // Calculate the sum of paid and pending amounts
  const sumTotalAmounts = sumPaidAmounts + sumPendingAmounts;

  const piedata = contractData.map((item) => ({
    ...item,
    amount: item.amount / sumTotalAmounts,
  }));

  // Sort the contractData array by createdAt property in descending order
  const sortedContracts = contractData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  console.log('sorted', sortedContracts);
  // Get the most recent contracts
  const mostRecentContracts = sortedContracts.slice(0, 5); // Assuming you want to retrieve the 5 most recent contracts

  // Extract the desired properties from each contract
  const contractDetails = mostRecentContracts.map((contract) => ({
    amount: contract.amount || 0,
    jobTitle: contract.jobTitle,
    status: contract.paymentStatus,
    createdAt: contract.createdAt,
  }));

  const getTotalProducts = () => inventoryData.length;

  const getTotalSales = () => inventoryData.reduce((total, product) => total + product.saleCount, 0);

  const getTotalStock = () => inventoryData.reduce((total, product) => {
    const stock = product.stock || 0; // Use 0 as the default value if stock is undefined or falsy
    return total + (Number(stock) || 0); // Convert stock to a number and add it to the total, use 0 if it's NaN or falsy
  }, 0);

  const getTotalCategories = () => {
    const allCategories = inventoryData.flatMap((product) => product.category);
    const uniqueCategories = [...new Set(allCategories)].filter((category) => category !== '');
    return uniqueCategories.length;
  };

  const totalProducts = getTotalProducts();
  const totalSales = getTotalSales();
  const totalStock = getTotalStock();
  const totalCategories = getTotalCategories();

  return (
    <div className="mt-24">
      <div className="flex flex-wrap lg:flex-nowrap justify-center ">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3  bg-center">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400">Earnings</p>
              <p className="text-2xl">{`$${sumPaidAmounts}`}</p>
            </div>
            <button
              type="button"
              style={{ backgroundColor: currentColor }}
              className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full  p-4"
            >
              <BsCurrencyDollar />
            </button>
          </div>
          <div className="mt-6">
            <Button
              color="white"
              bgColor={currentColor}
              text="Download"
              borderRadius="10px"
            />
          </div>
        </div>
        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          {/* Dynamic Data */}

          <div key="Total Paid Contracts" className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
            <button
              type="button"
              style={{ color: 'rgb(228, 106, 118)', backgroundColor: '#b6bffa' }}
              className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
            >
              <FiBarChart />
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">{totalPaidContracts}</span>
              <span className="text-sm text-green-600 ml-2">
                {/* {item.percentage} */}
              </span>
            </p>
            <p className="text-sm text-gray-400  mt-1">Total Paid Contracts</p>
          </div>
          <div key="Total Pending Contracts" className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
            <button
              type="button"
              style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }}
              className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
            >
              <MdOutlineSupervisorAccount />
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">{totalPendingContracts}</span>
              <span className="text-sm text-red-600 ml-2">
                {/* {item.percentage} */}
              </span>
            </p>
            <p className="text-sm text-gray-400  mt-1">Total Pending Contracts</p>
          </div>
          <div key="Products" className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
            <button
              type="button"
              style={{ color: 'rgb(255, 244, 229)', backgroundColor: '#904C77' }}
              className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
            >
              <BsBoxSeam />
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">{totalProducts}</span>
              <span className="text-sm text-green-600 ml-2">
                {/* {item.percentage} */}
              </span>
            </p>
            <p className="text-sm text-gray-400  mt-1">Products</p>
          </div>
          <div key="Total Stock" className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
            <button
              type="button"
              style={{ color: 'rgb(0, 194, 146)', backgroundColor: '#e8f7ad' }}
              className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
            >
              <HiOutlineRefresh />
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">{totalStock}</span>
              <span className="text-sm text-red-600 ml-2">
                {/* {item.percentage} */}
              </span>
            </p>
            <p className="text-sm text-gray-400  mt-1">Total Stock</p>
          </div>
        </div>
      </div>

      <div className="flex gap-10 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780  ">
          <div className="flex justify-between">
            <p className="font-semibold text-xl">Revenue Updates</p>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 text-gray-600 hover:drop-shadow-xl">
                <span>
                  <GoPrimitiveDot />
                </span>
                <span>Expense</span>
              </p>
              <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                <span>
                  <GoPrimitiveDot />
                </span>
                <span>Budget</span>
              </p>
            </div>
          </div>
          <div className="mt-10 flex gap-10 flex-wrap justify-center">
            <div className=" border-r-1 border-color m-4 pr-10">
              <div>
                <p>
                  <span className="text-3xl font-semibold">{`$${sumTotalAmounts}`}</span>
                  {/* <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs">
                    23%
                  </span> */}
                </p>
                <p className="text-gray-500 mt-1">Total Revenue</p>
              </div>
              <div className="mt-8">
                <p className="text-3xl font-semibold">{`$${sumPendingAmounts}`}</p>

                <p className="text-gray-500 mt-1">Pending</p>
              </div>

              <div className="mt-5">
                <SparkLine currentColor={currentColor} id="line-sparkLine" type="Line" height="80px" width="250px" data={SparklineAreaData} color={currentColor} />
              </div>
              <div className="mt-10">
                <Button
                  color="white"
                  bgColor={currentColor}
                  text="Download Report"
                  borderRadius="10px"
                />
              </div>
            </div>
            <div>
              <Stacked currentMode={currentMode} width="320px" height="360px" />
            </div>
          </div>
        </div>
        <div>
          <div
            className=" rounded-2xl md:w-400 p-4 m-3"
            style={{ backgroundColor: currentColor }}
          >
            <div className="flex justify-between items-center ">
              <p className="font-semibold text-white text-2xl">Earnings</p>

              <div>
                <p className="text-2xl text-white font-semibold mt-8">{`$${sumTotalAmounts}`}</p>
                <p className="text-gray-200">Total Revenue</p>
              </div>
            </div>

            <div className="mt-4">
              <SparkLine
                currentColor={currentColor}
                id="column-sparkLine"
                height="100px"
                type="Column"
                data={[{ x: 1, yval: contractData[0]?.amount },
                  { x: 2, yval: contractData[1]?.amount },
                  { x: 3, yval: contractData[2]?.amount },
                  { x: 4, yval: contractData[3]?.amount },
                  { x: 5, yval: contractData[4]?.amount }]}
                width="320"
                color="rgb(242, 252, 253)"
              />
            </div>
          </div>

          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl md:w-400 p-8 m-3 flex justify-center items-center gap-10">
            <div>
              <p className="text-2xl font-semibold ">{`$${sumPendingAmounts}`}</p>
              <p className="text-gray-400">Pending Revenue</p>
            </div>
            <div className="w-40">
              <Pie
                id="pie-chart"
                data={piedata}
                legendVisiblity={false}
                height="160px"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-10 m-4 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
          <div className="flex justify-between items-center gap-2">
            <p className="text-xl font-semibold">Recent Transactions</p>
            <DropDown currentMode={currentMode} />
          </div>
          {mostRecentContracts.map((contract) => (
            <div key={contract.jobTitle} className="flex justify-between mt-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  style={{
                    color: 'rgb(228, 106, 118)',
                    backgroundColor: 'rgb(255, 244, 229)',
                  }}
                  className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
                >
                  <TiTick />
                </button>
                <div>
                  <p className="text-md font-semibold">{contract.jobTitle}</p>
                  <p className="text-sm text-gray-400">{contract.jobTitle}</p>
                </div>
              </div>
              <p className="text-green-600">{`$${contract.amount}`}</p>
            </div>
          ))}
          <div className="flex justify-between items-center mt-5 border-t-1 border-color">
            <div className="mt-3">
              <Button
                color="white"
                bgColor={currentColor}
                text="Add"
                borderRadius="10px"
              />
            </div>

            <p className="text-gray-400 text-sm">36 Recent Transactions</p>
          </div>
        </div>
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
          <div className="flex justify-between items-center gap-2 mb-10">
            <p className="text-xl font-semibold">Sales Overview</p>
            <DropDown currentMode={currentMode} />
          </div>
          <div className="md:w-full overflow-auto">
            <LineChart />
          </div>
        </div>
      </div>

      {/* <div className="flex flex-wrap justify-center">
        <div className="md:w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">Weekly Stats</p>
            <button type="button" className="text-xl font-semibold text-gray-500">
              <IoIosMore />
            </button>
          </div>

          <div className="mt-10 ">
            {weeklyStats.map((item) => (
              <div key={item.title} className="flex justify-between mt-4 w-full">
                <div className="flex gap-4">
                  <button
                    type="button"
                    style={{ background: item.iconBg }}
                    className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                  >
                    {item.icon}
                  </button>
                  <div>
                    <p className="text-md font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>

                <p className={`text-${item.pcColor}`}>{item.amount}</p>
              </div>
            ))}
            <div className="mt-4">
              <SparkLine currentColor={currentColor} id="area-sparkLine" height="160px" type="Area" data={SparklineAreaData} width="320" color="rgb(242, 252, 253)" />
            </div>
          </div>

        </div>
        <div className="w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">MedicalPro Branding</p>
            <button type="button" className="text-xl font-semibold text-gray-400">
              <IoIosMore />
            </button>
          </div>
          <p className="text-xs cursor-pointer hover:drop-shadow-xl font-semibold rounded-lg w-24 bg-orange-400 py-0.5 px-2 text-gray-200 mt-10">
            16 APR, 2021
          </p>

          <div className="flex gap-4 border-b-1 border-color mt-6">
            {medicalproBranding.data.map((item) => (
              <div key={item.title} className="border-r-1 border-color pr-4 pb-2">
                <p className="text-xs text-gray-400">{item.title}</p>
                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="border-b-1 border-color pb-4 mt-2">
            <p className="text-md font-semibold mb-2">Teams</p>

            <div className="flex gap-4">
              {medicalproBranding.teams.map((item) => (
                <p
                  key={item.name}
                  style={{ background: item.color }}
                  className="cursor-pointer hover:drop-shadow-xl text-white py-0.5 px-3 rounded-lg text-xs"
                >
                  {item.name}
                </p>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <p className="text-md font-semibold mb-2">Leaders</p>
            <div className="flex gap-4">
              {medicalproBranding.leaders.map((item, index) => (
                <img key={index} className="rounded-full w-8 h-8" src={item.image} alt="" />
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center mt-5 border-t-1 border-color">
            <div className="mt-3">
              <Button
                color="white"
                bgColor={currentColor}
                text="Add"
                borderRadius="10px"
              />
            </div>

            <p className="text-gray-400 text-sm">36 Recent Transactions</p>
          </div>
        </div>
        <div className="w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">Daily Activities</p>
            <button type="button" className="text-xl font-semibold text-gray-500">
              <IoIosMore />
            </button>
          </div>
          <div className="mt-10">
            <img
              className="md:w-96 h-50 "
              src={product9}
              alt=""
            />
            <div className="mt-8">
              <p className="font-semibold text-lg">React 18 coming soon!</p>
              <p className="text-gray-400 ">By Johnathan Doe</p>
              <p className="mt-8 text-sm text-gray-400">
                This will be the small description for the news you have shown
                here. There could be some great info.
              </p>
              <div className="mt-3">
                <Button
                  color="white"
                  bgColor={currentColor}
                  text="Read More"
                  borderRadius="10px"
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default SupplierDashbaord;
