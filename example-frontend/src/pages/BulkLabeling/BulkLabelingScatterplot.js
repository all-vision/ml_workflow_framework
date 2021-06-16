/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from 'react';
// import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Button from '@material-ui/core/Button';
import props from '../../theme/props';
// import FilteringLoadingScreen from '../ModelDetails/FilteringLoadingScreen';
// import HighchartsBoost from 'highcharts/modules/boost';
// require('highcharts/modules/exporting')(Highcharts);
// HighchartsBoost(Highcharts);

var Highcharts = require('highcharts');
window.Highcharts = Highcharts;
require('highcharts/modules/exporting')(Highcharts);

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
  const [selectedRows, setSelectedRows] = useState([]);
  const [deselectClicked, setDeselectClicked] = useState(false);

  const chartComponent = useRef(null);

  console.log('props: ', props)

  useEffect(() => {
    const chart = chartComponent.current.chart;
    console.log('chart: ', chart)
  }, []);

  useEffect(() => {
    const chart = chartComponent.current.chart;
    console.log('chartComponent: ', chart.getSelectedPoints())
    var points = chart.getSelectedPoints();
    if (points.length > 0) {
        Highcharts.each(points, function (point) {
            point.select(false);
        });
    }
    setSelectedRows(false);
    props.handleSetSelectedRows([]);
  }, [deselectClicked]);

  useEffect(() => {
    const chart = chartComponent.current.chart;
    console.log('chartComponent: ', chart.getSelectedPoints())
    var points = chart.getSelectedPoints();
    if (points.length > 0) {
        Highcharts.each(points, function (point) {
            point.select(false);
        });
    }

    setSelectedRows(false);
    // if (props.resetButtonClicked) {
    //   unselectByClick()
    // }
  }, [props.resetButtonClicked])

  const handleDeselectByClick = () => {
    setDeselectClicked(true);
    setTimeout(() => {
      setDeselectClicked(false);
    }, 500)
  }
  function unselectByClick() {
    console.log(this.getSelectedPoints());
    var points = this.getSelectedPoints();
    if (points.length > 0) {
        Highcharts.each(points, function (point) {
            point.select(false);
        });
    }
    // console.log('points: ', points)
    setSelectedRows(false);

    props.handleSetSelectedRows([]);
}

console.log('selectedPoints: ', Highcharts.selectedPoints)
function selectedPoints(e) {
    // Show a label
    // console.log('e.points: ', e.points)
    console.log('e.points: ', e.points);
    let formattedPoints = [];
    e.points.forEach((point) => {
        formattedPoints.push(point.options)
    });
    console.log('formattedPoints: ', formattedPoints)
    props.handleSetSelectedRows(formattedPoints);
    setSelectedRows(true);
    // toast(this, '<b>' + e.points.length + ' points selected.</b>' +
    //     '<br>Click on empty space to deselect.');
}

function selectPointsByDrag(e) {

    // Select points
    Highcharts.each(this.series, function (series) {
        Highcharts.each(series.points, function (point) {
            if (point.x >= e.xAxis[0].min && point.x <= e.xAxis[0].max &&
                    point.y >= e.yAxis[0].min && point.y <= e.yAxis[0].max) {
                point.select(true, true);
            }
        });
    });

    // Fire a custom event
    Highcharts.fireEvent(this, 'selectedpoints', { points: this.getSelectedPoints() });

    return false; // Don't zoom
}

  console.log('props: ', props)
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
      events: {
        selection: selectPointsByDrag,
        selectedpoints: selectedPoints,
        click: unselectByClick
    },
    //   panning: {
    //     enabled: true,
    //     type: 'xy',
    //   },
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
        Object.keys(this.point.options).slice(0, 10).forEach((option) => {
            str += `<b style={{width: '150px', whiteSpace: 'normal'}}>${option}</b>:${this.point.options[option]}<br>`
        })
        // for (let index = 0; index < props.columnHeaders.length; index++) {
        //   if (props.columnHeaders[index]) {
        //     str += `<b style={{width: '150px', whiteSpace: 'normal'}}>${props.columnHeaders[index]}</b>:${this.point.options[index]}<br>`;
        //   }
        // }
        // str += `<b>X:</b> ${this.point.x}</b><br>`;
        // str += `<b>Y:</b> ${this.point.y}</b><br>`;
        // str += `<b>Cluster:</b> ${this.point.cluster}</b><br>`;
        return `
            <div className='scatterplot-tooltip'>
                ${str}
          </div>
            `;
      },
      // outside: true,
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
        scatter: {
          animation: false,
          enableMouseTracking: false,
          stickyTracking: false,
          shadow: false,
          dataLabels: { style: { textShadow: false } },
        },
        marker: {
          radius: 3,
          states: {
              select: {
                  fillColor: 'rgba(0,0,0,.1)',
                  lineWidth: 0
              }
          }
      },
        turboThreshold: 0, // Comment out this code to display error
        // showCheckbox: true,
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

//   if (props.isFiltering) {
//     return (
//       <FilteringLoadingScreen
//         isFiltering={props.isFiltering}
//         filterLoadingText={props.filterLoadingText}
//       />
//     );
//   }

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartComponent} />
      {
        (() => {
          console.log('selectedRows: ', selectedRows)
          if (selectedRows) {
            return (
              <Button onClick={() => handleDeselectByClick()} 
              style={{
                // marginLeft: "1.5vw",
                marginTop: "1.5vh",
                color: "#1565C0",
              //   background: "#1565C0",
                border: '1px solid #1565C0',
                fontFamily: "Open Sans, Lato, Roboto",
                textTransform: "capitalize",
                fontSize: ".9rem",
              }}
              variant="outlined"
              color="primary"
              >de-select points</Button>
            )
          } else {
            return null
          }
        })()
      }

    </>
  );
}

export default Scatterplot;
