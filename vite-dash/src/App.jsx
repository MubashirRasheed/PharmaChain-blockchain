/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { useSelector } from 'react-redux';
import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import { Ecommerce, Orders, Calendar, Employees, Stacked, Pyramid, Customers, Kanban, Line, Area, Bar, Pie, Financial, ColorPicker, ColorMapping, Editor, Medicines, Inventory, Contracts } from './pages';
import LoginPage from './pages/login';
import SupplierDashbaord from './pages/supplier/SupplierDashboard.jsx';
import AdminDashboard from './pages/admin/AdminDashboard';
import Chat from './components/chat/Chat.jsx';
import './App.css';

import { useStateContext } from './contexts/ContextProvider';
import AdminEmployee from './pages/admin/AdminEmployee.jsx';
import AdminLine from './pages/admin/AdminLine';
import AdminArea from './pages/admin/AdminArea';
import AdminBar from './pages/admin/AdminBar';
import AdminPie from './pages/admin/AdminPie';
import AdminFinancial from './pages/admin/AdminFinancial';

import AdminStacked from './pages/admin/AdminStacked';
import AdminPyramid from './pages/admin/AdminPyramid';
import AdminColorMapping from './pages/admin/AdminColorMapping';
import AdminManageUsers from './pages/admin/AdminManageUsers';
import RawMaterials from './pages/supplier/RawMaterials';
import CreateRaw from './pages/supplier/CreateRaw';

import TransporterDashboard from './pages/transporter/TransporterDashboard';
import ManufacturerDashboard from './pages/manufacturer/ManufacturerDashboard';
import ManufacturerRawMaterial from './pages/manufacturer/ManufacturerRawMaterial';
import CreateMedicine from './pages/manufacturer/CreateMedicine';
import NewMedicines from './pages/manufacturer/NewMedicines';
import DistributorDashboard from './pages/distributor/DistributorDashboard';
import ReceiveMedicine from './pages/distributor/ReceiveMedicine';
import SendMedicine from './pages/distributor/SendMedicine';
import AllSentMedicines from './pages/distributor/AllSentMedicines';
import PharmacistDashboard from './pages/pharmacist/PharmacistDashboard';
import PharmaReceiveMedicine from './pages/pharmacist/PharmaReceiveMedicine';
import UpdateStatus from './pages/pharmacist/UpdateStatus';
import AllMedicines from './pages/pharmacist/AllMedicines';
import PharmacistInventory from './pages/pharmacist/PharmacistInventory';
import DistributorInventory from './pages/distributor/DistributorInventory';
import SupplierInventory from './pages/supplier/SupplierInventory';
import ManufacturerInventory from './pages/manufacturer/ManufacturerInventory';
import EditProfile from './pages/EditProfile';
import PostJob from './pages/jobs/PostJob';
import GetJobs from './pages/jobs/GetJobs';
import AllPostedJobs from './pages/jobs/AllPostedJobs';
import Payment from './pages/Payment';

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();

  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === '/';
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const accountType = (user ?? {}).role ?? 'unknown';

  if (accountType === 'unknown') {
    console.error('User object is null or undefined.');
  // handle the error here
  } else {
    console.log(`User account type: ${accountType}`);
  // other code here
  }

  // const accountType = user.role ? user.role : 'admin';
  console.log('🚀 ~ file: App.jsx:58 ~ App ~ accountType:', accountType);
  // const accountType = "rawMaterialSupplier";
  console.log(accountType);
  console.log(token);

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  useEffect(() => {
    if (!isLoginPage && !token) {
      // Use the Navigate component from react-router-dom to redirect to the login page
      return navigate('/');
    }
  }, [isLoginPage, token]);

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>

      <div className="flex relative dark:bg-main-dark-bg">
        {/* <div> */}
        <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
          <TooltipComponent
            content="Settings"
            position="Top"
          >
            <button
              type="button"
              onClick={() => setThemeSettings(true)}
              style={{ background: currentColor, borderRadius: '50%' }}
              className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
            >
              <FiSettings />
            </button>

          </TooltipComponent>
        </div>

        {/* {activeMenu || isLoginPage ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={
              activeMenu
                ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
            }
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
              <Navbar />
            </div> */}

        {!isLoginPage && (
        <div className={activeMenu ? 'w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ' : 'w-0 dark:bg-secondary-dark-bg'}>
          <Sidebar />
        </div>
        )}

        <div
          className={
               isLoginPage ? 'bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2 '
                 : activeMenu ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  ' : 'bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2 '
            }
        >

          <div>
            {themeSettings && (<ThemeSettings />)}

            {isLoginPage ? (
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            ) : (
              <>
                <Navbar />
                <Routes>
                  {accountType === 'rawMaterialSupplier' && token != null ? (
                    <>
                      {/* <Route path="/ecommerce" element={<Ecommerce />} /> */}
                      <Route path="/supplierDashboard" element={<SupplierDashbaord />} />
                      <Route path="/suppliercustomers" element={<Customers />} />

                      {/* pages  */}
                      <Route path="/supplierorders" element={<Orders />} />
                      <Route path="/supplieremployees" element={<Employees />} />
                      <Route path="/suppliercustomers" element={<Customers />} />
                      <Route path="/supplierRawMaterials" element={<RawMaterials />} />
                      <Route path="/supplierCreateRaw" element={<CreateRaw />} />
                      <Route path="/supplierinventory" element={<SupplierInventory />} />
                      <Route path="/suppliermedicines" element={<Medicines />} />
                      <Route path="/suppliercontracts" element={<Contracts />} />
                      {/* apps  */}
                      <Route path="/supplierkanban" element={<Kanban />} />
                      <Route path="/suppliereditor" element={<Editor />} />
                      <Route path="/suppliercalendar" element={<Calendar />} />
                      <Route path="/suppliercolor-picker" element={<ColorPicker />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/EditProfile" element={<EditProfile />} />
                      <Route path="/supplierGetJobs" element={<GetJobs />} />

                      {/* charts  */}
                      <Route path="/supplierline" element={<Line />} />
                      <Route path="/supplierarea" element={<Area />} />
                      <Route path="/supplierbar" element={<Bar />} />
                      <Route path="/supplierpie" element={<Pie />} />
                      <Route path="/supplierfinancial" element={<Financial />} />
                      <Route path="/suppliercolor-mapping" element={<ColorMapping />} />
                      <Route path="/supplierpyramid" element={<Pyramid />} />
                      <Route path="/supplierstacked" element={<Stacked />} />
                      <Route path="*" />
                    </>
                  ) : accountType === 'manufacturer' && token != null ? (
                    <>
                      {/* <Route path="/ecommerce" element={<Ecommerce />} /> */}
                      <Route path="manufacturerDashboard" element={<ManufacturerDashboard />} />
                      <Route path="manufacturercustomers" element={<Customers />} />

                      {/* pages  */}
                      <Route path="manufacturerorders" element={<Orders />} />
                      <Route path="manufactureremployees" element={<Employees />} />
                      <Route path="manufacturercustomers" element={<Customers />} />
                      <Route path="manufacturerRawMaterial" element={<ManufacturerRawMaterial />} />
                      <Route path="manufacturerCreateMedicine" element={<CreateMedicine />} />
                      <Route path="manufacturerNewMedicines" element={<NewMedicines />} />
                      <Route path="/manufacturerinventory" element={<ManufacturerInventory />} />
                      <Route path="/manufacturermedicines" element={<Medicines />} />
                      <Route path="/manufacturercontracts" element={<Contracts />} />
                      <Route path="/EditProfile" element={<EditProfile />} />
                      <Route path="/manufacturerPostJob" element={<PostJob />} />
                      <Route path="/manufacturerPostedJobs" element={<AllPostedJobs />} />
                      <Route path="/manufacturerGetJobs" element={<GetJobs />} />

                      {/* apps  */}
                      <Route path="manufacturerkanban" element={<Kanban />} />
                      <Route path="manufacturereditor" element={<Editor />} />
                      <Route path="manufacturercalendar" element={<Calendar />} />
                      <Route path="manufacturercolor-picker" element={<ColorPicker />} />
                      <Route path="/chat" element={<Chat />} />

                      {/* charts  */}
                      <Route path="manufacturerline" element={<Line />} />
                      <Route path="manufacturerarea" element={<Area />} />
                      <Route path="manufacturerbar" element={<Bar />} />
                      <Route path="manufacturerpie" element={<Pie />} />
                      <Route path="manufacturerfinancial" element={<Financial />} />
                      <Route path="manufacturercolor-mapping" element={<ColorMapping />} />
                      <Route path="manufacturerpyramid" element={<Pyramid />} />
                      <Route path="manufacturerstacked" element={<Stacked />} />
                      <Route path="*" />
                    </>

                  ) : accountType === 'admin' && token != null ? (
                    <>
                      {/* <Route path="/ecommerce" element={<Ecommerce />} /> */}
                      <Route path="/adminDashboard" element={<AdminDashboard />} />
                      <Route path="/adminemployee" element={<AdminEmployee />} />
                      <Route path="/adminManageUsers" element={<AdminManageUsers />} />

                      {/* pages  */}
                      <Route path="/adminorders" element={<Orders />} />
                      <Route path="/adminemployees" element={<Employees />} />
                      <Route path="/adminemployee" element={<Customers />} />
                      <Route path="/adminmedicines" element={<Medicines />} />
                      <Route path="/admininventory" element={<Inventory />} />
                      <Route path="/admincontracts" element={<Contracts />} />
                      <Route path="/EditProfile" element={<EditProfile />} />

                      {/* apps  */}
                      <Route path="/adminkanban" element={<Kanban />} />
                      <Route path="/admineditor" element={<Editor />} />
                      <Route path="/admincalendar" element={<Calendar />} />
                      <Route path="/admincolor-picker" element={<ColorPicker />} />
                      <Route path="/chat" element={<Chat />} />

                      {/* charts  */}
                      <Route path="/adminline" element={<AdminLine />} />
                      <Route path="/adminarea" element={<AdminArea />} />
                      <Route path="/adminbar" element={<AdminBar />} />
                      <Route path="/adminpie" element={<AdminPie />} />
                      <Route path="/adminfinancial" element={<AdminFinancial />} />
                      <Route path="/admincolor-mapping" element={<AdminColorMapping />} />
                      <Route path="/adminpyramid" element={<AdminPyramid />} />
                      <Route path="/adminstacked" element={<AdminStacked />} />
                      <Route path="/adminventory" element={<Inventory />} />
                      <Route path="*" />
                    </>

                  ) : accountType === 'distributor' && token != null ? (
                    <>
                      {/* <Route path="/ecommerce" element={<Ecommerce />} /> */}
                      <Route path="distributorDashboard" element={<DistributorDashboard />} />
                      <Route path="distributorcustomers" element={<Customers />} />

                      {/* pages  */}
                      <Route path="distributororders" element={<Orders />} />
                      <Route path="distributoremployees" element={<Employees />} />
                      <Route path="distributorcustomers" element={<Customers />} />
                      <Route path="distributorReceiveMedicine" element={<ReceiveMedicine />} />
                      <Route path="distributorSendMedicine" element={<SendMedicine />} />
                      <Route path="distributorAllSentMedicines" element={<AllSentMedicines />} />
                      <Route path="distributorinventory" element={<DistributorInventory />} />
                      <Route path="/distributormedicines" element={<Medicines />} />
                      <Route path="/distributorcontracts" element={<Contracts />} />
                      <Route path="/EditProfile" element={<EditProfile />} />
                      <Route path="/distributorPostJob" element={<PostJob />} />
                      <Route path="/distributorPostedJobs" element={<AllPostedJobs />} />
                      <Route path="/distributorGetJobs" element={<GetJobs />} />

                      {/* <Route path="distributorNewMedicines" element={<NewMedicines />} /> */}

                      {/* apps  */}
                      <Route path="distributorkanban" element={<Kanban />} />
                      <Route path="distributoreditor" element={<Editor />} />
                      <Route path="distributorcalendar" element={<Calendar />} />
                      <Route path="distributorcolor-picker" element={<ColorPicker />} />
                      <Route path="/chat" element={<Chat />} />

                      {/* charts  */}
                      <Route path="distributorline" element={<Line />} />
                      <Route path="distributorarea" element={<Area />} />
                      <Route path="distributorbar" element={<Bar />} />
                      <Route path="distributorpie" element={<Pie />} />
                      <Route path="distributorfinancial" element={<Financial />} />
                      <Route path="distributorcolor-mapping" element={<ColorMapping />} />
                      <Route path="distributorpyramid" element={<Pyramid />} />
                      <Route path="distributorstacked" element={<Stacked />} />
                      <Route path="Payment" element={<Payment />} />
                      <Route path="*" />
                    </>

                  ) : accountType === 'transporter' && token != null ? (
                    <>
                      {/* <Route path="/ecommerce" element={<Ecommerce />} /> */}
                      <Route path="/transporterPickPackage" element={<TransporterDashboard />} />
                      <Route path="/EditProfile" element={<EditProfile />} />

                    </>

                  ) : accountType === 'pharmacist' && token != null ? (
                    <>
                      {/* <Route path="/ecommerce" element={<Ecommerce />} /> */}
                      <Route path="pharmacistDashboard" element={<PharmacistDashboard />} />
                      <Route path="distributorcustomers" element={<Customers />} />

                      {/* pages  */}
                      <Route path="pharmacistorders" element={<Orders />} />
                      <Route path="pharmacistemployees" element={<Employees />} />
                      <Route path="pharmacistcustomers" element={<Customers />} />
                      <Route path="pharmacistPharmaReceiveMedicine" element={<PharmaReceiveMedicine />} />
                      <Route path="pharmacistUpdateStatus" element={<UpdateStatus />} />
                      <Route path="pharmacistAllMedicines" element={<AllMedicines />} />
                      <Route path="pharmacistinventory" element={<PharmacistInventory />} />
                      <Route path="/pharmacistmedicines" element={<Medicines />} />
                      <Route path="/pharmacistcontracts" element={<Contracts />} />
                      <Route path="/EditProfile" element={<EditProfile />} />
                      <Route path="/pharmacistPostJob" element={<PostJob />} />
                      <Route path="/pharmacistPostedJobs" element={<AllPostedJobs />} />
                      <Route path="/pharmacistGetJobs" element={<GetJobs />} />

                      {/* <Route path="distributorNewMedicines" element={<NewMedicines />} /> */}

                      {/* apps  */}
                      <Route path="pharmacistkanban" element={<Kanban />} />
                      <Route path="pharmacisteditor" element={<Editor />} />
                      <Route path="pharmacistcalendar" element={<Calendar />} />
                      <Route path="pharmacistcolor-picker" element={<ColorPicker />} />
                      <Route path="/chat" element={<Chat />} />

                      {/* charts  */}
                      <Route path="pharmacistline" element={<Line />} />
                      <Route path="pharmacistarea" element={<Area />} />
                      <Route path="pharmacistbar" element={<Bar />} />
                      <Route path="pharmacistpie" element={<Pie />} />
                      <Route path="pharmacistfinancial" element={<Financial />} />
                      <Route path="pharmacistcolor-mapping" element={<ColorMapping />} />
                      <Route path="pharmacistpyramid" element={<Pyramid />} />
                      <Route path="pharmaciststacked" element={<Stacked />} />
                      <Route path="*" />
                    </>

                  )
                    : (
                      <>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="*" />
                      </>
                    )}
                </Routes>
              </>
            )}
          </div>
          {/* {!isLoginPage && (<Footer />)} */}
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
};

export default App;

