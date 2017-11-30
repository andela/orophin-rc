import React, { Component } from "react";

class WalletHistory extends Component {
  render() {
    return (
      <div className="wallet-dashboard-history">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Wallet History</h3>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Transaction Information</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#2,000</td>
                <td>
                  <p>Received from ilerioluwase97@gmail.com</p>
                  <p>Nov 30, 2017 1:56:08 AM</p>
                </td>
              </tr>
              <tr>
                <td>#2,000</td>
                <td>
                  <p>Sent to olojedekorede@gmail.com</p>
                  <p>Nov 24, 2017 1:56:08 AM</p>
                </td>
              </tr>
              <tr>
                <td>#2,000</td>
                <td>
                  <p>Sent to ilerioluwase97@gmail.com</p>
                  <p>Nov 01, 2017 1:56:08 AM</p>
                </td>
              </tr>
              <tr>
                <td>#2,000</td>
                <td>
                  <p>Received from ilerioluwase97@gmail.com</p>
                  <p>Nov 23, 2017 1:56:08 AM</p>
                </td>
              </tr>
              <tr>
                <td>#2,000</td>
                <td>
                  <p>Received from ilerioluwase97@gmail.com</p>
                  <p>Nov 30, 2017 1:56:08 AM</p>
                </td>
              </tr>
            </tbody>
            <tfoot />
          </table>
        </div>
      </div>
    );
  }
}

export default WalletHistory;
