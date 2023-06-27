import React, { useState } from "react";
import { Form, Input, Tooltip, Button, Select, Typography, Spin } from "antd";
import axios from "axios";
import { message } from "antd";
import { useHistory } from "react-router";
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

const TemplateUploadForm = (props) => {
  const history = useHistory();

  const [capturedFile, setcapturedFile] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [form] = Form.useForm();

  const success = (msg) => {
    message.success(msg);
  };

  const error = (msg) => {
    message.error(msg);
  };

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append("file", capturedFile);
    const templateData = JSON.stringify(values);
    formData.append("template", templateData);
    // const k = Object.entries(values)?.map(([key, value]) => {
    //   formData.append(key, value);
    // });

    const valueTosend = { file: capturedFile, template: { ...values } };

    // console.log("values", formData, values, valueTosend, capturedFile);

    axios
      .post(`${domainUrl}/management/template`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          //"content-type": "application/json",
          //"content-type": "multipart/form-data",
          //"content-type": "application/octet-stream",
        },
      })
      .then((res) => {
        // console.log(res);
        //console.log(res.data);
        if (res.status == 200) {
          success(res.data.message);
          history.goBack();
        } else error(res.data.message);
      })
      .catch((err) => {
        // what now?
        error("Error contacting API");
      });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setcapturedFile(file);

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageDataURL = e.target.result;
      };

      reader.readAsDataURL(file);
    }

    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     const fileBytes = new Uint8Array(e.target.result);
    //     console.log("file Bytes", fileBytes);
    //     setcapturedFile(file);
    //     // Store the fileBytes in state or perform any necessary operations
    //   };
    //   reader.readAsArrayBuffer(file);

    //   //   const reader = new FileReader();

    //   //   reader.onload = (e) => {
    //   //     const imageDataURL = e.target.result;
    //   //     setcapturedFile(imageDataURL);
    //   //   };

    //   //   reader.readAsDataURL(file);
    // }
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <>
      <Title style={{ paddingLeft: "56px" }} level={2}>
        Template Upload
      </Title>
      <Spin spinning={dataLoading}>
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Enter Template Name",
              },
            ]}
          >
            <Input placeholder="Please Enter Your Template Name" />
          </Form.Item>

          <Form.Item
            name="orientation"
            label={
              <span>
                Orientation &nbsp;
                <Tooltip title="Please enter class in the field"></Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Select orientation",
                // whitespace: true,
              },
            ]}
          >
            <Select
              placeholder="Select orientation"
              getPopupContainer={(trigger) => trigger.parentNode}
            >
              <Option value="Horizantal" key="Horizantal">
                Horizantal
              </Option>
              <Option value="Vertical" key="Vertical">
                Vertical
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="renderCode"
            label="Render Code"
            rules={[
              {
                required: true,
                message: "Enter Render Code",
              },
            ]}
          >
            <Input placeholder="Please Enter Render Code" />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Input type="file" accept=".docx" onChange={handleImageUpload} />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button
              shape="round"
              type="primary"
              htmlType="submit"
              style={{ marginRight: "10px", marginBottom: "10px" }}
            >
              {Boolean(props?.match?.params?.studentId) ? "Update" : "Submit"}
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

export default TemplateUploadForm;
