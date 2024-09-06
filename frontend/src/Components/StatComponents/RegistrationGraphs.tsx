// src/components/Graph.tsx

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { OverviewResponseData } from './../../types/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GraphProps {
  data: OverviewResponseData;
}

const Graph: React.FC<GraphProps> = ({ data }) => {
  const chartData = {
    labels: ['Faculty', 'Student', 'Industry Expert'],
    datasets: [
      {
        label: 'Paper Author - IEEE Member',
        data: [
          data.data['Paper Author'].Faculty['IEEE member'],
          data.data['Paper Author'].Student['IEEE member'],
          data.data['Paper Author']['Industry Expert']['IEEE member'],
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Paper Author - Non-IEEE Member',
        data: [
          data.data['Paper Author'].Faculty['non-IEEE member'],
          data.data['Paper Author'].Student['non-IEEE member'],
          data.data['Paper Author']['Industry Expert']['non-IEEE member'],
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Research Colloquium - IEEE Member',
        data: [
          data.data['Doctoral Consortium'].Faculty['IEEE member'],
          data.data['Doctoral Consortium'].Student['IEEE member'],
          data.data['Doctoral Consortium']['Industry Expert']['IEEE member'],
        ],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
      {
        label: 'Research Colloquium - Non-IEEE Member',
        data: [
          data.data['Doctoral Consortium'].Faculty['non-IEEE member'],
          data.data['Doctoral Consortium'].Student['non-IEEE member'],
          data.data['Doctoral Consortium']['Industry Expert']['non-IEEE member'],
        ],
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
      {
        label: 'Attendee - IEEE Member',
        data: [
          data.data['Attendee'].Faculty['IEEE member'],
          data.data['Attendee'].Student['IEEE member'],
          data.data['Attendee']['Industry Expert']['IEEE member'],
        ],
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
      {
        label: 'Attendee - Non-IEEE Member',
        data: [
          data.data['Attendee'].Faculty['non-IEEE member'],
          data.data['Attendee'].Student['non-IEEE member'],
          data.data['Attendee']['Industry Expert']['non-IEEE member'],
        ],
        backgroundColor: 'rgba(231, 76, 60, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Conference Participation Data',
        font: {
            size: 24,
          },
    },
      
    },
  };

  return <Bar data={chartData} options={options} style={{ width: '100%', height: '300px' }} />;
};

export default Graph;
