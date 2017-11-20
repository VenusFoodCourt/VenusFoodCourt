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
      foodPosts: [{id: 234, title: 'DummyTitle1', description: 'This is a dummy description. Should maybe have a limit on the number of characters allowed.', url: 'http://placecorgi.com/260/180', username: 'Dummyuser'}, {id: 123, title: 'DummyTitle2', description: 'This is a dummy description. Should maybe have a limit on the number of characters allowed.', url: 'http://placecorgi.com/260/180', username: 'Dummyuser'}]
    }
  }


  render () {
    return (
      <div style={{borderStyle: 'solid'}}>
        <nav>
          <Link to="/"><button type="button">Main Page</button></Link>
        </nav>
        <Header />
        <div>
          <Route exact path="/" render={(props) => ( <FoodPostList foodPosts={this.state.foodPosts} /> )}/>
        </div>
        <div>
          {this.state.foodPosts.map((foodPost, index)=>{
            return <Route key={index} exact path={"/post" + foodPost.id} render={(props) => ( <SingleFoodItem foodPost={foodPost} /> )}/>
          })}
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