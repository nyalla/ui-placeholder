import React, { useEffect, useState } from "react";
import { Form, Input, Tooltip, Button, Select, Typography, Spin } from "antd";
import axios from "axios";
import { message } from "antd";
import { useHistory } from "react-router";
import { PermissionWrapper } from "../layouts/Hoc/PermissionsChecking";
import { domainUrl } from "../../AppConstants";

const { Option } = Select;
const { Title } = Typography;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
    md: { span: 4 },
    // lg: { span: 12 },
    // xl: { span: 12 },
    // xxl: { span: 12 },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
    md: { span: 8 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 8,
      offset: 4,
    },
  },
};

const OrganizationForm = () => {
  const history = useHistory();
  const [templatesLoaded, setTemplatesLoaded] = useState(false);
  const [templateData, setTemplateData] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    setTemplatesLoaded(true);
    axios
      .get(`${domainUrl}/management/getAllTemplates`)
      .then((res) => {
        // console.log(res);
        setTemplateData(res.data.data);
        setTemplatesLoaded(false);
      })
      .catch((err) => {
        setTemplatesLoaded(false);
      });
  }, []);

  const success = (msg) => {
    message.success(msg);
  };

  const error = (msg) => {
    message.error(msg);
  };
  const onFinish = (values) => {
    // console.log("values", values);

    axios
      .post(`${domainUrl}/management/org/saveOrganization`, values, {
        headers: {
          "content-type": "application/json",
        },
      })
      .then((res) => {
        // console.log(res);
        //console.log(res.data);
        if (res.status == 200) {
          success(res.data.data);
          history.push("/SchoolList");
        } else error(res.data.message);
      })
      .catch((err) => {
        // what now?
        error("Error contacting API");
      });
  };
  const handleCancel = () => {
    history.goBack();
  };

  return (
    <>
      <Title style={{ paddingLeft: "56px" }} level={2}>
        School Form
      </Title>
      <Spin spinning={templatesLoaded}>
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="schoolName"
            label="School Name"
            rules={[
              {
                required: true,
                message: "Enter School Name",
              },
            ]}
          >
            <Input placeholder="Please Enter Your School Name" />
          </Form.Item>

          <Form.Item
            name="phone"
            label={
              <span>
                phone &nbsp;
                <Tooltip title="Enter Phone Number"></Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Enter Phone number",
              },
              {
                pattern: /^[0-9\b]+$/,
                message: "Please enter valid phone number",
              },
              { max: 10, message: "Cannot be more than 10 numbers" },
            ]}
          >
            <Input placeholder="Enter Your Phone Number" />
          </Form.Item>

          <Form.Item
            name="email"
            label={
              <span>
                Email &nbsp;
                <Tooltip title="Please enter email in the field"></Tooltip>
              </span>
            }
            rules={[
              {
                pattern:
                  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                message: "Enter Valid Mail",
              },
            ]}
          >
            <Input placeholder="Enter mail in the field" />
          </Form.Item>
          <Form.Item
            name="website"
            label={
              <span>
                website &nbsp;
                <Tooltip title="Please enter website in the field"></Tooltip>
              </span>
            }
            rules={[
              {
                pattern:
                  /^((http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/gm,
                message: "Enter Valid Website",
              },
            ]}
          >
            <Input placeholder="Enter Website in the field" />
          </Form.Item>
          <Form.Item
            name="templateTypeLink"
            label={
              <span>
                Template &nbsp;
                <Tooltip title="Please enter template in the field"></Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Select Template",
              },
            ]}
          >
            <Select
              placeholder="Select template type"
              getPopupContainer={(trigger) => trigger.parentNode}
            >
              {templateData?.map((item) => (
                <Option value={item.templateId} key={item.templateId}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="address"
            label={
              <span>
                Address &nbsp;
                <Tooltip title="Please enter address in the field"></Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Enter Address",
              },
            ]}
          >
            <Input placeholder="Enter Address" />
          </Form.Item>

          <Form.Item
            name="city"
            label={
              <span>
                Town/City &nbsp;
                <Tooltip title="Please enter Town/City in the field"></Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Enter Town/City",
              },
            ]}
          >
            <Input placeholder="Enter Town/City" />
          </Form.Item>

          <Form.Item
            name="district"
            label={
              <span>
                District &nbsp;
                <Tooltip title="Please enter District in the field"></Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Enter District",
              },
            ]}
          >
            <Input placeholder="Enter District" />
          </Form.Item>

          <Form.Item
            name="state"
            label={
              <span>
                State &nbsp;
                <Tooltip title="Please enter State in the field"></Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Enter State",
              },
            ]}
          >
            <Input placeholder="Enter State" />
          </Form.Item>
          <Form.Item
            name="pincode"
            label={
              <span>
                pincode &nbsp;
                <Tooltip title="Enter pincode"></Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Enter Pincode",
              },
              {
                pattern: /^[0-9\b]+$/,
                message: "Please enter valid pincode number",
              },
            ]}
          >
            <Input placeholder="Enter pincode" />
          </Form.Item>

          {/* <Form.Item
      name="dob"
      label="DOB"
      rules={[
        {
          required: true,
          message: "Please input your Date of Birth!",
        },
      ]}
    >
      <DatePicker />
    </Form.Item>

    <Form.Item
      name="doj"
      label="DOJ"
      rules={[
        {
          required: true,
          message: "Please input your Date of Joining!",
        },
      ]}
    >
      <DatePicker />
    </Form.Item>

    <Form.Item
      name="agreement"
      valuePropName="checked"
      rules={[
        {
          validator: (_, value) =>
            value
              ? Promise.resolve()
              : Promise.reject("Should accept agreement"),
        },
      ]}
      {...tailFormItemLayout}
    >
      <Checkbox>
        I have read the <a href="">agreement</a>
      </Checkbox>
    </Form.Item> */}
          <Form.Item {...tailFormItemLayout}>
            <Button
              style={{ marginRight: "10px", marginBottom: "10px" }}
              type="primary"
              shape="round"
              htmlType="submit"
            >
              Add
            </Button>
            <Button shape="round" type="primary" onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};
const permissions = () => ({
  page: "admin",
});

export default PermissionWrapper(permissions)(OrganizationForm);
