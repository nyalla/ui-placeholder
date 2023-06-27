import React, { useEffect, useState } from "react";
import { Table, Row, Col, Button, Typography, Space } from "antd";
import { useHistory } from "react-router";
import axios from "axios";
import { message } from "antd";
import moment from "moment";
import { PermissionWrapper } from "../layouts/Hoc/PermissionsChecking";
import { domainUrl } from "../../AppConstants";

const { Title } = Typography;

const dummyResponse = [
  {
    name: "Kiran",
    stepsaved: 1,
    "father/guardianName": "Srinu",
    studentId: 1,
  },
  {
    name: "Naveen",
    stepsaved: 2,
    "father/guardianName": "Srinu",
    studentId: 2,
  },
  {
    name: "Bhanu",
    stepsaved: 2,
    "father/guardianName": "Srinu",
    studentId: 3,
  },
];

const ClassWiseDetails = (props) => {
  const history = useHistory();
  const [allData, setAllData] = useState([]);

  //   const error = (msg: import("history").History.PoorMansUnknown) => {
  //     message.error(msg);
  //   };

  useEffect(() => {
    // setAllData(dummyResponse);
    classWiseDetails();
  }, []);

  const classWiseDetails = () => {
    axios
      .get(
        `${domainUrl}/management/showAllCandidates/${props.match.params.id}?className=${props.match.params.classId}`
      )
      .then((res) => {
        // console.log(res.data.data);
        setAllData(res.data.data);
      })
      .catch((err) => {
        // what now?
        //error("Error contacting API")
      });
  };

  const clickonReadyToSubmit = (studentId) => {
    axios
      .put(
        `${domainUrl}/management/submitPrint/${props.match.params.id}/${studentId}`
      )
      .then((res) => {
        // console.log(res.data.data);
        classWiseDetails();
      })
      .catch((err) => {
        // what now?
        //error("Error contacting API")
      });
  };

  const columns = [
    {
      title: "Student Name",
      dataIndex: "studentName",

      render: (text) => <span>{text}</span>,
    },
    {
      title: "Father/guardianName",
      dataIndex: "fatherGuardianName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Edit",
      dataIndex: "stepsaved",
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => editPage(record.studentId)}
          disabled={text === 2}
          shape="round"
        >
          Edit
        </Button>
      ),
    },
    {
      title: "Submit For Print",
      dataIndex: "readyForPrint",
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => clickonReadyToSubmit(record.studentId)}
          disabled={text == 0 ? false : true}
          shape="round"
        >
          Submit For Print
        </Button>
      ),
    },
  ];

  const editPage = (id) => {
    history.push(`/School/${props.match.params.id}/Details/${id}/edit`);
  };

  const handleClick = () => {
    history.push(`/School/${props.match.params.id}/Details/new`);
  };

  const goToSchool = () => {
    history.push(`/School/${props.match.params.id}/Details`);
  };

  return (
    <div style={{ paddingTop: "20px" }}>
      <Row gutter={[40, 0]}>
        <Col flex={1}>
          <Title level={2}>Student Details</Title>
        </Col>
        <Col>
          <Space>
            <Button type="primary" shape="round" onClick={goToSchool} block>
              Go back to School Page
            </Button>

            <Button type="primary" shape="round" onClick={handleClick} block>
              Add Student
            </Button>
          </Space>
        </Col>
      </Row>

      <Table columns={columns} dataSource={allData} pagination={false} />
    </div>
  );
};

const permissions = () => ({
  page: "school",
});

export default PermissionWrapper(permissions)(ClassWiseDetails);
