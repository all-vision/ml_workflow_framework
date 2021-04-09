import React, { useEffect, useState, setState } from "react";
import styled from "styled-components";
import { NavLink as RouterNavLink } from "react-router-dom";

import Helmet from 'react-helmet';

import "react-dragula/dist/dragula.css";

import {
  Avatar,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Grid,
  Link,
  Typography as MuiTypography
} from "@material-ui/core";

import { AvatarGroup } from '@material-ui/lab';

import { spacing } from "@material-ui/system";

import { orange, green, blue } from "@material-ui/core/colors";

import { Add as AddIcon } from "@material-ui/icons";

import { MessageCircle } from "react-feather";

import dragula from "react-dragula";

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import TaskFormDialog from "../../components/TaskModal"

const NavLink = React.forwardRef((props, ref) => (
  <RouterNavLink innerRef={ref} {...props} />
));

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  &:last-child {
    padding-bottom: ${props => props.theme.spacing(4)}px;
  }
`;

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const TaskWrapper = styled(Card)`
  border: 1px solid ${props => props.theme.palette.grey[300]};
  margin-bottom: ${props => props.theme.spacing(4)}px;
  cursor: grab;

  &:hover {
    background: ${props => props.theme.body.background};
  }
`;

const TaskWrapperContent = styled(CardContent)`
  position: relative;

  &:last-child {
    padding-bottom: ${props => props.theme.spacing(4)}px;
  }
`;

const TaskAvatars = styled.div`
  margin-left: 8px;
`

const MessageCircleIcon = styled(MessageCircle)`
  color: ${props => props.theme.palette.grey[500]};
  vertical-align: middle;
`

const TaskBadge = styled.div`
  background: ${props => props.color};
  width: 40px;
  height: 6px;
  border-radius: 6px;
  display: inline-block;
  margin-right: ${props => props.theme.spacing(2)}px;
`

const TaskNotifications = styled.div`
  display: flex;
  position: absolute;
  bottom: ${props => props.theme.spacing(4)}px;
  right: ${props => props.theme.spacing(4)}px;
`

const TaskNotificationsAmount = styled.div`
  color: ${props => props.theme.palette.grey[500]};
  font-weight: 600;
  margin-right: ${props => props.theme.spacing(1)}px;
  line-height: 1.75;
`

const Typography = styled(MuiTypography)(spacing);

const TaskTitle = styled(Typography)`
  font-weight: 600;
  font-size: 15px;
  margin-right: ${props => props.theme.spacing(10)}px;
`

const TaskBody = styled(Typography)`
  font-weight: 400;
  font-size: 12px;
  margin-right: ${props => props.theme.spacing(10)}px;
`

function LongMenu() {
  const taskMenuOptions = [
    'Edit',
    'Delete',
  ];
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    window.open("/private")
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {taskMenuOptions.map((option) => (
          <MenuItem key={option} onClick={handleClose}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}




/*
TODO:
  Creating tasks:
    - Have a modal popup when you click new task
    - Modal should be simple: enter task name and a descriptio (assignees later)
    - put tasks into 3 arrays: backlogTasks, inProgressTasks, completedTasks
    - display the tasks in their respective columns
  Modifying tasks:
    - when you click on a task, the modal pops up again and you can edit
      the task name and description
    - Modal should be simple: enter task name and a descriptio (assignees later)
  Deleting tasks:
    - have a delete button in the task modal --> deletes from respective array
*/

function Lane({ title, description, onContainerLoaded, children }) {
  const handleContainerLoaded = container => {
    if (container) {
      onContainerLoaded(container);
    }
  };

  // const handleTaskCreate = task => {
  //   // TODO: actually save the task into the task list
  //   console.log(task.taskName)
  //   const newTask = <Task content={task.taskName} avatars={[]} />
  //   setTaskList(prevTaskList => [...prevTaskList, newTask])
  //   // const newTask = <Task content={task.taskName} avatars={[]} />
  //   // this.setState(prevState => {
  //   //   return {
  //   //     tasksList: [...prevState.tasksList, newTask]
  //   //   }
  //   // })
  // }

  return (
    <Card mb={6}>
      <CardContent pb={0}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" mb={4}>
          {description}
        </Typography>
        <div ref={handleContainerLoaded}>{children}</div>
        {/* <TaskFormDialog onCreate={handleTaskCreate} /> */}
        {/* <Button color="primary" variant="contained" fullWidth>
          <AddIcon />
          Manually add new task
        </Button> */}
      </CardContent>
    </Card>
  );
}

function Task({ content, avatars }) {
  return (
    <TaskWrapper mb={4}>
      <TaskWrapperContent>
        {content.badges && content.badges.map((color, i) => <TaskBadge color={color} key={i} />)}

        <div style={{ justifyContent: "space-between", display: "flex" }}>
          <TaskTitle variant="body1" gutterBottom>
            {content.title}
          </TaskTitle>

          <LongMenu />
          {/* <IconButton size="small" style={{ float: "right" }} aria-label="delete">
            <DeleteIcon />
          </IconButton> */}
          
        </div>

        <TaskBody variant="body1" gutterBottom>
            {content.description}
        </TaskBody>

        <TaskAvatars>
          <AvatarGroup max={3}>
            {avatars && avatars.map((avatar, i) => <Avatar src={`/static/img/avatars/avatar-${avatar}.jpg`} key={i} />)}
          </AvatarGroup>
        </TaskAvatars>

        {content.notifications &&
          <TaskNotifications>
            <TaskNotificationsAmount>
              {content.notifications}
            </TaskNotificationsAmount>
            <MessageCircleIcon />
          </TaskNotifications>
        }
      </TaskWrapperContent>
    </TaskWrapper>
  );
}

const demoTasks = [
  {
    title: "Realign Radar 2",
    description: "Radar 2 shows degraded performance consistant with misalignment, Recommended Action to perform realignment",
    badges: [green[600], orange[600]]
  },
  {
    title: "Lidar Power Outage",
    badges: [green[600]],
    notifications: 1
  },
  {
    title: "Satellite Starlink-1532 Unexpected Maneuver", 
    description: "Satellite Boosted to new orbit, Recommended action to escalate to supervisor "
  },
  {
    title: "Satellite SJ-355 Unexpected Maneuver",
    badges: [green[600]],
    notifications: 3
  },
  {
    title: "New Debris Field Detected",
    badges: [blue[600]]
  }
];

function Tasks() {
  const containers = [];

  const onContainerReady = container => {
    containers.push(container);
  };

  const [taskList, setTaskList] = useState([])

  const handleTaskCreate = task => {
    // hook up backend to actually save new tasks to DB
    const newTask = <Task
      key={task.taskName.toLowerCase().replace(/ /g, '-')}
      content={{ title: task.taskName, badges: [] }}
    />
    setTaskList(prevTaskList => [...prevTaskList, newTask])
  }

  useEffect(() => {
    dragula(containers);
  }, [containers]);

  return (
    <React.Fragment>
      <Helmet title="Tasks" />
      <Typography variant="h3" gutterBottom display="inline">
        Tasks
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/">
          Dashboard
        </Link>
        <Link component={NavLink} exact to="/">
          Pages
        </Link>
        <Typography>Tasks</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12} lg={4} xl={4}>
          <Lane
            title="Alerts"
            description="Discovered anomolies and events"
            onContainerLoaded={onContainerReady}
          > 
            { <Task content={demoTasks[0]} avatars={[]} /> }
            {taskList}
            <TaskFormDialog onCreate={handleTaskCreate} />
          </Lane>
        </Grid>
        <Grid item xs={12} lg={4} xl={4}>
          <Lane
            title="Actions In Progress"
            description="Actions being taken to fix detected alerts."
            onContainerLoaded={onContainerReady}
          >
            <Task content={demoTasks[2]} avatars={[3, 1, 2]} />
            <Task content={demoTasks[4]} avatars={[2]} />
          </Lane>
        </Grid>
        <Grid item xs={12} lg={4} xl={4}>
          <Lane
            title="Completed"
            description="Solved Issues"
            onContainerLoaded={onContainerReady}
          >
            { <Task content={demoTasks[3]} avatars={[1, 2]} /> }
          </Lane>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Tasks;

