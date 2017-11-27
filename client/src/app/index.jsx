import React from 'react';
import {render} from 'react-dom';
import Header from './components/header.jsx';
import FoodPostList from './components/foodPostList.jsx';
import SingleFoodItem from './components/singleFoodItem.jsx';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currUser: 'Brendon',
      foodPosts: []
    }
    this.getFoodPosts = this.getFoodPosts.bind(this);
    this.getFoodPosts();
  }

  getFoodPosts() {
    $.ajax({
      type: 'GET',
      url: '/foodPosts',
      processData: false,
      contentType: false,
      context: this
    }).then((msg) => {
      console.log('Food post GETTED succesfully: response msg: ', msg);
      this.setState({foodPosts: msg});
    }).catch((error) => {
      console.error(error);
    });
  }


  render () {
    return (
      <div>
        <Link to="/" className="page-title"><h1 id="page-header">FOODCOURT</h1></Link>
        <img className="gavel" width="40" height="30" src="https://s3-us-west-1.amazonaws.com/venusfoodcourt/dev/gavel.png" />
        <Header currUser={this.state.currUser}/>
        <div>
          <Route exact path="/" render={(props) => ( <FoodPostList foodPosts={this.state.foodPosts} currUser={this.state.currUser} /> )}/>
        </div>
        <div>
          {this.state.foodPosts.map((foodPost, index)=>{
            return <Route key={index} exact path={"/post" + foodPost.id} render={(props) => ( <SingleFoodItem foodPost={foodPost} currUser={this.state.currUser}/> )}/>
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