import React from 'react'
import Blog from './Blog'
import PropTypes from 'prop-types'

const BlogList = ({ blogs, currentUser, likeButtonHandler, delButtonHandler }) => {
  const sortedBlogs = blogs.sort((a, b) => {
    return b.likes - a.likes
  })

  return (
    <div>
      <h2>blogs</h2>
      {sortedBlogs.map(blog =>
        <Blog
          key={blog._id}
          blog={blog}
          currentUser={currentUser}
          likeButtonHandler={likeButtonHandler(blog._id)}
          delButtonHandler={delButtonHandler(blog._id)}
        />
      )}
    </div>
  )
}

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  currentUser: PropTypes.string.isRequired,
  likeButtonHandler: PropTypes.func.isRequired,
  delButtonHandler: PropTypes.func.isRequired
}

export default BlogList