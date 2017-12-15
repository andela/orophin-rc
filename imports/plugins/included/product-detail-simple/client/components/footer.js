import React, { Component } from "react";
import { registerComponent } from "@reactioncommerce/reaction-components";

class Footer extends Component {
  render() {
    return (
      <div>
        <footer>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-4 footer-join">
                <p>Join us on</p>
                <a href="https://web.facebook.com/reactioncommerce/?_rdc=1&_rdr">
                  <img src="/resources/facebook.png" alt="icon" width="40px"/>
                </a>
                <a href="https://twitter.com/getreaction?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor">
                  <img src="/resources/twitter.png" alt="icon" width="40px"/>
                </a>
                <a href="https://www.instagram.com/reactioncommerce/">
                  <img src="/resources/instagram.png" alt="icon" width="40px"/>
                </a>
                <a href="https://www.youtube.com/watch?v=g_FwpbQnAZk">
                  <img src="/resources/youtube.png" alt="icon" width="40px"/>
                </a>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-4 text-center">
                <p className="footer-text">Policies: Terms of use | Privacy | Authentic Items
                  <br/> Copyright © 2017 reactioncommerce.com. All rights reserved.
                </p>
                <p className="footer-text text-center">
                Designed by: Team-Orophin
                </p>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-4 footer-align">
                <img src="/resources/cards.png" className="paystack-image" alt="Card" width="300"/>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

registerComponent("Footer", Footer);

export default Footer;
