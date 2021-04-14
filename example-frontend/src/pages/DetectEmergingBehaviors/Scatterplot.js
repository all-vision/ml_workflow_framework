/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsBoost from 'highcharts/modules/boost';
import color_palette from './color_palette'
require('highcharts/modules/exporting')(Highcharts);
HighchartsBoost(Highcharts);

function hexToRgbA(hex){
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    c= hex.substring(1).split('');
    if(c.length== 3){
      c= [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c= '0x'+c.join('');
    return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',.5)';
  }
  throw new Error('Bad Hex');
}

function HighChart(props) {
  const [chartData, setChartData] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);

  const options = {
    chart: {
      type: 'scatter',
      zoomType: 'xy',
      panning: {
        enabled: true,
        type: 'xy'
      },
      panKey: 'shift',
      spacingBottom: 15,
      spacingTop: 10,
      spacingLeft: 10,
      spacingRight: 10,
      //   width: '50vw',
      height: 550,
      reflow: false,
      animation: false
    },
    responsive: {  
      rules: [{  
        condition: {  
          maxWidth: 500  
        },  
        chartOptions: {  
          legend: {  
            enabled: false  
          }  
        }  
      }]  
    },
    yAxis: {
      title: '',
    },
    tooltip: {
    //   useHTML: true,
    //   formatter: function() {
    //     let str = '';
    //     for (const [index, property] in this.point.options) {
    //       console.log('this: ', this);
    //       if (columnHeaders[index]) {
    //         str += `<b>${columnHeaders[index]}</b>:${this.point.options[index]}<br>`;
    //       }
    //     }
    //     str += `<b>X:</b> ${this.point.x}</b><br>`;
    //     str += `<b>Y:</b> ${this.point.y}</b><br>`;
    //     str += `<b>Cluster:</b> ${this.point.cluster + 1}</b><br>`;
    //     return (
    //       `
    //         <div>
    //             ${str}
    //       </div>
    //         `
    //     );
    //   },
      animation: false
    },
    title: {
      text: undefined
    },
    legend:{
      align: 'center',
      verticalAlign: 'top',
      floating: true,
      itemDistance: 50,
      symbolHeight: 12,
      symbolWidth: 12,
      symbolRadius: 6        
    },
    plotOptions: {
      series: {
        stickyTracking: false,
        scatter: { animation: false, enableMouseTracking: false, stickyTracking: false, shadow: false, dataLabels: { style: { textShadow: false } } },
        turboThreshold: 0, // Comment out this code to display error
        point: {
          events: {
            click: function () {
              props.handleScatterplotPointClicked(this.options);
            }
          }
        },
        state: {
          hover: {
            enabled: false
          }
        }
      },
    },
    series: [{x: 10, y: 15}],
  };
      
  return (
    <HighchartsReact highcharts={Highcharts} options={options} />
  );
}
 
export default HighChart;