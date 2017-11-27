import React from 'react';
import Comments from './comments.jsx';
import $ from 'jquery';

class SingleFoodItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      comments: [{username: 'fred', text: 'hello world'}, {username: 'joe', text: 'hey fred!'}],
      voteTotal: 0,
      voteStatus: 0,
      upvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/upvote.png',
      downvoteUrl: 'https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/downvote.png'
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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
  onChange (e) {
    this.setState({text: e.target.value});
  }

  onSubmit () {
    var newComment = {username: this.props.currUser, text: this.state.text};
    var formData = new FormData();

    formData.append('username', this.props.currUser);
    formData.append('text', this.state.text);
    formData.append('foodPostId', this.props.foodPost.id);
    
    $.ajax({
      type: 'POST',
      url: '/comment',
      data: formData,
      processData: false,
      contentType: false,
      context: this
    }).then((msg) => {
      console.log('Comments POSTED succesfully: response msg: ', msg);
      this.state.comments.push(newComment);
      this.setState({comments: this.state.comments});
    }).catch((error) => {
      console.error(error);
    });
  }

  componentDidMount() {
    $.ajax({
      type: 'GET',
      url: '/comments/' + this.props.foodPost.id,
      processData: false,
      contentType: false,
      context: this
    }).then((msg) => {
      console.log('Comments GETTED succesfully: response msg: ', msg);
      this.setState({comments: msg});
    }).catch((error) => {
      console.error(error);
    });
  }

  render () {
    return (
      <div>
        <div className="post-header">
          <div className="vote-container">
            <img onClick={this.handleUpvote} className="votes" height="18" width="12" src={this.state.upvoteUrl} />
            <div className="total-votes">{this.state.voteTotal}</div>
            <img onClick={this.handleDownvote} className="votes" height="18" width="12" src={this.state.downvoteUrl} />
          </div>
          <div className="flex-post">
              <p className="post-title">{this.props.foodPost.title}</p>
              <p className="username">{"Submitted by:" + this.props.foodPost.username}</p>
            <img className="image-post" height="240" width="400" src={this.props.foodPost.url} />
            <p className="description">{this.props.foodPost.description}</p>
          </div>
        </div>
        <div className="comments">
          <textarea className="new-comment" onChange={this.onChange} placeholder="New Comment" rows="4" cols="50"></textarea>
          <br />
          <button className="new-comment-button" onClick={this.onSubmit}>Submit</button>
          {this.state.comments.slice().reverse().map((comment, index) => {
            return <Comments key={index} comment={comment}/>
          })}
          <br />
        </div>
      </div>
      );
  }
}

export default SingleFoodItem;