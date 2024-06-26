import React, { Fragment }  from "react";
import { useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useState , useEffect } from "react"
import { useNavigate , useParams } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form'; 
import { Button } from "react-bootstrap";
import '../../assets/css/compare.css';


const PasswordAlter = () => {
  let { pathname } = useLocation();

  const navigator = useNavigate();

  const [formData, setFormData] = useState({
    userId:"",
    userPwd:"",
    userPwdCheck:"",
    emailToken:""
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;

      setFormData({
        ...formData,
        [name]: value
      });
  
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 데이터를 서버로 전송하는 로직 작성
   // 에러 메시지 초기화
   let errorMessage = "";

   // 필드 검증
   if (!formData.userPwd) {
     errorMessage = "새 비밀번호를 입력해주세요.";
   }else if(!formData.userPwdCheck){
    errorMessage = "비밀번호를 일치시켜주세요.";
   }
   
   if (errorMessage !=="") {
     alert(errorMessage);
     return;
   }
   // 전송
   axios({ 
    method:"POST", 
    url : "http://localhost:9000/users/alter/password",
    data : formData, 
    }) 
     .then((res)=>{ 
        alert(res.data);
        navigator("/login-register")
    }) 
    .catch((err)=>{ 
      alert(err.response.data.title );
    });
  };

  return (
      <Fragment>
          <SEO
              titleTemplate="비밀번호 변경"
              description="비밀번호 변경페이지 입니다."
          />
          <LayoutOne headerTop="visible">
              {/* breadcrumb */}
              <Breadcrumb
                  pages={[
                      {label: "Home", path: process.env.PUBLIC_URL + "/"},
                      {label: "비밀번호 변경", path: process.env.PUBLIC_URL + pathname}
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
                              placeholder="인증 번호"
                              onChange={handleInputChange}
                              className="input-field"
                          />
                      </Form.Group>
                      <Form.Group>
                          <Form.Control
                              type="password"
                              id="userPwd"
                              name="userPwd"
                              placeholder="New Password"
                              onChange={handleInputChange}
                              className="input-field"
                          />
                      </Form.Group>
                      <Form.Group>
                          <Form.Control
                              type="password"
                              id="userPwdCheck"
                              name="userPwdCheck"
                              placeholder="Password Check"
                              onChange={handleInputChange}
                              className="input-field"
                          />
                      </Form.Group>
                      <Button
                          variant="primary"
                          onClick={handleSubmit}
                          className="submit-button"
                      >비밀번호 변경
                      </Button>
                  </Form>
              </div>
              <br></br>
              <br></br>
          </LayoutOne>

      </Fragment>
  );
};

export default PasswordAlter;

