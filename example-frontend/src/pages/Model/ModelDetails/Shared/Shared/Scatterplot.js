/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import color_palette from '../../ColorPalette';
// import FilteringLoadingScreen from '../ModelDetails/FilteringLoadingScreen';
import FilteringLoadingScreen from '../../FilteringLoadingScreen';
import HighchartsBoost from 'highcharts/modules/boost';
require('highcharts/modules/exporting')(Highcharts);
HighchartsBoost(Highcharts);

function hexToRgbA(hex) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return (
      'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',.5)'
    );
  }
  throw new Error('Bad Hex');
}

function Scatterplot(props) {
  const [chartData, setChartData] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);

  // useEffect(() => {
  //   console.log('scat props: ', props);
  //   let chartData = props.chartData.sort((a,b) => a.cluster - b.cluster);
  //   let selectedClusters = props.selectedClusters.sort((a,b) => a - b);

  //   if (props.selectedClusters.length > 0) {
  //     let wrapper = chartData.filter((series) => selectedClusters.includes(series.cluster));

  //     console.log('scat wrapper: ', wrapper);
  //     setChartData(wrapper);
  //     // console.log('scat wrapper: ', wrapper);
  //   } else {
  //     setChartData(props.chartData);
  //   }

  // }, [props.selectedClusters, props.chartData]);

  const options = {
    chart: {
      type: 'scatter',
      zoomType: 'xy',
      panning: {
        enabled: true,
        type: 'xy',
      },
      panKey: 'shift',
      spacingBottom: 15,
      spacingTop: 10,
      spacingLeft: 10,
      spacingRight: 10,
      height: 550,
      reflow: false,
      animation: false,
      style: {
        fontFamily: 'Open Sans',
      },
    },
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ['viewFullscreen'],
        },
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              enabled: false,
            },
          },
        },
      ],
    },
    yAxis: {
      title: '',
      gridLineColor: '#eee',
    },
    tooltip: {
      className: 'scatterplot-tooltip',
      // useHTML: true,
      style: {
        fontSize: '.8rem',
        whiteSpace: 'normal',
        width: '150px',
        height: '50px',
        padding: '50px',
        textOverflow: 'clip',
        color: '#323748',
        fontFamily: 'Open Sans, Lato, Roboto'
      },
      // formatter: function() {
      //   return '<div>asda</div>';
      // },
      formatter: function () {
        let str = '';
        for (let index = 0; index < props.columnHeaders.length; index++) {
          if (props.columnHeaders[index]) {
            str += `<b style={{width: '150px', whiteSpace: 'normal'}}>${props.columnHeaders[index]}</b>:${this.point.options[index]}<br>`;
          }
        }
        str += `<b>X:</b> ${this.point.x}</b><br>`;
        str += `<b>Y:</b> ${this.point.y}</b><br>`;
        str += `<b>Cluster:</b> ${this.point.cluster}</b><br>`;
        return `
            <div className='scatterplot-tooltip'>
                ${str}
          </div>
            `;
      },
      animation: false,
    },
    title: {
      text: undefined,
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
      floating: true,
      itemDistance: 50,
      symbolHeight: 12,
      symbolWidth: 12,
      symbolRadius: 6,
      // enabled: props.chartClusters.length > 8 ? false : true,
      enabled: false,
    },
    plotOptions: {
      series: {
        // stickyTracking: props.chartData[0].length > 100  ? true : false,
        stickyTracking: false,
        boostThreshold: 500,
        scatter: {
          animation: false,
          enableMouseTracking: false,
          stickyTracking: false,
          shadow: false,
          dataLabels: { style: { textShadow: false } },
        },
        turboThreshold: 0, // Comment out this code to display error
        state: {
          hover: {
            enabled: false,
          },
        },
      },
    },
    series: props.chartData,
    // series: chartData
  };

  if (props.isFiltering) {
    return (
      <FilteringLoadingScreen
        isFiltering={props.isFiltering}
        filterLoadingText={props.filterLoadingText}
      />
    );
  }

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
}

export default Scatterplot;
