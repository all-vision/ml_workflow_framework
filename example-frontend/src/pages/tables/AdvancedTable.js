import React from 'react';
import ReactDOM from "react-dom";
import MaterialTable from 'material-table';
import Search from '@material-ui/icons/Search'
import ViewColumn from '@material-ui/icons/ViewColumn'
import SaveAlt from '@material-ui/icons/SaveAlt'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Add from '@material-ui/icons/Add'
import Check from '@material-ui/icons/Check'
import FilterList from '@material-ui/icons/FilterList'
import Remove from '@material-ui/icons/Remove'


export default function MaterialTableDemo() {
  const [state, setState] = React.useState({
    columns: [
      { title: 'Event Name', field: 'name' },
      { title: 'Approriate Response', field: 'response' },
      { title: 'Data to be considered', field: 'data' },
      { title: 'Point of Contact', field: 'contact' },
      {
        title: 'Anomaly Expected/Actual',
        field: 'anomaly',
        lookup: { 34: 'Higher', 63: 'Lower', 90: 'Unknown Observations' },
      },
    ],
    data: [
      { name: 'Radar Power Loss', response: 'Reset Sensor, Contact Listed Point Of Contact, Replace Sensor Feed with replacement sensor data', data: 'Observations Time Series', contact: 'John Smith',anomaly: 63 },
      { name: 'Sensor Alignment Drift', response: 'Recalibrate Sensor, Follow Instructions 14.2.1', data: 'Average Sat Altitude, Average Sat Data, Average Sat Detection Rate', contact: 'Chase Morgan',anomaly: 90 },
      { name: 'Low Correlation With Catalog', response: 'Immediatly Escalate to Listed Point of Contact', data: 'Known Object Catalog, Detected Object Database', contact: 'John Smith',anomaly: 90 },
      { name: 'Un-cataloged object detected', response: 'Determine root cause. Generate additional tasking', data: 'Rate of new object detection,correlation with other un-cataloged objects detected', contact: 'Larry Anderson',anomaly: 34 },
      { name: 'Missed observation', response: 'Determine root cause, expected', data: 'Rate of missed passes', contact: 'Bob Williams',anomaly: 63 },

    ],
  });

  return (
    <MaterialTable
      title="Radar Performance Playbook"
      columns={state.columns}
      data={state.data}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.push(newData);
                return { ...prevState, data };
              });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                setState((prevState) => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                return { ...prevState, data };
              });
            }, 600);
          }),
      }}
    />
  );
}