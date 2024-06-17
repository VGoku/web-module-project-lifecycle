import React from 'react';
import axios from 'axios';
import Form from './Form';

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    todoNameInput: '',
    displayCompleteds: true,
  }
  onTodoNameInputChange = evt => {
    const { value } = evt.target
    //debugger
    this.setState({ ...this.state, todoNameInput: value })
  }

  resetForm = () => this.setState({ ...this.state, todoNameInput: '' })
  setAxiosResponseError = err =>  this.setState({ ...this.state, error: err.response.data.message })
  postNewTodo = () => {
    axios.post(URL, { name: this.state.todoNameInput })
    .then(res => {
      //debugger
      //this.fetchAllTodos()
      this.setState({...this.state, todos: this.state.todos.concat(res.data.data) })
      this.resetForm()
    })
    .catch(this.setAxiosResponseError)
      //debugger
     
    
  }
  onTodoFormSubmit = evt => {
    evt.preventDefault()
    this.postNewTodo()
  }
  fetchAllTodos = () => {
    axios.get(URL)
      .then(res => {
        //debugger
        this.setState({ ...this.state, todos: res.data.data })
      })
      .catch(this.setAxiosResponseError)
        //debugger
       
  }
  toggleCompleted = id => () => {
    axios.patch(`${URL}/${id}`)
    .then(res => {
      //debugger
      this.setState({ ...this.state, todos: this.state.todos.map(td => {
        //debugger
        if (td.id !== id) return td;
        return res.data.data;
      }) })
    })
    .catch(this.setAxiosResponseError)
  }
  toggleDisplayCompleteds = () => {
    this.setState({ ...this.state, displayCompleteds: !this.state.displayCompleteds })
  }
  componentDidMount() {
    // fetch all todos from server.
    this.fetchAllTodos()
  }
  render() {
    return (
      <div>
        <div id="error">Error: {this.state.error}</div>
        <div id="todos">
          <h2>Todos:</h2>
          {
            this.state.todos.reduce((acc, td) => {
              
              if (this.state.displayCompleteds || !td.completed) return acc.concat(
                <div onClick={this.toggleCompleted(td.id)} key={td.id}>{td.name}{td.completed ? " ✔️" : "" }</div>
              )
              return acc;
            }, [])
            
          }
        </div>
        <Form 
        onTodoFormSubmit={this.onTodoFormSubmit}
        onTodoNameInputChange={this.onTodoNameInputChange}
        toggleDisplayCompleteds={this.toggleDisplayCompleteds}
        todoNameInput={this.state.todoNameInput}
        displayCompleteds={this.state.displayCompleteds}
        />
        </div>
    )
  }
}


