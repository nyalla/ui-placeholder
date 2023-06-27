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
    class: "1st",
    regstudents: 4,
    submittedForPrint: 3,
  },
  {
    class: "2nd",
    regstudents: 6,
    submittedForPrint: 4,
  },
];

const OverallOrganizationDetails = (props) => {
  const history = useHistory();
  const [allData, setAllData] = useState([]);

  //   const error = (msg: import("history").History.PoorMansUnknown) => {
  //     message.error(msg);
  //   };

  useEffect(() => {
    // setAllData(dummyResponse);
    axios
      .get(
        `${domainUrl}/management//showAllCandidatesByClass/${props.match.params.id}`
      )
      .then((res) => {
        // console.log(res.data.data);
        const dataToStore = Object.keys(res.data.data)?.length
          ? Object.entries(res.data.data).map(([key, value]) => ({
              class: key,
              regstudents: value,
            }))
          : [];
        // console.log("Object is empty");
        setAllData(dataToStore);
      })
      .catch((err) => {
        // what now?
        //error("Error contacting API")
      });
  }, []);

  const gotoDetails = (id) => {
    history.push(`/School/${props.match.params.id}/Details/class/${id}`);
  };

  const columns = [
    {
      title: "class",
      dataIndex: "class",

      render: (text, record) => (
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => gotoDetails(record.class)}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Reg students",
      dataIndex: "regstudents",
      render: (text) => <span>{text}</span>,
    },
    // {
    //   title: "Submitted For Printed",
    //   dataIndex: "submittedForPrint",
    //   render: (text) => <span>{text}</span>,
    // },
  ];

  const handleClick = () => {
    history.push(`/School/${props.match.params.id}/Details/new`);
  };

  const detailsOfLoggedinUser = JSON.parse(
    window.localStorage.getItem("userDetails")
  );

  const goToAdminPage = () => {
    history.push(`/SchoolList`);
  };
  return (
    <div style={{ paddingTop: "20px" }}>
      <Row wrap={false} gutter={[16, 16]}>
        <Col flex={1}>
          <Title level={2}> Class Details</Title>
        </Col>
        <Col>
          <Space>
            {detailsOfLoggedinUser.isAdmin ? (
              <Button
                type="primary"
                shape="round"
                onClick={() => goToAdminPage()}
                block
              >
                Go to Admin Page
              </Button>
            ) : null}

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

export default PermissionWrapper(permissions)(OverallOrganizationDetails);
