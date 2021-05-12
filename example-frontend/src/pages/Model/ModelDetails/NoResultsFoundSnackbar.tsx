/* eslint-disable react/prop-types */
import React, { useEffect, FC } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useEventCallback } from '@material-ui/core';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

interface Props {
    showNoClustersFoundSnackbar: boolean
}
const CustomizedSnackbars: FC<Props> = ({showNoClustersFoundSnackbar}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (showNoClustersFoundSnackbar) {
      setOpen(true);
      return;
    }
    setOpen(false);
  }, [showNoClustersFoundSnackbar]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar
        open={open}
        // autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleClose} 
          severity="info"
          style={{background: '#E8F4FD'}}
          variant="outlined"
        >
          No Clusters fit within that range, try again.
        </Alert>
      </Snackbar>
    </div>
  );
};


export default CustomizedSnackbars;