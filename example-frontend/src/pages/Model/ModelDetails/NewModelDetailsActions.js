import React, { useEffect, useState } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import LoadingScreen from "./Loading";
import Tooltip from "@material-ui/core/Tooltip";
import "../../../styles/ModelDetails/model-details-actions.css";

export default function NewModelDetailsAction(props) {
  const [columnNames, setColumnNames] = useState([]);
  const [selectedXValue, setSelectedXValue] = useState('');
  const [selectedYValue, setSelectedYValue] = useState('');

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
    props.handleResetClusterData();
    setSelectedXValue('')
    setSelectedYValue('')
  }

  return (
    <div className="model-details-actions-wrapper">
      <FormControl
        style={{ maxWidth: 150, minWidth: 150 }}
        // error={this.props.selectedXValueIsNull}
      >
        <InputLabel id="demo-simple-select-label">Select Clusters</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            multiple
            style={{ overflowX: "hidden" }}
            onChange={(e) => props.handleFilterDataByCluster(e)}
            value={props.selectedClusters}
          >
            <MenuItem value={"All Clusters"}>All Clusters</MenuItem>
            {props.clusters.map((cluster, index) => {
              if (cluster === -1) {
                return (
                  <MenuItem value={cluster} key={index}>
                    {`${cluster} (Anomaly)`}
                  </MenuItem>
                );
              }
              return (
                <MenuItem value={cluster} key={index}>
                  {cluster}
                </MenuItem>
                // </div>
              );
            })}
          </Select>
      </FormControl>
      <FormControl
        style={{ minWidth: 150, marginLeft: "2vw" }}
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
          color: "#fafafa",
          background: "#1565C0",
          fontFamily: "Open Sans, Lato, Roboto",
          textTransform: "capitalize",
          fontSize: ".9rem",
        }}
        variant="contained"
        color="primary"
        onClick={(() => props.handleSubmitXYValues(selectedYValue, selectedXValue))}
      >
        Submit Changes
      </Button>
        <Button
          style={{
            marginLeft: "1vw",
            marginTop: "1.5vh",
            fontSize: ".9rem",
          }}
          color="default"
          className="reset-clusters-button"
          onClick={handleResetData}
        >
          Reset Chart
        </Button>
    </div>
  );
}
