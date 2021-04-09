import React from "react";
import styled, { withTheme } from "styled-components";
import PropTypes from 'prop-types';
import { NavLink as RouterNavLink } from "react-router-dom";

import Helmet from 'react-helmet';

import {
  Avatar,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent,
  Divider as MuiDivider,
  FormControl as MuiFormControl,
  Grid,
  Link,
  TextField as MuiTextField,
  Typography
} from "@material-ui/core";

import { CloudUpload as MuiCloudUpload } from "@material-ui/icons";

import { spacing } from "@material-ui/system";

const NavLink = React.forwardRef((props, ref) => (
  <RouterNavLink innerRef={ref} {...props} />
));

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const FormControl = styled(MuiFormControl)(spacing);

const TextField = styled(MuiTextField)(spacing);

const Button = styled(MuiButton)(spacing);

const CloudUpload = styled(MuiCloudUpload)(spacing);

const CenteredContent = styled.div`
  text-align: center;
`;

const BigAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  margin: 0 auto ${props => props.theme.spacing(2)}px;
`;

class Text extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: '', lat: '', long: '' };
  }

  handleOnChangeID = event => {
    console.log('Click');
    console.log(event.target.value);
    const userInput = event.target.value;
    this.setState(
      {
        id: userInput,
      },
      () => {
        console.log('Inside OutlinedTextFields state:', this.state);
      }
    );
  };

  handleOnChangeLat = event => {
    console.log('Click');
    console.log(event.target.value);
    const userInput = event.target.value;
    this.setState(
      {
        lat: userInput,
      },
      () => {
        console.log('Inside OutlinedTextFields state:', this.state);
      }
    );
  };


  handleOnChangeLong = event => {
    //console.log('Click');
    //console.log(event.target.value);
    const userInput = event.target.value;
    this.setState(
      {
        long: userInput
      },
      () => {
        console.log('Inside OutlinedTextFields state:', this.state);
      }
    );
  };


    handleOnSave = event => {
     event.preventDefault();
     this.props.onSave(this.state);
     this.setState({ id: '',lat: '', long: '' });
   };

   render() {
    const { classes } = this.props;
    const { id, lat, long } = this.state;
    return (
      <form  noValidate autoComplete="off">
      <Card mb={6}>
     <CardContent>
      <Typography variant="h6" gutterBottom>
          Add a new Sensor to track
        </Typography>
        <TextField
          id="id"
          label="Sensor Name"
          defaultValue={"Default Sensor"}
          fullWidth
          my={2}
          variant="outlined"
          onChange={this.handleOnChangeID}
        />
        <Grid container spacing={6}>
          <Grid item md={6}>
            <TextField id="lat" label="Latitude" defaultValue={"45"} variant="outlined" onChange={this.handleOnChangeLat} fullWidth my={2} />
          </Grid>
          <Grid item md={6}>
            <TextField id="long" label="Longitude" defaultValue={"90"} variant="outlined" onChange={this.handleOnChangeLong} fullWidth my={2} />
          </Grid>
        </Grid>

        <Grid container spacing={6}>
          <Grid item md={6}>
            <TextField id="Elevation" label="Elevation" defaultValue={"100.0"} variant="outlined" fullWidth />
          </Grid>
          <Grid item md={6}>
            <TextField id="Data Port" label="Data Port" defaultValue={"3000/1"} variant="outlined" fullWidth />
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" mt={3} onClick={this.handleOnSave}>Save</Button>
      </CardContent>
   </Card>
      </form>
    );
  }
}

Text.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withTheme(Text);
