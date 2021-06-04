/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import axios from "axios";
import color_palette from "../Model/ModelDetails/ColorPalette";
import cloneDeep from "lodash/cloneDeep";
import BulkLabelingScatterplot from "./BulkLabelingScatterplot";
import BulkLabelingDataTable from "./BulkLabelingDataTable";
import BulkLabelingClusterInfo from "./BulkLabelingClusterInfo";
import BulkLabelingActions from "./BulkLabelingActions";
import BulkLabelModal from "./BulkLabelModal";
import BulkLabelingAlert from './BulkLabelingAlert';
import "../../styles/BulkLabeling/bulk-labeling-wrapper.css";

function hexToRgbA(hex) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return (
      'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',.0001)'
    );
  }
  throw new Error('Bad Hex');
}

const BulkLabelingWrapper = (props) => {
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

  const [selectedRows, setSelectedRows] = useState([]);

  const [
    formattedDataWithCheckboxes,
    setFormattedDataWithCheckboxes,
  ] = useState([]);
  const [
    originalFormattedDataWithCheckboxes,
    setOriginalFormattedDataWithCheckboxes,
  ] = useState([]);
  const [selectedRowsByCheckbox, setSelectedRowsByCheckbox] = useState([]);
  const [selectedClustersByCheckbox, setSelectedClustersByCheckbox] = useState(
    []
  );
  const [resetButtonClicked, setResetButtonClicked] = useState(false);
  const [bulkLabelModalIsOpen, setBulkLabelModalIsOpen] = useState(false);
  const [activeModel, setActiveModel] = useState({
    name: 'Kmeans',
    value: 'kmeans'
  });
  // const [selectedXValueIsNull, setSelectedXValueIsNull] = useState(false);
  // const [selectedYValueIsNull, setSelectedYValueIsNull] = useState(false);
  //   useEffect(() => {
  //     console.log('formattedChartData: ', formattedChartData)
  //     let newFormattedChartData = cloneDeep(formattedChartData);
  //     newFormattedChartData.forEach((group) => {
  //         // console.log('group: ', group)
  //         group.checked = true
  //     })
  //     console.log('newFormattedChartData: ', newFormattedChartData)
  //     setFormattedDataWithCheckboxes(newFormattedChartData);
  //   }, [formattedChartData])

  //   const [clustersSelectedForLabeling, setClustersSelectedForLabeling] = useState([]);

  //   useEffect(() => {
  //       let wrapper = []
  //     let clustersForLabelingNames = formattedDataWithCheckboxes.filter((d) => d.checked === true);
  //     console.log('clustersForLabelingNames: ', clustersForLabelingNames)
  //     formattedChartData.forEach((cluster) => {
  //         if (clustersForLabelingNames.includes(cluster.name)) {
  //             wrapper.push(cluster)
  //         }
  //     })
  //     console.log('wrapper: ', wrapper)

  //   }, [formattedDataWithCheckboxes]);

  useEffect(() => {
    if(!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload(true);
    }
  }, []);
  
  const handleSelectClusterForLabeling = (index) => {
    console.log("index: ", index);
    let clonedFormattedDataWithCheckboxes = cloneDeep(
      formattedDataWithCheckboxes
    );
    let targetCheckbox = clonedFormattedDataWithCheckboxes[index];
    console.log("targetCheckbox: ", targetCheckbox);
    targetCheckbox.checked = !targetCheckbox.checked;

    let wrapper = [];
    let clustersForLabelingNames = clonedFormattedDataWithCheckboxes
      .filter((d) => d.checked === true)
      .map((n) => n.name);
    console.log("clustersForLabelingNames: ", clustersForLabelingNames);
    setSelectedClustersByCheckbox(clustersForLabelingNames);
    formattedChartData.forEach((cluster) => {
      console.log("cluster: ", cluster);
      if (clustersForLabelingNames.includes(cluster.name)) {
        wrapper.push(...cluster.data);
      }
    });
    console.log("wrapper: ", wrapper);
    setSelectedRowsByCheckbox(wrapper);
    setFormattedDataWithCheckboxes(clonedFormattedDataWithCheckboxes);
    //   clonedFormattedDataWithCheckboxes.forEach((checkbox) => {
    //       console.log(clonedFormattedDataWithCheckboxes[index])
    //   })
  };

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
        // console.log('includes: ', selectedClustersByCheckbox.includes(`Cluster ${cluster}`))

        const filteredData = data.filter((d) => d.clusters === cluster);
        formattedData.push({
          name: cluster === -1 ? "Anomaly" : `Cluster ${cluster}`,
          cluster: cluster,
          color: cluster === -1 ? "#cccccc" : color_palette[cluster],
          // color: clusterIsSelectedForLabeling ? 'black' : color_palette[cluster],
          // color: 'red',
          marker: {
            symbol: "circle",
          },
          visible: true,
          data: filteredData,
          selected: true,
        });
      });

      let dataRange = formattedData.map((d) => d.data.length);
      let min = dataRange.sort((a, b) => a - b)[0];
      let max = dataRange.sort((a, b) => a - b)[dataRange.length - 1];
      let formattedDataWithCheckboxes = [];
      formattedData.forEach((group) => {
        formattedDataWithCheckboxes.push({
          name: group.name,
          checked: false,
        });
      });
      setMinClusterCount(min);
      setMaxClusterCount(max);
      setOriginalChartData(cloneDeep(formattedData));
      console.log("real formattedData: ", formattedData);
      setFormattedDataWithCheckboxes(formattedDataWithCheckboxes);
      setOriginalFormattedDataWithCheckboxes(
        cloneDeep(formattedDataWithCheckboxes)
      );
      console.log(
        "real formattedDataWithCheckboxes: ",
        formattedDataWithCheckboxes
      );
      setFormattedChartData(formattedData);
    }
  }, [data]);

  useEffect(() => {
    let clonedFormattedData = cloneDeep(formattedChartData);
    clonedFormattedData.forEach((cluster) => {
      const clusterIsSelectedForLabeling = selectedClustersByCheckbox.includes(
        cluster.name
      );
      console.log("sherif cluster: ", cluster);
      console.log(
        "sherif selectedClustersByCheckbox: ",
        selectedClustersByCheckbox
      );
      if (clusterIsSelectedForLabeling) {
        cluster.color = "rgba(0,0,0,.1)";
      } else {
        cluster.color =
          cluster.cluster === -1 ? "#cccccc" : color_palette[cluster.cluster]; 
      }
      // console.log('cluster: ', cluster)
    });

    setFormattedChartData(clonedFormattedData);
  }, [selectedClustersByCheckbox]);

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
        setTableData(response.data);
        setOriginalTableData(cloneDeep(response.data));
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

    console.log("filteredTableData: ", filteredTableData);
    setTableData(filteredTableData);

    // deep clone original chart data to prevent any direct mutation of state
    let test = cloneDeep(originalChartData);
    let formattedData = test.filter(
      (t) => targetClusters.indexOf(t.cluster) !== -1
    );

    setSelectedClusters(targetClusters);
    console.log("formattedData: ", formattedData);
    setFormattedChartData(formattedData);
  };

  const handleSetSelectedRows = (rows) => {
    console.log("rows: ", rows);
    setSelectedRows(rows);
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

  const handleChangeModel = (newModel) => {
    console.log('newModel: ', newModel);
    setActiveModel(newModel)
  }

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

  const handleResetData = () => {
    console.log("sherif clicked");
    setFormattedChartData(originalChartData);
    setSelectedClustersByCheckbox([]);
    setSelectedRowsByCheckbox([]);
    setSelectedRows([]);
    setFormattedDataWithCheckboxes(originalFormattedDataWithCheckboxes);
    setResetButtonClicked(true);
    setSelectedXValueIsNull(false);
    setSelectedYValueIsNull(false);
    setTimeout(() => {
      setResetButtonClicked(false);
    });
  };

  const handleOpenBulkLabelModal = () => {
    setBulkLabelModalIsOpen(true);
  };

  const handleCloseBulkLabelModal = () => {
    setBulkLabelModalIsOpen(false);
  };

  if (!formattedChartData.length > 0 && !data.length > 0) {
    return <h1>loading</h1>
  }
  return (
    <div className='bulk-label-container'>
      <BulkLabelModal
        bulkLabelModalIsOpen={bulkLabelModalIsOpen}
        handleCloseBulkLabelModal={handleCloseBulkLabelModal}
      />
      <h1>Bulk Labeling</h1>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            borderRadius: "360px",
            height: "1rem",
            width: "1rem",
            background: "rgba(0,0,0,.8)",
            marginTop: "1.75vh",
            marginRight: ".5vw",
          }}
        ></div>
        <h3>
          {selectedRows.length + selectedRowsByCheckbox.length} Points Selected
          for Labeling
        </h3>
      </div>

      <BulkLabelingActions
        handleResetData={handleResetData}
        data={data}
        handleOpenBulkLabelModal={handleOpenBulkLabelModal}
        selectedXValueIsNull={selectedXValueIsNull}
        selectedYValueIsNull={selectedYValueIsNull}
        handleSubmitXYValues={handleSubmitXYValues}
        handleChangeModel={handleChangeModel}
        activeModel={activeModel}
      />
      <BulkLabelingAlert style={{
        width: '50%'
      }}
        />
      <div className="model-details-chart-and-metrics-wrapper">
        <div className="model-details-chart-wrapper">
          <BulkLabelingScatterplot
            handleSetSelectedRows={handleSetSelectedRows}
            chartData={formattedChartData}
            resetButtonClicked={resetButtonClicked}
            columnHeaders={columnHeaders}
          ></BulkLabelingScatterplot>
        </div>
        <BulkLabelingClusterInfo
          chartData={formattedChartData}
          handleSelectClusterForLabeling={handleSelectClusterForLabeling}
          formattedDataWithCheckboxes={formattedDataWithCheckboxes}
          // handleCloseFilterByClusterSizeModal={handleCloseFilterByClusterSizeModal}
          // handleOpenFilterByClusterSizeModal={handleOpenFilterByClusterSizeModal}
        />
      </div>
      {/* <BulkLabelingScatterplot
    handleSetSelectedRows={handleSetSelectedRows}
    chartData={formattedChartData}
    columnHeaders={columnHeaders}
    />
    <BulkLabelingClusterInfo chartData={formattedChartData} /> */}
      {selectedRows.length > 0 || selectedRowsByCheckbox.length > 0 ? (
        <BulkLabelingDataTable
          data={selectedRows ? selectedRows : []}
          selectedClusters={[]}
          selectedRowsByCheckbox={
            selectedRowsByCheckbox ? selectedRowsByCheckbox : []
          }
        />
      ) : null}
    </div>
  );
};

export default React.memo(BulkLabelingWrapper);
