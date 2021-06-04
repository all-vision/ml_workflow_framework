/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
// import Sidebar from '../Sidebar/Sidebar';
import ModelDetailsActions from "./ModelDetailsActions";
import LoadingScreen from "./Loading";
import ChartAndMetricsWrapper from "./ChartAndMetricsWrapper";
import ElbowChartAndParameters from "./ElbowChartAndHyperparameters/ElbowChartAndParameters";
import { connect } from "react-redux";
import axios from "axios";
import { useQuery, gql, useSubscription } from "@apollo/client";
import DataTable from "./Shared/Shared/DataTable";
import Skeleton from "@material-ui/lab/Skeleton";
import ModelDetailsAlert from "./ModelDetailsAlert";
// import { newModelIsBeingCreated, setActiveModel, setAllModelNames } from '../../redux/actions/index';
import FilterByClusterSizeModal from "./FilterByClusterSizeModal.js";
import color_palette from "./ColorPalette";
import cloneDeep from "lodash/cloneDeep";
import NoResultsFoundSnackbar from "./NoResultsFoundSnackbar.tsx";
import NewModelNameModal from "./NewModelNameModal";
import NewModelCreatedSnackbar from "./NewModelCreatedSnackbar";
import ModelDetailSkeleton from "./ModelDetailSkeleton";
import worker from "./WebWorker/worker.js";
import WebWorker from "./WebWorker/workerSetup.js";
import NewScatterplot from "./NewScatterplot";
import NewModelDetailsActions from "./NewModelDetailsActions";
import ClusterInfo from "./ClusterInfo";
import "../../../styles/ModelDetails/model-details-wrapper.css";
import "../../../styles/ModelDetails/chart-and-metrics-wrapper.css";


const ModelDetailsWrapper = (props) => {
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [originalTableData, setOriginalTableData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [chartClusters, setChartClusters] = useState([]);
  const [formattedChartData, setFormattedChartData] = useState([]);
  const [originalChartData, setOriginalChartData] = useState([]);
  const [selectedClusters, setSelectedClusters] = useState([]);
  const [selectedYValueIsNull, setSelectedYValueIsNull] = useState(false);
  const [selectedXValueIsNull, setSelectedXValueIsNull] = useState(false);
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [
    filterByClusterSizeModalIsOpen,
    setFilterByClusterSizeModalIsOpen,
  ] = useState(false);

      const [maxClusterCount, setMaxClusterCount] = useState(0);
    const [minClusterCount, setMinClusterCount] = useState(0);

  useEffect(() => {
    console.log("real data: ", data);

    if (data.length > 0) {
      const clusters = data
        .map((item) => item.clusters)
        .filter((value, index, self) => self.indexOf(value) === index);

      setChartClusters(clusters);
      let formattedData = [];
      const headerConstants = ["x", "y", "cluster"];
      let headers = [];
      Object.keys(data[1]).forEach((key) => {
        if (!headerConstants.includes(key)) {
          headers.push(data[0][key]);
        }
      });

      setColumnHeaders(headers);

      console.log("headers: ", headers);

      clusters.forEach((cluster) => {
        console.log("data: ", data);
        const filteredData = data.filter((d) => d.clusters === cluster);
        formattedData.push({
          name: cluster === -1 ? "Anomaly" : `Cluster ${cluster}`,
          cluster: cluster,
          color: cluster === -1 ? "#cccccc" : color_palette[cluster],
          marker: {
            symbol: "circle",
          },
          visible: true,
          // data: filteredData,
        data: [{x:1, y:1}, ...filteredData]
        });
      });

      let dataRange = formattedData.map((d) => d.data.length);
      let min = dataRange.sort((a, b) => a - b)[0];
      let max = dataRange.sort((a, b) => a - b)[dataRange.length - 1];
      setMinClusterCount(min);
      setMaxClusterCount(max);
      setOriginalChartData(cloneDeep(formattedData));
      console.log("real formattedData: ", formattedData);
      setFormattedChartData(formattedData);
    }
  }, [data]);

  function getCorsFreeUrl(url) {
    // return 'https://cors-anywhere.herokuapp.com/' + url;
    return "https://api.allorigins.win/raw?url=" + url;
  }

  useEffect(() => {
    // call api here
    axios
      .get(getCorsFreeUrl("https://spacetest.azurewebsites.net/data"))
      .then((response) => {
        setData(response.data);
        setOriginalData(cloneDeep(response.data));
        setTableData(response.data)
        setOriginalTableData(cloneDeep(response.data))
        console.log("response: ", response);
      });
  }, []);

  const handleFilterDataByCluster = (e) => {
    // setIsFiltering(true);
    const targetClusters = e.target.value;
    console.log("targetClusters: ", targetClusters);
    // setFilterLoadingText('Filtering Data By Cluster');

    if (!targetClusters.length > 0) {
      setSelectedClusters([]);
      setFormattedChartData(originalChartData);
      return;
    }
    if (targetClusters.includes("All Clusters")) {
      setSelectedClusters([]);
      setFormattedChartData(originalChartData);
      return;
    }

    // const existingData = [...originalChartData];

    let existingTableData = [...originalTableData];

    const filteredTableData = existingTableData.filter((d) =>
      targetClusters.includes(d.clusters)
    );

    console.log('filteredTableData: ', filteredTableData)
    setTableData(filteredTableData);

    // deep clone original chart data to prevent any direct mutation of state
    let test = cloneDeep(originalChartData);
    let formattedData = test.filter(
      (t) => targetClusters.indexOf(t.cluster) !== -1
    );

    setSelectedClusters(targetClusters);
    console.log("formattedData: ", formattedData);
    setFormattedChartData(formattedData);
    // setTimeout(() => {
    //   setFormattedChartData(formattedData);
    //   setSelectedClusters(targetClusters);
    // }, 100);

    // setTimeout(function(){
    //   setIsFiltering(false);
    // }, 1000);
  };

  const handleResetClusterData = () => {
    setSelectedClusters([]);
    setFormattedChartData(originalChartData);
  };


  const handleSubmitXYValues = (selectedXValue, selectedYValue) => {
    // console.log('selectedXValue: ', selectedXValue);
    // console.log('selectedYValue: ', selectedYValue);
    if (!selectedXValue && !selectedYValue) {
      setSelectedXValueIsNull(true);
      setSelectedYValueIsNull(true);
    } else if (!selectedXValue && selectedYValue) {
      setSelectedXValueIsNull(true);
      setSelectedYValueIsNull(false);
    } else if (!selectedYValue && selectedXValue) {
      setSelectedXValueIsNull(false);
      setSelectedYValueIsNull(true);
    } else {
      // setIsFiltering(true);
      // setFilterLoadingText('Reassigning X and Y Values');
      const newXYValues = {
        xValue: selectedXValue,
        yValue: selectedYValue,
      };

      let existingData = [...formattedChartData];
      let wrapper = [];
      existingData.forEach((series) => {
        let newSeries = cloneDeep(series);
        newSeries.data.forEach((d) => {
          d.x = parseFloat(d[newXYValues.xValue]);
          d.y = parseFloat(d[newXYValues.yValue]);
        });
        wrapper.push(newSeries);
      });

      console.log("wrapper: ", wrapper);
      setFormattedChartData(wrapper);
      // setTimeout(() => {
      //   setIsFiltering(false);
      // }, 1000);
    }
  };

    const handleFilterDataByClusterSize = (values) => {
      // setIsFiltering(true);
      // setFilterLoadingText('Filtering Data by Cluster Size');
      const min = values[0];
      const max = values[1];

      let existingData = cloneDeep(originalChartData);

      let filteredData = existingData.filter(
        (d) => d.data.length >= min && d.data.length <= max
      );
      if (filteredData.length > 0) {
        // setShowNoClustersFoundSnackbar(false);
        // let res = filteredData.map((item) => item.cluster);
        setFormattedChartData(filteredData);
        setFilterByClusterSizeModalIsOpen(false);
        // setTimeout(() => {
        //   setIsFiltering(false);
        // }, 1000);
        return;
      }

      // setShowNoClustersFoundSnackbar(true);
      // setIsFiltering(false);
      return;
    };

  //   const handleOpenNewModelNameModal = (params) => {
  //     setModelHyperparameters(params);
  //     setNewModelNameModalIsOpen(true);
  //   };

  //   const handleCloseNewModelNameModal = () => {
  //     setNewModelNameModalIsOpen(false);
  //   };

  const handleOpenFilterByClusterSizeModal = () => {
    setFilterByClusterSizeModalIsOpen(true);
  };

  const handleCloseFilterByClusterSizeModal = () => {
    setFilterByClusterSizeModalIsOpen(false);
  };

  //   const handleOpenAssignModelToDEB = () => {
  //     setAssignModelToDEBIsOpen(true);
  //   };

  //   const handleOpenModal = () => {
  //     setDeployModelModalIsOpen(true);
  //   };

  return (
    <>
               <FilterByClusterSizeModal
              chartData={formattedChartData}
              minClusterCount={minClusterCount}
              maxClusterCount={maxClusterCount}
              handleFilterDataByClusterSize={handleFilterDataByClusterSize}
              chartClusters={chartClusters}
              filterByClusterSizeModalIsOpen={filterByClusterSizeModalIsOpen}
              handleCloseFilterByClusterSizeModal={
                handleCloseFilterByClusterSizeModal
              }
            ></FilterByClusterSizeModal>
      <NewModelDetailsActions
        data={data}
        handleFilterDataByCluster={handleFilterDataByCluster}
        selectedClusters={selectedClusters}
        handleSubmitXYValues={handleSubmitXYValues}
        clusters={chartClusters.sort((a, b) => a - b)}
        handleResetClusterData={handleResetClusterData}
        selectedXValueIsNull={selectedXValueIsNull}
        selectedYValueIsNull={selectedYValueIsNull}
      ></NewModelDetailsActions>
      <div className="model-details-chart-and-metrics-wrapper">
        <div className="model-details-chart-wrapper">
        <NewScatterplot
          chartData={formattedChartData}
          columnHeaders={columnHeaders}
        ></NewScatterplot>
        </div>
        <ClusterInfo
        chartData={formattedChartData}
        handleCloseFilterByClusterSizeModal={handleCloseFilterByClusterSizeModal}
        handleOpenFilterByClusterSizeModal={handleOpenFilterByClusterSizeModal}
        />
      </div>
      <div className="model-details-data-table-wrapper">
      <DataTable
      selectedClusters={selectedClusters}
        data={tableData ? tableData : []}
      >
      </DataTable>
      </div>
    </>
  );

};

export default React.memo(ModelDetailsWrapper);
