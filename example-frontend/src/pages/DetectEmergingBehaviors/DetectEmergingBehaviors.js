import React, { useState, useEffect } from "react";
import Scatterplot from './Scatterplot'
import Table from './Table'
import axios from 'axios';

/* 
    axios({
      method: 'post',
      url: 'https://allvisionmodels.azurewebsites.net/data',
      data: {filename: file.DatasetIDRef},
      onUploadProgress: function (progressEvent) {
        console.log(progressEvent);
      },
    })
      .then((response) => {
        alert('setting new active data');
        console.log('response.data: ', response.data);
        props.setActiveDatasetData(response.data);
        setShowLoadingScreen(false);
        props.routeProps.history.push('/unsupervised');
      }, (error) => {
        console.log(error.response);
      });
*/

function SpaceForce() {

  useEffect(() => {

    // https://spacework.azurewebsites.net
    // axios call here 
  }, [])

  return (
    <>
      <h1>Space Force</h1>
      <div className="clusters-wrapper">
        <Scatterplot></Scatterplot>
      </div>
      <div className="table-wrapper">
        <Table></Table>
      </div>
    </>
  );
}

export default SpaceForce;
