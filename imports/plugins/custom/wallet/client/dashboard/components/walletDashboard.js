import React, { Component } from "react";

// Components
import WalletHistory from "./walletHistroy";
import WalletAction from "./walletAction";

class  WalletDashboard extends Component {
  render() {
    return (
      <div className="wallet-dashboard">
        <div className="container container-lg">
          <div className="panel panel-defaultwallet-dashboard-intro">
            <div className="panel-heading">
              <h4>My Wallet</h4>
            </div>
            <div className="panel-body">
              <span>Balance:</span>
              <h2>#20, 000</h2>
            </div>
          </div>
          <div className="wallet-dashboard-actions">
            <WalletAction
              actionType="fund"
              headerTitle="Fund my wallet"
              buttonText="Fund My Wallet"
            />
            <WalletAction
              actionType="transfer"
              headerTitle="Transfer To Wallet"
              buttonText="Transfer"
            />
          </div>
          <WalletHistory />
        </div>
      </div>
    );
  }
}

export default  WalletDashboard;
