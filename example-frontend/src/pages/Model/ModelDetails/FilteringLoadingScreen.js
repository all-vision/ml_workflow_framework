/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Skeleton from '@material-ui/lab/Skeleton';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  text: {
    fontFamily: 'Open Sans, Lato, Roboto',
    color: '#323748',
    fontWeight: '400'
  }
}));

export default function CircularIndeterminate(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {/* <Skeleton variant="rect" width={'60vw'} height={70} /> */}
      <h3 className={classes.text}>{props.filterLoadingText}</h3>
      {/* <LinearProgress style={{marginTop: '2vh'}} /> */}
      <CircularProgress style={{marginTop: '2vh'}} disableShrink variant='static' />
    </div>
  );
}