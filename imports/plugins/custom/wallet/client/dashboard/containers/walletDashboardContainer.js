import { compose, withProps } from "recompose";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import WalletDashboard from "../components/walletDashboard";


const handlers = {};


function composer(props, onData) {
  onData(null, { user: "yo ma" });
}


registerComponent("WalletDashboard", WalletDashboard, [
  withProps(handlers),
  composeWithTracker(composer)
]);

export default compose(
  withProps(handlers),
  composeWithTracker(composer)
)(WalletDashboard);
