import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 30;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [newLabelName, setNewLabelName] = useState('');

  useEffect(() => {
    if (props.bulkLabelModalIsOpen) {
        setOpen(true)
        return
    }
    setOpen(false)
  }, [props.bulkLabelModalIsOpen]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
        <div style={{
            width: '100%',
        }}>
        <h2 id="simple-modal-title">Assign New Label</h2>
      <p id="simple-modal-description">
        Assign a new label to the selected points.
      </p>
      <TextField
          id="standard-basic"
          label="New Label Name"
          style={{
              width: '100%'
          }}
        //   error={modelNameError}
          className="create-new-model-modal-input"
          value={newLabelName}
          onChange={(e) => setNewLabelName(e.target.value)}
        />
        <Button
        style={{
            marginTop: "1.5vh",
            width: '100%',
            color: "#fafafa",
          //   background: "#1565C0",
            border: '1px solid #1565C0',
            fontFamily: "Open Sans, Lato, Roboto",
            textTransform: "capitalize",
            fontSize: ".9rem",
          }}
          variant="contained"
          color="primary"
        >Create new Label</Button>
        </div>

      <SimpleModal />
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={() => props.handleCloseBulkLabelModal()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
