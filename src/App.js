import { Component } from 'react';
import './App.css';
import TodoContainer from './components/TodoContainer'
import TodoForm from './components/TodoForm'

const baseUrl = 'http://localhost:3000/todos'

class App extends Component {

  state = {
    todos: []
  }

  componentDidMount(){
    this.getTodos()
  }

  getTodos = () => {
    fetch(baseUrl)
    .then(response => response.json())
    .then(todos => this.setState({todos}))
  }

  addTodo = (newTodo) => {
    this.setState({
      todos: [...this.state.todos, newTodo]
    })
    fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(newTodo)
    })
  }

  deleteTodo = (id) => {
    let filtered = this.state.todos.filter(todo => todo.id !== id)
    this.setState({
      todos: filtered
    })
  }

  render(){
    return (
      <div className="App">
        <h1>Todo App</h1>
        <TodoForm addTodo={this.addTodo}/>
        <TodoContainer todos={this.state.todos} deleteTodo={this.deleteTodo}/>
      </div>
    );
  }
}

export default App;
