import React, { useState } from "react";
import ApplicationRoutes from "./config/ApplicationRoutes";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Login } from "./components/LoginPage/Login";
import UserContext from "./context/userContext";

function App() {
  const [userDetails, setUserDetails] = useState({});
  const [updatedDetails, setUpdatedDetails] = useState(false);

  const updateUSerDetails = (data) => {
    setUserDetails(data);
    setUpdatedDetails(true);
  };

  const contextData = {
    userData: userDetails,
    updateUserData: updateUSerDetails,
  };

  if (window.localStorage.getItem("userDetails") && !updatedDetails) {
    updateUSerDetails(JSON.parse(window.localStorage.getItem("userDetails")));
  }
  return (
    <UserContext.Provider value={contextData}>
      <Router>
        <Switch>
          <Route path="/Login" component={Login} />
          <Redirect exact to="/Login" from="/" />
          <ApplicationRoutes />
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
