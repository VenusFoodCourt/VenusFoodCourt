import React from 'react';

class FoodPostListEntry extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <div className="flex">
        <img className="image-item" height="120" width="150" src={this.props.foodPost.url} />
        <div className="flex-item">
          <p className="title">{this.props.foodPost.title}</p>
          <p className="description">{this.props.foodPost.description}</p>
          <p className="username">{this.props.foodPost.username}</p>
        </div>
      </div>
      );
  }
}

export default FoodPostListEntry;