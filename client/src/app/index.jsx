import React from 'react';
import {render} from 'react-dom';
import Header from './components/header.jsx';
import FoodPostList from './components/foodPostList.jsx';
import SingleFoodItem from './components/singleFoodItem.jsx';
import { BrowserRouter, Link, Route } from 'react-router-dom';

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
        <nav>
          <Link to="/">Main Page</Link>
          <Link to="/post">Post Page</Link>
        </nav>
        <Header />
        <div>
          <Route exact path="/" render={(props) => ( <FoodPostList foodPosts={this.state.foodPosts} /> )}/>
        </div>
        <div>
          <Route exact path="/post" render={(props) => ( <SingleFoodItem foodPost={this.state.foodPosts[0]} /> )}/>
        </div>
      </div>
      );
  }
}

render((
  <BrowserRouter>
    <App/>
  </BrowserRouter>
  ), document.getElementById('app'));