import React from 'react';
import Modal from 'react-modal';
import $ from 'jquery';
import { BrowserRouter, Link, Route } from 'react-router-dom';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      submitModalOpen: false,
      loginModalOpen: false,
      signupModalOpen: false,
      file: undefined,
      imgPath: '//:0',
      title: '',
      username: '',
      password: '',
      description: ''
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.toggleSubmitModal = this.toggleSubmitModal.bind(this);
    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.toggleSignupModal = this.toggleSignupModal.bind(this);
    this.handleImgUpload = this.handleImgUpload.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleTitleChange(e) {
    this.setState({title: e.target.value});
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleDescriptionChange(e) {
    this.setState({description: e.target.value});
  }

  handleLogin(e) {
    e.preventDefault();
    // this.setState({username: '', password: ''})

    var formData = new FormData();
    formData.append('username', this.state.username);
    formData.append('password', this.state.password);
    $.ajax({
      type: 'POST',
      url: '/login',
      data: formData,
      processData: false,
      contentType: false
    }).then((msg) => {
      this.setState({loginModalOpen: false});
      this.props.handleLogin(this.state.username);
      console.log('login success');
    }).catch((error) => {
      console.error('login failed', error);
      alert('LOGIN FAILED');
    });
  }

  handleLogout(e) {
    console.log('handleLogout');
    this.props.handleLogout();
  }

  handleSignup(e) {
    e.preventDefault();
    var formData = new FormData();
    formData.append('username', this.state.username);
    formData.append('password', this.state.password);
    console.log('username: ', this.state.username);
    console.log('password: ', this.state.password);
    $.ajax({
      type: 'POST',
      url: '/signup',
      data: formData,
      processData: false,
      contentType: false
    }).then((msg) => {
      this.props.handleLogin(this.state.username);
      this.setState({signupModalOpen: false});
      console.log(msg);
    }).catch((error) => {
      console.error('signup failed', error);
      alert('SIGNUP FAILED');
    });
  }

  handleImgUpload(e) {
    e.preventDefault();
    var formData = new FormData();

    formData.append('username', this.props.currUser);
    formData.append('title', this.state.title);
    formData.append('description', this.state.description);
    formData.append('imageFile', this.state.file);
    $.ajax({
      type: 'POST',
      url: '/foodPost',
      data: formData,
      processData: false,
      contentType: false,
      context: this
    }).then((msg) => {
      this.props.refresh();
      this.setState({submitModalOpen: false});
      console.log('Food post POSTED succesfully: response msg: ', msg);
    }).catch((error) => {
      console.error(error);
    });
  }

  handleImgChange(e) {
    e.preventDefault();
    console.log('handleImgChange e.target ', e.target);

    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imgPath: reader.result
      });
    };
    reader.readAsDataURL(file);
    console.log('handleImgChange e.target.files[0], ', e.target.files[0]);
    // this.setState({imgPath: './public' + e.target.value});
  }

  toggleSubmitModal () {
    this.setState({submitModalOpen: !this.state.submitModalOpen});
  }

  toggleLoginModal () {
    this.setState({loginModalOpen: !this.state.loginModalOpen});
  }

  toggleSignupModal () {
    this.setState({signupModalOpen: !this.state.signupModalOpen});
  }

  render () {

    return (
      <div className="header">
        <Modal className="modal-submit" isOpen={this.state.submitModalOpen} contentLabel="Modal">
          <h1 className="modal-header">Submit New Food Post</h1>
          <form id="uploadimage" onSubmit={this.handleImgUpload} encType="multipart/form-data">
            <div id="new-post">
              <h4 className="new-post-item">Title</h4>
              <input type="text" onChange={this.handleTitleChange}></input>
              <h4 className="new-post-item">Description</h4>
              <textarea style={{width: "200px", height: "120px"}} onChange={this.handleDescriptionChange} type="text"></textarea>
              <div id="selectImage">
                <label>Select Your Image</label><br/>
                <input type="file" name="image" id="file" onChange={this.handleImgChange} required />
                <button type="submit" className="btn btn-primary" id="upload">Upload</button>
                <button onClick={this.toggleSubmitModal}>Close</button>
              </div>
            </div>
            <img id="previewing" src={this.state.imgPath}/>
          </form>
        </Modal>

        <Modal className="modal-login" isOpen={this.state.loginModalOpen} contentLabel="Modal">
          <h1 className="modal-header">Login</h1>
          <form id="uploadimage" onSubmit={this.handleLogin} encType="multipart/form-data">
            <div id="new-post">
              <h4 className="new-post-item">Username</h4>
              <input type="text" onChange={this.handleUsernameChange}></input>
              <h4 className="new-post-item">Password</h4>
              <input type="password" onChange={this.handlePasswordChange}></input>
              <br/>
              <button type="submit" className="loginsubmit" id="login">Login</button>
              <button onClick={this.toggleLoginModal}>Close</button>
            </div>
          </form>
        </Modal>

        <Modal className="modal-signup" isOpen={this.state.signupModalOpen} contentLabel="Modal">
          <h1 className="modal-header">Signup</h1>
          <form id="uploadimage" onSubmit={this.handleSignup} encType="multipart/form-data">
            <div id="new-post">
              <h4 className="new-post-item">Username</h4>
              <input type="text" onChange={this.handleUsernameChange}></input>
              <h4 className="new-post-item">Password</h4>
              <input type="password" onChange={this.handlePasswordChange}></input>
              <br/>
              <button type="submit" className="signupsubmit" id="signup">Signup</button>
              <button onClick={this.toggleSignupModal}>Close</button>
            </div>
          </form>
        </Modal>

        <Link to="/" className="header-link">Home</Link>
        <a className="header-link" onClick={this.toggleSubmitModal}>Submit FoodPost</a>
        <a className="header-link" onClick={this.toggleLoginModal}>Login</a>
        <a className="header-link" onClick={this.toggleSignupModal}>Signup</a>
        <span id="user-welcome">Welcome {this.props.currUser}!<a className="header-link" onClick={this.handleLogout}>Logout</a></span>
      </div>
      );
  }
}

export default Header;
