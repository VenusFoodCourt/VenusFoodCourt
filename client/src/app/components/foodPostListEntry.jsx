import React from 'react';
import SingleFoodItem from './SingleFoodItem.jsx';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import $ from 'jquery';



class FoodPostListEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      voteTotal: 0,
      voteStatus: 0,
      upvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/upvote.png',
      downvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/downvote.png'
    }
    this.handleUpvote = this.handleUpvote.bind(this);
    this.handleDownvote = this.handleDownvote.bind(this);
    this.getVote = this.getVote.bind(this);
    this.getVotes = this.getVotes.bind(this);
    this.handleVoteImage = this.handleVoteImage.bind(this);
    this.getVote();
    this.getVotes();
  }

  getVotes() {
    $.ajax({
      type: 'GET',
      url: '/voteCount/' + this.props.foodPost.id,
      processData: false,
      contentType: false,
      context: this
    }).then((msg) => {
      this.setState({voteTotal: JSON.parse(msg)});
      console.log('VoteTotal GETTED succesfully: response msg: ', msg);
    }).catch((error) => {
      console.error(error);
    });
  }

  getVote() {


    console.log('request for', this.props.foodPost.id);
    $.ajax({
      type: 'GET',
      url: '/voteStatus/' + this.props.foodPost.id + '/Johnny',
      processData: false,
      contentType: false,
      context: this
    }).then((msg) => {
      if (msg.length > 0) {
        this.handleVoteImage(msg[0].voteValue);
      }
      console.log('Votes GETTED succesfully: response msg: ', msg);
    }).catch((error) => {
      console.error(error);
    });
  }

  handleVoteImage (value) {
    if (value === 1) {
      this.setState({voteStatus: 1, upvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/upvoteclicked.png', downvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/downvote.png'});
    } else if (value === 0) {
      this.setState({voteStatus: 0, upvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/upvote.png', downvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/downvote.png'});
    } else if (value === -1) {
      this.setState({voteStatus: -1, upvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/upvote.png', downvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/downvoteclicked.png'});
    }
  }



  handleUpvote() {
    var formData = new FormData();
    formData.append('username', 'Johnny');
    formData.append('foodPostId', this.props.foodPost.id);
    

    if (this.state.voteStatus !== 1) {
      //make ajax request to server
      this.setState({voteStatus: 1, upvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/upvoteclicked.png', downvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/downvote.png'});
      formData.append('voteValue', 1);
    } else {
      this.setState({voteStatus: 0, upvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/upvote.png', downvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/downvote.png'});
      formData.append('voteValue', 0);
    }



    $.ajax({
      type: 'POST',
      url: '/vote',
      data: formData,
      processData: false,
      contentType: false,
      context: this
    }).then((msg) => {
      this.getVotes();
      console.log('Votes POSTED succesfully: response msg: ', msg);
    }).catch((error) => {
      console.error(error);
    });
  }

  handleDownvote() {
    var formData = new FormData();
    formData.append('username', 'Johnny');
    formData.append('foodPostId', this.props.foodPost.id);
    
    console.log('pressed downvote');
    if (this.state.voteStatus !== -1) {
      //make ajax request to server
      this.setState({voteStatus: -1, upvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/upvote.png', downvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/downvoteclicked.png'});
      formData.append('voteValue', -1);
    } else {
      this.setState({voteStatus: 0, upvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/upvote.png', downvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/downvote.png'});
      formData.append('voteValue', 0);
    }


    $.ajax({
      type: 'POST',
      url: '/vote',
      data: formData,
      processData: false,
      contentType: false,
      context: this
    }).then((msg) => {
      this.getVotes();
      console.log('Votes POSTED succesfully: response msg: ', msg);
    }).catch((error) => {
      console.error(error);
    });
  }


  render () {
    return (
      <div className="flex">
        {this.state.voteTotal}
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