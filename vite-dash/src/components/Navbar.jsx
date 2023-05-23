import React, { useEffect, useRef } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FiLogOut, FiShoppingCart } from 'react-icons/fi';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import avatar from '../data/avatar.jpg';
import { Cart, Notification, UserProfile } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import { setLogout } from '../state/index';

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const { currentColor, activeMenu, setActiveMenu, handleClick, isClicked, setScreenSize, screenSize } = useStateContext();

  const user = useSelector((state) => state.user);

  const avatar = user.picturePath;
  const userProfileRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/');
    dispatch(setLogout());
    console.log('logout');
    // alert('logout');

    // persistor.flush(); // flush the persisted token
  };
  const handleChat = () => {
    navigate('/chat');
  };
  // useEffect(() => {
  //   const handleOutsideClick = (event) => {
  //     if (userProfileRef.current && !userProfileRef.current.contains(event.target)) {
  //       handleClick('userProfile', false);
  //     }
  //   };

  //   window.addEventListener('click', handleOutsideClick);

  //   return () => window.removeEventListener('click', handleOutsideClick);
  // }, [handleClick, userProfileRef]);

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">

      <NavButton title="Menu" customFunc={handleActiveMenu} color={currentColor} icon={<AiOutlineMenu />} />
      <div className="flex">
        {/* <NavButton title="Cart" customFunc={() => handleClick('cart')} color={currentColor} icon={<FiShoppingCart />} /> */}
        <NavButton title="logout" customFunc={handleLogout} color={currentColor} icon={<FiLogOut />} />

        <NavButton title="Chat" dotColor="#03C9D7" customFunc={handleChat} color={currentColor} icon={<BsChatLeft />} />
        {/* customFunc={() => handleClick('chat')}  */}
        <NavButton title="Notification" dotColor="rgb(254, 201, 15)" color={currentColor} icon={<RiNotification3Line />} customFunc={() => handleClick('notification')} />
        {/* customFunc={() => handleClick('notification')} */}
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick('userProfile')}

          >
            <img
              className="rounded-full w-8 h-8"
              src={avatar}
              alt="user-profile"
            />
            <p>
              <span className="text-gray-400 text-14">Hi, </span>{' '}
              <span className="text-gray-400 font-bold ml-1 text-14">
                {user.fullname}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </TooltipComponent>

        {isClicked.cart && (<Cart />)}
        {isClicked.chat && (<Chat />)}
        {isClicked.notification && (<Notification />)}
        {isClicked.userProfile && (<UserProfile />)}
        {/* {console.log('isClicked', isClicked, isClicked.userProfile)} */}
      </div>
    </div>
  );
};

export default Navbar;

// import React, { useEffect, useRef, useState } from 'react';
// import { AiOutlineMenu } from 'react-icons/ai';
// import { FiLogOut, FiShoppingCart } from 'react-icons/fi';
// import { BsChatLeft, BsCurrencyDollar } from 'react-icons/bs';
// import { RiNotification3Line } from 'react-icons/ri';
// import { MdKeyboardArrowDown, MdOutlineCancel } from 'react-icons/md';
// import { TooltipComponent } from '@syncfusion/ej2-react-popups';

// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// // import avatar from '../data/avatar.jpg';
// import { Box, Modal } from '@mui/material';
// import { Cart, Notification, UserProfile, Button } from '.';
// import { useStateContext } from '../contexts/ContextProvider';
// import { setLogout } from '../state/index';

// import { userProfileData } from '../data/dummy';
// // import avatar from '../data/avatar.jpg';

// const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
//   <TooltipComponent content={title} position="BottomCenter">
//     <button
//       type="button"
//       onClick={() => customFunc()}
//       style={{ color }}
//       className="relative text-xl rounded-full p-3 hover:bg-light-gray"
//     >
//       <span
//         style={{ background: dotColor }}
//         className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
//       />
//       {icon}
//     </button>
//   </TooltipComponent>
// );

// const Navbar = () => {
//   const { currentColor, activeMenu, setActiveMenu, handleClick, isClicked, setScreenSize, screenSize } = useStateContext();
//   const [open, setOpen] = useState(false);

//   const user = useSelector((state) => state.user);

//   const avatar = user.picturePath;
//   const userProfileRef = useRef(null);

//   useEffect(() => {
//     const handleResize = () => setScreenSize(window.innerWidth);

//     window.addEventListener('resize', handleResize);

//     handleResize();

//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     if (screenSize <= 900) {
//       setActiveMenu(false);
//     } else {
//       setActiveMenu(true);
//     }
//   }, [screenSize]);

//   const handleActiveMenu = () => setActiveMenu(!activeMenu);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const handleLogout = () => {
//     navigate('/');
//     dispatch(setLogout());
//     console.log('logout');
//     // alert('logout');

//     // persistor.flush(); // flush the persisted token
//   };
//   const handleChat = () => {
//     navigate('/chat');
//   };
//   // useEffect(() => {
//   //   const handleOutsideClick = (event) => {
//   //     if (userProfileRef.current && !userProfileRef.current.contains(event.target)) {
//   //       handleClick('userProfile', false);
//   //     }
//   //   };

//   //   window.addEventListener('click', handleOutsideClick);

//   //   return () => window.removeEventListener('click', handleOutsideClick);
//   // }, [handleClick, userProfileRef]);

//   const handleOpen = () => {
//     setOpen(true);
//   };
//   const handleClose = (event) => {
//     // if (userProfileRef.current && userProfileRef.current.contains(event.target)) {
//     //   // Click inside UserProfile component
//     //   return;
//     // }
//     console.log('close', event.target);

//     setOpen(false);
//   };

//   return (
//     <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">

//       <NavButton title="Menu" customFunc={handleActiveMenu} color={currentColor} icon={<AiOutlineMenu />} />
//       <div className="flex">
//         {/* <NavButton title="Cart" customFunc={() => handleClick('cart')} color={currentColor} icon={<FiShoppingCart />} /> */}
//         <NavButton title="logout" customFunc={handleLogout} color={currentColor} icon={<FiLogOut />} />

//         <NavButton title="Chat" dotColor="#03C9D7" customFunc={handleChat} color={currentColor} icon={<BsChatLeft />} />
//         {/* customFunc={() => handleClick('chat')}  */}
//         <NavButton title="Notification" dotColor="rgb(254, 201, 15)" color={currentColor} icon={<RiNotification3Line />} />
//         {/* customFunc={() => handleClick('notification')} */}
//         <TooltipComponent content="Profile" position="BottomCenter">
//           <div
//             className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
//             onClick={handleOpen}

//           >
//             {open ? (
//               <Modal
//                 open={open}
//                 onClose={handleClose}
//               >

//                 <Box
//                   sx={{
//                     position: 'absolute',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     width: 700,
//                     bgcolor: '#1c2d38',
//                     border: '2px solid #000',
//                     boxShadow: 24,
//                     p: 4,
//                     maxHeight: 500, // set a fixed height for the Box component
//                     overflow: 'auto !important', // add !important rule to the overflow property
//                   }}
//                 >
//                   <Box>

//                     <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
//                       <div className="flex justify-between items-center">
//                         <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
//                         <Button
//                           icon={<MdOutlineCancel />}
//                           color="rgb(153, 171, 180)"
//                           bgHoverColor="light-gray"
//                           size="2xl"
//                           borderRadius="50%"
//                         />
//                       </div>
//                       <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
//                         <img
//                           className="rounded-full h-24 w-24"
//                           src={avatar}
//                           alt="user-profile"
//                         />
//                         <div>
//                           <p className="font-semibold text-xl dark:text-gray-200"> {user.fullname} </p>
//                           <p className="text-gray-500 text-sm dark:text-gray-400">  {user.role}   </p>
//                           <p className="text-gray-500 text-sm font-semibold dark:text-gray-400"> {user.email} </p>
//                         </div>
//                       </div>
//                       <div>

//                         <div className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
//                           <div onClick={() => { navigate('/EditProfile'); }} className="flex gap-5">
//                             <button
//                               type="button"
//                               style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }}
//                               className=" text-xl rounded-lg p-3 hover:bg-light-gray"
//                             >
//                               <BsCurrencyDollar />
//                             </button>

//                             <div>
//                               <p className="font-semibold dark:text-gray-200 ">My Profile</p>
//                               <p className="text-gray-500 text-sm dark:text-gray-400"> Account Settings</p>
//                             </div>
//                           </div>
//                         </div>
//                         {userProfileData.map((item, index) => (
//                           <div key={index} className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
//                             <button
//                               type="button"
//                               style={{ color: item.iconColor, backgroundColor: item.iconBg }}
//                               className=" text-xl rounded-lg p-3 hover:bg-light-gray"
//                             >
//                               {item.icon}
//                             </button>

//                             <div>
//                               <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
//                               <p className="text-gray-500 text-sm dark:text-gray-400"> {item.desc} </p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                       <div className="mt-5">
//                         <button
//                           color="white"
//                           style={{ backgroundColor: currentColor, padding: '18px', color: 'white', borderRadius: '10px', marginTop: '10px', width: '100%' }}
//                           borderRadius="10px"
//                           onClick={handleLogout}
//                         >Logout
//                         </button>
//                         {/* <button
//           color="white"
//           backgroundColor={currentColor}
//           text="Logout"
//           borderRadius="10px"
//           width="full"
//           onClick={() => { console.log("logout") }}
//         /> */}
//                       </div>
//                     </div>
//                     {console.log('open', open)}
//                   </Box>
//                 </Box>
//               </Modal>
//             ) : (
//               <Box sx={{ width: '100%' }}>
//                 {console.log('open', open)}
//               </Box>

//             )}

//             <img
//               className="rounded-full w-8 h-8"
//               src={avatar}
//               alt="user-profile"
//             />
//             <p>
//               <span className="text-gray-400 text-14">Hi, </span>{' '}
//               <span className="text-gray-400 font-bold ml-1 text-14">
//                 {user.fullname}
//               </span>
//             </p>
//             <MdKeyboardArrowDown className="text-gray-400 text-14" />
//           </div>
//         </TooltipComponent>

//         {isClicked.cart && (<Cart />)}
//         {isClicked.chat && (<Chat />)}
//         {isClicked.notification && (<Notification />)}
//         {isClicked.userProfile && (<UserProfile />)}
//         {console.log('isClicked', isClicked, isClicked.userProfile)}
//       </div>
//     </div>
//   );
// };

// export default Navbar;
