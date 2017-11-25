import React from 'react';
import Comments from './comments.jsx';

class SingleFoodItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      comments: [{username: 'fred', text: 'hello world'}, {username: 'joe', text: 'hey fred!'}]
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange (e) {
    this.setState({text: e.target.value});
  }

  onSubmit () {
    var newComment = {username: 'bob', text: this.state.text};
    this.state.comments.push(newComment);
    this.setState({comments: this.state.comments});
  }

  render () {
    return (
      <div className="flex-post">
        <p className="post-title">{this.props.foodPost.title}</p>
        <p className="username">{"Submitted by:" + this.props.foodPost.username}</p>
        <img className="image-post" height="240" width="400" src={this.props.foodPost.url} />
        <p className="description">{this.props.foodPost.description}</p>
        <div>
        <textarea onChange={this.onChange} placeholder="New Comment" rows="4" cols="50"></textarea>
        <br />
        <button onClick={this.onSubmit}>Submit</button>
        {this.state.comments.map((comment, index) => {
          return <Comments key={index} comment={comment}/>
        })}
        </div>
      </div>
      );
  }
}

export default SingleFoodItem;