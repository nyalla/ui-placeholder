import React, { useContext } from "react";
import { useHistory } from "react-router";
import {
  Col,
  Layout,
  Row,
  Input,
  Form,
  Button,
  Typography,
  Space,
  message,
} from "antd";
import "../../Loginpage.css";
import myImage from "../../IMG-20230527-WA0017.jpg";
import axios from "axios";
import UserContext from "../../context/userContext";
import { domainUrl } from "../../AppConstants";

const { Title } = Typography;

export const Login = () => {
  const { updateUserData } = useContext(UserContext);
  const history = useHistory();

  const success = (msg) => {
    message.success(msg);
  };

  const error = (msg) => {
    message.error(msg);
  };

  const onFinish = (values) => {
    axios
      .post(`${domainUrl}/management/login`, values, {
        headers: {
          "content-type": "application/json",
        },
      })
      .then((res) => {
        if (res.status == 200) {
          const response = res.data.data;
          updateUserData(response);
          window.localStorage.setItem("userDetails", JSON.stringify(response));
          if (response.orgId) {
            history.push(`/School/${response.orgId}/Details`);
          } else {
            history.push(`/SchoolList`);
          }
          success(res.data.message);
        } else {
          history.push(`/login`);
          error(res.data.message);
        }
      })
      .catch((err) => {
        // what now?
        error("username/Passwords are incorrect");
      });
  };
  return (
    <Layout style={{ backgroundColor: "#f9f9f9", height: "100%" }}>
      <Row className="h100">
        <Col xs={24} sm={24} md={6} lg={6} xl={6} className="column1">
          <div className="left-content">
            <div className="nep-asi-signup-left-heading nep-login-interface-name">
              Quality Printing For The Right Price
            </div>
            <img src={myImage} alt="Logo" className="image-style" />
            <div className="addressstyle">
              Address:
              <div>
                Opp:Police Station,
                <div>Main Road,</div>
                <div>SOMPETA-532284</div>
                <div>Srikakulam Dist, AP.</div>
                8339933309, 9441115952
              </div>
              <div>Sublekala Nilayam</div>
            </div>
            <div className="below-content">
              <div>FLEX PRINT</div>
              <div>MULTICOLOUR</div>
              <div>OFFSETPRINTING</div>
              <div>SCREENPRINTING</div>
            </div>
          </div>
        </Col>
        {/* <Col style={{ background: "#0da8e0" }} span={2}></Col> */}
        <Col
          xs={24}
          sm={24}
          md={18}
          lg={18}
          xl={18}
          offset={0}
          className="column2-bg"
        >
          <div offset={2} className="column2">
            <div>
              <img src={myImage} alt="Logo" className="image-style" />
              <Title className="typography-style" level={4}>
                ID CARD SOLUTION
              </Title>
            </div>
            <div>
              <Form
                requiredMark={false}
                onFinish={onFinish}
                className="login-input"
              >
                <div className="formfiledsstyle">
                  <Form.Item
                    name="userName"
                    label={<span style={{ fontWeight: "bold" }}>Username</span>}
                    rules={[
                      {
                        required: true,
                        message: "Enter Username",
                      },
                    ]}
                  >
                    <Input bordered={false} placeholder="Enter Username" />
                  </Form.Item>
                  <Form.Item
                    name="passWord"
                    label={<span style={{ fontWeight: "bold" }}>Password</span>}
                    rules={[
                      {
                        required: true,
                        message: "Enter Password",
                      },
                    ]}
                  >
                    <Input
                      type="password"
                      bordered={false}
                      placeholder="Enter Password"
                    />
                  </Form.Item>
                </div>
                <Form.Item offset={8}>
                  {" "}
                  <Button
                    // type="primary"
                    htmlType="submit"
                    className="button-style"
                  >
                    LOGIN
                  </Button>
                </Form.Item>
              </Form>

              <div
                style={{
                  paddingTop: "10px",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                <Space size={100}>
                  <span>
                    <div>FLEX PRINT</div>
                    <div>DIGITAL PRINTING</div>
                    <div>MULTICOLOUR PRINTING</div>
                  </span>
                  <span>
                    <div>PHOTO PRINTING</div>
                    <div>OFFSETPRINTING</div>
                    <div>SCREENPRINTING</div>
                  </span>
                </Space>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Layout>
  );
};
