/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import '../../../../styles/ModelDetails/HyperParameterAndElbow/hyperparameter-wrapper.css';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 220,
  },
  selectEmpty: {
    marginTop: theme.spacing(5),
  },
}));

export default function SimpleSelect(props) {
  const classes = useStyles();
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div style={{overflow: 'hidden'}}>
      <FormControl style={{width: '200px', flexBasis: '27%', overflow: 'hidden'}}>
        <>
          <InputLabel>{props.param}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            style={{overflow: 'hidden'}}
            value={props.value}
            onChange={(e) => props.handleUpdateHyperparameter(e, props.param)}
          >
            {
              props.dropdownValues.map((value, index) => {
                return (
                  <MenuItem value={value} key={index}>{value}</MenuItem>
                );
              })
            }
          </Select>
        </>
      </FormControl>
    </div>
  );
}