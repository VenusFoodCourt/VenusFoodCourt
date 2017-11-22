import React from 'react';
import Modal from 'react-modal';
import $ from 'jquery';
import { BrowserRouter, Link, Route } from 'react-router-dom';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      file: undefined,
      imgPath: '',
      title: '',
      description: ''
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleImgUpload = this.handleImgUpload.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
  }

  handleTitleChange(e) {
    this.setState({title: e.target.value});
  }

  handleDescriptionChange(e) {
    this.setState({description: e.target.value});
  }

  handleImgUpload(e) {
    e.preventDefault();
    var formData = new FormData();

    formData.append('username', 'Johnny');
    formData.append('title', 'My food post');
    formData.append('description', 'My food is so delicious');
    formData.append('imageFile', this.state.file);
    $.ajax({
      type: 'POST',
      url: '/foodPost',
      data: formData,
      processData: false,
      contentType: false
    }).then((msg) => {
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

  toggleModal () {
    this.setState({modalOpen: !this.state.modalOpen});
  }

  render () {

    return (
      <div className="header">
        <Modal className="modal" isOpen={this.state.modalOpen} contentLabel="Modal">
          <h1>Submit New Food Post</h1>
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
              </div>
            </div>
            <img id="previewing" src={this.state.imgPath}/>
          </form>
          <button onClick={this.toggleModal}>Close</button>
        </Modal>
        <Link to="/" className="header-link">Home</Link>
        <a className="header-link" onClick={this.toggleModal}>Submit FoodPost</a>
        <a className="header-link">Login</a>
        <a className="header-link">Signup</a>
      </div>
      );
  }
}

export default Header;
