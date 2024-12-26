import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

const Chart = ({ fuelInventoryData = [] }) => {
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    return `#${Array.from({ length: 6 })
      .map(() => letters[Math.floor(Math.random() * 16)])
      .join('')}`;
  };

  const getChartOptions = (currentInventory, maxCapacity, fuelType) => {
    const percentage = (currentInventory / maxCapacity) * 100;
    const chartColor = getRandomColor();

    return {
      series: [percentage, 100 - percentage], 
      chart: {
        type: 'donut',  
        height: 320,   
        width: '100%', 
      },
      plotOptions: {
        pie: {
          donut: {
            size: '80%',  
            labels: {
              show: true,
              name: {
                show: true,
              },
              total: {
                show: true,
                label: `${fuelType} Fuel`,
                formatter: () => `${currentInventory.toFixed(2)} L / ${maxCapacity} L`,  
              },
              value: {
                show: true,
                formatter: (val) => `${Math.round(val)}%`,  
              },
            },
          },
        },
      },
      labels: [`${fuelType} Fuel Inventory`], 
      colors: [chartColor, '#e0e0e0'],
      legend: {
        position: 'bottom',  
      },
      dataLabels: {
        enabled: false,  
      },
      stroke: {
        colors: ['transparent'],  
      },
    };
  };

  useEffect(() => {
    if (fuelInventoryData.length === 0) return;

    const charts = []; 

    fuelInventoryData.forEach((inventory, index) => {
      const chartId = `donut-chart-${index}`; 
      const chartContainer = document.getElementById(chartId); 

      if (chartContainer) {
        const options = getChartOptions(inventory.current, inventory.max, inventory.type);

        const chart = new ApexCharts(chartContainer, options);

        try {
          chart.render(); 
          charts.push(chart);  
        } catch (error) {
          console.error(`Error rendering chart for ${inventory.type}:`, error);
        }
      }
    });

    return () => {
      charts.forEach((chart) => chart.destroy());
    };
  }, [fuelInventoryData]); 

  return (
    <div className="flex flex-col items-center min-h-screen">
      <h5 className="text-xl font-bold mb-4">Fuel Inventory</h5>
      <div className="flex flex-wrap justify-center gap-6">
        {fuelInventoryData.map((inventory, index) => (
          <div key={index} className="w-full max-w-xs bg-white rounded-lg shadow p-4">
            <div id={`donut-chart-${index}`} className="py-6"></div> 
            <p className="text-center mt-2 text-sm font-medium">
              {inventory.type} - {inventory.current.toFixed(2)} L / {inventory.max} L
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chart;
