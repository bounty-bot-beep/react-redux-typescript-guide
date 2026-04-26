import Types from 'MyTypes';
import * as React from 'react';
import { connect } from 'react-redux';

import { todosActions, todosSelectors } from '../features/todos';
import { Todo, TodosFilter } from '../features/todos/models';

// Feature-specific selectors only know about their own slice (TodosState),
// so we adapt the global RootState by passing the relevant slice (state.todos).
const mapStateToProps = (state: Types.RootState) => ({
  todos: todosSelectors.getFilteredTodos(state.todos),
  filter: todosSelectors.getTodosFilter(state.todos),
});

const dispatchProps = {
  onAdd: todosActions.add,
  onToggle: todosActions.toggle,
  onChangeFilter: todosActions.changeFilter,
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const TodosList: React.FC<Props> = ({
  todos,
  filter,
  onAdd,
  onToggle,
  onChangeFilter,
}) => {
  const [title, setTitle] = React.useState('');

  const handleAdd = () => {
    if (!title) return;
    onAdd(title);
    setTitle('');
  };

  return (
    <div>
      <div>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="New todo"
        />
        <button type="button" onClick={handleAdd}>
          Add
        </button>
      </div>
      <div>
        <select
          value={filter}
          onChange={e => onChangeFilter(e.target.value as TodosFilter)}
        >
          <option value={TodosFilter.All}>All</option>
          <option value={TodosFilter.Active}>Active</option>
          <option value={TodosFilter.Completed}>Completed</option>
        </select>
      </div>
      <ul>
        {todos.map((todo: Todo) => (
          <li
            key={todo.id}
            onClick={() => onToggle(todo.id)}
            style={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              cursor: 'pointer',
            }}
          >
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const TodosListConnected = connect(
  mapStateToProps,
  dispatchProps
)(TodosList);
