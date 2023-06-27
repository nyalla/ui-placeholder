import React from "react";
import { Menu } from "antd";
import {
  ClusterOutlined,
  TeamOutlined,
  UserOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";

// const SideNav = () => {
//   const location = useLocation();
//   return (
//     <div>
//       <div
//         style={{
//           color: "#404040",
//           boxShadow: "2px 0px 3px rgba(0,0,0,.1)",
//           //background:' #fff',
//           position: "fixed",
//           height: "32px",
//           background: "rgba(255, 255, 255, 0.2)",
//           //margin: "16px",
//         }}
//       ></div>
//       <Menu theme="dark" mode="inline">
//         <Menu.Item key="2">
//           <ClusterOutlined />
//           <NavLink
//             href
//             to="/organizationList"
//             activeclassname={
//               location.pathname.includes("organizationList") ? "active" : ""
//             }
//           >
//             <span> Organization Details</span>
//           </NavLink>
//         </Menu.Item>
//       </Menu>
//     </div>
//   );
// };

// export default SideNav;

const SideNav = (props) => {
  const location = useLocation();
  return (
    <div className="app-sidemenu">
      <div>
        {/* <Menu
          getPopupContainer={(trigger) => trigger.parentNode}
          className="border-right0 side-menu"
          mode="inline"
          items={items}
        /> */}
        <Menu mode="inline">
          <Menu.Item key="2" className="app-leftmenu">
            <NavLink
              href
              to="/SchoolList"
              activeclassname={
                location.pathname.includes("SchoolList") ? "active" : ""
              }
            >
              <span> School Details</span>
            </NavLink>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default SideNav;
