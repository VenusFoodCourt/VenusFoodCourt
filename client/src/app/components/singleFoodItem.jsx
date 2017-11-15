import React from 'react';
import Comments from './comments.jsx';

class SingleFoodItem extends React.Component {
  render () {
    return (
        <div style={{borderStyle: 'solid'}}>
          <h1>This is where the SingleFoodItem goes</h1>
          <Comments />
        </div>
      );
  }
}

export default SingleFoodItem;