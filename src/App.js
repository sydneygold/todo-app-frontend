import { Component } from 'react';
import './App.css';
import SignUpForm from './components/SignUpForm'
import {Route, Switch, Redirect} from 'react-router-dom'
import PrivateRoute from  './components/PrivateRoute'
import Home from './components/Home';

const baseUrl = 'http://localhost:3000/todos'
const userUrl = "http://localhost:3000/users/"

class App extends Component {

  state = {
    todos: [],
    user: {},
    alerts: []
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
      body: JSON.stringify({todo: newTodo})
    })
  }

  updateTodo = (updatedTodo) => {
    let todos = this.state.todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo)

    this.setState({todos})

    fetch(baseUrl + "/" + updatedTodo.id, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"
    },
    body: JSON.stringify({todo: updatedTodo})
    })
  }

  deleteTodo = (id) => {
    let filtered = this.state.todos.filter(todo => todo.id !== id)
    this.setState({
      todos: filtered
    })

    fetch(baseUrl + "/" + id, {method: "DELETE"})
  }

  signUp = (user) => {
    return fetch(userUrl, {
      method: 'POST',
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({user})
  })
    .then(response => response.json())
    .then(response => {
      if(response.errors){
        this.setState({alerts: response.errors})
      }
      else {
        localStorage.setItem('token', response.token)
        this.setState({
          user: response.user, 
          alerts: ["User successfully created!"]
        })
      }
    })
  }

  render(){
    return (
      <div className="App">
        <h1>Todo App</h1>
        <Switch>
        <PrivateRoute 
          exact path="/" 
          component={Home} 
          submitAction={this.addTodo}
          updateTodo={this.updateTodo}
          deleteTodo={this.deleteTodo}
          todos={this.state.todos}
        />
        <Route exact path="/signup" render={(routerProps) => {
            return (<SignUpForm 
              {...routerProps}
              signUp={this.signUp} 
              alerts={this.state.alerts}
            />)}
        }/>
        <Redirect to="/"/>
        </Switch>
      </div>
    );
  }
}

export default App;
