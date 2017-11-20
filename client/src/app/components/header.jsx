import React from 'react';
import Modal from 'react-modal';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      file: undefined,
      imgPath: ''
    }
    this.toggleModal = this.toggleModal.bind(this);
    this.handleImgUpload = this.handleImgUpload.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
  }

  handleImgUpload(e) {
    e.preventDefault();
    console.log('handleImgUpload');
    console.log(this.state.file);
    let imageFormData = new FormData();

    imageFormData.append('imageFile', this.state.file);

    // {this.state.file, this.state.title}

    $.ajax({
      type: 'POST',
      url: '/foodPost',
      data: imageFormData
    });

    console.log(imageFormData);

    console.log(imageFormData.get('imageFile'));
  }

  handleImgChange(e) {
    e.preventDefault();
    console.log(e.target);
    let formData = new FormData(e.target);
    console.log(formData);
    for (let [key, val] of formData.entries()) {
      console.log(key, val);
    }
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imgPath: reader.result
      });
    }
    reader.readAsDataURL(file);
    console.log(e.target.files[0]);
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