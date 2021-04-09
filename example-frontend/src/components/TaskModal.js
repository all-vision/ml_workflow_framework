import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class extends Component {
  constructor() {
    super()
    this.state = {
      open: false,
      task: {
        taskName: '',
        taskDescription: ''
      }
    }
    this.handleToggle = this.handleToggle.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleToggle = () => {
    this.setState({
      open: !this.state.open
    })
  }

  handleChange = name => ({ target: { value } }) => {
    this.setState({
      task: {
        ...this.state.task,
        [name]: value
      }
    })
  }

  handleSubmit = () => {
    // TODO: validation

    const { task } = this.state
    this.props.onCreate({
      ...task,
      id: task.taskName.toLowerCase().replace(/ /g, '-')
    })

    this.setState({
      open: false,
      task: {
        taskName: "",
        taskDescription: ""
      }
    })
  }

  render() {
    return (
      <div>
        <Button variant="outlined" color="primary" onClick={this.handleToggle}>
          Add new task
      </Button>
        <Dialog open={this.state.open} onClose={this.handleToggle} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">New Task</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              label="Task Name"
              value={this.state.task.taskName}
              onChange={this.handleChange('taskName')}
              id="taskName"
              type="text"
              margin="dense"
              fullWidth
            />
            <TextField
              label="Task Description"
              value={this.state.task.taskDescription}
              onChange={this.handleChange('taskDescription')}
              id="taskDescription"
              margin="dense"
              type="text"
              multiline
              rows="3 "
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleToggle} color="primary">
              Cancel
          </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Add Task
          </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

}

