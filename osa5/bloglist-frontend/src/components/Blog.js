import React from 'react'

class Blog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false
    }
  }

  toggleCollapsed = () => {
    this.setState({ collapsed: !this.state.collapsed })
  }

  render() {
    const showWhenCollapsed = { display: this.state.collapsed ? '': 'none' }
    const showWhenNotCollapsed = { display: this.state.collapsed ? 'none': '' }
    const adder = (this.props.blog.user ? this.props.blog.user.name : 'anonymous')

    return (
      <div className="blog">
        <div className="blog-title" onClick={this.toggleCollapsed}>
          <span style={showWhenNotCollapsed} className="toggle-arrow">›</span>
          <span style={showWhenCollapsed} className="toggle-arrow">⌄</span>
          {this.props.blog.title} by {this.props.blog.author}
        </div>
        <div className="blog-info-box" style={showWhenCollapsed}>
          <a href={this.props.blog.url}>{this.props.blog.url}</a><br/>
          {this.props.blog.likes} likes
          <button
            onClick={this.props.likeButtonHandler}
            className="like-button">
            like
          </button><br/>
          added by {adder}<br/>
          <button
            onClick={this.props.delButtonHandler}
            className="del-button">
            delete
          </button>
        </div>
      </div>
    )
  }
}

export default Blog