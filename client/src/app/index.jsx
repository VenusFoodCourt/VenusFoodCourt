import React from 'react';
import {render} from 'react-dom';
import Header from './components/header.jsx';
import FoodPostList from './components/foodPostList.jsx';
import SingleFoodItem from './components/singleFoodItem.jsx';

class App extends React.Component {
  render () {
    return (
      <div style={{borderStyle: 'solid'}}>
        <Header />
        <SingleFoodItem />
      </div>
      );
  }
}

render(<App/>, document.getElementById('app'));