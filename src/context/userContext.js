import React from "react";

const UserContext = React.createContext({
  userData: {},
  updateUserData: () => {},
});
export default UserContext;
