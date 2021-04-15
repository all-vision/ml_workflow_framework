import React, { Component } from 'react';
import "./assets/theme.css";
import { Engine } from './engine';
import Info from './Info';
import Search from './Search/Search';
import SelectedStations from './Selection/SelectedStations';
import * as qs from 'query-string';
import {
    Button,
    Card as MuiCard,
    CardContent as MuiCardContent,
    CardHeader,
    IconButton
  } from "@material-ui/core";
  
import { Add as AddIcon } from '@material-ui/icons';
import axios from 'axios';
import { spacing } from "@material-ui/system";
import { Alert as MuiAlert, AlertTitle } from '@material-ui/lab';
import styled, { withTheme } from "styled-components";
const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  &:last-child {
    padding-top: 0;
    padding-bottom: ${props => props.theme.spacing(4)}px;
  }
`;

const Alert = styled(MuiAlert)(spacing);

  
// Bypass CORS
function getCorsFreeUrl(url) {
    return 'https://cors-anywhere.herokuapp.com/' + url;
}


class SatVis extends Component {

    state = {
        selected: [],
        stations: [],
        alerts: []
    }

    componentDidMount() {
        this.engine = new Engine();
        this.engine.initialize(this.el, {
            onStationClicked: this.handleStationClicked
        });
        this.addStations();
        axios.get('https://mlpipeline.azurewebsites.net/getalerts')
        .then((response) => {
            console.log(response);
        }, (error) => {
            console.log('error: ', error);
        });

        setInterval(this.handleTimer, 1000);
    }

    filterResults = (stations, searchText) => {
        if (!stations) return null;
        if (!searchText || searchText === '') return null;
    
        const regex = new RegExp(searchText, 'i');
    
        return stations.filter(station => regex.test(station.name))[0];
    }

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

        selectedIds.forEach(id => {
            const station = this.findStationById(stations, id);
            if (station) this.selectStation(station);
        });
    }

    findStationById = (stations, id) => {
        return stations.find(st => st.satrec && st.satrec.satnum == id);
    }

    handleStationClicked = (station) => {
        if (!station) return;

        this.toggleSelection(station);
    }

    toggleSelection(station) {
        if (this.isSelected(station))
            this.deselectStation(station);
        else
            this.selectStation(station);
    }

    isSelected = (station) => {
        return this.state.selected.includes(station);
    }

    selectStation = (station) => {
        const newSelected = this.state.selected.concat(station);
        this.setState({selected: newSelected});

        this.engine.addOrbit(station);
    }

    deselectStation = (station) => {
        const newSelected = this.state.selected.filter(s => s !== station);
        this.setState( { selected: newSelected } );

        this.engine.removeOrbit(station);
    }

    addStations = () => {
        this.addCelestrakSets();
        //this.engine.addSatellite(ISS);
        this.addAmsatSets();
    }

    addCelestrakSets = () => {
        //this.engine.loadLteFileStations(getCorsFreeUrl('http://www.celestrak.com/NORAD/elements/weather.txt'), 0x00ffff)
        this.engine.loadLteFileStations('http://www.celestrak.com/NORAD/elements/active.txt', 0xffffff)
        //this.engine.loadLteFileStations(getCorsFreeUrl('http://www.celestrak.com/NORAD/elements/science.txt'), 0xffff00)
        //this.engine.loadLteFileStations(getCorsFreeUrl('http://www.celestrak.com/NORAD/elements/stations.txt'), 0xffff00)
        //this.engine.loadLteFileStations(getCorsFreeUrl('http://www.celestrak.com/NORAD/elements/cosmos-2251-debris.txt'), 0xff0000)
        //this.engine.loadLteFileStations(getCorsFreeUrl('http://www.celestrak.com/NORAD/elements/iridium-NEXT.txt'), 0x00ff00)
        //this.engine.loadLteFileStations(getCorsFreeUrl('http://www.celestrak.com/NORAD/elements/gps-ops.txt'), 0x00ff00)
        //this.engine.loadLteFileStations(getCorsFreeUrl('http://www.celestrak.com/NORAD/elements/ses.txt'), 0xffffff)
        //this.engine.loadLteFileStations(getCorsFreeUrl('http://www.celestrak.com/NORAD/elements/starlink.txt'), 0xffffff)
        //this.engine.loadLteFileStations(getCorsFreeUrl('http://www.celestrak.com/NORAD/elements/gps-ops.txt'), 0xffffff, { orbitMinutes: 0, satelliteSize: 200 })
        //this.engine.loadLteFileStations(getCorsFreeUrl('http://www.celestrak.com/NORAD/elements/glo-ops.txt'), 0xff0000, { orbitMinutes: 500, satelliteSize: 500 })
            .then(stations => {
                this.setState({stations});
                this.processQuery(stations);
            });

    }

    addAmsatSets = () => {
        this.engine.loadLteFileStations('https://www.amsat.org/tle/current/nasabare.txt', 0xffff00);
    }

    handleTimer = () => {
        this.engine.updateAllPositions(new Date());
    }

    handleSearchResultClick = (station) => {
        if (!station) return;

        this.toggleSelection(station);
    }

    handleRemoveSelected = (station) => {
        if (!station) return;
        
        this.deselectStation(station);
    }

    handleRemoveAllSelected = () => {
        this.state.selected.forEach(s => this.engine.removeOrbit(s));
        this.setState({selected: []});
    }


    render() {
        const { selected, stations } = this.state;

        return (
            <div>
            <Card mb={4}>
                <CardHeader
                title = "Real-Time Satellites View"
                />
                <CardContent>
                <div ref={c => this.el = c} style={{ width: '100%', height: '100%' }} />
                <Search stations={this.state.stations} onResultClick={this.handleSearchResultClick} />
                <SelectedStations selected={selected} onRemoveStation={this.handleRemoveSelected} onRemoveAll={this.handleRemoveAllSelected} />
                </CardContent>
            </Card>
            <Card mb={4}>
            <CardHeader
            title= "Active Alerts"
            />
            <CardContent>
            {/* <Alert mb={4} severity="error"
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() =>{
                            this.handleStationClicked(this.filterResults(this.state.stations,'Starlink-1532'))
                        }}
                        >
                            <AddIcon fontSize ="inherit" />
                        </IconButton>
                }
            >
            <AlertTitle>Unknown Object Detected</AlertTitle>
            Non-Catalog Object Detected by Desert Laser — <strong>Recommended to add Object with new TLE to be tracked </strong>
            </Alert>

            <Alert mb={4} severity="error"
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() =>{
                            this.handleStationClicked(this.filterResults(this.state.stations,'BEIDOU-3 M14'))
                        }}
                        >
                            <AddIcon fontSize ="inherit" />
                        </IconButton>
                }
            >
            <AlertTitle>Unexpected Maneuver Detected</AlertTitle>
            BEIDOU-3 M14 thrusted to an uncharacteristic Orbit— <strong>Recommended to esclate to track further</strong>
            </Alert>

            <Alert mb={4} severity="error"
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() =>{
                            this.handleStationClicked(this.filterResults(this.state.stations,'Starlink-1532'))
                        }}
                        >
                            <AddIcon fontSize ="inherit" />
                        </IconButton>
                }    
            >
            <AlertTitle>Unexpected Maneuver Detected</AlertTitle>
            Starlink-1532 Performed an anomolous thrust maneuver — <strong>Recommended to esclate to supervisor</strong>
            </Alert>

            <Alert mb={4} severity="success"
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() =>{
                            this.handleStationClicked(this.filterResults(this.state.stations,'REMOVEDEBRI'))
                        }}
                        >
                            <AddIcon fontSize ="inherit" />
                        </IconButton>
                }    
            >
            <AlertTitle>Debris Cloud Formation Resolved</AlertTitle>
            Debris cloud generation event found and cataloged
            </Alert> */}
            </CardContent>
            </Card>
            </div>
            
        )
    }
}

export default SatVis;
