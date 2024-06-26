import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import clsx from "clsx";
import MenuCart from "./sub-components/MenuCart";
import { LogingedContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import adminIcon from '../../assets/img/admin/admin-icon.png';
import './../../assets/css/icon.css';
import Notification from "../notification/Notification";
import FriendList from "../friend/FriendList";
import FriendRequestForm from "../friend/FriendRequestForm";




const IconGroup = ({ iconWhiteClass }) => {

  let logingedCon =useContext(LogingedContext);


  const navigator = useNavigate();

  const [saveData, setSaveData] = useState({
    userId : "",
    userSeq : ""
  });

  const [friendList, setFriendList] = useState([]); // 친구
  const [showFriendList, setShowFriendList] = useState(false); // 친구
  const [showFriendRequestForm, setShowFriendRequestForm] = useState(false);
  const [receiverId, setReceiverId] = useState(''); // 친구 요청 ID 상태 추가
  const [message, setMessage] = useState(''); // 메시지 상태 추가

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserSeq = localStorage.getItem('userSeq');

    if (storedUserId) {
      setSaveData(prevFormData => ({
        ...prevFormData,
        userId: storedUserId
      }));
    }

    if (storedUserSeq) {
      setSaveData(prevFormData => ({
        ...prevFormData,
        userSeq: storedUserSeq
      }));
    }



  }, []);

  const toggleFriendListHandler = () => { // 친구 목록 불러오기
      setShowFriendList(!showFriendList);
  };

  const toggleFriendRequestFormHandler = () => {
      setShowFriendRequestForm(!showFriendRequestForm);
  };
  
  const logoutCheck = (e)=>{ 
      e.preventDefault();

      let formData = new FormData(); //폼전송으로 보내기위한 작업 
      let userId = sessionStorage.getItem("userId") !=null ? sessionStorage.getItem("userId") : localStorage.getItem('userId');
      formData.append("userId", userId);

    // 전송
    axios({ 
    method:"POST", 
    url : "http://localhost:9000/logout",
    data : formData
    }) 
     .then((res)=>{

        localStorage.removeItem("userId"); 
        localStorage.removeItem("country"); 
        localStorage.removeItem("gender"); 
        localStorage.removeItem("userName");
        localStorage.removeItem("userSeq"); 
        localStorage.removeItem("nickName"); 
        localStorage.removeItem("userJelly"); 
        localStorage.removeItem("Authorization");

       sessionStorage.removeItem("userId", res.data.userId);
       sessionStorage.removeItem("userName", res.data.userName);
       sessionStorage.removeItem("userSeq", res.data.userSeq);
       sessionStorage.removeItem("Authorization", res.headers.authorization);
      // 공유된 변수를 상태를 변경하면 이 컨텍스트를 사용하는 모든 컴포넌트가 상태변경을 감지하고 업데이트 된다!!
        logingedCon.onLoggedChange(false);
        logingedCon.onAdminInChange(false);
        navigator("/");
  
    }) 
    .catch((err)=>{
      console.log(err)
    });

       
 }

 const resign = () =>{

  const check = window.confirm("정말 회원 탈퇴하시겠습니까?");
  // 전송
  if(check){
    axios({ 
      method:"GET", 
      url : "http://localhost:9000/users/resign/"+saveData.userSeq,
      }) 
       .then((res)=>{
          alert(res.data);
  
          localStorage.removeItem("userId"); 
          localStorage.removeItem("userName");
          localStorage.removeItem("userSeq"); 
          localStorage.removeItem("Authorization");
          localStorage.removeItem("rememberedUserId");
          localStorage.removeItem("rememberedPassword");
        // 공유된 변수를 상태를 변경하면 이 컨텍스트를 사용하는 모든 컴포넌트가 상태변경을 감지하고 업데이트 된다!!
        logingedCon.onLoggedChange(false); 
  
        navigator("/");
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
    }
  }

  const handleClick = e => {
    e.currentTarget.nextSibling.classList.toggle("active");
  };

  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.add("active");
  };




  const { compareItems } = useSelector((state) => state.compare);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { cartItems } = useSelector((state) => state.cart);

  return (
    <div className={clsx("header-right-wrap", iconWhiteClass)} >

        {logingedCon.isLoggedIn && <Notification />}

        <div className="same-style header-search d-none d-lg-block">
        <button className="search-active" onClick={e => handleClick(e)}>
          <i className="pe-7s-search" />
        </button>
        <div className="search-content">
          <form action="#">
            <input type="text" placeholder="Search" />
            <button className="button-search">
              <i className="pe-7s-search" />
            </button>
          </form>
        </div>
      </div>
      <div className="same-style account-setting d-none d-lg-block">
        <button
          className="account-setting-active"
          onClick={e => handleClick(e)}
        >
          <i className="pe-7s-user-female" />
        </button>
        <div className="account-dropdown">
        <ul>
          {logingedCon.isAdminIn ? (
            // Admin 계정일 때
            <>
              <li>
                <Link to="#" onClick={logoutCheck} className="nav-link">로그아웃</Link>
              </li>
              {/* 필요한 관리자 전용 링크 추가 */}
            </>
          ) : (
            // 일반 사용자 계정일 때
            <>
              <li>
                {logingedCon.isLoggedIn ? (
                  <Link to="#" onClick={logoutCheck} className="nav-link">로그아웃</Link>
                ) : (
                  <Link to={process.env.PUBLIC_URL + "/login-register?tab=login"}>로그인</Link>
                )}
              </li>
              <li>
                {!logingedCon.isLoggedIn && (
                  <>
                    <Link to={process.env.PUBLIC_URL + "/login-register?tab=register"}>회원 가입</Link>
                    <Link to={process.env.PUBLIC_URL + "/emailVerification"}>회원 인증</Link>
                  </>
                )}
              </li>
              <li>
                {logingedCon.isLoggedIn && (
                  <>
                    <Link to={process.env.PUBLIC_URL + "/my-profile"}>프로필</Link>
                    <Link to="#" onClick={toggleFriendListHandler }>친구 목록</Link>
                    <Link to={process.env.PUBLIC_URL + "/smsVerification"}>본인 인증</Link>
                    <Link to={process.env.PUBLIC_URL + "/jellyTransction"}>젤리 구매</Link>
                    <Link to="#" onClick={resign}>회원 탈퇴</Link>
                  </>
                )}
              </li>

            {/* 친구요청 기능확인용 임시(채팅 완성되면 거기에 쓸거) */}
            <li>
                <FriendRequestForm
                    receiverId={receiverId}
                    closeForm={toggleFriendRequestFormHandler}
                />

            </li>
            <li>
              {message && <p>{message}</p>}
            </li>
            </>
          )}
        </ul>
        </div>
      </div>

      {/* 관리자 페이지로 가기*/}
      <div className="same-style cart-wrap d-none d-lg-block">
          { logingedCon.isAdminIn ? ( <Link className="icon-cart" to={process.env.PUBLIC_URL + "/"} onClick={logoutCheck}>
              <img src={adminIcon} alt="관리자아이콘"/>
          </Link>) : (
              <Link className="icon-cart" to={process.env.PUBLIC_URL + "/adminLogin"}>
                     <img src={adminIcon} alt="관리자아이콘"/>
             </Link>
              )

          }
      </div>
      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div>

        {showFriendList && ( // 친구목록 호출
            <FriendList
                showFriendList={showFriendList}
                toggleFriendListHandler={toggleFriendListHandler}
            />
        )}

    </div>
  );
};

IconGroup.propTypes = {
  iconWhiteClass: PropTypes.string,
};



export default IconGroup;
