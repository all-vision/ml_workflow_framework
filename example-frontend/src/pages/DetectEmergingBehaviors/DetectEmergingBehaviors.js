import React, { useState, useEffect } from "react";
import Scatterplot from './Scatterplot'
import Table from './Table'

function SpaceForce() {
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
