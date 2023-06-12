import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import CampaignCreation from "./pages/CampaignCreation";
import CampaignCreationSuccess from "./pages/CampaignCreationSuccess"
import ReportCreation from "./pages/ReportCreation";
import ReportCreationSuccess from "./pages/ReportCreationSuccess"

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/campaigns/create" >
          <CampaignCreation />
        </Route>
        <Route exact path="/campaigns/create/success" >
          <CampaignCreationSuccess />
        </Route>
        <Route exact path="/campaigns/:slug/reports">
          <ReportCreation />
        </Route>
        <Route exact path="/campaigns/:slug/reports/success">
          <ReportCreationSuccess />
        </Route>
      </Switch>
    </Router>
  )
}

export default App