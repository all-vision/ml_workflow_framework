import React from 'react';
import Button from '@material-ui/core/Button';
import '../../../styles/ModelDetails/chart-and-metrics-wrapper.css';

export default function ClusterInfo(props) {
    return (
      <div className="model-details-right-side">

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
    )
}