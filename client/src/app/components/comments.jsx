import React from 'react';

const Comments = (props) => (
  <div style={{borderStyle: 'solid'}}>
    <p>{props.comment.username}</p>
    <p className='comment-text'>{props.comment.text}</p>
  </div>
);

export default Comments;