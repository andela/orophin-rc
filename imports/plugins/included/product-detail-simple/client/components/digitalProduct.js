import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase";
import { registerComponent, Components } from "@reactioncommerce/reaction-components";
import config from "../firebase/config";
import { setTimeout } from "timers";

firebase.initializeApp(config);

class DigitalProduct extends Component {
  static propTypes = {
    hasAdminPermission: PropTypes.bool,
    onProductFieldChange: PropTypes.function,
    product: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      isDigital: this.props.product.isDigital,
      downloadUrl: this.props.product.downloadLink,
      newUrl: "",
      urlFile: "",
      progressBar: false,
      progressLevel: 0,
      uploadStatus: ""
    };
  }

  selectDigital = () => {
    this.setState({ isDigital: !this.state.isDigital });
  }

  fileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      Alerts.toast("Select a file", "error");
      return;
    }
    if (file.size / 1000000 > 40) {
      Alerts.toast("File size more than 40 MB", "error");
      return;
    }
    const fileName = file.name;
    const storageRef = firebase.storage().ref("files");
    const spaceRef = storageRef.child(fileName);
    const uploadTask = spaceRef.put(file);
    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({ progressLevel: progress });
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          break;
        case firebase.storage.TaskState.RUNNING:
          this.setState({ progressBar: true, uploadStatus: "Uploading" });
          break;
        default:
          this.setState({ progressBar: true });
      }
    }, (error) => {
      if (error) {
        Alerts.toast("Error in uploading file", "error");
      }
    }, () => {
      const downloadURL = uploadTask.snapshot.downloadURL;
      Alerts.toast("Upload Completed", "success");
      this.setState({ newUrl: downloadURL, uploadStatus: "Uploaded" });
      this.props.onProductFieldChange(this.props.product._id, "downloadLink", this.state.newUrl);
      this.props.onProductFieldChange(this.props.product._id, "isDigital", true);
      setTimeout(() => {
        this.setState({
          progressBar: false
        });
      }, 3000);
    });
  }


  editLink = (event) => {
    event.preventDefault();
    this.setState({
      downloadUrl: ""
    });
  }

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    const { EditButton } = Components;
    return (
      <div>
        {(this.props.hasAdminPermission) ?
          <div>
            <div>
              <input type="checkbox" className="digital-check"
                defaultChecked={this.state.isDigital}
                onChange={this.selectDigital}
              />
              <label className="digital">Digital Product</label>
            </div>
            <div>
              {(this.state.isDigital && this.state.downloadUrl === "") ?
                < div className=" col-sm-11 input-group downloadLink">
                  <input type="file" className="form-control choose" id="file"
                    onChange={this.fileUpload}
                  />
                </div> : <div />}
              {this.state.progressBar &&
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-striped active"
                    role="progressbar"
                    style={{ width: `${this.state.progressLevel}%` }}
                  >
                    {this.state.uploadStatus}</div>
                </div>
              }
              {(this.state.isDigital && this.state.downloadUrl !== "") ?
                <div className="row downloadLink">
                  <div className="col-sm-11 digital-input">
                    <input type="text" disabled
                      placeholder={this.state.downloadUrl}
                    />
                  </div>
                  <div className="col-sm-1">
                    <EditButton
                      onClick={this.editLink}
                    />
                  </div>
                </div> : <div />
              }
            </div>
          </div>
          : <div />
        }
        {(this.state.isDigital && !this.props.hasAdminPermission) ?
          <div><h4>This is a Digital Product</h4></div> : <div />
        }
        <br />
      </div>
    );
  }
}

registerComponent("DigitalProduct", DigitalProduct);

export default DigitalProduct;
