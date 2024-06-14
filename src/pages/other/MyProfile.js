import { Fragment, useEffect, useState } from "react"; 
import { useLocation } from "react-router-dom"; 
import Accordion from "react-bootstrap/Accordion";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import axios from "axios";
import Select from 'react-select';
import defaultProfileImage from '../../assets/img/default.jpeg'; // 기본 이미지 경로

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
    profileDetailImgList:[],
    interestList:[]
  })

  const [userSeq, setUserSeq] = useState(localStorage.getItem('userSeq'));
  const [interestOptions, setInterestOptions] = useState([]);
  const [mainProfileImage, setMainProfileImage] = useState(null);
  const [detailImage, setDetailImage] = useState(null);

  const [formData, setFormData] = useState({
    introduce:"",
    interestCategory: []
  });

  useEffect(() => {
  
  
     
    axios.get("http://localhost:9000/profile/"+userSeq,
    {
      headers :  {Authorization: localStorage.getItem("Authorization")},
    })
      .then((response) => {
        setProfileData(response.data);
      })
      .catch((err) => {
        let errMessage = err.response.data.type + "\n" + 
        err.response.data.title + "\n" + 
        err.response.data.detail + "\n" + 
        err.response.data.status + "\n" + 
        err.response.data.instance + "\n" + 
        err.response.data.timestamp; 
        console.log(errMessage);
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
      let errMessage = err.response.data.type + "\n" + 
      err.response.data.title + "\n" + 
      err.response.data.detail + "\n" + 
      err.response.data.status + "\n" + 
      err.response.data.instance + "\n" + 
      err.response.data.timestamp; 
      console.log(errMessage);
    });

  },[userSeq]);

  const handleInterestChange = (selectedOptions) => {
    const interests = selectedOptions ? selectedOptions.map(option => option.label) : [];
    console.log(selectedOptions)
    setFormData({
      ...formData,
      interestCategory: interests
    });
    console.log(profileData);
  };

  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
    console.log(formData);
  };

  const handleSubmit = (e) => {
    const { name, value } = e.target
    console.log(name)

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
        interestCategory: []
      });
    
    })
    .catch((err)=>{ console.log(err) 
        let errMessage = err.response.data.type +"\n"; 
        errMessage += err.response.data.title +"\n"; 
        errMessage += err.response.data.detail +"\n"; 
        errMessage += err.response.data.status +"\n"; 
        errMessage += err.response.data.instance +"\n"; 
        
        errMessage += err.response.data.timestamp; 
        alert(errMessage); 
    });
  };

  const handleFileChange = (e) => {

    const { name, files } = e.target;
    console.log(files)

    if (name === "mainProfileImage") {
      setMainProfileImage(files[0]);
    } else if (name === "detailImage") {
      setDetailImage(files[0]);
    }
    console.log(mainProfileImage)
    console.log(detailImage)
  };

  const handleMainSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("mainProfileImage", mainProfileImage);

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

        let errMessage = err.response.data.type +"\n"; 
        errMessage += err.response.data.title +"\n"; 
        errMessage += err.response.data.detail +"\n"; 
        errMessage += err.response.data.status +"\n"; 
        errMessage += err.response.data.instance +"\n"; 
        
        errMessage += err.response.data.timestamp; 
        alert(errMessage); 
    });
  };

  const handleSubSubmit = (e) => {
    e.preventDefault();

    const { name, value } = e.target

    const formDataToSend = new FormData();
    formDataToSend.append("detailImage", detailImage);

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

        let errMessage = err.response.data.type +"\n"; 
        errMessage += err.response.data.title +"\n"; 
        errMessage += err.response.data.detail +"\n"; 
        errMessage += err.response.data.status +"\n"; 
        errMessage += err.response.data.instance +"\n"; 
        
        errMessage += err.response.data.timestamp; 
        alert(errMessage); 
    });
  };

  const getMainImg = (imgName) => {
    return imgName ? "http://localhost:9000/profile/main/img?imgName="+imgName : defaultProfileImage;
  };
  const getDetailImg = (imgName) =>{
    return imgName ? "http://localhost:9000/profile/detail/img?imgName="+imgName : defaultProfileImage;
  };



  return (
    <Fragment>
      <SEO
        titleTemplate="My Account"
        description="My Account page of flone react minimalist eCommerce template."
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
                                <img src={getMainImg(profileData.profileMainImgName)} alt="Profile" sizes="100px 100px" />
                                  <p><strong>이름 :</strong> {profileData.userName}</p>
                                  <p><strong>닉네임 :</strong> {profileData.nickName}</p>
                                  <p><strong>국적 :</strong> {profileData.country}</p>
                                  <p><strong>성별 :</strong> {profileData.gender}</p>
                                  <p><strong>보유 젤리 :</strong> {profileData.userJelly} 개</p>
                                  <p><strong>자기소개 :</strong> {profileData.introduce}</p>
                                  <hr></hr>
                                  <ul>
                                    {profileData.profileDetailImgList.map((proFileDetailImgDTO, index) => (
                                      <li key={proFileDetailImgDTO.profileDetailImgSeq}>
                                        <img src={getDetailImg(proFileDetailImgDTO.profileDetailImgName)} alt={`Detail ${index}`} />
                                      </li>
                                    ))}
                                  </ul>
                                  <hr></hr>
                                  <ul>
                                    {profileData.interestList.map((interestDTO, index) => (
                                      <li key={interestDTO.interestSeq}><strong>{interestDTO.interestCategory}</strong></li>
                                    ))}
                                  </ul>
                            </div>
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
                                  onChange={handleFileChange} />
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
                                  onChange={handleFileChange}/>
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
                            <div className="account-info-wrapper">
                              <h4>Change Password</h4>
                              <h5>Your Password</h5>
                            </div>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Password</label>
                                  <input type="password" />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Password Confirm</label>
                                  <input type="password" />
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="submit">Continue</button>
                              </div>
                            </div>
                          </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                          <span>3 .</span> 젤리 결제
                      </Accordion.Header>
                      <Accordion.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>Address Book Entries</h4>
                            </div>
                            <div className="entries-wrapper">
                              <div className="row">
                                <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                  <div className="entries-info text-center">
                                    <p>John Doe</p>
                                    <p>Paul Park </p>
                                    <p>Lorem ipsum dolor set amet</p>
                                    <p>NYC</p>
                                    <p>New York</p>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                  <div className="entries-edit-delete text-center">
                                    <button className="edit">Edit</button>
                                    <button>Delete</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="submit">Continue</button>
                              </div>
                            </div>
                          </div>
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
