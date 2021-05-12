import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import Scatterplot from './Shared/Scatterplot';
import Scatterplot from './Shared/Shared/Scatterplot'
import Skeleton from '@material-ui/lab/Skeleton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import cloneDeep from 'lodash/cloneDeep';
import '../../../styles/ModelDetails/chart-and-metrics-wrapper.css';

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

export default function ChartAndMetricsWrapper(props) {
  const [chartData, setChartData] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [sortAsc, setSortAsc] = useState(false);
  const [sortedData, setSortedData] = useState([]);

  // useEffect(() => {
  //   let formattedData = [];
  //   const headerConstants = ['x', 'y', 'cluster'];
  //   // let headers = [];
  //   // Object.keys(props.chartData[1]).forEach((key) => {
  //   //   if (!headerConstants.includes(key)) {
  //   //     headers.push(props.chartData[0][key]);
  //   //   }
  //   // });

  //   // setColumnHeaders(headers);
  //   props.chartClusters.forEach((cluster) => {
  //     const filteredData = props.chartData.filter(
  //       (data) => data.cluster === cluster
  //     );
  //     // let randomColor = Math.floor(Math.random()*16777215).toString(16);
  //     var randomColor = '#000000'.replace(/0/g, function () {
  //       return (~~(Math.random() * 16)).toString(16);
  //     });
  //     formattedData.push({
  //       name: cluster === -1 ? 'Anomaly' : `Cluster ${cluster + 1}`,
  //       color:
  //         cluster === -1
  //           ? hexToRgbA('#cccccc')
  //           : color_palette[cluster],
  //       marker: {
  //         symbol: 'circle',
  //       },
  //       data: filteredData,
  //     });
  //   });

  //   setChartData(formattedData);
  // }, [props]);

  // useEffect(() => {
  //   if (props.clusterSizeRange.length > 0) {
  //     const min = props.clusterSizeRange[0];
  //     const max = props.clusterSizeRange[1];
  //     let existingData = chartData;
  //     let filteredData = existingData.filter(
  //       (d) => d.data.length >= min && d.data.length <= max
  //     );
  //     setChartData(filteredData);
  //   }
  // }, [props.clusterSizeRange]);

  // useEffect(() => {
  //   setSortedData(
  //     props.chartData.sort((a, b) => b.data.length - a.data.length)
  //   );
  // }, [props.chartData]);

  const handleSortChartClusters = () => {
    let existingData = cloneDeep(props.chartData);
    if (sortAsc) {
      let sorted = existingData.sort(
        (a, b) => b.data.length - a.data.length
      );
      setSortedData(sorted);
      setSortAsc(false);
      return;
    }
    let sorted = existingData.sort((a, b) => a.data.length - b.data.length);
    setSortedData(sorted);
    setSortAsc(true);
  };

  return (
    <div className="model-details-chart-and-metrics-wrapper">
      <div className="model-details-chart-wrapper">
        {props.chartData.length > 0 ? (
          <Scatterplot
            chartData={props.chartData}
            isFiltering={props.isFiltering}
            selectedClusters={props.selectedClusters}
            filterLoadingText={props.filterLoadingText}
            // chartData={chartData}
            columnHeaders={props.columnHeaders}
            chartClusters={props.chartClusters}
            handleScatterplotPointClicked={props.handleScatterplotPointClicked}
          ></Scatterplot>
        ) : (
          <>
            <h3>Loading Clusters</h3>
            <Skeleton
              animation="wave"
              variant="rect"
              width={900}
              height={250}
            />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Skeleton
                style={{ marginTop: '.1vh' }}
                animation="wave"
                variant="rect"
                width={450}
                height={250}
              />
              <Skeleton
                style={{ marginTop: '.1vh' }}
                animation="wave"
                variant="rect"
                width={450}
                height={250}
              />
            </div>
          </>
        )}
      </div>
      <div className="model-details-right-side">
        <div className="model-details-metrics-wrapper">
          <div className="model-details-metrics-header">
            <h3>Model Metrics</h3>
          </div>
          {props.model.ModelScores ? (
            Object.keys(props.model.ModelScores[0]).map((score, index) => {
              return (
                <div className="model-details-metric-wrapper" key={index}>
                  <p className="model-detail-metric">{score}</p>
                  <p className="model-detail-value">
                    {props.model.ModelScores[0][score]}
                  </p>
                </div>
              );
            })
          ) : (
            <p>no model metrics</p>
          )}
        </div>
        <div className="cluster-filtering-wrapper">
          <div className="model-details-metrics-header">
            <h3>Cluster Information</h3>
            {/* {props.minClusterCount > 0 && props.maxClusterCount > 0 ? (
              <p>
                Showing clusters between this range {props.minClusterCount} -{' '}
                {props.maxClusterCount}
              </p>
            ) : (
              <p>Currently Showing all clusters</p>
            )} */}
          </div>
          <div className="model-details-metric-wrapper">
            {/* <div style={{height: '5px', width:'5px', background: data.color }}></div> */}
            <p className="model-detail-metric" style={{ fontWeight: 600 }}>
              Cluster Name
            </p>
            <p
              className="model-detail-value sort-by-cluster-size"
              // onClick={handleSortChartClusters}
            >
              {/* <ExpandMoreIcon 
                style={{transform: sortAsc ? 'rotate(180deg)' : 'rotate(0deg)'}}
                className="sort-clusters-icon" />  */}
                Points in cluster
            </p>
          </div>
          <div className="scrolling-clusters-wrapper">
            {props.chartData
              ? props.chartData.sort((a, b) => b.data.length - a.data.length).map((data, index) => {
                if (data.data.length > 0) {
                  return (
                    <div key={index} className="model-details-metric-wrapper">
                      <div
                        className="model-detail-metric"
                        style={{ display: 'flex', flexDirection: 'row' }}
                      >
                        <div
                          style={{
                            height: '10px',
                            width: '10px',
                            background: data.color.replace(
                              /[^,]+(?=\))/,
                              '1'
                            ),
                            marginTop: '.5vh',
                          }}
                          className="cluster-circle"
                        ></div>
                        <p style={{ marginLeft: '.5vw' }}>{data.name}</p>
                      </div>
                      <p className="model-detail-value">{data.data.length}</p>
                    </div>
                  );
                }
              })
              : null}
          </div>
          <div className="filter-by-cluster-size-wrapper">
            <Button
              // color="primary"
              size="small"
              className="filter-by-cluster-size-button"
              onClick={props.handleOpenFilterByClusterSizeModal}
            >
              Filter chart by cluster size
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

ChartAndMetricsWrapper.propTypes = {
  model: PropTypes.object,
  data: PropTypes.array,
  options: PropTypes.object,
  chartData: PropTypes.array,
  handleScatterplotPointClicked: PropTypes.func,
  chartClusters: PropTypes.array,
  handleOpenFilterByClusterSizeModal: PropTypes.func,
  clusterSizeRange: PropTypes.array,
  columnHeaders: PropTypes.array,
  minClusterCount: PropTypes.number,
  maxClusterCount: PropTypes.number,
  selectedClusters: PropTypes.array,
  isFiltering: PropTypes.bool,
  filterLoadingText: PropTypes.string
};
