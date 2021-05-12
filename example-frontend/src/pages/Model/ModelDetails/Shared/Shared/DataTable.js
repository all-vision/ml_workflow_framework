/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {Grid, AutoSizer, CellMeasurer, CellMeasurerCache, Table, Column} from 'react-virtualized';
import { CSVLink } from 'react-csv';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import Skeleton from '@material-ui/lab/Skeleton';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import 'react-virtualized/styles.css';
// import '../../styles/DEB/deb-table.css';
import '../../../../../styles/ModelDetails/deb-table.css'

const mapStateToProps = (state) => {
  return {
    selectedDataset: state.selectedDataset,
  };
};

const screenWidth =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const cache = new CellMeasurerCache({
  defaultWidth: 100,
  minWidth: screenWidth < 1900 ? 300 : 350,
  fixedHeight: true
});
  
const STYLE = {
  marginBottom: '5vh',
  background: '#fff',
  fontFamily: 'Open Sans',
  borderRadius: '5px',
  boxShadow: '0px 1px 15px rgba(0, 0, 0, 0.1)'
};

const COLUMN_HEADER_STYLE = {
  textTransform: 'capitalize',
  fontWeight: '400'
};

const TABLE_STYLE = {
  fontFamily: 'Open Sans',
};

const ROW_STYLE = {
  border: '1px solid #eee',
};
const STYLE_BOTTOM_LEFT_GRID = {
  borderRight: '2px solid #aaa',
  backgroundColor: '#f7f7f7',
};
const STYLE_TOP_LEFT_GRID = {
  borderBottom: '2px solid #aaa',
  borderRight: '2px solid #aaa',
  fontWeight: 'bold',
};
const STYLE_TOP_RIGHT_GRID = {
  borderBottom: '2px solid #aaa',
  fontWeight: 'bold',
};

function DataTable(props) {
  const [tableData, setTableData ] = useState([]);
  const [filteredByClusterString, setFilteredByClusterString] = useState('');
  const constants = ['x', 'y', 'cluster'];
  const XY = ['x', 'y'];
  const _getColumnWidth = ({ index }) => {
    return index * 50;
  };
  console.log('new table props: ', props);

  // let columnHeaders = ['cluster', ...props.columnHeaders];

  useEffect(() => {
    let newString = '';
    if (props.selectedClusters.length > 0) {
      newString = props.selectedClusters.length === 1 ? 'Table only showing data in cluster ' : 'Table only showing data in clusters ';
      props.selectedClusters.forEach((cluster, index) => {
        if (index === props.selectedClusters.length -1 && props.selectedClusters.length > 1) {
          const miniString = ` and ${cluster}. `;
          newString += miniString;
        } else {
          const miniString = `${cluster},`;
          newString += miniString;
        }
      });
    } else {
      newString = 'Showing all data, use the filter by cluster dropdown above to zero in on a specific cluster. ';
    }

    setFilteredByClusterString(newString.slice(0, -1));
    console.log('real newString: ', newString.slice(0, -2));
  }, [props.selectedClusters]);

  // let items = [];
  // for (let i = 0, l = 1000; i < l; i++) {
  //   items.push({
  //     id: '1',
  //     name: 'hey',
  //     email: 'email'
  //   });
  //   // items.push(generateRandomItem(i));
  // }

  // useEffect(() => {
  //   if (props.data) {
  //     console.log('new props.data: ', props.data);
  //     let joinedArray = [];
  //     for (let i=0; i<props.model.ClusteringColumn.length-1; i++) {
  //       let joinedObj = {...props.data[i]};
  //       if (i === 0) {
  //         joinedObj[Object.keys(props.data[0]).length] = 'Cluster';
  //       } else {
  //         joinedObj[Object.keys(props.data[0]).length] = props.model.ClusteringColumn[i];
  //       }
  //       joinedArray.push(joinedObj);
  //       // console.log(Object.assign(props.data[i], {cluster: props.model.ClusteringColumn[i]}));
  //     }
  //     console.log('new joinedArray: ', joinedArray);
  //     setTableData(joinedArray);
  //   }
  // }, [props]);



  function cellRenderer({columnIndex, key, parent, rowIndex, style}) {
    let newStyle;
    if (rowIndex === 0) {
      newStyle = {
        height: 300,
        left: style.left,
        fontWeight: '600',
        position: 'absolute',
        top: style.top,
        padding: '5px',
        width: style.width,
        background: '#eee'
      };
      return (
        <div key={key} style={newStyle}>
          {props.data[0]}
        </div>
      );
    } else {
      newStyle = {
        height: style.height,
        left: style.left,
        position: style.position,
        top: style.top,
        width: style.width,
        padding: '5px',
        borderTop: '.1px solid #eee',
        borderBottom: '.1px solid #eee',
        marginBottom: '1.5rem',
        background: rowIndex % 2 == 0 ? '#fafafa' : '#FFFFFF'
      };
      return (
        <CellMeasurer
          cache={cache}
          columnIndex={columnIndex}
          key={key}
          parent={parent}
          rowIndex={rowIndex}
        >
          <div
            style={{
              ...newStyle,
              height: 35,
              whiteSpace: 'nowrap'
            }}
          >
            {props.data[rowIndex][columnIndex]}         
          </div>
        </CellMeasurer>
      );
    }

  }

  if (!props.data.length > 0) {
    return (
      <Skeleton variant="rect" width={1000} height={200} />
    );
  }
  else {
    return (
      <>
        <div className="data-table-container">
          <div className="deb-table-header">
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <h1>Your Dataset</h1>
              <p className='filtered-by-cluster-string'>{filteredByClusterString}</p>
            </div>
            {/* {props.targetRow ? (
              <Button
                onClick={props.handleResetTableData}
                style={{ marginLeft: '2vw' }}
              >
            Reset Table
              </Button>
            ) : null} */}
            <CSVLink data={props.data} filename={`allvision_file_satellites`} className="deb-export-csv">
              <p>
                <SaveAltIcon
                  fontSize={'default'}
                  style={{ marginRight: '.5vw' }}
                  className="model-details-export-as-csv-icon"
                ></SaveAltIcon>
            Export as CSV
              </p>
            </CSVLink>
          </div>
          <div className="data-table-wrapper">
            <Table
              width={300 * Object.keys(props.data[0]).length}
              // width={1500}
              height={300}
              rowClassName='table-row'
              headerHeight={50}
              rowHeight={50}
              rowCount={props.data.length}
              rowGetter={({index}) => props.data[index]}>
              {Object.keys(props.data[0]).map((column, index) => {
                console.log('column: ', column)
                if (!XY.includes(column)) {
                  if (!constants.includes(column)) {
                    return (
                      <Column
                        key={index}
                        label={column}
                        dataKey={column}
                        width={Object.keys(props.data[0]).length * 20}
                      />
                    );
                  } 
                  else {
                    return (
                      <Column
                        key={index}
                        label={column.toString()}
                        dataKey={column.toString()}
                        width={Object.keys(props.data[0]).length * 10}
                      />
                    );
                  }
                }
              })}
            </Table>
          </div> 
          <div style={{height: '100px'}}></div>
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps)(DataTable);
