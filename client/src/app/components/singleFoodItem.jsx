import React from 'react';
import Comments from './comments.jsx';

class SingleFoodItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [{username: 'fred', text: 'hello world'}, {username: 'joe', text: 'hey fred!'}]
    }
  }
  render () {
    return (
      <div className="flex-post">
        <p className="post-title">{this.props.foodPost.title}</p>
        <p className="username">{"Submitted by:" + this.props.foodPost.username}</p>
        <img className="image-post" height="240" width="400" src={this.props.foodPost.url} />
        <p className="description">{this.props.foodPost.description}</p>
        <div>
        {this.state.comments.map((comment, index) => {
          return <Comments key={index} comment={comment}/>
        })}
        </div>
      </div>
      );
  }
}

export default SingleFoodItem;