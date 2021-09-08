import React, {useState} from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
interface Todo {
  value: string;
  id: number;
  checked: boolean;
  removed: boolean;
}
type Filter = 'all' | 'checked' | 'unchecked' | 'removed';

const App:React.VFC = () => {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement | HTMLInputElement>) => {
    console.log('defined newTodo');
    e.preventDefault();
    if (!text) return;

    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false,
    };
    setTodos([newTodo, ...todos]);
    setText('');
  }
  const handleOnEdit = (id:number, value: string) => {
    const newTodos = todos.map((todo) => {
      if (todo.id ===id) {
        todo.value = value;
      }
      return todo
    });
    setTodos(newTodos);
  }
  const handleOnCheck = (id:number, checked: boolean) => {
    const newTodos = todos.map((todo) => {
      if (todo.id ===id) {
        todo.checked = !checked;
      }
      return todo
    });
    setTodos(newTodos);
  }
  const handleOnRemove = (id:number, removed: boolean) => {
    const newTodos = todos.map((todo) => {
      if (todo.id ===id) {
        todo.removed = !removed;
      }
      return todo
    });
    setTodos(newTodos);
  }
  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case 'all':
        return !todo.removed;
      case 'checked':
        return todo.checked && !todo.removed;
      case 'unchecked':
        return !todo.checked && !todo.removed;
      case 'removed':
        return todo.removed;
    
      default:
        return todo;
    }
  })
  const handleOnEmpty = () => {
    const newTodos = todos.filter((todo) => !todo.removed);
    setTodos(newTodos);
  }
  return (
    <div>
      <select 
        defaultValue="all"
        onChange={(e) => setFilter(e.target.value as Filter)}>
        <option value="all">全てのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">未完了のタスク</option>
        <option value="removed">削除済みのタスク</option>
      </select>
      {filter === 'removed' ? (
        <button 
          onClick={() => handleOnEmpty()}
          disabled={todos.filter((todo) => todo.removed).length === 0}>
          ゴミ箱を空にする
        </button>
      ):(
        <form onSubmit={(e)=>handleOnSubmit(e)}>
          <input type="text" value={text} disabled={filter === 'checked'} onChange={(e)=> setText(e.target.value)} />
          <input type="submit" disabled={filter === 'checked'} value="追加" onSubmit={(e) => handleOnSubmit(e)} />
        </form>

      )}
      <ul>
        {filteredTodos.map((todo)=>{
          return <li key={todo.id}>
            <input type="checkbox" checked={todo.checked} disabled={todo.removed} onChange={(e) => handleOnCheck(todo.id, todo.checked)} />
            <input type="text" value={todo.value} disabled={todo.checked || todo.removed} onChange={(e) => handleOnEdit(todo.id, e.target.value)} />
            <button onClick={() => handleOnRemove(todo.id, todo.removed)}>{todo.removed ? '復元' : '削除'}</button>
          </li>
        })}
      </ul>
    </div>

  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


