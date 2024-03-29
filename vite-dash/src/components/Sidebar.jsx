import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SiAdguard, SiShopware } from 'react-icons/si';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { useSelector } from 'react-redux';
import { links } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize, userRole } = useStateContext();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  const user = useSelector((state) => state.user);

  // const user = {
  //   role: 'rawMaterialSupplier',
  // };

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link to="/" onClick={handleCloseSideBar} className="items-center gap-3 ml-3 mt-10 flex text-2xl font-extrabold tracking-tight dark:text-white text-slate-900">
              <SiAdguard /> <span>PharmaChain.</span>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10 ">
            {links.map((item) => (
              <div key={item.title}>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  {item.title}
                </p>

                {/* Render Pages section when user is admin */}
                {item.links.map((link) => ((
                  (user.role === 'admin' && (link.name === 'calendar' || link.name === 'employees' || link.name === 'line' || link.name === 'Dashboard' || link.name === 'area' || link.name === 'bar' || link.name === 'financial' || link.name === 'color-mapping' || link.name === 'ManageUsers' || link.name === 'medicines' || link.name === 'inventory' || link.name === 'contracts' || link.name === 'logout'))
                  || (user.role === 'rawMaterialSupplier' && (link.name === 'calendar' || link.name === 'RawMaterials' || link.name === 'CreateRaw' || link.name === 'line' || link.name === 'area' || link.name === 'bar' || link.name === 'Dashboard' || link.name === 'GetJobs' || link.name === 'employees' || link.name === 'medicines' || link.name === 'inventory' || link.name === 'contracts' || link.name === 'logout'))
                  || (user.role === 'manufacturer' && (link.name === 'RawMaterial' || link.name === 'CreateMedicine' || link.name === 'NewMedicines' || link.name === 'PostJob' || link.name === 'PostedJobs' || link.name === 'GetJobs' || link.name === 'calendar' || link.name === 'line' || link.name === 'area' || link.name === 'bar' || link.name === 'Dashboard' || link.name === 'medicines' || link.name === 'inventory' || link.name === 'contracts' || link.name === 'logout'))
                  || (user.role === 'distributor' && (link.name === 'ReceiveMedicine' || link.name === 'SendMedicine' || link.name === 'AllSentMedicines' || link.name === 'PostJob' || link.name === 'PostedJobs' || link.name === 'GetJobs' || link.name === 'calendar' || link.name === 'line' || link.name === 'area' || link.name === 'bar' || link.name === 'Dashboard' || link.name === 'medicines' || link.name === 'inventory' || link.name === 'contracts' || link.name === 'logout'))
                  // eslint-disable-next-line max-len
                  || (user.role === 'pharmacist' && (link.name === 'PharmaReceiveMedicine' || link.name === 'AllMedicines' || link.name === 'UpdateStatus' || link.name === 'calendar' || link.name === 'line' || link.name === 'area' || link.name === 'bar' || link.name === 'Dashboard' || link.name === 'PostJob' || link.name === 'PostedJobs' || link.name === 'medicines' || link.name === 'inventory' || link.name === 'contracts' || link.name === 'logout')) || (user.role === 'transporter' && (link.name === 'PickPackage' || link.name === 'logout'))
                ) ? (
                  <NavLink
                    to={
                      user.role === 'admin'
                        ? `/admin${link.name}`
                        : user.role === 'rawMaterialSupplier'
                          ? `/supplier${link.name}`
                          : user.role === 'transporter'
                            ? `/transporter${link.name}`
                            : user.role === 'manufacturer'
                              ? `/manufacturer${link.name}`
                              : user.role === 'distributor'
                                ? `/distributor${link.name}`
                                : user.role === 'pharmacist'
                                  ? `/pharmacist${link.name}`
                                  : ''
                    }
                    key={link.name}
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    {link.icon}
                    <span className="capitalize ">{link.name}</span>
                  </NavLink>
                  ) : null))}

              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
