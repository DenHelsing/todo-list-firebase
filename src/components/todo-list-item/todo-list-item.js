import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faExclamation,
  faPen,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

import './todo-list-item.css';

class TodoListItem extends Component {
  render() {
    const {
      label,
      onDeleted,
      onToggleImportant,
      onToggleDone,
      onEnterEditMode,
      onExitEditMode,
      done,
      important,
      editing
    } = this.props;

    let classNames = 'todo-list-item';
    if (done) {
      classNames += ' done';
    }

    if (important) {
      classNames += ' important';
    }

    let labelChangedValue = label;

    const listItemLabel = (
      <span className="todo-list-item-label" onClick={onToggleDone}>
        {label}
      </span>
    );
    const listItemEdit = (
      <input
        defaultValue={labelChangedValue}
        onChange={(e) => (labelChangedValue = e.target.value)}
      />
    );

    return (
      <span className={classNames}>
        {editing ? listItemEdit : listItemLabel}
        <div className="todo-list-item-buttons">
          <button
            type="button"
            className="btn btn-outline-success btn-sm"
            onClick={onToggleImportant}
          >
            <FontAwesomeIcon icon={faExclamation} />
          </button>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={
              editing
                ? () => onExitEditMode(labelChangedValue)
                : onEnterEditMode
            }
          >
            {editing ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faPen} />
            )}
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={onDeleted}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </span>
    );
  }
}

export default TodoListItem;
