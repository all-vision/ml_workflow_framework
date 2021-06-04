/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import LoadingScreen from './Loading';
import Tooltip from '@material-ui/core/Tooltip';
import color_palette from './ColorPalette';
import '../../../styles/ModelDetails/model-details-actions.css';
import Checkbox from '@material-ui/core/Checkbox';

export default class ModelDetailsActions extends Component {
  state = {
    model: '',
    clusters: [],
    selectedXValue: '',
    selectedYValue: '',
    columnNames: [],
  };

  componentDidMount() {
    const constants = ['x', 'y', 'cluster'];
    let test = this.props.data[0];
    let keys = Object.keys(test);
    let columnNames = keys.filter((key) => !constants.includes(key));
    let integerOnlyColumnNames = [];
    columnNames.forEach((column) => {
      if (!isNaN(this.props.data[1][column]) && this.props.data[1][column]) {
        integerOnlyColumnNames.push(column);
      }
    }); 
    this.setState({
      columnNames: integerOnlyColumnNames,
      model: this.props.model,
    });
  }

  // handleSubmitXYValues = () => {
  //   this.props.handleSubmitXYValues(this.state.selectedYValue, this.state.selectedXValue);
  //   this.setState({
  //     selectedXValue: '',
  //     selectedYValue: ''
  //   });
  // }

  handleResetData = () => {
    this.props.handleResetClusterData();
    this.setState({
      selectedXValue: '',
      selectedYValue: ''
    });
  }
  render() {
    console.log('real this.props: ', this.props);
    if (!this.state.model) {
      return <LoadingScreen></LoadingScreen>;
    }
    return (
      <>
        <div className="model-details-actions-wrapper">
          <FormControl
            style={{ maxWidth: 150, minWidth: 150 }}
            // error={this.props.selectedXValueIsNull}
          >
            <InputLabel id="demo-simple-select-label">
                Select Clusters
            </InputLabel>
            <Tooltip title="Filter the scatterplot by multiple clusters" placement="top-start">
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                multiple
                style={{ overflowX: 'hidden' }}
                onChange={(e) => this.props.handleFilterDataByCluster(e)}
                value={this.props.selectedClusters}
              >
                <MenuItem value={'All Clusters'}>All Clusters</MenuItem>
                {this.props.clusters.map((cluster, index) => {
                  if (cluster === -1) {
                    return (
                      <MenuItem value={cluster} key={index} > 
                        {`${cluster} (Anomaly)`}
                      </MenuItem>
                    );
                  }
                  return (
                    <MenuItem 
                      value={cluster} 
                      key={index}
                    >
                      {cluster}
                    </MenuItem>
                  // </div>
                  );
                })}
              </Select>
            </Tooltip>
          </FormControl>
          {/* : null
          } */}

          <FormControl
            style={{ minWidth: 150, marginLeft: '2vw' }}
            error={this.props.selectedXValueIsNull}
          >
            <InputLabel id="demo-simple-select-label">
              Select X Value
            </InputLabel>
            <Tooltip title="Reassign X Value to another column's value" placement="top-start">
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ overflowX: 'hidden' }}
                // onChange={(e) => this.props.handleChangeXValue(e)}
                onChange={(e) => this.setState({selectedXValue: e.target.value})}
                value={this.state.selectedXValue}
              >
                {this.state.columnNames.map((column, index) => {
                  return (
                    <MenuItem value={column} key={index}>
                      {this.props.data[0][column]}
                    </MenuItem>
                  );
                })}
              </Select>
            </Tooltip>
          </FormControl>
          <FormControl
            style={{ minWidth: 150, marginLeft: '2vw' }}
            error={this.props.selectedYValueIsNull}
          >
            <InputLabel id="demo-simple-select-label">
              Select Y Value
            </InputLabel>
            <Tooltip title="Reassign Y Value to another column's value" placement="top-start">
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ overflowX: 'hidden' }}
                value={this.state.selectedYValue}
                // onChange={(e) => this.props.handleChangeYValue(e)}
                onChange={(e) => this.setState({selectedYValue: e.target.value})}
              >
                {this.state.columnNames.map((column, index) => {
                  return (
                    <MenuItem value={column} key={index}>
                      {this.props.data[0][column]}
                    </MenuItem>
                  );
                })}
              </Select>
            </Tooltip>
          </FormControl>
          <Button
            style={{
              marginLeft: '1.5vw',
              marginTop: '1.5vh',
              color: '#fafafa',
              background: '#1565C0',
              fontFamily: 'Open Sans, Lato, Roboto',
              textTransform: 'capitalize',
              fontSize: '.9rem',
            }}
            variant="contained"
            color="primary"
            onClick={() => this.props.handleSubmitXYValues(this.state.selectedYValue, this.state.selectedXValue)}
          >
            Submit Changes
          </Button>
          <Tooltip title="Reset clusters and selected X,Y values." placement="top-start">
            <Button
              style={{
                marginLeft: '1vw',
                marginTop: '1.5vh',
                fontSize: '.9rem',
              }}
              color="default"
              className="reset-clusters-button"
              onClick={this.handleResetData}
            >
              Reset Chart
            </Button>
          </Tooltip>
        </div>
      </>
    );
  }
}
