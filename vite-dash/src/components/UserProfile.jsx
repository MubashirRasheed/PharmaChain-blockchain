import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsCurrencyDollar, BsShield } from 'react-icons/bs';
import { Button } from '.';
import { userProfileData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
// import avatar from '../data/avatar.jpg';
import { setLogout } from '../state';

const UserProfile = () => {
  const { currentColor } = useStateContext();
  const user = useSelector((state) => state.user);
  const avatar = user.picturePath;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/');
    dispatch(setLogout());
    console.log('logout');
    // alert('logout');

    // persistor.flush(); // flush the persisted token
  };

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={avatar}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200"> {user.fullname} </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">  {user.role}   </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400"> {user.email} </p>
        </div>
      </div>
      <div>

        <div className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
          <div onClick={() => { navigate('/EditProfile'); }} className="flex gap-5">
            <button
              type="button"
              style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              <BsCurrencyDollar />
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">My Profile</p>
              <p className="text-gray-500 text-sm dark:text-gray-400"> Account Settings</p>
            </div>
          </div>
        </div>

        <div onClick={() => { navigate('/chat'); }} className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
          <button
            type="button"
            style={{ color: 'rgb(0, 194, 146)', backgroundColor: 'rgb(235, 250, 242)' }}
            className=" text-xl rounded-lg p-3 hover:bg-light-gray"

          >
            <BsShield />
          </button>

          <div>
            <p className="font-semibold dark:text-gray-200 ">My Inbox</p>
            <p className="text-gray-500 text-sm dark:text-gray-400"> Messages </p>
          </div>
        </div>

      </div>
      <div className="mt-5">
        <button
          color="white"
          style={{ backgroundColor: currentColor, padding: '18px', color: 'white', borderRadius: '10px', marginTop: '10px', width: '100%' }}
          borderRadius="10px"
          onClick={handleLogout}
        >Logout
        </button>
        {/* <button
          color="white"
          backgroundColor={currentColor}
          text="Logout"
          borderRadius="10px"
          width="full"
          onClick={() => { console.log("logout") }}
        /> */}
      </div>
    </div>

  );
};

export default UserProfile;
