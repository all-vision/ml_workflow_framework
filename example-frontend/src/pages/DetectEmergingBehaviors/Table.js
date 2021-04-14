/* eslint-disable react/prop-types */
import React from 'react';
import ReactDOM from 'react-dom';
import {Grid, AutoSizer} from 'react-virtualized';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import Skeleton from '@material-ui/lab/Skeleton';
import Button from '@material-ui/core/Button';


const list = [
    ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125],
    // And so on...
  ];

const screenWidth =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const STYLE = {
  marginBottom: '5vh',
  background: '#fff',
  fontFamily: 'Open Sans',
  borderRadius: '5px',
  boxShadow: '0px 1px 15px rgba(0, 0, 0, 0.1)'

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

function ReactVirtualizedGrid(props) {

  const _getColumnWidth = ({ index }) => {
    return index * 50;
  };

  function cellRenderer({columnIndex, key, rowIndex, style}) {
    let newStyle;

    console.log('style: ', style);
    if (rowIndex === 0) {
      newStyle = {
        // height: style.height,
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
          {list[rowIndex][columnIndex]}
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
        <div key={key} style={newStyle}>
          {list[rowIndex][columnIndex]}
        </div>
      );
    }

  }

    return (
      <>
        <div className="deb-table-header">
          <h1>Your Dataset</h1>
        </div>
        <Grid
          cellRenderer={cellRenderer}
          columnCount={list.length}
          columnWidth={screenWidth < 1900 ? 300 : 350}
          height={300}
          style={STYLE}
          rowStyle={ROW_STYLE}
          styleBottomLeftGrid={STYLE_BOTTOM_LEFT_GRID}
          styleTopLeftGrid={STYLE_TOP_LEFT_GRID}
          styleTopRightGrid={STYLE_TOP_RIGHT_GRID}
          rowCount={list.length}
          rowHeight={40}
          width={1100}
        /> 
      </>
    );
}

export default ReactVirtualizedGrid;
// Render your grid
