import React, { Component } from "react";
import PropTypes from "prop-types";

class WalletAction extends Component {
  render() {
    const { buttonText, headerTitle, actionType } = this.props;
    return (
      <div className={`wallet-dashboard-action ${actionType}`}>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">{headerTitle}</h3>
          </div>
          <div className="panel-body">
            <form>
              {
                actionType === "transfer"
                &&
                <input type="text" placeholder="Wallet Holder Email" />
              }
              <input type="text" placeholder="Amount" />
              <button type="submit">{buttonText}</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

WalletAction.propTypes = {
  actionType: PropTypes.oneOf(["fund", "transfer"]).isRequired,
  buttonText: PropTypes.string.isRequired,
  headerTitle: PropTypes.string.isRequired
};

export default WalletAction;
