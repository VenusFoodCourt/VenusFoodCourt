import React from 'react';
import {render} from 'react-dom';
import Header from './components/header.jsx';
import FoodPostList from './components/foodPostList.jsx';
import SingleFoodItem from './components/singleFoodItem.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foodPosts: [{title: 'DummyTitle', description: 'This is a dummy description. Should maybe have a limit on the number of characters allowed.', url: 'http://placecorgi.com/260/180', username: 'Dummyuser'}, {title: 'DummyTitle', description: 'This is a dummy description. Should maybe have a limit on the number of characters allowed.', url: 'http://placecorgi.com/260/180', username: 'Dummyuser'}]
    }
  }


  render () {
    return (
      <div style={{borderStyle: 'solid'}}>
        <Header />
        <FoodPostList foodPosts={this.state.foodPosts} />
      </div>
      );
  }
}

render(<App/>, document.getElementById('app'));