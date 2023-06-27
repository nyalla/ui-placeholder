import React, { useEffect, useState } from "react";
import { Table, Row, Col, Button, Typography, Spin, Space, Modal } from "antd";
import { useHistory } from "react-router";
import axios from "axios";
import { message } from "antd";
import moment from "moment";
import { PermissionWrapper } from "../layouts/Hoc/PermissionsChecking";
import { domainUrl } from "../../AppConstants";

const { Title } = Typography;

const dummyResponse = [
  {
    schoolId: "1",
    schoolName: "sri chaitanya",
    phone: "9676673455",
    email: "def@gmail.com",
    Regstudents: 5,
    TotalPrinted: 4,
    ReadyForPrint: 1,
    id: 5555,
  },
  {
    schoolId: "2",
    schoolName: "Narayana",
    phone: "9676673455",
    email: "def@gmail.com",
    Regstudents: 10,
    TotalPrinted: 6,
    ReadyForPrint: 4,
    id: 7777,
  },
  {
    schoolId: "2",
    schoolName: "Narayana",
    phone: "9676673455",
    email: "def@gmail.com",
    Regstudents: 10,
    TotalPrinted: 6,
    ReadyForPrint: 4,
    id: 7777,
  },
  {
    schoolId: "2",
    schoolName: "Narayana",
    phone: "9676673455",
    email: "def@gmail.com",
    Regstudents: 10,
    TotalPrinted: 6,
    ReadyForPrint: 4,
    id: 7777,
  },
  {
    schoolId: "2",
    schoolName: "Narayana",
    phone: "9676673455",
    email: "def@gmail.com",
    Regstudents: 10,
    TotalPrinted: 6,
    ReadyForPrint: 4,
    id: 7777,
  },
];

const OrganizationList = () => {
  const history = useHistory();
  const [allData, setAllData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [details, setDetails] = useState({});
  const [schoolId, setSchoolId] = useState(null);

  //   const error = (msg: import("history").History.PoorMansUnknown) => {
  //     message.error(msg);
  //   };

  useEffect(() => {
    // setAllData(dummyResponse);
    setDataLoading(true);
    axios
      .get(`${domainUrl}/management/org/showAllByOrg`)
      .then((res) => {
        // console.log(res);
        setAllData(res.data.data);
        setDataLoading(false);
      })
      .catch((err) => {
        // what now?
        setDataLoading(false);
        //error("Error contacting API")
      });
    axios
      .get(`${domainUrl}/management/org/showAll`)
      .then((res) => {
        const eachDetails = {};
        if (res.data.data.length) {
          const d = res.data.data;
          d.map((item) => {
            eachDetails[item.schoolId] = item;
          });
          //  console.log("ooo", eachDetails);
          setDetails(eachDetails);
          return;
        }
        setDetails(eachDetails);
      })
      .catch((err) => {
        // what now?
        setDataLoading(false);
        //error("Error contacting API")
      });
  }, []);

  const columns = [
    {
      title: "School Name",
      dataIndex: "orgName",
      render: (text, record) => (
        <span
          onClick={() => history.push(`/School/${record.orgId}/Details`)}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Reg students",
      dataIndex: "studentsCount",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Total Printed",
      dataIndex: "TotalPrinted",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Ready For Print",
      dataIndex: "ReadyForPrint",
      render: (text, record) => (
        <>
          {text}{" "}
          <span
            style={{ color: "blue", paddingLeft: "10px", cursor: "pointer" }}
            onClick={() => downLoadZip(record.orgId, record.orgName)}
          >
            Download
          </span>
        </>
      ),
    },
    {
      title: "See Moredetails",
      dataIndex: "",
      render: (text, record) => (
        <>
          <Button
            shape="round"
            type="primary"
            onClick={() => setSchoolId(record.orgId)}
          >
            See Details
          </Button>
        </>
      ),
    },
  ];

  const downLoadZip = (orgId, orgName) => {
    axios
      .get(`${domainUrl}/management/download/orgId/${orgId}`, {
        responseType: "blob",
      })
      .then((response) => {
        // const contentDispositionHeader =
        //   response.headers["content-disposition"];
        // const filename = contentDispositionHeader
        //   .split(";")
        //   .find((item) => item.trim().startsWith("filename="))
        //   .split("=")[1]
        //   .trim()
        //   .replace(/"/g, "");
        // console.log("filename", filename);

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${orgName}.zip`);

        // Trigger the download
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        // what now?
        //error("Error contacting API")
      });
  };

  const handleClick = () => {
    history.push("/SchoolForm");
  };
  const handleTemplate = () => {
    history.push("/templatesection");
  };

  return (
    <div style={{ paddingTop: "20px" }}>
      <Spin spinning={dataLoading}>
        <Row gutter={[16, 16]} wrap={false}>
          <Col flex={1}>
            <Title level={2}>School Details</Title>
          </Col>
          <Col>
            <Space wrap>
              {" "}
              <Button
                style={{ marginBottom: "10px" }}
                type="primary"
                key="templatesction"
                shape="round"
                onClick={handleTemplate}
                block
              >
                Template Section
              </Button>
              {/* <Button
                style={{ marginBottom: "10px" }}
                type="primary"
                shape="round"
                onClick={handleTemplate}
                block
              >
                Template Section
              </Button> */}
              <Button
                style={{ marginBottom: "10px" }}
                type="primary"
                shape="round"
                onClick={handleClick}
                block
                key="add school"
              >
                Add School
              </Button>
            </Space>
          </Col>
        </Row>
        {/* <Row gutter={[40, 0]}>
        <Col span={24}> */}
        <Table columns={columns} dataSource={allData} pagination={false} />
        {schoolId ? (
          <Modal
            footer={null}
            title="School Details"
            visible={true}
            onCancel={() => setSchoolId(null)}
          >
            <Space>
              {" "}
              <strong>School Name:</strong>{" "}
              <div> {details[schoolId].schoolName}</div>
            </Space>
            <br />
            <Space>
              <strong style={{ paddingLeft: "7px" }}>User Name:</strong>{" "}
              <div>{details[schoolId].superUserName} </div>
            </Space>
            <br />
            <Space>
              {" "}
              <strong>Password:</strong>
              <div>{details[schoolId].superUserPassword} </div>
            </Space>
          </Modal>
        ) : null}
        {/* </Col>
      </Row> */}
      </Spin>
    </div>
  );
};

const permissions = () => ({
  page: "admin",
});

export default PermissionWrapper(permissions)(OrganizationList);
