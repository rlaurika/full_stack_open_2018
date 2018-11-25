import React from 'react'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import NewBlogForm from './components/NewBlogForm'
import NotificationBox from './components/NotificationBox'
import blogService from './services/blogs'
import loginService from './services/login'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      username: '',
      password: '',
      user: null,
      newBlogTitle: '',
      newBlogAuthor: '',
      newBlogURL: '',
      notification: null,
      notificationClass: null
    }
  }

  componentDidMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })
    )

    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      this.setState({ user })
      blogService.setToken(user.token)
    }
  }

  showNotification = ({ notification, notificationClass }) => {
    this.setState({ notification: notification,
                    notificationClass: notificationClass })
    setTimeout(() => {
      this.setState({ notification: null, notificationClass: null })
    }, 3000)
  }

  doLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })

      blogService.setToken(user.token)
      this.setState({ username: '', password: '', user })
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
    } catch (exception) {
      this.showNotification({ notification: 'Invalid username or password',
                              notificationClass: 'error' })
    }
  }

  doLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    this.setState({ user: null })
  }

  createNewBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = {
        title: this.state.newBlogTitle,
        author: this.state.newBlogAuthor,
        url: this.state.newBlogURL
      }

      const response = await blogService.create(newBlog)

      this.setState({ newBlogTitle: '',
                      newBlogAuthor: '',
                      newBlogURL: '',
                      blogs: this.state.blogs.concat(response) })

      this.showNotification({ notification: `Added new blog ${response.title} by ${response.author}`,
                              notificationClass: 'notice' })
    } catch (exception) {
      this.showNotification({ notification: 'Could not add new blog',
                              notificationClass: 'error' })
    }
  }

  handleLoginFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleNewBlogFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    const newBlog = {
      title: this.state.newBlogTitle,
      author: this.state.newBlogAuthor,
      url: this.state.newBlogURL
    }

    return (
      <div>
        <NotificationBox
          notificationClass={this.state.notificationClass}
          notification={this.state.notification}
        />
        { this.state.user === null ?
          <div>
            <LoginForm
              doLogin={this.doLogin}
              handleLoginFieldChange={this.handleLoginFieldChange}
            />
          </div> :
          <div>
            <div>
              <p>{this.state.user.name} logged in</p>
              <button onClick={this.doLogout}>log out</button>
            </div>
            <NewBlogForm
              newBlog={newBlog}
              createNewBlog={this.createNewBlog}
              handleNewBlogFieldChange={this.handleNewBlogFieldChange}
            />
            <BlogList blogs={ this.state.blogs }/>
          </div>
        }
      </div>
    );
  }
}

export default App;
