import React from 'react';
import Modal from 'react-modal';
import $ from 'jquery';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      file: undefined,
      imgPath: ''
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleImgUpload = this.handleImgUpload.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
  }

  handleImgUpload(e) {
    e.preventDefault();
    console.log('inside handleImgUpload!');
    console.log('this.state.file: ', this.state.file);
    var formData = {
      'username': 'Johnny',
      'title': 'My food post',
      'description': 'My food is so delicious',
      'imageFile': this.state.file
    };
    var formData = new FormData();

    formData.append('username', 'Johnny');
    formData.append('title', 'My food post');
    formData.append('description', 'My food is so delicious');
    formData.append('imageFile', this.state.file);

    console.log('formData.get("imageFile"): ', formData.get('imageFile'));

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
      <div>
        <Modal className="modal" isOpen={this.state.modalOpen} contentLabel="Modal">
          <h1>Submit New Food Post</h1>
          <form id="uploadimage" onSubmit={this.handleImgUpload} encType="multipart/form-data">
            <img id="previewing" src={this.state.imgPath}/>
            <div id="selectImage">
              <label>Select Your Image</label><br/>
              <input type="file" name="image" id="file" onChange={this.handleImgChange} required />
              <button type="submit" className="btn btn-primary" id="upload">Upload</button>
            </div>
          </form>
          <button onClick={this.toggleModal}>Close</button>
        </Modal>
        <h1>FOODCOURT</h1>
        <button onClick={this.toggleModal}>Submit FoodPost</button>
        <button>Login</button>
        <button>Signup</button>
      </div>
      );
  }
}

export default Header;
