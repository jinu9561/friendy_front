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


const EmailVerification = () => {
  let { pathname } = useLocation();

  const navigator = useNavigate();

  const [formData, setFormData] = useState({
    userId:"",
    emailToken : ""
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
   }else if(!formData.emailToken){
    errorMessage = "인증 번호를 입력해 주세요.";
   }
   
   if (errorMessage !=="") {
     alert(errorMessage);
     return;
   }
   // 전송
   axios({ 
    method:"POST", 
    url : "http://localhost:9000/email",
    data : formData, 
    }) 
     .then((res)=>{ 
        res.data === true ? alert("인증에 성공했습니다!") : alert("인증에 실패했습니다..");
        navigator("/login-register"); 
    }) 
    .catch((err)=>{ 
      console(err)
      alert(err.response.data.title ); 
    });

    console.log(formData);
  };







  return (
      <Fragment>
          <SEO
              titleTemplate="이메일 인증"
              description="해당 이메일로 인증번호를 보냈습니다!"
          />
          <LayoutOne headerTop="visible">
              {/* breadcrumb */}
              <Breadcrumb
                  pages={[
                      {label: "Home", path: process.env.PUBLIC_URL + "/"},
                      {label: "Create Account", path: process.env.PUBLIC_URL + pathname}
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
                              id="emailToken"
                              name="emailToken"
                              placeholder="이메일 인증 번호"
                              onChange={handleInputChange}
                              className="input-field"
                          />
                      </Form.Group>
                      <p>
                          <Link to={process.env.PUBLIC_URL + "/findEmailVerification"}>
                              인증번호가 오지않았나요?
                          </Link>
                      </p>
                      <Button
                          variant="primary"
                          onClick={handleSubmit}
                          className="submit-button"
                      >등록하기</Button>
                  </Form>

              </div>
              <br></br>
              <br></br>
          </LayoutOne>
      </Fragment>
  );
};

export default EmailVerification;

