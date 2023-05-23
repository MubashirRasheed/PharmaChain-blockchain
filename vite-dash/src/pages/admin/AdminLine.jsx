import React from 'react';

import { ChartsHeader, LineChart } from '../../components';

const AdminLine = () => (
  <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
    <ChartsHeader category="Line" title="Sales and Products Graph" />
    <div className="w-full">
      <LineChart />
    </div>
  </div>
);

export default AdminLine;
