/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MetricHyperparameterSelect from './MetricHyperparameterSelect';
import kmeans_types from '../kmeans_types';
import { FormHelperText } from '@material-ui/core';
import HyperparameterErrorAlert from './HyperparameterErrorAlert';
import '../../../../styles/ModelDetails/HyperParameterAndElbow/hyperparameter-wrapper.css';

export default function HyperparametersWrapper(props) {
  console.log('props: ', props);
  const [arrayInputs, setArrayInputs] = useState([]);
  const [hyperparameters, setHyperparameters] = useState([]);
  const [hyperparameterErrorInputs, setHyperparameterErrorInputs] = useState(
    []
  );

  const [hyperparameterErrorMessage, setHyperparameterErrorMessage] = useState(
    ''
  );

  useEffect(() => {
    console.log('real props: ', props);
    setHyperparameters(props.modelHyperparameters);
  }, []);

  const handleResetHyperparameters = () => {
    setHyperparameterErrorInputs([]);
    // checkHyperparameterTypes(props.defaultHyperparameters);
    setHyperparameters(props.defaultHyperparameters);
  };

  // helper function to check if input is a float
  function isFloat(value) {
    if (!isNaN(value) && value.toString().indexOf('.') != -1) {
      return true;
    }
    return false;
  }

  const checkHyperparameterTypes = (hyperparameters) => {
    // gather all hyperparameters where the expected type is an integer
    const filteredByTypeInt = Object.keys(
      Object.fromEntries(
        Object.entries(kmeans_types).filter(([key, value]) => value === 'Int')
      )
    );

    // gather all hyperparameters where the expected type is a float
    const filteredByTypeFloat = Object.keys(
      Object.fromEntries(
        Object.entries(kmeans_types).filter(([key, value]) => value === 'float')
      )
    );

    const hyperparameterKeys = Object.keys(hyperparameters);

    // initialize array to keep track of errors in hyperparameters
    let errors = [];

    // check if inputted cluster amount is greater than or equal to 2000
    if (hyperparameters['n_clusters'] >= 2000) {
      errors.push('n_clusters');
      setHyperparameterErrorMessage('Cannot have more that 2000 clusters.');
    }
    hyperparameterKeys.forEach((key) => {
      // make sure that hyperparameter has a positive value
      if (hyperparameters[key] <= 0) {
        setHyperparameterErrorMessage(
          'Hyperparameters cannot be 0 or a negative number.'
        );
        errors.push(key);
      }
      // check if input is a float
      if (filteredByTypeFloat.includes(key) && !isFloat(hyperparameters[key])) {
        setHyperparameterErrorMessage('Mind your types!');
        errors.push(key);
      }

      // check if input is a whole number
      if (filteredByTypeInt.includes(key) && isFloat(hyperparameters[key])) {
        setHyperparameterErrorMessage('Mind your types!');
        errors.push(key);
      }
    });

    setHyperparameterErrorInputs(errors);
  };

  const handleUpdateHyperparameter = (event, param) => {
    const newValue = event.target.value;
    let existingHyperparameters = hyperparameters;
    let clone = Object.assign({}, existingHyperparameters);
    clone[param] = newValue;

    checkHyperparameterTypes(clone);

    setHyperparameters(clone);
  };

  useEffect(() => {
    const filteredByTypeArray = Object.fromEntries(
      Object.entries(kmeans_types).filter(([key, value]) =>
        Array.isArray(value)
      )
    );
    setArrayInputs(filteredByTypeArray);
  }, []);

  if (!props) {
    return <p>loading things</p>;
  }

  return (
    <div className="hyperparams-wrapper">
      <div className="hyperparameters-header">
        <h1>{props.model.name} Hyperparameters</h1>
        {hyperparameterErrorInputs.length > 0 ? (
          <HyperparameterErrorAlert
            hyperparameterErrorMessage={hyperparameterErrorMessage}
          ></HyperparameterErrorAlert>
        ) : null}
      </div>
      <div className="hyperparameters-inputs-wrapper">
        {hyperparameters ? (
          Object.keys(hyperparameters).map((param, index) => {
            // check if parameter expected value is an array
            // if parameter type is an array render a dropdown menu
            if (Object.keys(arrayInputs).includes(param)) {
              return (
                <div className="hyperparameter-input" key={index}>
                  <MetricHyperparameterSelect
                    handleUpdateHyperparameter={handleUpdateHyperparameter}
                    param={param}
                    dropdownValues={arrayInputs[param]}
                    // value={props.modelHyperparameters[param]}
                    value={hyperparameters[param]}
                    key={index}
                  />
                </div>
              );
            }
            // check is paramsater value is type of float
            if (
              !isNaN(props.defaultHyperparameters[param]) &&
              props.defaultHyperparameters[param] &&
              props.defaultHyperparameters[param].toString().indexOf('.') != -1
            ) {
              return (
                <div className="hyperparameter-input" key={index}>
                  <TextField
                    id="outlined-basic"
                    label={param}
                    type="number"
                    // error={props.hyperparameterErrorInputs.includes(param) ? true : false}
                    error={
                      hyperparameterErrorInputs.includes(param) ? true : false
                    }
                    // value={props.modelHyperparameters[param] === '1e500' ? 'Infinity' : props.modelHyperparameters[param]}
                    value={
                      hyperparameters[param] === '1e500'
                        ? 'Infinity'
                        : hyperparameters[param]
                    }
                    // onChange={(e) => props.handleUpdateHyperparameter(e, param)}
                    onChange={(e) => handleUpdateHyperparameter(e, param)}
                  />
                  <FormHelperText>Takes Float</FormHelperText>
                </div>
              );
            }
            // check if parameter expected value is a number
            if (!isNaN(props.defaultHyperparameters[param])) {
              return (
                <div className="hyperparameter-input" key={index}>
                  <TextField
                    id="outlined-basic"
                    label={param}
                    type="number"
                    // error={props.hyperparameterErrorInputs.includes(param) ? true : false}
                    error={
                      hyperparameterErrorInputs.includes(param) ? true : false
                    }
                    // value={props.modelHyperparameters[param] === '1e500' ? 'Infinity' : props.modelHyperparameters[param]}
                    value={
                      hyperparameters[param] === '1e500'
                        ? 'Infinity'
                        : hyperparameters[param]
                    }
                    // onChange={(e) => props.handleUpdateHyperparameter(e, param)}
                    onChange={(e) => handleUpdateHyperparameter(e, param)}
                  />
                  <FormHelperText>Takes Integer</FormHelperText>
                </div>
              );
            }

            // parameters expected value is a string
            return (
              <div className="hyperparameter-input" key={index}>
                <TextField
                  id="outlined-basic"
                  label={param}
                  type="text"
                  // value={props.modelHyperparameters[param] === '1e500' ? 'Infinity' : props.modelHyperparameters[param]}
                  value={
                    hyperparameters[param] === '1e500'
                      ? 'Infinity'
                      : hyperparameters[param]
                  }
                  // onChange={(e) => props.handleUpdateHyperparameter(e, param)}
                  onChange={(e) => handleUpdateHyperparameter(e, param)}
                />
                <FormHelperText>Takes Text</FormHelperText>
              </div>
            );
          })
        ) : (
          <p>Loading hyperparameters</p>
        )}
      </div>
      <div className="hyperparameters-buttons-wrapper">
        <Button
          color="primary"
          variant="contained"
          className="hyperparameters-button run"
          disabled={hyperparameterErrorInputs.length > 0 ? true : false}
          // onClick={props.handleSubmitHyperparameters}
          // handleOpenNewModelNameModal={handleOpenNewModelNameModal}
          onClick={() => props.handleOpenNewModelNameModal(hyperparameters)}
        >
          Update Hyperparameters
        </Button>
        <Button
          color="default"
          style={{ textTransform: 'capitalize' }}
          className="hyperparameters-button reset"
          // onClick={props.handleResetHyperparameters}
          onClick={handleResetHyperparameters}
        >
          Reset Hyperparameters
        </Button>
      </div>
    </div>
  );
}
