import { Switch, Route, useHistory } from "react-router-dom";

// MSAL imports
import { MsalProvider } from "@azure/msal-react";
import { CustomNavigationClient } from "./utils/NavigationClient";

// ui-components
import { PageLayout } from "./ui-components/PageLayout";

// pages
import { Home } from "./pages/Home";
import { GroupOverview } from "./pages/GroupOverview";

function App({ pca }) {
  // The next 3 lines are optional. This is how you configure MSAL to take advantage of the router's navigate functions when MSAL redirects between pages in your app
  const history = useHistory();
  const navigationClient = new CustomNavigationClient(history);
  pca.setNavigationClient(navigationClient);

  return (
    <MsalProvider instance={pca}>
      <PageLayout>
        <Pages />
      </PageLayout>
    </MsalProvider>
  );
}

function Pages() {
  return (
    <Switch>
      <Route path="/groupOverview">
        <GroupOverview />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  )
}

export default App;
