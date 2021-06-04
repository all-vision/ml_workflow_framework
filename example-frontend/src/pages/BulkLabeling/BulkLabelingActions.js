import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export default function BulkLabelingActions(props) {
    const [columnNames, setColumnNames] = useState([]);
    const [selectedXValue, setSelectedXValue] = useState('');
    const [selectedYValue, setSelectedYValue] = useState('');
    const [activeModel, setActiveModel] = useState('Kmeans')
    const modelsNames = [
        {
            name: 'Weighted_linkage',
            value: 'weighted'
        },
        {
            name: 'K_medians',
            value: 'median'
        },
        {
            name: 'Kmeans',
            value: 'kmeans'
        },
        {
            name: 'Single_hierarchial',
            value: 'single'
        },
        {
            name: 'Complete_hierarchial',
            value: 'complete'
        },
        {
            name: 'Birch',
            value: 'birch'
        },
        {
            name: 'Average_linkage',
            value: 'average'
        },
        {
            name: 'DBSCAN',
            value: 'dbscan'
        },
        {
            name: 'OPTICS',
            value: 'optics'
        },
        {
            name: 'HDBSCAN',
            value: 'hdbscan'
        },
        {
            name: 'Agglomerative',
            value: 'agglomerative'
        }
    ]
    useEffect(() => {
      console.log("props: ", props);
      if (props.data[0]) {
        const constants = ["x", "y", "cluster"];
        let test = props.data[0];
        let keys = Object.keys(test);
        let columnNames = keys.filter((key) => !constants.includes(key));
        let integerOnlyColumnNames = [];
        columnNames.forEach((column) => {
          if (!isNaN(props.data[1][column]) && props.data[1][column]) {
            integerOnlyColumnNames.push(column);
          }
        });
        setColumnNames(integerOnlyColumnNames);
        console.log("integerOnlyColumnNames: ", integerOnlyColumnNames);
      }
    }, [props.data]);


    const handleResetData = () => {
        props.handleResetData();
        setSelectedXValue('')
        setSelectedYValue('')
      }

    return (
        <div>
        <FormControl
        style={{ minWidth: 150 }}
        error={props.selectedXValueIsNull}
      >
        <InputLabel id="demo-simple-select-label">Select Model</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            style={{ overflowX: "hidden" }}
            // onChange={(e) => this.props.handleChangeXValue(e)}
            // onChange={(e) => this.setState({selectedXValue: e.target.value})}
            onChange={(e) => props.handleChangeModel(e.target.value)}
            value={activeModel}
          >
            {modelsNames.map((model, index) => {
              return (
                <MenuItem value={model} key={index}>
                  {model.name}
                </MenuItem>
              );
            })}
          </Select>
      </FormControl>
            <FormControl
        style={{ minWidth: 150, marginLeft: '2vw' }}
        error={props.selectedXValueIsNull}
      >
        <InputLabel id="demo-simple-select-label">Select X Value</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            style={{ overflowX: "hidden" }}
            // onChange={(e) => this.props.handleChangeXValue(e)}
            // onChange={(e) => this.setState({selectedXValue: e.target.value})}
            onChange={(e) => setSelectedXValue(e.target.value)}
            value={selectedXValue}
          >
            {columnNames.map((column, index) => {
              return (
                <MenuItem value={column} key={index}>
                  {column}
                </MenuItem>
              );
            })}
          </Select>
      </FormControl>
      <FormControl
        style={{ minWidth: 150, marginLeft: "2vw" }}
        error={props.selectedYValueIsNull}
      >
        <InputLabel id="demo-simple-select-label">Select Y Value</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            style={{ overflowX: "hidden" }}
            value={selectedYValue}
            // onChange={(e) => this.props.handleChangeYValue(e)}
            // onChange={(e) => this.setState({selectedYValue: e.target.value})}
            onChange={(e) => setSelectedYValue(e.target.value)}
          >
            {columnNames.map((column, index) => {
              return (
                <MenuItem value={column} key={index}>
                  {column}
                </MenuItem>
              );
            })}
          </Select>
      </FormControl>
      <Button
        style={{
          marginLeft: "1.5vw",
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
        onClick={(() => props.handleSubmitXYValues(selectedYValue, selectedXValue))}
      >
        Reassign X & Y Values
      </Button>
      <Button onClick={handleResetData} style={{marginLeft: '1vw',marginTop: "1.5vh" }}>Reset Data</Button>
      <Button
              style={{
                marginLeft: "1.5vw",
                marginTop: "1.5vh",
                color: "#fafafa",
                background: "#1565C0",
                fontFamily: "Open Sans, Lato, Roboto",
                textTransform: "capitalize",
                fontSize: ".9rem",
              }}
              variant="contained"
              color="primary"
              onClick={() => props.handleOpenBulkLabelModal()}
      >Assign New Label</Button>
        </div>
    )
} 