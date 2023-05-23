import React from 'react';
import { Skeleton, Box } from '@mui/material';

const SkeletonLoading = () => (
  <div className="max-w-2xl px-8 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800 cursor-pointer">
    <div className="flex items-center justify-between">
      <span className="text-sm font-light text-gray-600 dark:text-gray-400">
        <Skeleton animation="wave" height={20} width={200} />
      </span>
      <p className="px-3 py-1 text-m font-bold text-gray-100 transition-colors duration-300 transform rounded cursor-pointe dark:text-white">
        <Skeleton animation="wave" height={20} width={100} />
      </p>
    </div>

    <div className="mt-2">
      <Box sx={{ width: '100%' }}>
        <Skeleton animation="wave" height={30} />
      </Box>
      <Box sx={{ width: '100%' }}>
        <Skeleton animation="wave" height={80} />
      </Box>
    </div>
    <div className="flex flex-col mt-3" />

    <div className="flex items-center justify-between mt-4 flex-row">
      <p className="w-24 px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform  rounded cursor-pointer hover:bg-gray-500">
        <Skeleton animation="wave" height={20} width={100} />
      </p>
      <p className="mt-2 dark:text-gray-300">
        <Skeleton animation="wave" height={20} width={200} />
      </p>
    </div>
  </div>
);

export default SkeletonLoading;
