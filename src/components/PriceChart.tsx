'use client';

import {
  LineChart,
  areaElementClasses,
  lineElementClasses,
  markElementClasses,
  axisClasses,
} from '@mui/x-charts';
import { FC } from 'react';

type TokenPriceChartProps = {
  data: { time: string; price: number }[];
};

const TokenPriceChart: FC<TokenPriceChartProps> = ({ data }) => {
  return (
    <div className="w-full h-96">
      <LineChart
        xAxis={[
          {
            scaleType: 'band',
            data: data.map((point) => new Date(point.time).getDate().toString()),
            label: 'Date',
          },
        ]}
        series={[
          {
            data: data.map((point) => point.price),
            label: 'Price (USD)',
            color: '#16a34a',
            area: true,
            showMark: false,
          },
        ]}
        sx={{
          backgroundColor: 'transparent',
          [`& .${axisClasses.root}`]: {
            color: '#94a3b8',
          },
          [`& .${lineElementClasses.root}`]: {
            strokeWidth: 2,
          },
          [`& .${areaElementClasses.root}`]: {
            fill: 'url(#v6-gradient)',
            filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))',
          },
          [`& .${markElementClasses.root}`]: {
            display: 'none',
          },
        }}
        height={300}
        margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
      >
        <defs>
          <linearGradient id="v6-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
          </linearGradient>
        </defs>
      </LineChart>
    </div>
  );
};

export default TokenPriceChart;
