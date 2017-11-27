import PropTypes from "prop-types";
import { registerComponent, Components } from "@reactioncommerce/reaction-components";
import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import moment from "moment";
import isGuestUser from "../util/isGuest";

class ReviewsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      contentToEdit: "",
      name: Meteor.user().name || "Guest",
      editMode: false,
      elementToEdit: -1
    };
    this.reviewer = {
      id: Meteor.userId(),
      name: this.state.name
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  setEditMode = (index = -1, content = "") => {
    this.setState({
      editMode: !this.state.editMode,
      elementToEdit: index,
      contentToEdit: content
    });
  };

  handlePostReview = (event) => {
    event.preventDefault();
    if (this.state.name === "Guest") {
      Alerts.toast("Oops, you need to update your profile before you can post a review.", "error");
      return;
    }
    const { content } = this.state;
    const { revieweeId } = this.props;
    Meteor.call(`insert/${this.props.collectionName}`, {
      reviewer: JSON.stringify(this.reviewer),
      revieweeId,
      content
    }, (error) => {
      if (error) {
        Alerts.toast(error.message, "error");
        this.forceUpdate();
      } else {
        this.setState({ content: "" });
      }
    });
  };

  handleEditReview = (id) => {
    const { contentToEdit } = this.state;
    Meteor.call(`update/${this.props.collectionName}`, `${id}`, JSON.stringify(this.reviewer), contentToEdit
      , (error) => {
        if (error) {
          Alerts.toast(error.message, "error");
        }
      });
    this.setEditMode();
  };

  handleDeleteReview = (id) => {
    Meteor.call(`remove/${this.props.collectionName}`, id, JSON.stringify(this.reviewer), (error) => {
      if (error) {
        Alerts.toast(error.message, "error");
        this.forceUpdate();
      }
    });
  };

  renderReviews = (props) => {
    const { ReactionAvatar, Button } = Components;
    const { elementToEdit, contentToEdit } = this.state;
    let postedByUSer;
    let {
      content,
      createdAt,
      reviewer,
      _id
    } = props.review;
    const { index } = props;

    if (reviewer) {
      reviewer = JSON.parse(`${reviewer}`);
      postedByUSer = Meteor.userId() === reviewer.id;
    }

    return (
      <div>
        <li className="review">
          <ReactionAvatar name={reviewer.name} size={50} />
          {index !== elementToEdit &&
            <div className="review-content">
              <div className="review-header">
                <h6>{reviewer.name}</h6>
                <span>{moment(createdAt).fromNow()}</span>
              </div>
              <div className="review-body">
                {content}
              </div>
              { postedByUSer &&
                  <div className="d-flex review-icon-wrapper">
                    <i className="fa fa-pencil"
                      onClick={
                        () => this.setEditMode(index, content)
                      }
                    />
                    <i className="fa fa-trash"
                      onClick={
                        () => { this.handleDeleteReview(_id);}
                      }
                    />
                  </div>
              }
            </div>
          }
          {index === elementToEdit &&
            <form onSubmit={(event) => {
              event.preventDefault();
              this.handleEditReview(_id);
            }} className="review-content"
            >
              <div className="form-group">
                <textarea
                  className="form-control rui textfield input"
                  name="contentToEdit"
                  rows="4"
                  required
                  value={contentToEdit}
                  onChange={this.handleChange}
                />
                <div>
                  <Button
                    type="submit"
                    className="btn review-btn"
                  >
                  Update
                  </Button>
                  <Button
                    className="btn review-btn"
                    onClick={this.setEditMode}
                  >
                  Close
                  </Button>
                </div>
              </div>
            </form>
          }
        </li>
      </div>
    );
  }

  render() {
    const { content, name } = this.state;
    const { reviews, editable, revieweeName, center  } = this.props;
    const { Button } = Components;
    const Comp = this.renderReviews;
    const isReviewsAvailable = reviews.length > 0;
    const isGuest = isGuestUser();
    return (
      <div className={`review-section ${center ? "center" : ""}`}>
        {
          !editable && !isGuest &&
          <div>
            <h3 className="pdp">
              <span>
              Post a review
              </span>
            </h3>
            <form onSubmit={this.handlePostReview} className="col-12 review-form">
              <div className="form-group">
                <label htmlFor="name" className="review-label">Name</label>
                <input
                  className="form-control rui textfield input "
                  name="name"
                  onChange={this.handleChange}
                  value={name}
                  required
                  type="text"
                  placeholder="Enter your name"
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="content" className="review-label">Review</label>
                <textarea
                  className="form-control rui textfield input"
                  name="content"
                  rows="3"
                  onChange={this.handleChange}
                  value={content}
                  required
                  placeholder="Enter your review"
                />
              </div>
              <br />
              <div>
                <Button
                  type="submit"
                  className="btn review-btn"
                >
              Post Review
                </Button>
              </div>
            </form>
          </div>
        }
        {
          !editable &&
          <ul className="row review-list">
            <h3 className="pdp">
              <span>
              Reviews
              </span>
            </h3>
            {
              reviews.map((review, index) => {
                return (<Comp review={review} key={review._id} index={index}/>);
              })
            }
            {
              !isReviewsAvailable &&
            <p className="pdp">
              <span>
                {`There is currently no review for this ${revieweeName}`}
              </span>
            </p>
            }
          </ul>
        }
      </div>
    );
  }
}

ReviewsComponent.propTypes = {
  center: PropTypes.bool,
  collectionName: PropTypes.string,
  editable: PropTypes.bool,
  revieweeId: PropTypes.string,
  revieweeName: PropTypes.string,
  reviews: PropTypes.arrayOf(PropTypes.object)
};


registerComponent("ReviewsComponent", ReviewsComponent);

export default ReviewsComponent;

