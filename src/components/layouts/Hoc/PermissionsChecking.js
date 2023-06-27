import React, { useContext } from "react";
import UserContext from "../../../context/userContext";
import { StopOutlined } from "@ant-design/icons";

const BaseNoAccessComponent = () => (
  <div className="no-access-component">
    <div className="font-36px text-red">
      <StopOutlined />
    </div>
    <b>You do not have access to view this page</b>
  </div>
);

const BasePermissionsWraper = (props) => {
  const { userData } = useContext(UserContext);

  if (!Object.keys(userData).length) {
    return <BaseNoAccessComponent />;
  } else if (props.page === "admin" && !userData.isAdmin) {
    return <BaseNoAccessComponent />;
  } else if (props.page === "school" && !(userData.orgId || userData.isAdmin)) {
    return <BaseNoAccessComponent />;
  }
  return React.cloneElement(props.children);
};

const PermissionWrapper = (mapPropsToPermissions) => {
  return function wrapWithPermissionsWraper(WrappedComponent) {
    return (props) => {
      const configs = mapPropsToPermissions(props);
      return (
        <BasePermissionsWraper {...configs}>
          <WrappedComponent {...props} />
        </BasePermissionsWraper>
      );
    };
  };
};
export { PermissionWrapper };
