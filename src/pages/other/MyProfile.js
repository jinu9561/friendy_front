import { Fragment, useEffect, useState } from "react"; 
import { useLocation } from "react-router-dom"; 
import Accordion from "react-bootstrap/Accordion";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import axios from "axios";
import Select from 'react-select';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../assets/css/Myprofile.css';
import Profile from "../../components/Profile/Profile";
import SlideImg from "../../components/Profile/SlideImg";
import InterestList from "../../components/Profile/InterestList";
import ProfileDetail from "../../components/Profile/ProfileDetail";
import { Button, Modal ,Form } from "react-bootstrap";

const MyProfile = () => {
  let { pathname } = useLocation();

  const [profileData, setProfileData] = useState({
    userName:"",
    nickName:"",
    country:"",
    gender:"",
    userJelly:"",
    introduce:"",
    profileMainImgName:"",
    profileMainApprove:"",
    profileDetailImgList:[],
    interestList:[],
    address:"",
    phone:"",
    email:"",
    userState:"",
    purchaseHistory:[]
  })

  const [userSeq, setUserSeq] = useState(localStorage.getItem('userSeq'));
  const [interestOptions, setInterestOptions] = useState([]);
  const [mainProfileImage, setMainProfileImage] = useState(null);
  const [detailImage, setDetailImage] = useState(null);

  const [formData, setFormData] = useState({
    introduce:"",
    interestCategory: [],
    address:"",
    phone:"",
    nickName:"",
    email:""
  });


  const [passwoardData, setPasswoardData] = useState({
    userPwd:"",
    userPwdCheck:"",
  });

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [selectedTransactionSeq, setSelectedTransactionSeq] = useState(null);

  useEffect(() => {
  
    refresh();

  },[userSeq]);

  
  const handleInterestChange = (selectedOptions) => {
    const interests = selectedOptions ? selectedOptions.map(option => option.label) : [];
    setFormData({
      ...formData,
      interestCategory: interests
    });
  };

  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
    console.log(formData)
    console.log(profileData)
    
  };

  const handleSubmit = (e) => {

    const { name, value } = e.target

    e.preventDefault();

   // 전송
   axios({ 
    method:"PUT", 
    url : "http://localhost:9000/profile/alter/"+userSeq,
    headers: {
      Authorization: localStorage.getItem("Authorization"),
    },
    data : formData, 
    }) 
     .then((res)=>{ 
        alert(res.data);
        return axios.get("http://localhost:9000/profile/"+userSeq)
    }) 
    .then((res)=>{
      setProfileData(res.data);
      setFormData({
        introduce: "",
        interestCategory: [],
        address:"",
        phone:"",
        nickName:"",
        email:""
      });
    
    })
    .catch((err)=>{ console.log(err) 
      if (err.response && err.response.data && err.response.data.title === undefined) {
        alert("로그아웃 후 다시 로그인해 주세요");
    } else {
        alert(err.response.data.title);
    }
    });
  };

  const handleFileChange = (e) => {

    const { name, files } = e.target;

    if (name === "mainProfileImage") {
      setMainProfileImage(files[0]);
    } else if (name === "detailImage") {
      setDetailImage(files[0]);
    }

  };

  const handleMainSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("mainProfileImage", mainProfileImage);

    let errorMessage = "";
    
    // 필드 검증
   if (!mainProfileImage) {
    errorMessage = "사진을 등록해 주세요.";
   }
  
  if (errorMessage !=="") {
    alert(errorMessage);
    return;
  }

   // 전송
   axios({ 
    method:"POST", 
    url : "http://localhost:9000/profile/main/"+userSeq,
    data : formDataToSend,
    headers :  {
        Authorization: localStorage.getItem("Authorization"),
        "Content-Type": "multipart/form-data"
    }
    })
    .then((res) => {
      alert(res.data);
      return axios.get(`http://localhost:9000/profile/${userSeq}`);
     }) 
     .then((res)=>{ 
        setProfileData(res.data);
        setMainProfileImage(null)
    }) 
    
    .catch((err)=>{ 

      if (err.response && err.response.data && err.response.data.title === undefined) {
        alert("로그아웃 후 다시 로그인해 주세요");
    } else {
        alert(err.response.data.title);
    }
    });
  };

  const handleSubSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("detailImage", detailImage);

    let errorMessage = "";
    
    // 필드 검증
   if (!detailImage) {
    errorMessage = "사진을 등록해 주세요.";
   }
  
  if (errorMessage !=="") {
    alert(errorMessage);
    return;
  }

   // 전송
   axios({ 
    method:"POST", 
    url : "http://localhost:9000/profile/detail/"+userSeq,
    data : formDataToSend,
    headers :  {
      "Content-Type": "multipart/form-data"
    }
    }) 
    .then((res) => {
      alert(res.data);
      return axios.get(`http://localhost:9000/profile/${userSeq}`);
    })
     .then((res)=>{ 
        setProfileData(res.data);
        setDetailImage(null)
    }) 
    .catch((err)=>{ 

      if (err.response && err.response.data && err.response.data.title === undefined) {
        alert("로그아웃 후 다시 로그인해 주세요");
    } else {
        alert(err.response.data.title);
    }
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswoardData({
        ...passwoardData,
        [name]: value
      });
  
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // 데이터를 서버로 전송하는 로직 작성
   // 에러 메시지 초기화
   let errorMessage = "";

   // 필드 검증
   if (!passwoardData.userPwd) {
     errorMessage = "새 비밀번호를 입력해주세요.";
   }else if(!passwoardData.userPwdCheck){
    errorMessage = "비밀번호를 일치시켜주세요.";
   }
   
   if (errorMessage !=="") {
     alert(errorMessage);
     return;
   }
   // 전송
   axios({ 
    method:"PUT", 
    url : "http://localhost:9000/profile/alter/password/"+userSeq,
    data : passwoardData, 
    }) 
     .then((res)=>{ 
        alert(res.data);
        setPasswoardData({
          userPwd:"",
          userPwdCheck:"",
        })
    }) 
    .catch((err)=>{ console.log(err) 
      if (err.response && err.response.data && err.response.data.title === undefined) {
        alert("로그아웃 후 다시 로그인해 주세요");
    } else {
        alert(err.response.data.title);
    }
    });
  };

  const openRefundModal = (transactionSeq) => {
    setSelectedTransactionSeq(transactionSeq);
    setShowRefundModal(true);
  };

  const handleRefundRequest = (e)=>{

    e.preventDefault();

    axios({ 
      method:"PUT", 
      url : "http://localhost:9000/jelly/refund",
      data : {
        transactionSeq: selectedTransactionSeq,
        refundReason: refundReason
      },
      headers :  {
          Authorization: localStorage.getItem("Authorization")
      }
      })
      .then((res) => {
        alert(res.data);
        setRefundReason("")
        setShowRefundModal(false);
       })    
      .catch((err)=>{ 
  
        if (err.response && err.response.data && err.response.data.title === undefined) {
          alert("로그아웃 후 다시 로그인해 주세요");
      } else {
          alert(err.response.data.title);
      }
      });
  }

  const handledeleteImg = ()=>{

    let check  = window.confirm("등록된 사진을 삭제하시겠습니까?");
    if(check){
        // 전송
        axios({ 
            method:"DELETE", 
            url : "http://localhost:9000/profile/main/img/"+userSeq,
            headers :  {
                Authorization: localStorage.getItem("Authorization"),
            }
            })
            .then((res) => {
            alert(res.data);
            return axios.get(`http://localhost:9000/profile/${userSeq}`);
            }) 
            .then((res)=>{ 
                setProfileData(res.data);
                setMainProfileImage(null);
            }) 
            .catch((err)=>{ 
            if (err.response && err.response.data && err.response.data.title === undefined) {
                alert("로그아웃 후 다시 로그인해 주세요");
            } else {
                alert(err.response.data.title);
            }
        });
    }
  }

  const refresh = ()=>{

    axios.get("http://localhost:9000/profile/"+userSeq,
      {
        headers :  {Authorization: localStorage.getItem("Authorization")},
      })
        .then((response) => {
          // 날짜순으로 정렬
          const sortedPurchaseHistory = [...response.data.purchaseHistory].sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
          setProfileData({ ...response.data, purchaseHistory: sortedPurchaseHistory });
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.title === undefined) {
            alert("로그아웃 후 다시 로그인해 주세요");
        } else {
            alert(err.response.data.title);
        }
        });
  
      axios.get("http://localhost:9000/interest/",
        {
          headers :  {Authorization: localStorage.getItem("Authorization")},
        })
        .then((res) => {
        const options = res.data.map(interest => ({
          value: interest.interestSeq,
          label: interest.interestCategory
        }));
        setInterestOptions(options);
      })
      .catch((err) => {
  
      });

  }


  return (
    <Fragment>
      <SEO
        titleTemplate="My Profile"
        description="개인 프로필."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "My Profile", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        
        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ms-auto me-auto col-lg-9">
                <div className="myaccount-wrapper">
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                        <span>1 .</span> 프로필{" "}
                      </Accordion.Header>
                      <Accordion.Body>
                          <div className="myaccount-info-wrapper">
                              <div className="account-info-wrapper">
                                <Profile profileData={profileData} handledeleteImg={handledeleteImg}/> {/*기본 프로필 컴퍼넌트*/}
                                <hr></hr>
                                <SlideImg profileData={profileData} refresh={refresh}/>
                              </div>
                              <hr></hr>
                                <InterestList profileData={profileData}/>
                              <hr></hr>
                              <div className="row">
                                <div className="col-lg-12 col-md-12">
                                  <div className="billing-info">
                                    <label>자기 소개</label>
                                    <input type="text" 
                                    name="introduce"
                                    onChange={handleInputChange}
                                    value={formData.introduce}
                                    placeholder="자기소개를 입력해주세요"/>
                                  </div>
                                  <div className="billing-back-btn">
                                    <div className="billing-btn">
                                      <button type="submit" onClick={handleSubmit}>Update</button>
                                    </div>
                                  </div>
                                </div>
                              
                                <div className="col-lg-12 col-md-12">
                                  <div className="billing-info">
                                    <label>프로필 사진</label>
                                    <input type="file"
                                    name="mainProfileImage"
                                    onChange={handleFileChange}
                                   />
                                  </div>
                                  <div className="billing-back-btn">
                                    <div className="billing-btn">
                                      <button type="submit" onClick={handleMainSubmit}>Update</button>
                                    </div>
                                  </div>
                                </div>
                              
                                <div className="col-lg-12 col-md-12">
                                  <div className="billing-info">
                                    <label>사진목록 추가</label>
                                    <input type="file" 
                                    name="detailImage"
                                    onChange={handleFileChange}
                                    />
                                  </div>
                                  <div className="billing-back-btn">
                                    <div className="billing-btn">
                                      <button type="submit" onClick={handleSubSubmit}>Update</button>
                                    </div>
                                  </div>
                                </div>

                            </div>
                            <hr></hr>
                            <label>관심사</label>
                            <Select
                                isMulti
                                name="interestCategory"
                                options={interestOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={handleInterestChange}
                                value={interestOptions.filter(option => formData.interestCategory.includes(option.label))}
                              />
                              <div className="billing-back-btn">
                                  <div className="billing-btn">
                                    <button type="submit" onClick={handleSubmit}>Update</button>
                                  </div>
                             </div>
                            
                          </div>
                      </Accordion.Body>
                    </Accordion.Item>


                    <Accordion.Item eventKey="1" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                          <span>2 .</span> 개인정보 수정
                      </Accordion.Header>
                      <Accordion.Body>
                          <div className="myaccount-info-wrapper">

                            <ProfileDetail profileData={profileData}/>
                              <hr></hr>

                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                  <div className="billing-info">
                                    <label>주소</label>
                                    <input type="text" 
                                    name="address"
                                    onChange={handleInputChange}
                                    value={formData.address}
                                    placeholder="주소를 입력해주세요"/>
                                  </div>
                                  <div className="billing-back-btn">
                                    <div className="billing-btn">
                                      <button type="submit" onClick={handleSubmit}>Update</button>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-lg-12 col-md-12">
                                  <div className="billing-info">
                                    <label>전화번호</label>
                                    <input type="text" 
                                    name="phone"
                                    onChange={handleInputChange}
                                    value={formData.phone}
                                    placeholder="전화번호를 입력해주세요"/>
                                  </div>
                                  <div className="billing-back-btn">
                                    <div className="billing-btn">
                                      <button type="submit" onClick={handleSubmit}>Update</button>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-lg-12 col-md-12">
                                  <div className="billing-info">
                                    <label>이메일</label>
                                    <input type="text" 
                                    name="email"
                                    onChange={handleInputChange}
                                    value={formData.email}
                                    placeholder="이메일을 입력해주세요"/>
                                  </div>
                                  <div className="billing-back-btn">
                                    <div className="billing-btn">
                                      <button type="submit" onClick={handleSubmit}>Update</button>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-lg-12 col-md-12">
                                  <div className="billing-info">
                                    <label>닉네임</label>
                                    <input type="text" 
                                    name="nickName"
                                    onChange={handleInputChange}
                                    value={formData.nickName}
                                    placeholder="닉네임을 입력해주세요"/>
                                  </div>
                                  <div className="billing-back-btn">
                                    <div className="billing-btn">
                                      <button type="submit" onClick={handleSubmit}>Update</button>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-lg-6 col-md-6">
                                  <div className="billing-info">
                                    <label>새 비밀번호</label>
                                    <input type="password" 
                                    name="userPwd"
                                    onChange={handlePasswordChange}
                                    value={passwoardData.userPwd}
                                    placeholder="비밀번호를 입력해주세요"/>
                                  </div>
                                  
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="billing-info">
                                    <label>비밀번호 확인</label>
                                    <input type="password" 
                                    name="userPwdCheck"
                                    onChange={handlePasswordChange}
                                    value={passwoardData.userPwdCheck}
                                    placeholder="비밀번호가 일치해야 합니다"/>
                                  </div>
                                  
                                </div>
                                <div className="billing-back-btn">
                                    <div className="billing-btn">
                                      <button type="submit" onClick={handlePasswordSubmit}>Update</button>
                                    </div>
                                </div>
                            </div>
   
                          </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    
                    <Accordion.Item eventKey="2" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                          <span>3 .</span> 결제 내역
                      </Accordion.Header>
                      <Accordion.Body>

                          {profileData.purchaseHistory.map((item, index) => (
                            <div className="purchase-item" key={index}>
                              <div>
                                  <strong>구매 젤리:</strong> {item.jellyAmount}개
                              </div>
                              <div>
                                  <strong>구매 금액:</strong> {item.amount} 원
                              </div>
                              <div>
                                  <strong>구매 일자:</strong> {item.transactionDate}
                              </div>
                              <input type="hidden" value={item.transactionSeq} name="transactionSeq"/>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="refund-button"
                                onClick={() => openRefundModal(item.transactionSeq)}
                              >
                                환불 요청
                              </Button>
                            </div>
                          ))} 

                           {/* 환불 요청 팝업 모달 */}
                            <Modal show={showRefundModal} onHide={() => setShowRefundModal(false)}>
                              <Modal.Header closeButton>
                                <Modal.Title>환불 요청</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <Form.Group controlId="refundReason">
                                  <Form.Label>환불 이유</Form.Label>
                                  <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                  />
                                </Form.Group>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowRefundModal(false)}>
                                  닫기
                                </Button>
                                <Button variant="primary" onClick={handleRefundRequest}>
                                  요청하기
                                </Button>
                              </Modal.Footer>
                            </Modal>


                      </Accordion.Body>
                      </Accordion.Item>
            
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default MyProfile;
