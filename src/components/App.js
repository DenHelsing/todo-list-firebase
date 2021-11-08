import React, { Component, useEffect } from 'react';
import {
  doc,
  setDoc,
  getDocs,
  getFirestore,
  collection,
  deleteDoc,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
// import * as firebase from 'firebase/app'
import 'firebase/firestore';
import ItemAddForm from './item-add-form/item-add-form.js';
import TodoList from './todo-list/todo-list.js';
import SearchPanel from './search-panel/search-panel.js';
import AppHeader from './app-header/app-header.js';
import ItemStatusFilter from './item-status-filter/item-status-filter.js';
import '../bootstrap.css';
import './App.css';
import firebase from '../firebase';
export default class App extends Component {
  maxId = 100;
  db = getFirestore(firebase);

  state = {
    todoData: [
      // this.createToDoItem('Learn React'),
      // this.createToDoItem('Do cryptography'),
      // this.createToDoItem('Do secure internet technologies'),
      // this.createToDoItem('Do cloud computing'),
      // this.createToDoItem('Have some sleep')
    ],
    loading: false,
    searchText: '',
    statusFilter: 'all',
    deletedIDs: []
  };

  createToDoItem(label, deadline = 0, priority = 0, important = false) {
    // console.log(deadline);
    return {
      id: ++this.maxId,
      label,
      priority,
      deadline: deadline ? new Date(deadline).getTime() / 1000 : 0,
      important,
      done: false,
      editing: false
    };
  }
  createItemForDatabase({
    label,
    deadline,
    priority,
    important,
    done,
    editing
  }) {
    // console.log(deadline);
    return {
      label,
      priority,
      deadline: Timestamp.fromMillis(new Date(deadline).getTime() * 1000),
      important,
      done,
      editing
    };
  }

  deleteAnItem = (id) => {
    this.setState(({ todoData, deletedIDs }) => {
      console.log(deletedIDs);
      let anArr = todoData;
      anArr = todoData.filter(function (el) {
        return el.id !== id;
      });
      return { todoData: anArr, deletedIDs: [...deletedIDs, id] };
    });
  };

  // deleteAnItem = async (id) => {
  //   console.log(id);
  //   // this.setState({ loading: true });
  //   await deleteDoc(doc(this.db, 'todos', id));
  //   // this.setState({ loading: false });
  // };

  // addAnItem = async (txt, deadline, priority, important) => {
  //   // this.setState({ loading: true });
  //   const [id, firebaseObject] = this.createToDoItem(
  //     txt,
  //     deadline,
  //     priority,
  //     important
  //   );
  //   console.log(id);
  //   console.log(firebaseObject);
  //   // await setDoc(doc(this.db, 'todos', 'LA'), {
  //   //   name: 'Los Angeles',
  //   //   state: 'CA',
  //   //   country: 'USA'
  //   // });
  //   // await setDoc(doc(this.db, 'todos', String.toString(id)), firebaseObject);
  //   // this.setState({ loading: false });
  // };

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

  saveToDatabase = () => {
    const batch = writeBatch(this.db);
    const postData = async () => {
      this.state.todoData.forEach((item) => {
        const firebaseObject = this.createItemForDatabase(item);
        console.log(item.id);
        console.log(firebaseObject);
        batch.set(doc(this.db, 'todos', '' + item.id), firebaseObject);
      });
      if (this.state.deletedIDs.length !== 0) {
        console.log(this.state.deletedIDs);
        this.state.deletedIDs.forEach((id) =>
          batch.delete(doc(this.db, 'todos', '' + id))
        );
      }
      await batch.commit();
    };
    postData().then(() => console.log('saved'));
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
  componentDidMount() {
    // this.setState({ loading: true });
    const fetchData = async () => {
      const snapshot = await getDocs(collection(this.db, 'todos'));
      console.log(snapshot);
      const todos = snapshot.docs.map((doc) => {
        this.maxId = Math.max(this.maxId, parseInt(doc.id, 10));
        return {
          ...doc.data(),
          deadline: doc.data().deadline.seconds,
          id: parseInt(doc.id, 10)
        };
      });
      console.log(todos);
      this.setState({ todoData: todos });
    };
    fetchData();
  }

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
        <button
          type="button"
          className="btn btn-outline-primary saveButton"
          title="Save to cloud"
          onClick={this.saveToDatabase}
        >
          Save to cloud
        </button>
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
