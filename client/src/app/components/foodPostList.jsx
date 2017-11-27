import React from 'react';
import FoodPostListEntry from './foodPostListEntry.jsx';

class FoodPostList extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }
  render () {
    return (
      <div>
        <div>
          {this.props.foodPosts.slice().reverse().map((foodPost, index)=>{
            return <FoodPostListEntry key={index} foodPost={foodPost}/>
          })}
        </div>
      </div>
    );
  }
}

export default FoodPostList;