import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
 
import { Tasks } from '../api/tasks.js';
 
import Task from './Task.js';
 
// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeValue: '',
      hideCompleted: false,
    }
  }
  renderTasks() {
    let taskList = this.props.tasks;
    if (this.state.hideCompleted) {
      taskList = taskList.filter(task => !task.checked);
    }
    return taskList.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  handleSubmit = (event) => {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = this.state.typeValue;
 
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
    });
 
    // Clear form
    this.setState({
      typeValue: ''
    })
  }

  onChangeInput = (e) => {
    this.setState({
      typeValue: e.target.value
    });
  }

  toggleHideCompleted = () => {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted}
            />
            Hide Completed Tasks
          </label>
 
          <form className="new-task" onSubmit={this.handleSubmit} >
            <input
              type="text"
              onChange={this.onChangeInput}
              value={this.state.typeValue}
              ref="textInput"
              placeholder="Type to add new tasks"
            />
          </form>
        </header>
 
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}


export default withTracker(() => {
    return {
      tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
      incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    };
  })(App);