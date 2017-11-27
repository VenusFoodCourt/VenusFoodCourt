import React from 'react';

const Comments = (props) => (
  <div className="comment">
    <p className='comment-user'>{props.comment.username}</p>
    <p className='comment-text'>{props.comment.text}</p>
  </div>
);

export default Comments;