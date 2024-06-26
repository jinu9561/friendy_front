import React, { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useState } from "react"
import { useNavigate , useParams } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form'; 
import { Button } from "react-bootstrap";
import '../../assets/css/compare.css';


const SMSConfirm = () => {
  let { pathname } = useLocation();

  const navigator = useNavigate();
  const [userSeq, setUserSeq] = useState(localStorage.getItem('userSeq'));

  const [formData, setFormData] = useState({
    userId:"",
    smsToken : ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    console.log(formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 데이터를 서버로 전송하는 로직 작성
   // 에러 메시지 초기화
   let errorMessage = "";

   // 필드 검증
   if (!formData.userId) {
     errorMessage = "ID를 입력해 주세요.";
   }else if(!formData.smsToken){
    errorMessage = "인증 번호를 입력해 주세요.";
   }
   
   if (errorMessage !=="") {
     alert(errorMessage);
     return;
   }
   // 전송
   axios({ 
    method:"POST", 
    url : "http://localhost:9000/sms/confirm/"+userSeq,
    headers: {
      Authorization: localStorage.getItem("Authorization"),
    },
    data : formData, 
    }) 
     .then((res)=>{ 
        res.data === true ? alert("인증에 성공했습니다!") : alert("인증에 실패했습니다..");
        navigator("/"); 
    }) 
    .catch((err)=>{ 
      if (err.response && err.response.data && err.response.data.title === undefined) {
        alert("로그아웃 후 다시 로그인해 주세요");
    } else {
        alert(err.response.data.title);
    }
    });

    console.log(formData);
  };







  return (
      <Fragment>
          <SEO
              titleTemplate="본인 인증"
              description="해당 번호의 인증번호로 인증을 완료하세요!"
          />
          <LayoutOne headerTop="visible">
              {/* breadcrumb */}
              <Breadcrumb
                  pages={[
                      {label: "Home", path: process.env.PUBLIC_URL + "/"},
                      {label: "Authentication", path: process.env.PUBLIC_URL + pathname}
                  ]}
              />
              <br></br>
              <br></br>
              <div className="form-container">
                  <Form>
                      <Form.Group>
                          <Form.Control
                              type="text"
                              id="userId"
                              name="userId"
                              placeholder="ID"
                              onChange={handleInputChange}
                              className="input-field"
                          />
                      </Form.Group>
                      <Form.Group>
                          <Form.Control
                              type="text"
                              id="smsToken"
                              name="smsToken"
                              placeholder="문자 인증번호"
                              onChange={handleInputChange}
                              className="input-field"
                          />
                      </Form.Group>
                      <Button
                          variant="primary"
                          onClick={handleSubmit}
                          className="submit-button"
                      >인증하기</Button>
                  </Form>

              </div>
              <br></br>
              <br></br>
          </LayoutOne>

      </Fragment>
  );
};

export default SMSConfirm;

