/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
// import MuiAlert from '@material-ui/lab/Alert';
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { set } from 'lodash';

// function Alert(props) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomizedSnackbars(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    console.log('props: ', props);
    if (props.newModelIsBeingCreated.isBeingCreated) {
      setOpen(true);
      // return;
    }
    // setOpen(false);

  }, [props.newModelIsBeingCreated]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={classes.root}>
      {/* <Button variant="outlined" onClick={handleClick}>
        Open success snackbar
      </Button> */}
      <Snackbar
        open={open}
        autoHideDuration={null}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {/* <Alert
          onClose={handleClose}
          severity="success"
          variant='outlined'
          style={{ color: '#fafafa', fontWeight: '300', background: '#43AA8B' }}
        >
          {`New model ${props.newModelIsBeingCreated.newModelName} is being created and will appear in the Model Zoo`}
        </Alert> */}
        <Alert severity="success">
          <AlertTitle>New Model is Being Created</AlertTitle>
          {`New model ${props.newModelIsBeingCreated.newModelName} is being created and will appear in the Model Zoo`}
        </Alert>
      </Snackbar>
    </div>
  );
}
