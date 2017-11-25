import React from 'react';
import SingleFoodItem from './SingleFoodItem.jsx';
import { BrowserRouter, Link, Route } from 'react-router-dom';



class FoodPostListEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      voteStatus: 0,
      upvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/upvote.png',
      downvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/downvote.png'
    }
    this.handleUpvote = this.handleUpvote.bind(this);
    this.handleDownvote = this.handleDownvote.bind(this);
  }

  handleUpvote() {
    console.log('pressed upvote');
    if (this.state.voteStatus !== 1) {
      //make ajax request to server
      this.setState({voteStatus: 1, upvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/upvoteclicked.png', downvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/downvote.png'});
    } else {
      this.setState({voteStatus: 0, upvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/upvote.png', downvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/downvote.png'});
    }
  }

  handleDownvote() {
    console.log('pressed downvote');
    if (this.state.voteStatus !== -1) {
      //make ajax request to server
      this.setState({voteStatus: -1, upvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/upvote.png', downvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/downvoteclicked.png'});
    } else {
      this.setState({voteStatus: 0, upvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/upvote.png', downvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/downvote.png'});
    }
  }


  render () {
    return (
      <div className="flex">
        <div>
          <img onClick={this.handleUpvote} className="votes" height="18" width="12" src={this.state.upvoteUrl} /> <br />
          <img onClick={this.handleDownvote} className="votes" height="18" width="12" src={this.state.downvoteUrl} />
        </div>
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