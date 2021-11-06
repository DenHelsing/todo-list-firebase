import React from 'react';
import TodoListItem from '../todo-list-item/todo-list-item.js';
import './todo-list.css';

const TodoList = ({
  data,
  onDeleted,
  onToggleImportant,
  onToggleDone,
  onEnterEditMode,
  onExitEditMode
}) => {
  const elements = data.map((item) => {
    const { id, ...itemProps } = item;
    return (
      <li key={id} className="list-group-item">
        <TodoListItem
          {...itemProps}
          onDeleted={() => onDeleted(id)}
          onToggleImportant={() => onToggleImportant(id)}
          onToggleDone={() => onToggleDone(id)}
          onEnterEditMode={() => onEnterEditMode(id)}
          onExitEditMode={(newLabel) => onExitEditMode(id, newLabel)}
        />
      </li>
    );
  });

  return <ul className="list-group todo-list">{elements}</ul>;
};

export default TodoList;
