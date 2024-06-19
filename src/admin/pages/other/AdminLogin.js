import React, { Fragment, useContext } from "react";
import { Link, useLocation } from "react-router-dom"; 
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SEO from "../../../components/seo";
import LayoutOne from "../../../layouts/LayoutOne";
import { useState,useEffect } from "react";
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import BreadcrumbWrap from "../../../wrappers/breadcrumb/Breadcrumb";
import { LogingedContext } from "../../../App"


const AdminLogin = () => {

  let { pathname } = useLocation();

  const navigator = useNavigate();
  let logingedCon =useContext(LogingedContext);

  const [loginData, setLoginData] = useState({
    userId:"",
    userPwd:""
  });

  

  // 로그인 데이터 입력될때마다 상태 값 수정
  const handleLoginDataChange = (e) => {
    const {name, value} = e.target;
    setLoginData({...loginData,[name]: value})
  }

  const submitLogin = (e) =>{
    e.preventDefault();//submit이벤트 막음 

    let formData = new FormData(); //폼전송으로 보내기위한 작업 
    formData.append("userId", loginData.userId); 
    formData.append("userPwd", loginData.userPwd);

    axios({
      method:"POST", 
      url : "http://localhost:9000/login", 
      data : formData, 
      }) 
      .then((res)=>{ 

       // 인증된 사용자의 정보를 저장
      //  localStorage.setItem("userId", res.data.userId); 
      //  localStorage.setItem("userName", res.data.userName);
      //  localStorage.setItem("userSeq", res.data.userSeq); 
      //  localStorage.setItem("Authorization", res.headers.authorization);
      sessionStorage.setItem("userId", res.data.userId); 
      sessionStorage.setItem("userName", res.data.userName);
      sessionStorage.setItem("userSeq", res.data.userSeq); 
      sessionStorage.setItem("Authorization", res.headers.authorization);

       logingedCon.onAdminInChange(true);
       console.log(logingedCon.isAdminIn);
       navigator("/adminUser");
     }) 
      .catch((err)=>{ 
      console.log(err); 
     
     });

  }




 



  return (
    <Fragment>
      <SEO
        titleTemplate="Admin-Login"
        description="Login page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <BreadcrumbWrap 
          pages={[
            {label: "Admin", path: process.env.PUBLIC_URL + "/" },
            {label: "Admin Login", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ms-auto me-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>Admin Login</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit={submitLogin}>
                              <input
                                type="text"
                                name="userId"
                                placeholder="ID"
                                value={loginData.userId}
                                onChange={handleLoginDataChange}
                              />
                              <input
                                type="password"
                                name="userPwd"
                                placeholder="Password"
                                value={loginData.userPwd}
                                onChange={handleLoginDataChange}
                              />
                              <div className="button-box">
                                <button type="submit">
                                  <span>Login</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default AdminLogin;
