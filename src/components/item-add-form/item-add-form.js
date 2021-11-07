import React, { Component } from 'react';
import './item-add-form.css';

export default class ItemAddForm extends Component {
  state = {
    label: '',
    deadline: '',
    important: false,
    priority: '',
    placeholder: 'Input a new item',
    txtColor: 'grey'
  };

  onLabelChange = (event) => {
    this.setState({
      label: event.target.value
    });
  };

  onProrityChange = (event) => {
    this.setState({
      priority: Number(event.target.value)
    });
  };

  onDeadlineChange = (event) => {
    this.setState({
      deadline: event.target.value
    });
  };

  onStatusChange = (event) => {
    console.log(event.target.checked);
    this.setState({
      important: event.target.checked
    });
  };

  onSubmit = (e) => {
    const { label, deadline, priority, important } = this.state;
    e.preventDefault();

    if (label.split(' ').filter((el) => el.length >= 15).length !== 0) {
      console.log(label.split(' ').filter((el) => el.length >= 15).length);
      this.setState(
        {
          label: '',
          placeholder: 'Incorrect input',
          txtColor: 'red'
        },
        () => {
          this.makePlaceholdeColorBack();
        }
      );
    } else if (label === '') {
      console.log(label.length);
      this.setState(
        {
          placeholder: 'Enter smth!!!',
          txtColor: 'red'
        },
        () => {
          this.makePlaceholdeColorBack();
        }
      );
    } else {
      this.props.onAdding(label, deadline, priority, important);
      this.setState({
        label: '',
        deadline: '',
        priority: '',
        placeholder: 'Enter new task',
        txtColor: 'grey'
      });
    }
  };

  makePlaceholdeColorBack = () => {
    setTimeout(() => {
      this.setState({
        placeholder: 'Input a new item',
        txtColor: 'grey'
      });
    }, 5000);
  };

  render() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;
    return (
      <form className="item-add-form" onSubmit={this.onSubmit}>
        <div className="item-add-form-fields">
          <input
            type="text"
            value={this.state.label}
            className={`form-control ${
              this.state.txtColor === 'red' ? 'red' : 'grey'
            }`}
            onChange={this.onLabelChange}
            placeholder={this.state.placeholder}
          />
          <input
            type="date"
            value={this.state.deadline}
            onChange={this.onDeadlineChange}
            min={today}
          />
          <input
            type="number"
            placeholder="Priority"
            value={this.state.priority}
            min="0"
            onChange={this.onProrityChange}
          />
          <label>
            important?
            <input
              type="checkbox"
              value={this.state.important}
              onChange={this.onStatusChange}
            />
          </label>
        </div>
        <button className="btn btn-outline-secondary" title="Add an item">
          Add an item
        </button>
      </form>
    );
  }
}
