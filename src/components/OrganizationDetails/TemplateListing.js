import React, { useEffect, useState } from "react";
import { Table, Row, Col, Button, Typography, Spin, Input, Card } from "antd";
import { useHistory } from "react-router";
import axios from "axios";
import { message } from "antd";
import moment from "moment";
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

const TemplateListing = () => {
  const history = useHistory();
  const [allData, setAllData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  //   const error = (msg: import("history").History.PoorMansUnknown) => {
  //     message.error(msg);
  //   };

  useEffect(() => {
    // setAllData(dummyResponse);
    setDataLoading(true);
    axios
      .get(`${domainUrl}/management/getAllTemplates`)
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
  }, []);

  const handleClick = () => {
    history.push("/SchoolForm");
  };

  const gotoTemplateUpload = () => {
    history.push("/templateupload");
  };

  return (
    <div style={{ paddingTop: "20px" }}>
      <Spin spinning={dataLoading}>
        <Row gutter={[40, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} offset={0}>
            <Title level={2}>Template Details</Title>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={6}
            lg={6}
            xl={6}
            offset={0}
            style={{ marginBottom: "10px" }}
          >
            <Button type="primary" shape="round" onClick={gotoTemplateUpload}>
              {" "}
              Template Upload
            </Button>
          </Col>

          <Col xs={24} sm={24} md={6} lg={6} xl={6} offset={0}>
            <Button type="primary" shape="round" onClick={handleClick} block>
              Add School
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          {allData?.map((item) => (
            <Col pull={1} xs={24} sm={24} md={7} lg={7} xl={7} offset={1}>
              <Card
                style={{ paddingRight: "10px", marginBottom: "10px" }}
                title={item.name}
              >
                {item.name}
                {item.orientation}
                {item.renderCode}
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>
    </div>
  );
};

export default TemplateListing;
