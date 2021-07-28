import React, { Component } from 'react';
import './assets/theme.css';
import { Engine } from './engine';
import Info from './Info';
import Search from './Search/Search';
import SelectedStations from './Selection/SelectedStations';
// import color_palette from "../Model/ModelDetails/ColorPalette";
import color_palette from './satColorPalette';
import * as qs from 'query-string';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import Grid from '@material-ui/core/Grid';
import {
  Button,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  // Button
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Add as AddIcon } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import { spacing } from '@material-ui/system';
import { Alert as MuiAlert, AlertTitle } from '@material-ui/lab';
import Scatterplot from '../Model/ModelDetails/NewScatterplot';
import styled, { withTheme } from 'styled-components';
import SpaceTrackTXT from './space-track.txt';
import { cloneDeep } from '@apollo/client/utilities';
import '../../styles/Satellite/satellite.css';

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  &:last-child {
    padding-top: 0;
    padding-bottom: ${(props) => props.theme.spacing(4)}px;
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const Alert = styled(MuiAlert)(spacing);

// Bypass CORS
function getCorsFreeUrl(url) {
  // return 'https://cors-anywhere.herokuapp.com/' + url;
  return 'https://api.allorigins.win/raw?url=' + url;
}

class SatVis extends Component {
  state = {
    selected: [],
    stations: [],
    filteredStations: [],
    alerts: [],
    originalRawData: [],
    rawChartData: [],
    formattedChartData: [],
    originalFormattedChartData: [],
    clusters: [],
    selectedClusters: [],
    columnNames: [],
    contentView: 'scatterplot',
    selectedXValueIsNull: false,
    selectedYValueIsNull: false,
    selectedXValue: '',
    selectedYValue: '',
    modelsNames: [
      {
        name: 'Weighted_linkage',
        value: 'weighted',
      },
      {
        name: 'K_medians',
        value: 'median',
      },
      {
        name: 'Kmeans',
        value: 'kmeans',
      },
      {
        name: 'Single_hierarchial',
        value: 'single',
      },
      {
        name: 'Complete_hierarchial',
        value: 'complete',
      },
      {
        name: 'Birch',
        value: 'birch',
      },
      {
        name: 'Average_linkage',
        value: 'average',
      },
      {
        name: 'DBSCAN',
        value: 'dbscan',
      },
      {
        name: 'OPTICS',
        value: 'optics',
      },
      {
        name: 'HDBSCAN',
        value: 'hdbscan',
      },
      {
        name: 'Agglomerative',
        value: 'agglomerative',
      },
    ],
  };

  screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  handleSubmitXYValues = (selectedXValue, selectedYValue) => {
    // console.log('selectedXValue: ', selectedXValue);
    // console.log('selectedYValue: ', selectedYValue);
    // if (!selectedXValue && !selectedYValue) {
    //   setSelectedXValueIsNull(true);
    //   setSelectedYValueIsNull(true);
    // } else if (!selectedXValue && selectedYValue) {
    //   setSelectedXValueIsNull(true);
    //   setSelectedYValueIsNull(false);
    // } else if (!selectedYValue && selectedXValue) {
    //   setSelectedXValueIsNull(false);
    //   setSelectedYValueIsNull(true);
    // } else {

    // setIsFiltering(true);
    // setFilterLoadingText('Reassigning X and Y Values');
    const newXYValues = {
      xValue: this.state.selectedXValue,
      yValue: this.state.selectedYValue,
    };

    let existingData = cloneDeep(this.state.formattedChartData);
    let wrapper = [];
    existingData.forEach((series) => {
      let newSeries = cloneDeep(series);
      newSeries.data.forEach((d) => {
        d.x = parseFloat(d[newXYValues.xValue]);
        d.y = parseFloat(d[newXYValues.yValue]);
      });
      wrapper.push(newSeries);
    });

    console.log('wrapper: ', wrapper);
    this.setState({
      formattedChartData: wrapper,
    });
    // setFormattedChartData(wrapper);
    // setTimeout(() => {
    //   setIsFiltering(false);
    // }, 1000);
    // }
  };

  handleChangeSelectedYValue = (newYValue) => {
    console.log('newYValue: ', newYValue);
    this.setState({
      selectedYValue: newYValue,
    });
  };

  handleChangeSelectedXValue = (newXValue) => {
    console.log('newXValue: ', newXValue);
    this.setState({
      selectedXValue: newXValue,
    });
  };

  formatDataForChart = (data) => {
    console.log('this.state: ', this.state);
    let wrapper = [];

    const constants = ['x', 'y', 'cluster'];
    let test = data[0];
    console.log('test: ', test);
    let keys = Object.keys(test);
    console.log('test: ', keys);
    let columnNames = keys.filter((key) => !constants.includes(key));
    let integerOnlyColumnNames = [];
    columnNames.forEach((column) => {
      if (!isNaN(data[1][column]) && data[1][column]) {
        integerOnlyColumnNames.push(column);
      }
    });

    console.log('intOnly: ', integerOnlyColumnNames);
    this.state.stations.forEach((s) => {
      let targetSatellite = data.filter(
        (satellite) => satellite.OBJECT_NAME === s.name
      );
      if (targetSatellite.length > 0) {
        wrapper.push(targetSatellite[0]);
      }
    });

    console.log('wrapper: ', wrapper);
    if (data.length > 0) {
      const clusters = wrapper
        .map((item) => item.clusters)
        .filter((value, index, self) => self.indexOf(value) === index);

      let formattedData = [];
      const headerConstants = ['x', 'y', 'cluster'];
      let headers = [];
      Object.keys(wrapper[1]).forEach((key) => {
        if (!headerConstants.includes(key)) {
          headers.push(wrapper[0][key]);
        }
      });

      clusters.forEach((cluster) => {
        const filteredData = wrapper.filter((d) => d.clusters === cluster);
        formattedData.push({
          name: cluster === -1 ? 'Anomaly' : `Cluster ${cluster}`,
          cluster: cluster,
          color: cluster === -1 ? '#cccccc' : color_palette[cluster],
          marker: {
            symbol: 'circle',
          },
          //   data: filteredData,
          data: [{ x: 1, y: 1 }, ...filteredData],
        });
      });
      console.log('rawChartData: ', formattedData);

      this.setState({
        formattedChartData: formattedData,
        originalFormattedChartData: cloneDeep(formattedData),
        clusters: clusters,
        columnNames: integerOnlyColumnNames,
      });
    }
  };

  componentDidMount() {
    this.engine = new Engine();
    this.engine.initialize(this.el, {
      onStationClicked: this.handleStationClicked,
    });
    this.addStations();

    axios
      .get(getCorsFreeUrl('https://spacetest.azurewebsites.net/data'))
      .then((response) => {
        this.setState({
          rawChartData: response.data,
          originalRawData: response.data,
        });
        this.formatDataForChart(response.data);
      });

    axios
      .get(getCorsFreeUrl('https://mlpipeline.azurewebsites.net/getalerts'))
      .then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log('error: ', error);
        }
      );

    setInterval(this.handleTimer, 1000);
  }

  filterResults = (stations, searchText) => {
    console.log('searchText: ', searchText);
    if (!stations) return null;
    if (!searchText || searchText === '') return null;

    const regex = new RegExp(searchText, 'i');

    return stations.filter((station) => regex.test(station.name))[0];
  };

  componentWillUnmount() {
    this.engine.dispose();
  }

  processQuery = (stations) => {
    const q = window.location.search;
    if (!q) return;

    const params = qs.parse(q);
    if (!params.ss) return;

    const selectedIds = params.ss.split(',');
    if (!selectedIds || selectedIds.length === 0) return;

    selectedIds.forEach((id) => {
      const station = this.findStationById(stations, id);
      if (station) this.selectStation(station);
    });
  };

  findStationById = (stations, id) => {
    return stations.find((st) => st.satrec && st.satrec.satnum == id);
  };

  handleStationClicked = (station) => {
    if (!station) return;

    this.toggleSelection(station);
  };

  toggleSelection(station) {
    if (this.isSelected(station)) {
      this.deselectStation(station);
    } else {
      this.selectStation(station);
    }
  }

  isSelected = (station) => {
    return this.state.selected.includes(station);
  };

  selectStation = (station) => {
    const newSelected = this.state.selected.concat(station);
    console.log('newSelected: ', newSelected);
    console.log('newselected station: ', station);
    this.setState({ selected: newSelected });
    // newSelected.forEach((station) => {
    //   this.engine.addOrbit(station);
    // })
    this.engine.addOrbit(station);
  };

  deselectStation = (station) => {
    const newSelected = this.state.selected.filter((s) => s !== station);
    this.setState({ selected: newSelected });
    console.log('newSelected delete: ', newSelected);
    console.log('newSelected station: ', station);
    this.engine.removeOrbit(station);
  };

  addStations = () => {
    this.addCelestrakSets();
    //this.engine.addSatellite(ISS);
    this.addAmsatSets();
  };

  //   loadStations = (url, color, stationOptions) => {
  //     const defaultStationOptions = {
  //         orbitMinutes: 0,
  //         satelliteSize: 75, // default = 50
  //       };

  //     const options = { ...defaultStationOptions, ...stationOptions };
  //     return fetch(url).then((res) => {
  //       // return res.text().then(text => {
  //       //     return this._addTleFileStations(text, color, options);
  //       // });
  //       if (res.ok) {
  //         return res.text().then((text) => {
  //             let stations = this.engine._addTleFileStations(text, color, options)
  //             console.log('deez stations: ', stations)
  //           return this.engine._addTleFileStations(text, color, options);
  //         });
  //       }
  //     });
  //   };

  addCelestrakSets = () => {
    //this.engine.loadLteFileStations(getCorsFreeUrl('http://www.celestrak.com/NORAD/elements/weather.txt'), 0x00ffff)
    // https://www.space-track.org/basicspacedata/ajaxauth/login/identity=selmetwa@gmail.com&password=Ji9n7Yh7X-fJ4ZY&/query/class/gp/EPOCH/%3Enow-30/MEAN_MOTION/[…]5/OBJECT_TYPE/payload/orderby/NORAD_CAT_ID,EPOCH/format/3le.txt
    this.engine
      .loadLteFileStations(
        getCorsFreeUrl('http://www.celestrak.com/NORAD/elements/active.txt'),
        [0xffffff, 0xffff00],

        'hey',
        { selectedClusters: [] }
      )
      .then((stations) => {
        console.log('deez: ', stations);
        this.setState({
          stations: stations,
        });
        this.processQuery(stations);
      });
  };

  addAmsatSets = () => {
    this.engine
      .loadLteFileStations(
        getCorsFreeUrl('https://www.amsat.org/tle/current/nasabare.txt'),
        0xffffff,
        'hey',
        { selectedClusters: [] }
      )
      .then((stations) => {
        console.log('res stations: ', stations);
      });
  };

  handleTimer = () => {
    this.engine.updateAllPositions(new Date());
  };

  handleSearchResultClick = (station) => {
    if (!station) return;

    this.toggleSelection(station);
  };

  handleRemoveSelected = (station) => {
    if (!station) return;
    this.deselectStation(station);
  };

  handleRemoveAllSelected = () => {
    this.state.selected.forEach((s) => this.engine.removeOrbit(s));
    this.handleTestSelection(null, this.state.selected);
    this.setState({ selected: [] });
  };

  handleDeleteChip = (selectedStation) => {
    console.info('You clicked the delete icon.');
    console.log('selectedStation: ', selectedStation);
    this.handleRemoveSelected(selectedStation);
  };

  handleTestFilter = () => {
    let existingData = cloneDeep(this.state.rawChartData);
    let filteredData = existingData.filter((d) => d.clusters === 0);

    // addCelestrakSets = () => {
    //this.engine.loadLteFileStations(getCorsFreeUrl('http://www.celestrak.com/NORAD/elements/weather.txt'), 0x00ffff)
    // https://www.space-track.org/basicspacedata/ajaxauth/login/identity=selmetwa@gmail.com&password=Ji9n7Yh7X-fJ4ZY&/query/class/gp/EPOCH/%3Enow-30/MEAN_MOTION/[…]5/OBJECT_TYPE/payload/orderby/NORAD_CAT_ID,EPOCH/format/3le.txt
    this.engine
      .loadLteFileStations(
        getCorsFreeUrl('http://www.celestrak.com/NORAD/elements/active.txt'),
        [0xffffff, 0xffff00],

        'hey',
        { selectedClusters: filteredData }
      )
      .then((stations) => {
        console.log('deez: ', stations);
        this.setState({
          stations: stations,
        });
        this.processQuery(stations);
      });
    // };

    // addAmsatSets = () => {
    this.engine
      .loadLteFileStations(
        getCorsFreeUrl('https://www.amsat.org/tle/current/nasabare.txt'),
        0xffffff,
        'hey',
        { selectedClusters: filteredData }
      )
      .then((stations) => {
        console.log('res stations: ', stations);
      });
    // };

    console.log('existingData: ', existingData);
    console.log('existingData filtered: ', filteredData);
  };

  handleResetClusterData = () => {
    this.setState({
      formattedChartData: this.state.originalFormattedChartData,
      selectedClusters: [],
      selectedXValue: '',
      selectedYValue: '',
    });
    this.engine
      .loadLteFileStations(
        getCorsFreeUrl('http://www.celestrak.com/NORAD/elements/active.txt'),
        [0xffffff, 0xffff00],

        'hey',
        { selectedClusters: [] }
      )
      .then((stations) => {
        console.log('deez: ', stations);
        this.setState({
          stations: stations,
        });
        this.processQuery(stations);
      });

    this.engine
      .loadLteFileStations(
        getCorsFreeUrl('https://www.amsat.org/tle/current/nasabare.txt'),
        0xffffff,
        'hey',
        { selectedClusters: [] }
      )
      .then((stations) => {
        console.log('res stations: ', stations);
      });
  };

  handleFilterDataByCluster = (e) => {
    console.log('rawChartData e:', e.target.value);
    let selected = [...this.state.selectedClusters, e.target.value];
    // this.setState({
    //   selectedClusters: e.target.value
    // })
    console.log('rawChartData e:', selected);

    if (e.target.value.includes('All Clusters')) {
      this.handleResetClusterData();
      return;
    }
    if (e.target.value.length === 0) {
      this.handleResetClusterData();
      return;
    }
    const existingData = cloneDeep(this.state.originalFormattedChartData);
    // let filteredChartData = [];
    // existingData.forEach((datum) => {
    // console.log('filteredChartData: ', e.target.value)
    //   if (e.target.value.includes(datum.cluster)) {
    //     filteredChartData.push(datum)
    //   }
    // })
    const filteredChartData = existingData.filter((d) =>
      e.target.value.includes(d.cluster)
    );

    const filteredOriginalData = this.state.originalRawData.filter((d) =>
      e.target.value.includes(d.clusters)
    );
    const filteredStationNames = filteredOriginalData.map((d) => d.OBJECT_NAME);
    const filteredStations = this.state.stations.filter((s) =>
      filteredStationNames.includes(s.name)
    );
    console.log('originalRawData: ', this.state.originalRawData);
    console.log('filteredChartData: ', existingData);
    console.log('filteredOriginalData: ', filteredOriginalData);
    console.log('filteredOriginalData: ', filteredStationNames);
    console.log('filteredStations: ', filteredStations);

    this.setState({
      formattedChartData: filteredChartData,
      selectedClusters: e.target.value,
      filteredStations: filteredStations,
    });
    this.engine
      .loadLteFileStations(
        getCorsFreeUrl('http://www.celestrak.com/NORAD/elements/active.txt'),
        [0xffffff, 0xffff00],

        'hey',
        { selectedClusters: e.target.value }
      )
      .then((stations) => {
        console.log('deez: ', stations);
        this.setState({
          stations: stations,
        });
        this.processQuery(stations);
      });

    this.engine
      .loadLteFileStations(
        getCorsFreeUrl('https://www.amsat.org/tle/current/nasabare.txt'),
        0xffffff,
        'hey',
        { selectedClusters: e.target.value }
      )
      .then((stations) => {
        console.log('res stations: ', stations);
      });
  };

  handleTestSelection = (event, values, reason) => {
    console.log('event: ', event);
    console.log('reason: ', reason);
    if (reason === 'clear') {
      this.handleRemoveAllSelected();
    }

    let selectedStations = values;
    console.log('selectedStations: ', selectedStations);
    if (!selectedStations) return;

    if (selectedStations.length === 0) {
      this.setState({
        selected: [],
      });
    }
    // selectedStations.forEach((station) => {
    //   this.toggleSelection(station);
    // });

    this.toggleSelection(selectedStations);
  };

  handleContentView = (event, newView) => {
    console.log(newView);
    this.setState({
      ...this.state,
      contentView: newView,
    });
  };

  render() {
    console.log('this.state: ', this.state);
    const { selected, stations } = this.state;

    return (
      <div style={{ overflowX: 'hidden' }}>
        {/* <Search
          stations={stations}
          onResultClick={this.handleSearchResultClick}
        /> */}
        <Autocomplete
          id="combo-box-demo"
          // multiple
          disableCloseOnSelect
          onChange={this.handleTestSelection}
          // options={this.state.stations}
          options={
            this.state.selectedClusters.length > 0
              ? this.state.filteredStations.filter(
                  (station) => !(station.orbitMinutes > 0)
                )
              : this.state.stations
          }
          getOptionLabel={(station) => station.name}
          getOptionSelected={(station) => selected.includes(station)}
          style={{ width: 600, background: '#fff' }}
          renderInput={(params) => (
            <TextField {...params} label="Select Stations" variant="outlined" />
          )}
        />
        <div
          style={{
            marginTop: '2vh',
            marginBottom: '1vh',
            // display: 'flex',
          }}
        >
          <ToggleButtonGroup
            value={this.state.contentView}
            exclusive
            onChange={this.handleContentView}
            aria-label="text alignment"
          >
            <ToggleButton value="scatterplot" aria-label="scatter plot">
              Scatterplot
            </ToggleButton>
            <ToggleButton value="earth" aria-label="earth">
              3D-View
            </ToggleButton>
          </ToggleButtonGroup>
          <div
            style={{
              display:
                this.state.contentView === 'scatterplot' ? 'flex' : 'none',
            }}
          >
            <FormControl style={{ maxWidth: 150, minWidth: 150 }}>
              <InputLabel id="demo-simple-select-label">
                Select Model
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                multiple
                defaultValue={'KMeans'}
                style={{ overflowX: 'hidden' }}
                onChange={(e) => this.handleFilterDataByCluster(e)}
                value={this.state.selectedClusters}
              >
                {this.state.modelsNames.map((model, index) => {
                  return <MenuItem>{model.name}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <FormControl
              style={{ maxWidth: 150, minWidth: 150, marginLeft: '2vw' }}
            >
              <InputLabel id="demo-simple-select-label">
                Filter Data By Cluster
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                multiple
                style={{ overflowX: 'hidden' }}
                onChange={(e) => this.handleFilterDataByCluster(e)}
                value={this.state.selectedClusters}
              >
                <MenuItem value={'All Clusters'}>All Clusters</MenuItem>
                {this.state.clusters.map((cluster, index) => {
                  if (cluster === -1) {
                    return (
                      <MenuItem value={cluster} key={index}>
                        {`${cluster} (Anomaly)`}
                      </MenuItem>
                    );
                  }
                  return (
                    <MenuItem
                      value={cluster}
                      key={index}
                      style={{
                        color: color_palette[cluster],
                        fontWeight: '900',
                      }}
                    >
                      {cluster}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl
              style={{ minWidth: 150, marginLeft: '2vw' }}
              error={this.props.selectedXValueIsNull}
            >
              <InputLabel id="demo-simple-select-label">
                Select X Value
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ overflowX: 'hidden' }}
                // onChange={(e) => this.props.handleChangeXValue(e)}
                onChange={(e) =>
                  this.handleChangeSelectedXValue(e.target.value)
                }
                // onChange={(e) => this.setState({selectedXValue: e.target.value})}
                value={this.state.selectedXValue}
              >
                {this.state.columnNames.map((column, index) => {
                  return (
                    <MenuItem value={column} key={index}>
                      {column}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl
              style={{ minWidth: 150, marginLeft: '2vw' }}
              // error={props.selectedYValueIsNull}
            >
              <InputLabel id="demo-simple-select-label">
                Select Y Value
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ overflowX: 'hidden' }}
                onChange={(e) =>
                  this.handleChangeSelectedYValue(e.target.value)
                }
                value={this.state.selectedYValue}
                // onChange={(e) => this.props.handleChangeYValue(e)}
                // onChange={(e) => this.setState({selectedYValue: e.target.value})}
                // onChange={(e) => setSelectedYValue(e.target.value)}
              >
                {this.state.columnNames.map((column, index) => {
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
                marginLeft: '1.5vw',
                marginTop: '1vh',
                color: '#fafafa',
                background: '#1565C0',
                fontFamily: 'Open Sans, Lato, Roboto',
                textTransform: 'capitalize',
                // fontSize: '.9rem',
              }}
              variant="contained"
              color="primary"
              onClick={() =>
                this.handleSubmitXYValues(
                  this.state.selectedYValue,
                  this.state.selectedXValue
                )
              }
            >
              Submit New X & Y Values
            </Button>
            <Button
              variant={'outlined'}
              style={{
                marginTop: '1vh',
                marginLeft: '2vw',
              }}
              onClick={this.handleResetClusterData}
            >
              Reset Data
            </Button>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            // flexDirection: this.screenWidth < 1900 ? 'column' : 'row',
            marginTop: '2vh',
          }}
        >
          <Card
            mb={4}
            mr={4}
            style={{
              width: '70%',
              display:
                this.state.contentView === 'scatterplot' ? 'block' : 'none',
            }}
          >
            <Scatterplot
              chartData={this.state.formattedChartData}
              style={{ display: 'flex', flex: '2' }}
            />
          </Card>

          <Card
            mb={4}
            mr={4}
            style={{
              display: 'flex',
              width: '70%',
              // flex: '1',
              flexDirection: 'column',
              display: this.state.contentView === 'earth' ? 'block' : 'none',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <CardHeader title="Real-Time Satellites View" />
            </div>

            <CardContent>
              <div
                ref={(c) => (this.el = c)}
                // style={{ width: '100%', height: '100%' }}
              />
            </CardContent>
          </Card>
          <Card
            mb={4}
            ml={4}
            style={{
              flex: 1,
            }}
          >
            <CardContent></CardContent>
          </Card>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: this.screenWidth < 1900 ? 'column' : 'row',
            width: this.screenWidth < 1900 ? '75%' : '100%',
          }}
        >
          {' '}
          {/* flexDirection: screenWidth < 1900 ? 'column' : 'row' */}
          <Card
            mb={4}
            style={{ display: 'flex', flex: '2', flexDirection: 'column' }}
          >
            <CardHeader title="Active Alerts" />
            {/* <SelectedStations
                selected={selected}
                onRemoveStation={this.handleRemoveSelected}
                onRemoveAll={this.handleRemoveAllSelected}
              /> */}
            <CardContent>
              <Alert
                mb={4}
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      this.handleStationClicked(
                        this.filterResults(this.state.stations, 'Starlink-1532')
                      );
                    }}
                  >
                    <AddIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                <AlertTitle>Unknown Object Detected</AlertTitle>
                Non-Catalog Object Detected by Desert Laser —{' '}
                <strong>
                  Recommended to add Object with new TLE to be tracked{' '}
                </strong>
              </Alert>

              <Alert
                mb={4}
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      this.handleStationClicked(
                        this.filterResults(this.state.stations, 'BEIDOU-3 M14')
                      );
                    }}
                  >
                    <AddIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                <AlertTitle>Unexpected Maneuver Detected</AlertTitle>
                BEIDOU-3 M14 thrusted to an uncharacteristic Orbit—{' '}
                <strong>Recommended to esclate to track further</strong>
              </Alert>

              <Alert
                mb={4}
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      this.handleStationClicked(
                        this.filterResults(this.state.stations, 'Starlink-1532')
                      );
                    }}
                  >
                    <AddIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                <AlertTitle>Unexpected Maneuver Detected</AlertTitle>
                Starlink-1532 Performed an anomolous thrust maneuver —{' '}
                <strong>Recommended to esclate to supervisor</strong>
              </Alert>

              <Alert
                mb={4}
                severity="success"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      this.handleStationClicked(
                        this.filterResults(this.state.stations, 'REMOVEDEBRI')
                      );
                    }}
                  >
                    <AddIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                <AlertTitle>Debris Cloud Formation Resolved</AlertTitle>
                Debris cloud generation event found and cataloged
              </Alert>
            </CardContent>
          </Card>
          <Card
            mb={4}
            ml={4}
            style={{ display: 'flex', flex: '1', flexDirection: 'column' }}
          >
            <CardHeader title="Selected Satellites" />
            <CardContent>
              {this.state.selected.length > 0 ? (
                <Button
                  onClick={() => this.handleRemoveAllSelected()}
                  variant={'outlined'}
                  color="primary"
                >
                  Clear all selected satellites
                </Button>
              ) : null}
              {/* <button onClick={() => this.handleRemoveAllSelected()}>
                clear all selected satellites
              </button> */}
              <div>
                {this.state.selected.length > 0 ? (
                  this.state.selected.map((selectedStation) => {
                    console.log('selectedStation: ', selectedStation);
                    return (
                      <Alert
                        m={2}
                        // style={{width: '80%'}}
                        severity="info"
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            // onClick={() => {
                            //   this.handleStationClicked(
                            //     this.filterResults(this.state.stations, "REMOVEDEBRI")
                            //   );
                            // }}
                            onClick={() =>
                              this.handleRemoveSelected(selectedStation)
                            }
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        }
                      >
                        <AlertTitle>{selectedStation.name}</AlertTitle>
                        <p>
                          <strong>tle1:</strong> {selectedStation.tle1}
                        </p>
                        <p>
                          <strong>tle2:</strong> {selectedStation.tle2}
                        </p>
                      </Alert>
                      // <Card m={2}>
                      //   <h3>{selectedStation.name}</h3>
                      //   <h3>tle1: {selectedStation.tle1}</h3>
                      //   <h3>tle2: {selectedStation.tle2}</h3>
                      //   <button
                      //     onClick={() =>
                      //       this.handleRemoveSelected(selectedStation)
                      //     }
                      //   >
                      //     remove
                      //   </button>
                      // </Card>
                    );
                  })
                ) : (
                  <h3>No selected satellites yet</h3>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

export default SatVis;
