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

// const mapStateToProps = (state) => {
//   return {
//     modelAssignedToDEB: state.modelAssignedToDEB,
//     selectedDataset: state.selectedDataset,
//     auth_token: state.auth_token,
//     activeDatasetData: state.activeDatasetData,
//     allModelNames: state.allModelNames,
//     activeModel: state.activeModel,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     setActiveModel: (model) => dispatch(setActiveModel(model)),
//     setAllModelNames: (models) => dispatch(setAllModelNames(models)),
//     newModelIsBeingCreated: (bool) => dispatch(newModelIsBeingCreated(bool))
//   };
// };

// const GET_LATEST_MODEL = gql`
//   query MyQuery {
//     ModelsTable(limit: 1, order_by: { ModelID: desc }) {
//       ModelName
//       DatasetID
//       ModelHyperparameters
//       ModelScores
//       ModelID
//       ClusteringColumn
//     }
//   }
// `;

// const GET_CLUSTERING_COLUMN = gql`
//   query ($ModelID: Int) {
//     ModelsTable(where: { ModelID: { _eq: $ModelID } }) {
//       ModelHyperparameters
//       ClusteringColumn
//     }
//   }
// `;

// const GET_COORDINATES = gql`
//   query ($DatasetIDRef: uuid) {
//     DatasetsTable(where: { DatasetIDRef: { _eq: $DatasetIDRef } }) {
//       Coordinates
//     }
//   }
// `;

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
          data: filteredData,
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
  //   const [model, setModel] = useState(null);
  //   const [data, setData] = useState(null);
  //   const [selectedCluster, setSelectedCluster] = useState([]);
  //   const [selectedYValue, setSelectedYValue] = useState('');
  //   const [selectedXValue, setSelectedXValue] = useState('');
  //   const [selectedXYValues, setSelectedXYValues] = useState(null);
  //   const [selectedYValueIsNull, setSelectedYValueIsNull] = useState(false);
  //   const [selectedXValueIsNull, setSelectedXValueIsNull] = useState(false);
  //   const [activePage, setActivePage] = useState('modeldetails');
  //   const [deployModelModalIsOpen, setDeployModelModalIsOpen] = useState(false);
  //   const [assignModelToDEBIsOpen, setAssignModelToDEBIsOpen] = useState(false);
  //   const [accessAPIModalIsOpen, setAccessAPIModalIsOpen] = useState(false);
  //   const [elbowChartData, setElbowChartData] = useState([
  //     12,
  //     2,
  //     0.5,
  //     0.5,
  //     0.5,
  //     0.5,
  //     0.5,
  //     0.5,
  //     1,
  //     1.5,
  //   ]);
  //   const [hyperparameters, setHyperparameters] = useState([
  //     {
  //       name: 'min_samples',
  //       value: 8,
  //     },
  //     {
  //       name: 'eps',
  //       value: 12,
  //     },
  //     {
  //       name: 'metric',
  //       value: 'euclidian',
  //     },
  //     {
  //       name: 'min_samples',
  //       value: 8,
  //     },
  //     {
  //       name: 'metric_params',
  //       value: {},
  //     },
  //     {
  //       name: 'algorithm',
  //       value: 'ball_tree',
  //     },
  //     {
  //       name: 'leaf_size',
  //       value: 30,
  //     },
  //     {
  //       name: 'p',
  //       value: 4.3,
  //     },
  //   ]);
  //   const [chartClusters, setChartClusters] = useState([]);
  //   const [chartData, setChartData] = useState([]);
  //   const [originalChartData, setOriginalChartData] = useState([]);
  //   const [modelHyperparameters, setModelHyperparameters] = useState([]);
  //   const [defaultHyperparameters, setDefaultHyperparameters] = useState([]);
  //   const [elbowChartDropdownValue, setElbowChartDropdownValue] = useState(
  //     'leaf_size'
  //   );
  //   const [hyperparameterErrorInputs, setHyperparameterErrorInputs] = useState(
  //     []
  //   );
  //   const [selectedClusters, setSelectedClusters] = useState([]);
  //   const [clusterSizeRange, setClusterSizeRange] = useState([]);
  //   const [formattedChartData, setFormattedChartData] = useState([]);
  //   const [originalFormattedChartData, setOriginalFormattedChartData] = useState(
  //     []
  //   );
  //   const [columnHeaders, setColumnHeaders] = useState([]);
  //   const [maxClusterCount, setMaxClusterCount] = useState(0);
  //   const [minClusterCount, setMinClusterCount] = useState(0);
  //   const [tableData, setTableData] = useState([]);
  //   const [originalTableData, setOriginalTableData] = useState([]);

  //   const [
  //     showNoClustersFoundSnackbar,
  //     setShowNoClustersFoundSnackbar,
  //   ] = useState(false);

  //   const [
  //     filterByClusterSizeModalIsOpen,
  //     setFilterByClusterSizeModalIsOpen,
  //   ] = useState(false);

  //   const [newModelNameModalIsOpen, setNewModelNameModalIsOpen] = useState(false);
  //   const [newModelIsBeingCreated, setNewModelISBeingCreated] = useState(false);
  //   const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  //   const [webWorker] = useState(new WebWorker(worker));
  //   const [isFiltering, setIsFiltering] = useState(false);
  //   const [filterLoadingText, setFilterLoadingText] = useState('');

  //   const coordinates = useQuery(GET_COORDINATES, {
  //     variables: { DatasetIDRef: props.selectedDataset.DatasetIDRef },
  //     pollInterval: 500,
  //   });

  //   const clusteringColumnData = useQuery(GET_CLUSTERING_COLUMN, {
  //     variables: { ModelID: props.activeModel.ModelID },
  //     pollInterval: 500,
  //   });

  //   useEffect(() => {
  //     setShowLoadingScreen(true);
  //     if (!clusteringColumnData.loading && clusteringColumnData.data) {
  //       let clusterColumns =
  //         clusteringColumnData.data.ModelsTable[0].ClusteringColumn;

  //       let res = clusterColumns
  //         .map((item) => item['0'])
  //         .filter((value, index, self) => self.indexOf(value) === index);

  //       setChartClusters(res);

  //       setModelHyperparameters(
  //         clusteringColumnData.data.ModelsTable[0].ModelHyperparameters[0]
  //       );

  //       console.log('real modelHyperparameters: ', clusteringColumnData.data.ModelsTable[0].ModelHyperparameters[0]);
  //       setDefaultHyperparameters(
  //         clusteringColumnData.data.ModelsTable[0].ModelHyperparameters[0]
  //       );
  //     }
  //   }, [clusteringColumnData, props.activeModel]);

  //   useEffect(() => {
  //     if (!coordinates.loading && !clusteringColumnData.loading && data) {
  //       let clusterColumns =
  //         clusteringColumnData.data.ModelsTable[0].ClusteringColumn;

  //       let final = [];
  //       console.log('debug coordinates: ', coordinates);
  //       console.log('debug data: ', data);
  //       if (coordinates.data.DatasetsTable) {
  //         for (
  //           let i = 0;
  //           i < coordinates.data.DatasetsTable[0].Coordinates.length;
  //           i++
  //         ) {
  //           let test = {
  //             ...data[i],
  //             ...coordinates.data.DatasetsTable[0].Coordinates[i],
  //           };
  //           // test.cluster = clusterColumns[i]['0'];
  //           test.cluster = clusterColumns[i] ? clusterColumns[i]['0'] : -1;
  //           final.push(test);
  //         }
  //       }

  //       setOriginalChartData(cloneDeep(final));
  //       setTableData(final);
  //       setOriginalTableData(final);
  //       setChartData(final);
  //     }
  //   }, [coordinates, data, clusteringColumnData]);

  // useEffect(() => {
  //   if (chartData.length > 0 && chartClusters.length > 0) {
  //     let formattedData = [];
  //     const headerConstants = ['x', 'y', 'cluster'];
  //     let headers = [];
  //     Object.keys(chartData[1]).forEach((key) => {
  //       if (!headerConstants.includes(key)) {
  //         headers.push(chartData[0][key]);
  //       }
  //     });

  //     setColumnHeaders(headers);
  //     chartClusters.forEach((cluster) => {
  //       const filteredData = chartData.filter(
  //         (data) => data.cluster === cluster
  //       );
  //       formattedData.push({
  //         name: cluster === -1 ? 'Anomaly' : `Cluster ${cluster}`,
  //         cluster: cluster,
  //         color: cluster === -1 ? '#cccccc' : color_palette[cluster],
  //         marker: {
  //           symbol: 'circle',
  //         },
  //         visible: true,
  //         data: filteredData,
  //       });
  //     });

  //     let dataRange = formattedData.map((d) => d.data.length);
  //     let min = dataRange.sort((a, b) => a - b)[0];
  //     let max = dataRange.sort((a, b) => a - b)[dataRange.length - 1];
  //     setMinClusterCount(min);
  //     setMaxClusterCount(max);

  //     let clonedFormattedData = cloneDeep(formattedData);
  //     setOriginalFormattedChartData(clonedFormattedData);
  //     setFormattedChartData(formattedData);
  //     setTimeout(function(){
  //       setShowLoadingScreen(false);
  //     }, 1000);
  //     // alert('finish loading model');
  //   }
  // }, [chartData, chartClusters]);

  //   // helper function to check if input is a float
  //   function isFloat(value) {
  //     if (!isNaN(value) && value.toString().indexOf('.') != -1) {
  //       return true;
  //     }
  //     return false;
  //   }

  //   const handleUpdateHyperparameter = (event, param) => {
  //     const newValue = event.target.value;
  //     let existingHyperparameters = modelHyperparameters;
  //     let clone = Object.assign({}, existingHyperparameters);
  //     clone[param] = newValue;
  //     setModelHyperparameters(clone);
  //   };

  //   const handleResetHyperparameters = () => {
  //     // const defaultHyperparameters = defaultHyperparameters;
  //     setModelHyperparameters(defaultHyperparameters);
  //     // POST REQUEST TO RESET HYPERPARAMETERS
  //   };

  //   // const checkHyperparameterTypes = (hyperparameters) => {

  //   //   const filteredByTypeInt = Object.keys(
  //   //     Object.fromEntries(
  //   //       Object.entries(kmeans_types).filter(([key, value]) => value === 'Int')
  //   //     )
  //   //   );

  //   //   const filteredByTypeFloat = Object.keys(
  //   //     Object.fromEntries(
  //   //       Object.entries(kmeans_types).filter(([key, value]) => value === 'float')
  //   //     )
  //   //   );

  //   //   const hyperparameterKeys = Object.keys(hyperparameters);

  //   //   let errors = [];
  //   //   hyperparameterKeys.forEach((key) => {
  //   //     // check if input is a float
  //   //     if (filteredByTypeFloat.includes(key) && !isFloat(hyperparameters[key])) {
  //   //       errors.push(key);
  //   //     }

  //   //     // check if input is a whole number
  //   //     if (filteredByTypeInt.includes(key) && isFloat(hyperparameters[key])) {
  //   //       // alert('should be whole number');
  //   //       errors.push(key);
  //   //     }
  //   //   });

  //   //   setHyperparameterErrorInputs(errors);
  //   //   if (errors.length > 0) {
  //   //     return true;
  //   //   }
  //   //   return false;
  //   // };

  //   const handleSubmitHyperparameters = (newModelName) => {

  //     // if (checkHyperparameterTypes(modelHyperparameters)) {
  //     //   return;
  //     // }

  //     props.newModelIsBeingCreated({
  //       isBeingCreated: true,
  //       newModelName: newModelName
  //     });
  //     console.log('newModelName: ', newModelName);
  //     let datasetIDRef = props.selectedDataset.DatasetIDRef;

  //     let modelHyperparametersCopy = cloneDeep(modelHyperparameters);

  //     // convert every current hyperparameter to a string for backend
  //     function toString(o) {
  //       Object.keys(o).forEach((k) => {
  //         if (o[k] && typeof o[k] === 'object') {
  //           return toString(o[k]);
  //         }
  //         o[k] = '' + o[k];
  //       });

  //       return o;
  //     }

  //     const modelHyperparametersToString = toString(modelHyperparametersCopy);

  //     // const newModelHyperparameters = {
  //     //   model_name: newModelName,
  //     //   ...modelHyperparametersToString
  //     // };
  //     // console.log('newModelHyperparameters: ', newModelHyperparameters);
  //     axios({
  //       method: 'post',
  //       url: 'https://allvisiondocs.azurewebsites.net/embed',
  //       data: {
  //         filename: datasetIDRef
  //       },
  //     }).then(
  //       (response) => {
  //         console.log('new response: ', response);
  //       },
  //       (error) => {
  //         console.warn('error: ', error);
  //       }
  //     );

  //     if (props.activeModel.ModelName.trim() === 'Agglomerative'.trim()) {
  //       axios({
  //         method: 'post',
  //         url: 'https://allvisiondocs.azurewebsites.net/agglomerative_new',
  //         data: {
  //           filename: datasetIDRef,
  //           model_name: newModelName,
  //           hyperparameters: modelHyperparametersToString
  //         },
  //       }).then(
  //         (response) => {
  //           console.log('new response: ', response);
  //           props.routeProps.history.push('/unsupervised');
  //         },
  //         (error) => {
  //           console.warn('error: ', error);
  //         }
  //       );
  //     }

  //     if (props.activeModel.ModelName.trim() === 'KMeans'.trim()) {
  //       axios({
  //         method: 'post',
  //         url: 'https://allvisiondocs.azurewebsites.net/kmeans_new',
  //         data: {
  //           filename: datasetIDRef,
  //           model_name: newModelName,
  //           hyperparameters: modelHyperparametersToString
  //         },
  //       }).then(
  //         (response) => {
  //           console.log('new response: ', response);
  //           props.routeProps.history.push('/unsupervised');
  //         },
  //         (error) => {
  //           console.warn('error: ', error);
  //         }
  //       );
  //     }
  //     props.newModelIsBeingCreated({
  //       isBeingCreated: true,
  //       newModelName: newModelName
  //     });
  //     // setTimeout(function(){
  //     //   props.newModelIsBeingCreated({
  //     //     isBeingCreated: false,
  //     //     newModelName: ''
  //     //   });
  //     //   alert('done');
  //     // }, 5000);
  //   };

  //   // ELBOW CHART
  //   const handleUpdateSelectedHyperparameter = (event) => {
  //     const newSelectedHyperparameter = event.target.value;
  //     setElbowChartDropdownValue(newSelectedHyperparameter);
  //   };

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
  //   const handleResetClusterData = () => {
  //     setIsFiltering(true);
  //     setFilterLoadingText('Resetting Data');

  //     setTimeout(() => {
  //       let clusterColumns =
  //       clusteringColumnData.data.ModelsTable[0].ClusteringColumn;

  //       let res = clusterColumns
  //         .map((item) => item['0'])
  //         .filter((value, index, self) => self.indexOf(value) === index);

  //       setChartClusters(res);
  //       setSelectedCluster([]);
  //       setSelectedClusters([]);
  //       setSelectedXValueIsNull(null);
  //       setSelectedXValueIsNull(false);
  //       setSelectedYValueIsNull(false);

  //       setChartData(originalChartData);
  //       setTableData(originalTableData);
  //       setFormattedChartData(originalFormattedChartData);
  //       setIsFiltering(false);
  //     }, 100);

  //     setTimeout(() => {
  //       setIsFiltering(false);
  //     }, 1000);
  //   };

  //   const handleAuthenticationResult = (res) => {
  //     const message = res.data.message;
  //     if (message === 'Invalid session token.') {
  //       alert('FAILURE');
  //       props.routeProps.history.push('/notauthorized');
  //       return;
  //     }

  //     if (props.activeDatasetData) {
  //       // setTableData(props.activeDatasetData);
  //       setData(props.activeDatasetData);
  //     } else {
  //       axios({
  //         method: 'post',
  //         url: 'https://allvisiondocs.azurewebsites.net/data',
  //         data: { filename: props.selectedDataset.DatasetIDRef },
  //         onUploadProgress: function (progressEvent) {
  //           console.log(progressEvent);
  //         },
  //       }).then(
  //         (response) => {
  //           // setTableData(response.data);
  //           setData(response.data);
  //         },
  //         (error) => {
  //           console.log(error.response);
  //         }
  //       );
  //     }
  //   };

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
  //   if (showLoadingScreen) {
  //     return (
  //       <ModelDetailSkeleton></ModelDetailSkeleton>
  //       // <div
  //       //   className="sidebar-page-wrapper"
  //       //   style={{ display: 'flex', flexDirection: 'row' }}
  //       // >
  //       //   <Sidebar
  //       //     model={model}
  //       //     handleSelectActiveModel={handleSelectActiveModel}
  //       //     mods={props.allModelNames}
  //       //     activePage={activePage}
  //       //     routeProps={props.routeProps}
  //       //     selectedDataset={props.selectedDataset}
  //       //   ></Sidebar>
  //       //   <div className="model-detail-main-content">
  //       //     <ModelDetailSkeleton></ModelDetailSkeleton>
  //       //   </div>
  //       // </div>
  //     );
  //   }

  //   if (chartClusters && data && chartData && model) {
  //     return (
  //       <div
  //         className="sidebar-page-wrapper"
  //         style={{ display: 'flex', flexDirection: 'row' }}
  //       >
  //         {/* <Sidebar
  //           model={model}
  //           handleSelectActiveModel={handleSelectActiveModel}
  //           mods={props.allModelNames}
  //           activePage={activePage}
  //           routeProps={props.routeProps}
  //           selectedDataset={props.selectedDataset}
  //         ></Sidebar> */}
  //         <div className="model-detail-main-content">
  //           <NoResultsFoundSnackbar
  //             showNoClustersFoundSnackbar={showNoClustersFoundSnackbar}
  //           ></NoResultsFoundSnackbar>
  //           <NewModelCreatedSnackbar newModelIsBeingCreated={newModelIsBeingCreated}></NewModelCreatedSnackbar>
  //           <NewModelNameModal
  //             handleSubmitHyperparameters={handleSubmitHyperparameters}
  //             newModelNameModalIsOpen={newModelNameModalIsOpen}
  //             handleCloseNewModelNameModal={handleCloseNewModelNameModal}
  //           ></NewModelNameModal>
  //           <FilterByClusterSizeModal
  //             chartData={formattedChartData}
  //             minClusterCount={minClusterCount}
  //             maxClusterCount={maxClusterCount}
  //             handleFilterDataByClusterSize={handleFilterDataByClusterSize}
  //             chartClusters={chartClusters}
  //             filterByClusterSizeModalIsOpen={filterByClusterSizeModalIsOpen}
  //             handleCloseFilterByClusterSizeModal={
  //               handleCloseFilterByClusterSizeModal
  //             }
  //           ></FilterByClusterSizeModal>
  //           <div className="model-detail-header">
  //             <h1>KMeans Details</h1>
  //             <h3>
  //               Coordinates generated by UMAP, coloring determined by labels that
  //               were found.
  //             </h3>
  //             <div className="model-detail-header-buttons-wrapper">
  //               <ModelDetailsActions
  //                 model={model}
  //                 data={data}
  //                 selectedCluster={selectedCluster}
  //                 // selectedXValue={selectedXValue}
  //                 // selectedYValue={selectedYValue}
  //                 selectedYValueIsNull={selectedYValueIsNull}
  //                 selectedXValueIsNull={selectedXValueIsNull}
  //                 clusters={chartClusters.sort((a, b) => a - b)}
  //                 selectedClusters={selectedClusters}
  //                 handleFilterDataByCluster={handleFilterDataByCluster}
  //                 handleOpenModal={handleOpenModal}
  //                 handleResetClusterData={handleResetClusterData}
  //                 handleOpenAssignModelToDEB={handleOpenAssignModelToDEB}
  //                 // handleChangeXValue={handleChangeXValue}
  //                 // handleChangeYValue={handleChangeYValue}
  //                 handleSubmitXYValues={handleSubmitXYValues}
  //               ></ModelDetailsActions>
  //             </div>
  //           </div>
  //           <ModelDetailsAlert></ModelDetailsAlert>
  //           {formattedChartData && formattedChartData.length > 0 ? (
  //             <ChartAndMetricsWrapper
  //               model={model}
  //               // clusterSizeRange={clusterSizeRange}
  //               chartData={formattedChartData}
  //               minClusterCount={minClusterCount}
  //               isFiltering={isFiltering}
  //               filterLoadingText={filterLoadingText}
  //               maxClusterCount={maxClusterCount}
  //               selectedClusters={selectedClusters}
  //               chartClusters={chartClusters}
  //               columnHeaders={columnHeaders}
  //               handleOpenFilterByClusterSizeModal={
  //                 handleOpenFilterByClusterSizeModal
  //               }
  //               data={data}
  //             ></ChartAndMetricsWrapper>
  //           ) : (
  //             <p>loading</p>
  //           )}

  //           <ElbowChartAndParameters
  //             model={model}
  //             elbowChartData={elbowChartData}
  //             hyperparameterErrorInputs={hyperparameterErrorInputs}
  //             handleOpenNewModelNameModal={handleOpenNewModelNameModal}
  //             handleUpdateHyperparameter={handleUpdateHyperparameter}
  //             handleSubmitHyperparameters={handleSubmitHyperparameters}
  //             handleUpdateSelectedHyperparameter={
  //               handleUpdateSelectedHyperparameter
  //             }
  //             hyperparameters={hyperparameters}
  //             modelHyperparameters={modelHyperparameters}
  //             defaultHyperparameters={defaultHyperparameters}
  //             handleResetHyperparameters={handleResetHyperparameters}
  //             elbowChartDropdownValue={elbowChartDropdownValue}
  //           ></ElbowChartAndParameters>
  //           <div className="model-details-data-table-wrapper">
  //             {tableData.length > 0 && model ? (
  //               <DataTable
  //                 data={tableData}
  //                 model={model}
  //                 selectedClusters={selectedClusters}
  //                 columnHeaders={columnHeaders}
  //               ></DataTable>
  //             ) : (
  //               <Skeleton variant="rect" width={210} height={118} />
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   } else {
  //     return <LoadingScreen></LoadingScreen>;
  //   }
};

export default React.memo(ModelDetailsWrapper);
