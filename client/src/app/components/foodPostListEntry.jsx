import React from 'react';
import SingleFoodItem from './SingleFoodItem.jsx';
import { BrowserRouter, Link, Route } from 'react-router-dom';

class FoodPostListEntry extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <div className="flex">
        <Link to={"/post" + this.props.foodPost.id}>
          <img className="image-item" height="120" width="150" src={this.props.foodPost.url} />
        </Link>
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