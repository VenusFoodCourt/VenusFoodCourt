import React from 'react';
import FoodPostListEntry from './foodPostListEntry.jsx';

class FoodPostList extends React.Component {
  render () {
    return (
      <div style={{borderStyle: 'solid'}}>
        <h2>This is where the foodPostList goes</h2>
        <FoodPostListEntry />
        <FoodPostListEntry />
        <FoodPostListEntry />
        <FoodPostListEntry />
        <FoodPostListEntry />
      </div>
    );
  }
}

export default FoodPostList;