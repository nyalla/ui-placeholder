import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useHistory,
} from "react-router-dom";
import SideNav from "../components/layouts/sidebar";
import OrganizationList from "../components/OrganizationDetails/OrganizationList";
import OrganizationForm from "../components/OrganizationDetails/OrganizationForm";
import OverallOrganizationDetails from "../components/OrganizationDetails/OverallOrganizationDetails";
import StudentForm from "../components/OrganizationDetails/StudentsForm";
import ClassWiseDetails from "../components/OrganizationDetails/ClasswiseDetails";
import TemplateUploadForm from "../components/OrganizationDetails/TemplateUploadForm";

import { Layout, Avatar, Typography, Dropdown, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ".././App.css";
import ".././SideNav.css";
import TemplateListing from "../components/OrganizationDetails/TemplateListing";
import UserContext from "../context/userContext";
import { Login } from "../components/LoginPage/Login";

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

const ApplicationRoutes = (props) => {
  const [collapse, setCollapse] = useState(false);
  const { userData } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    window.innerWidth <= 760 ? setCollapse(true) : setCollapse(false);
  }, [window.innerWidth]);

  // const handleToggle = (event: any) => {
  //   event.preventDefault();
  //   collapse ? setCollapse(false) : setCollapse(true);
  // };

  const items = [
    {
      label: "LogOut",

      key: "LogOut",
    },
  ];

  const onLogout = () => {
    window.localStorage.removeItem("userDetails");
    history.push("/Login");
  };

  const getMoreActionsMenu = () => {
    return (
      //  V4 Menu component 🆕

      <Menu>
        <Menu.Item onClick={() => onLogout()}>Logout</Menu.Item>
      </Menu>
    );
  };

  return (
    <Router>
      {Object.keys(userData).length ? (
        <Layout>
          <Header
            className="header"
            style={{
              padding: 0,
              background: "#001529",
              height: `${window.innerWidth <= 760 ? "150px" : "80px"}`,
            }}
          >
            {/* {React.createElement(
            collapse ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: handleToggle,
              style: { color: "#fff" },
            }
          )} */}
            <div className="moving-text">
              VB Print World, One step printing solution, Our Services: Flex
              printing, Offset printing ,Screen printing,Multi colour
              printing,Digital prints,Photo prints and Photo framming. For more
              details please contact: +91 8339933309, +91 9441115952.
            </div>

            <Dropdown
              //getPopupContainer={(trigger) => trigger.parentNode}
              trigger={["click"]}
              overlay={getMoreActionsMenu}
            >
              <Avatar
                style={{
                  backgroundColor: "#87d068",
                  float: "right",
                  marginRight: "20px",
                  marginTop: "20px",
                }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </Header>
          <Layout>
            {collapse || !userData.isAdmin ? null : (
              <Sider trigger={null} collapsible collapsed={collapse}>
                <div className="app-left-nav">
                  <SideNav />
                </div>
              </Sider>
            )}

            <Content
              style={{
                //margin: "24px 16px",
                paddingTop: `${window.innerWidth <= 760 ? "190px" : "90px"}`,
                minHeight: "calc(100vh - 114px)",
                background: "#fff",
                paddingRight: "35px",
              }}
            >
              <Switch>
                <Route path="/SchoolList" component={OrganizationList} />
                <Route path="/SchoolForm" component={OrganizationForm} />
                <Route path="/School/:id/Details/new" component={StudentForm} />
                <Route
                  path="/School/:id/Details/:studentId/edit"
                  component={StudentForm}
                />
                <Route
                  path="/School/:id/Details/class/:classId"
                  component={ClassWiseDetails}
                />
                <Route
                  path="/School/:id/Details"
                  component={OverallOrganizationDetails}
                />
                <Route path="/templatesection" component={TemplateListing} />
                <Route path="/templateupload" component={TemplateUploadForm} />
              </Switch>
            </Content>
          </Layout>
          <Footer style={{ textAlign: "center" }}>
            Design By Highlancers Team
          </Footer>
        </Layout>
      ) : (
        <Redirect exact to="/Login" from="/" />
      )}

      <Route path="/Login" component={Login} />
    </Router>
  );
};

export default ApplicationRoutes;
