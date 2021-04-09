import React from "react";
import styled, { withTheme } from "styled-components";

import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader,
  IconButton
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

import Settings from "./Settings";

import SatAdd from "./SatAdd";

import RemoveSensor from "./RemoveSensor";

import { MoreVertical } from "react-feather";

import { VectorMap } from "react-jvectormap";

import "../../vendor/jvectormap.css";

const MapContainer = styled.div`
  height: 344px;
`;

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  &:last-child {
    padding-top: 0;
    padding-bottom: ${props => props.theme.spacing(4)}px;
  }
`;

var options = {
  map: "world_mill",
  regionStyle: {
    initial: {
      fill: "#e3eaef"
    }
  },
  backgroundColor: "transparent",
  containerStyle: {
    width: "100%",
    height: "100%"
  },
  markerStyle: {
    initial: {
      r: 9,
      fill: "#000000",
      "fill-opacity": 1,
      stroke: "#fff",
      "stroke-width": 7,
      "stroke-opacity": 0.4
    },
    hover: {
      stroke: "#fff",
      "fill-opacity": 1,
      "stroke-width": 1.5
    }
  },
  zoomOnScroll: false,
  markers: [
    {
      latLng: [34.052235, -118.243683],
      name: "Radar Sensor 1 [Low Observations]",
      style: {r: 8, fill:'#ff0000'}
    },
    {
      latLng: [41.878113, -87.629799],
      name: "Lidar Sensor 1"
    },
    {
      latLng: [21, 16.5],
      name: "Desert Laser"
    },

  ]
};

class Blank extends React.Component {
  constructor(props) {
    super(props);
    this.state = { options: options };
    this.handleOnSave = this.handleOnSave.bind(this);
    this.handleOnRemove = this.handleOnRemove.bind(this);
  }

  handleOnSave(textInput) {
    const toAdd = {
      latLng: [parseFloat(textInput.lat) , parseFloat(textInput.long)],
      name: textInput.id
    };

    const newOptions = {map: "world_mill",
    regionStyle: {
      initial: {
        fill: "#e3eaef"
      }
    },
    backgroundColor: "transparent",
    containerStyle: {
      width: "100%",
      height: "100%"
    },
    markerStyle: {
      initial: {
        r: 9,
        fill: "#000000",
        "fill-opacity": 1,
        stroke: "#fff",
        "stroke-width": 7,
        "stroke-opacity": 0.4
      },
      hover: {
        stroke: "#fff",
        "fill-opacity": 1,
        "stroke-width": 1.5
      }
    },
    zoomOnScroll: false,
    markers: options.markers};

    newOptions.markers.push(toAdd);
    this.setState(
      {
        options: newOptions,
      },
      () => {
        console.log(this.state.options);
      }
    );

  }



  handleOnRemove(textInput) {
    const toRemove = {
      latLng: [parseFloat(textInput.lat) , parseFloat(textInput.long)],
      name: textInput.id
    };


    const newOptions = {map: "world_mill",
    regionStyle: {
      initial: {
        fill: "#e3eaef"
      }
    },
    backgroundColor: "transparent",
    containerStyle: {
      width: "100%",
      height: "100%"
    },
    markerStyle: {
      initial: {
        r: 9,
        fill: "#000000",
        "fill-opacity": 1,
        stroke: "#fff",
        "stroke-width": 7,
        "stroke-opacity": 0.4
      },
      hover: {
        stroke: "#fff",
        "fill-opacity": 1,
        "stroke-width": 1.5
      }
    },
    zoomOnScroll: false,
    markers: options.markers};


    options.markers = options.markers.filter(a => !(a.name === toRemove.name));

    this.setState(
      {
        options: options,
      },
      () => {
        console.log(this.state.options);
      }
    );

  }

  render() {
    return (
      <div className="Blank">
      <Card mb={4}>
        <CardHeader
          action={
            <IconButton aria-label="settings">
              <MoreVertical />
            </IconButton>
          }
          title="Real-Time Satellite Feed"
        />
        <CardContent>
          <MapContainer>
            <VectorMap {...this.state.options} />
          </MapContainer>
          <SatAdd onSave={this.handleOnSave}/>
        </CardContent>
      </Card>
      </div>
    );
  }
}

export default withTheme(Blank);
