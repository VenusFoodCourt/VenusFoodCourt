import React from 'react';
import Comments from './comments.jsx';

class SingleFoodItem extends React.Component {
  render () {
    return (
      <div className="flex-post">
        <img className="image-post" height="240" width="400" src={this.props.foodPost.url} />
        <div className="flex-item">
          <p className="title">{this.props.foodPost.title}</p>
          <p className="description">{this.props.foodPost.description}</p>
          <p className="username">{this.props.foodPost.username}</p>
        </div>
      </div>
      );
  }
}

export default SingleFoodItem;