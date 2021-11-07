import React, { Component } from 'react';
import ItemAddForm from './item-add-form/item-add-form.js';
import TodoList from './todo-list/todo-list.js';
import SearchPanel from './search-panel/search-panel.js';
import AppHeader from './app-header/app-header.js';
import ItemStatusFilter from './item-status-filter/item-status-filter.js';
import '../bootstrap.css';
import './App.css';
export default class App extends Component {
  maxId = 100;

  state = {
    todoData: [
      this.createToDoItem('Learn React'),
      this.createToDoItem('Do cryptography'),
      this.createToDoItem('Do secure internet technologies'),
      this.createToDoItem('Do cloud computing'),
      this.createToDoItem('Have some sleep')
    ],
    searchText: '',
    statusFilter: 'all'
  };

  createToDoItem(label, deadline = '', priority = 0, important = false) {
    return {
      label,
      id: this.maxId++,
      priority,
      deadline,
      important,
      done: false,
      editing: false
    };
  }

  deleteAnItem = (id) => {
    this.setState(({ todoData }) => {
      let anArr = todoData;
      anArr = todoData.filter(function (el) {
        return el.id !== id;
      });
      return { todoData: anArr };
    });
  };

  addAnItem = (txt, deadline, priority, important) => {
    this.setState(({ todoData }) => {
      return {
        todoData: [
          ...todoData,
          this.createToDoItem(txt, deadline, priority, important)
        ]
      };
    });
  };

  changeProp = (arr, id, prop, exactValue = '') => {
    const index = arr.findIndex((el) => el.id === id);
    const oldItem = arr[index];

    let newItem = {};
    if (!!exactValue) {
      newItem = { ...oldItem, [prop]: exactValue };
    } else {
      newItem = { ...oldItem, [prop]: !oldItem[prop] };
    }

    const newArray = [...arr.slice(0, index), newItem, ...arr.slice(index + 1)];
    return newArray;
  };

  onToggleImportant = (id) => {
    this.setState(({ todoData }) => {
      const newArray = this.changeProp(todoData, id, 'important');
      return { todoData: newArray };
    });
  };

  onEnterEditMode = (id) => {
    this.setState(({ todoData }) => {
      const newArray = this.changeProp(todoData, id, 'editing');
      return { todoData: newArray };
    });
  };

  onExitEditMode = (id, newLabel) => {
    if (newLabel.length != 0) {
      this.setState(({ todoData }) => {
        const changedLabelArray = this.changeProp(
          todoData,
          id,
          'label',
          newLabel
        );
        const exitEditModeArray = this.changeProp(
          changedLabelArray,
          id,
          'editing'
        );
        return { todoData: exitEditModeArray };
      });
    }
  };

  onToggleDone = (id) => {
    this.setState(({ todoData }) => {
      const newArray = this.changeProp(todoData, id, 'done');
      return { todoData: newArray };
    });
  };

  handleSearch = (txt) => {
    console.log(txt);
    this.setState({
      searchText: txt
    });
  };

  changeStatus = (status) => {
    this.setState({
      statusFilter: status
    });
  };

  filterBySearch = (data, searchText) => {
    if (searchText === '') {
      return data;
    }
    return data.filter(
      (el) => el.label.toLowerCase().indexOf(searchText.toLowerCase()) > -1
    );
  };

  filterByStatus = (data, status) => {
    if (status === 'all') {
      return data;
    }
    if (status === 'active') {
      return data.filter((el) => !el.done);
    }
    if (status === 'done') {
      return data.filter((el) => el.done);
    }
  };

  render() {
    const { todoData, searchText, statusFilter } = this.state;
    const doneCounter = todoData.filter((el) => el.done === true);
    const visibleData = this.filterByStatus(
      this.filterBySearch(todoData, searchText),
      statusFilter
    );

    return (
      <div>
        <AppHeader
          done={doneCounter.length}
          toDo={todoData.length - doneCounter.length}
        />
        <div className="searchPanel">
          <SearchPanel
            changed={(txt) => this.handleSearch(txt)}
            searchValue={this.state.searchText}
          />
          <ItemStatusFilter
            changeStatus={(txt) => this.changeStatus(txt)}
            currFilter={this.state.statusFilter}
          />
        </div>
        <TodoList
          data={visibleData}
          onDeleted={(id) => this.deleteAnItem(id)}
          onToggleImportant={(id) => this.onToggleImportant(id)}
          onToggleDone={(id) => this.onToggleDone(id)}
          onEnterEditMode={(id) => this.onEnterEditMode(id)}
          onExitEditMode={(id, newLabel) => this.onExitEditMode(id, newLabel)}
        />
        <ItemAddForm
          onAdding={(txt, deadline, priority, important) =>
            this.addAnItem(txt, deadline, priority, important)
          }
        />
      </div>
    );
  }
}
