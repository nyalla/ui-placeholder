import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import {
  Form,
  Input,
  Tooltip,
  Checkbox,
  Button,
  InputNumber,
  Select,
  Typography,
  Spin,
} from "antd";
import { DatePicker } from "antd";
import axios from "axios";
import { message } from "antd";
import { useHistory } from "react-router";
import { PermissionWrapper } from "../layouts/Hoc/PermissionsChecking";
import { domainUrl } from "../../AppConstants";
//import Webcam from "react-webcam";

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

const schoolClass = [
  "PP1",
  "PP2",
  "LKG",
  "UKG",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "xi",
  "xii",
];
const interClass = [
  "MPC 1st Year",
  "MPC 2nd Year",
  "BiPC 1st Year",
  "BiPC 2nd Year",
  "MEC 1st Year",
  "MEC 2nd Year",
  "CEC 1st Year",
  "CEC 2nd Year",
  "HEC 1st Year",
  "HEC 2nd Year",
];

const orgTypeList = {
  Intermediate: interClass,
  School: schoolClass,
};

let mediaStream = null;

const StudentForm = (props) => {
  const history = useHistory();

  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [openCamera, setCamera] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [form] = Form.useForm();

  const [orgType, setOrgType] = useState(undefined);

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setWebcamOpen(false);
  };
  useEffect(() => {
    // setAllData(dummyResponse);

    if (Boolean(props?.match?.params?.studentId)) {
      setDataLoading(true);
      axios
        .get(
          `${domainUrl}/management/editCandidateDetails?candidateId=${props?.match?.params?.studentId}`
        )
        .then((res) => {
          const dataToStore = { ...res.data.data };
          dataToStore["dob"] = moment(dataToStore.dob);
          dataToStore["doj"] = moment(dataToStore.doj);
          form.setFieldsValue(dataToStore);
          const org = schoolClass.includes(dataToStore.className)
            ? "School"
            : "Intermediate";
          setOrgType(org);

          setDataLoading(false);
        })
        .catch((err) => {
          // what now?
          // console.log("catch ");
          setDataLoading(false);
          //error("Error contacting API")
        });
    }
  }, []);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = () => {
    setCamera(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = { video: true };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          mediaStream = stream;
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.log("Error accessing the camera:", error);
        });
    } else {
      console.log("getUserMedia is not supported in this browser");
    }
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageDataURL = canvas.toDataURL("image/png");
      // console.log("Captured image data URL:", imageDataURL);
      const file = dataURLtoFile(imageDataURL, "image.png");
      setCapturedImage(file);
      setUploadedImage(imageDataURL);
      stopCamera();
      // You can further process or display the captured image as needed
    }
  };

  function dataURLtoFile(dataURL, filename) {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      mediaStream = null;
      setCamera(false);
    }
  };

  const [webcamOpen, setWebcamOpen] = useState(false);

  const handleOpenWebcam = () => {
    setCapturedImage(null);
    // setWebcamOpen(true);
    startCamera();
  };

  const handleCloseWebcam = () => {
    setWebcamOpen(false);
  };

  const success = (msg) => {
    message.success(msg);
  };

  const error = (msg) => {
    message.error(msg);
  };

  const onFinish = (values) => {
    if (!capturedImage) {
      error("Student Image is mandatory");
      return;
    }

    const formData = new FormData();

    const dataToSend = {
      ...values,
      dob: values["dob"].format("YYYY-MM-DD"),
      doj: values["doj"].format("YYYY-MM-DD"),
    };

    formData.append("file", capturedImage);
    const StudentData = JSON.stringify(dataToSend);
    formData.append("candidate", StudentData);

    const id = Boolean(props?.match?.params?.studentId)
      ? props?.match?.params?.studentId
      : undefined;

    if (id) {
      axios
        .put(
          `${domainUrl}/management/editCandidate/${props.match.params.id}/candidateId=${id}`,
          // JSON.stringify(dataToSend),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          console.log(res);
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
    } else {
      axios
        .post(
          `${domainUrl}/management/saveCandidate/${props.match.params.id}`,
          // JSON.stringify(dataToSend),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          console.log(res);
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
    }
  };

  const handleImageUpload = (event) => {
    // const file = event.target.files[0];
    // const reader = new FileReader();

    // reader.onloadend = () => {
    //   setCapturedImage(reader.result);
    // };

    // if (file) {
    //   reader.readAsDataURL(file);
    // }

    const file = event.target.files[0];

    if (file) {
      setCapturedImage(file);
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageDataURL = e.target.result;
        setUploadedImage(imageDataURL);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <>
      <Title style={{ paddingLeft: "56px" }} level={2}>
        Student Form
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
            name="studentName"
            label="Student Name"
            rules={[
              {
                required: true,
                message: "Enter Student Name",
              },
            ]}
          >
            <Input placeholder="Please Enter Your Student Name" />
          </Form.Item>
          <Form.Item
            name="fatherGuardianName"
            label="fatherGuardianName"
            rules={[
              {
                required: true,
                message: "Enter Father Name",
                // whitespace: true,
              },
            ]}
          >
            <Input placeholder="Please Enter Your Father Name" />
          </Form.Item>
          <Form.Item
            name="motherName"
            label="Mother Name"
            rules={[
              {
                required: true,
                message: "Enter Mother Name",
                // whitespace: true,
              },
            ]}
          >
            <Input placeholder="Please Enter Your Mother Name" />
          </Form.Item>
          <Form.Item label={<span>Org Type &nbsp;</span>}>
            <Select
              placeholder="Select orgType"
              getPopupContainer={(trigger) => trigger.parentNode}
              onChange={(value) => setOrgType(value)}
              value={orgType}
            >
              <Option value="Intermediate" key="Intermediate">
                Intermediate
              </Option>
              <Option value="School" key="School">
                School
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="className"
            label={
              <span>
                Class &nbsp;
                <Tooltip title="Please enter class in the field"></Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Select class",
                // whitespace: true,
              },
            ]}
          >
            <Select
              placeholder="Select class"
              getPopupContainer={(trigger) => trigger.parentNode}
            >
              {orgType
                ? orgTypeList[orgType].map((item) => (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  ))
                : null}
            </Select>
          </Form.Item>
          <Form.Item
            name="section"
            label={
              <span>
                Section &nbsp;
                <Tooltip title="Please enter Section"></Tooltip>
              </span>
            }
            // rules={[
            //   {
            //     required: true,
            //     message: "Select Section",
            //     // whitespace: true,
            //   },
            // ]}
          >
            <Select
              placeholder="Select Section type"
              getPopupContainer={(trigger) => trigger.parentNode}
            >
              <Option value="A" key="A">
                A
              </Option>
              <Option value="B" key="B">
                B
              </Option>
              <Option value="C" key="C">
                C
              </Option>
              <Option value="D" key="D">
                D
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="dob"
            label={
              <span>
                Date Of Birth &nbsp;
                <Tooltip title="Please enter Section"></Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Select DOB",
              },
            ]}
          >
            <DatePicker format="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item
            name="rollNumber"
            label={
              <span>
                Roll Number &nbsp;
                <Tooltip title="Enter Roll Number"></Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Enter Roll Number",
                // whitespace: true,
              },
              // {
              //   pattern: /^[0-9\b]+$/,
              //   message: "Please enter valid pincode number",
              // },
            ]}
          >
            <Input placeholder="Enter Roll Number" />
          </Form.Item>
          {/* <Form.Item
            name="phoneNumber"
            label={
              <span>
                phone &nbsp;
                <Tooltip title="Enter Phone Number"></Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Please enter phone number in the field!",
                whitespace: true,
              },
              {
                pattern: /^[0-9\b]+$/,
                message: "Please enter valid phone number",
              },
              { max: 10, message: "Cannot be more than 10 numbers" },
            ]}
          >
            <Input placeholder="Enter Your Phone Number" />
          </Form.Item> */}
          <Form.Item
            name="emergencyNumber"
            label={
              <span>
                Emergency contact &nbsp;
                <Tooltip title="Enter Phone Number"></Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Enter emergency contact in the field!",
                // whitespace: true,
              },
              {
                pattern: /^[0-9\b]+$/,
                message: "Enter valid phone number",
              },
              { max: 10, message: "Cannot be more than 10 numbers" },
            ]}
          >
            <Input placeholder="Enter Your emergency contact" />
          </Form.Item>
          <Form.Item
            name="bloodGroup"
            label={
              <span>
                Blood Group &nbsp;
                <Tooltip title="Please enter Section"></Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Select Blood Group",
                // whitespace: true,
              },
            ]}
          >
            <Select
              placeholder="Select Blood Group"
              getPopupContainer={(trigger) => trigger.parentNode}
            >
              <Option value="A+ve" key="A+ve">
                A+ve
              </Option>
              <Option value="B+ve" key="B+ve">
                B+ve
              </Option>
              <Option value="A-ve" key="A-ve">
                A-ve
              </Option>
              <Option value="B-ve" key="B-ve">
                B-ve
              </Option>
              <Option value="AB+ve" key="AB+ve">
                AB+ve
              </Option>
              <Option value="AB-ve" key="AB-ve">
                AB-ve
              </Option>
              <Option value="O+ve" key="O+ve">
                O+ve
              </Option>
              <Option value="O-ve" key="O-ve">
                O-ve
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="address"
            label={
              <span>
                Address1 &nbsp;
                <Tooltip title="Please enter address in the field"></Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Enter Address",
                // whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
            name="address2"
            label={
              <span>
                Address2 &nbsp;
                <Tooltip title="Please enter address in the field"></Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Enter Address",
                // whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item> */}
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
                // whitespace: true,
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
                // whitespace: true,
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
                // whitespace: true,
              },
            ]}
          >
            <Input placeholder="Enter State" />
          </Form.Item>
          <Form.Item
            name="pincode"
            label={
              <span>
                Pincode &nbsp;
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
          <Form.Item
            name="doj"
            label="Date Of Joining"
            rules={[
              {
                required: true,
                message: "Input your Date of Joining!",
              },
            ]}
          >
            <DatePicker />
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
                regex:
                  '/^(([^<>()[].,;:s@"]+(.[^<>()[].,;:s@"]+)*)|(".+"))@(([^<>()[].,;:s@"]+.)+[^<>()[].,;:s@"]{2,})$/i',
                message: "Enter Valid Mail",
              },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            {/* 
          {webcamOpen ? (
            <>
              <div>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  style={{ width: "200px", height: "200px" }}
                />
              </div>
              <Button type="primary" onClick={capturePhoto}>
                Capture Photo
              </Button>
            </>
          ) : capturedImage ? null : (
            <Button type="primary" onClick={handleOpenWebcam}>
              Take a Photo
            </Button>
          )}*/}
            {/* logic below is useful */}

            {openCamera ? (
              <>
                {" "}
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <video
                  ref={videoRef}
                  style={{ width: "200px", height: "200px" }}
                  autoPlay
                />
                <Button shape="round" type="primary" onClick={captureImage}>
                  Capture Image
                </Button>
              </>
            ) : capturedImage ? null : (
              <Button shape="round" type="primary" onClick={startCamera}>
                Open Camera
              </Button>
            )}

            {capturedImage && (
              <>
                <div>
                  <img
                    style={{ width: "200px", height: "200px" }}
                    src={uploadedImage}
                    alt="Captured"
                  />
                </div>
                <Button
                  shape="round"
                  style={{ marginTop: "10px" }}
                  type="primary"
                  onClick={handleOpenWebcam}
                >
                  Retake Photo
                </Button>
              </>
            )}
          </Form.Item>
          <Form.Item label={<span>Student Image &nbsp;</span>}>
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
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

const permissions = () => ({
  page: "school",
});

export default PermissionWrapper(permissions)(StudentForm);
