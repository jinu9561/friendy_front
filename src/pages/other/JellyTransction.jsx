import React, { Fragment } from "react";
import { Link, useLocation } from "react-router-dom"; 
import Tab from "react-bootstrap/Tab";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useState,useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import * as PortOne from "@portone/browser-sdk/v2";
import '../../assets/css/JellyTransction.css';
import jellyIconData from '../../data/jelly-transction/jelly-data.json'
import axios from "axios";


const JellyTransction = () => {
  let { pathname } = useLocation();

  const navigator = useNavigate();

  const [userSeq, setUserSeq] = useState(localStorage.getItem('userSeq'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const [formData, setFormData] = useState({
    amount:'',
    jellyAmount: "",
    address:"",
    phone:"",
    email:"",
    userName:""
  });

  // IMP 객체 초기화
  useEffect(() => {
    if (window.IMP) {
      window.IMP.init("imp16740845"); // "imp00000000"를 실제 상점 코드로 교체하세요.
    }
  }, []);

  function requestPay(params) {
    return new Promise((resolve, reject) => {
      window.IMP.request_pay(params, function (rsp) {
        if (rsp.success) {
          resolve(rsp); // 결제 성공 시 resolve
        } else {
          reject(rsp); // 결제 실패 시 reject
        }
      });
    });
  }


  useEffect(() => {
  
    axios.get("http://localhost:9000/profile/"+userSeq,
    {
      headers :  {Authorization: localStorage.getItem("Authorization")},
    })
      .then((response) => {
        setFormData(response.data);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.title === undefined) {
          alert("로그아웃 후 다시 로그인해 주세요");
      } else {
          alert(err.response.data.title);
      }
      });

  },[userSeq]);

  const handleKakaoPayment = async (e) => {
    e.preventDefault();

    const {name, innerText} = e.target;
    
    try {
      const response = await PortOne.requestPayment({
        storeId: "store-01ad41c5-219f-4b19-be47-c7fff337bd5a",
        channelKey: 'channel-key-05881fe3-11b9-4fdc-8d56-436237b10722',
        paymentId: `payment-${crypto.randomUUID()}`,
        orderName: "Friendy Jelly 구매",
        totalAmount: formData.amount,
        currency: "CURRENCY_KRW",
        payMethod: "EASY_PAY",
      });

      if (response.code != null) {
        // 오류 발생
        return alert(response.message);
      }

      const notified = await fetch(`http://localhost:9000/jelly/`+userSeq, {
        method: "POST",
        headers: { "Content-Type": "application/json" ,
          "Authorization": localStorage.getItem("Authorization"),
        },
        // paymentId와 주문 정보를 서버에 전달합니다
        body: JSON.stringify({
          impUid: response.imp_uid, // 포트원 결제 고유 ID
          merchantUid: response.merchant_uid, // 가맹점 고유 결제 ID
          userId: userId, // 사용자 ID
          amount: formData.amount,
          jellyAmount: formData.jellyAmount, // 결제 금액
          transactionType : "CHAGE"
        }),
      });

      if (notified.ok) {
        alert('결제가 완료되었습니다. 젤리가 지급되었습니다.');
        navigator("/");
      } else {
        alert('결제는 완료되었으나 젤리 지급에 실패했습니다.');
      }
    } catch (error) {
      console.error('결제 오류', error);
      alert('결제가 취소되었습니다.');
    }
  };

  const handlePaykoPayment = async (e)=>{
   
    e.preventDefault();

    try {
      const response = await requestPay({
        pg: 'payco',
        merchant_uid: `order_no_${new Date().getTime()}`, // 유니크한 주문 번호 생성
        name: "Friendy Jelly 구매",
        amount: formData.amount,
        pay_method: "card",
        buyer_email: formData.email,
        buyer_name: formData.userName,
        buyer_tel: formData.phone,
        buyer_addr: formData.address,
      });
  
      // 결제 완료 후 서버로 결제 정보 전달
      const notified = await fetch(`http://localhost:9000/jelly/` + userSeq, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("Authorization"),
        },
        body: JSON.stringify({
          impUid: response.imp_uid, // PortOne 결제 고유 ID
          merchantUid: response.merchant_uid, // 상점 고유 결제 ID
          userId: userId, // 사용자 ID
          amount: formData.amount,
          jellyAmount: formData.jellyAmount, // 결제 금액
          transactionType: "CHAGE"
        }),
      });
  
      if (notified.ok) {
        alert('결제가 완료되었습니다. 젤리가 지급되었습니다.');
        navigator("/");
      } else {
        alert('결제는 완료되었으나 젤리 지급에 실패했습니다.');
      }
    } catch (error) {
      console.error('결제 오류', error);
      alert('결제가 취소되었습니다.');
    }
  };

  const handleTossPayment = (e)=>{

    e.preventDefault();

    const IMP = window.IMP; // 생략 가능
    IMP.init("imp16740845"); // Example: imp00000000
    IMP.request_pay(
      {
        pg: 'tosspay',
        pay_method: "card",
        merchant_uid: `order_no_${new Date().getTime()}`, // 상점에서 생성한 고유 주문번호
        name: "Friendy Jelly 구매", // 필수 파라미터 입니다.
        amount: formData.amount,
        buyer_email: formData.email,
        buyer_name: formData.userName,
        buyer_tel: formData.phone,
        buyer_addr: formData.address
      }, function (rsp) {
        if (rsp.success) {
          // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
          // jQuery로 HTTP 요청
          axios({
            url: "http://localhost:9000/jelly/"+userSeq, 
            method: "POST",
            headers: { "Content-Type": "application/json" ,
              "Authorization": localStorage.getItem("Authorization")
            },
            data: {
              imp_uid: rsp.imp_uid,            // 결제 고유번호
              merchant_uid: rsp.merchant_uid,   // 주문번호
              userId: userId, // 사용자 ID
              amount: formData.amount,
              jellyAmount: formData.jellyAmount, // 결제 금액
              transactionType: "CHAGE"
            }
          }).done(function (data) {
            // 가맹점 서버 결제 API 성공시 로직
          })
        } else {
          alert("결제에 실패하였습니다. 에러 내용: " + rsp.error_msg);
        }
      });

  };


  const handleCheckboxChange = (e) => {
    const { value } = e.target;

    const selectedOption = jellyIconData.find(option => option.value === value);

    if (selectedOption) {
      setFormData({
        amount: selectedOption.amount,
        jellyAmount: selectedOption.jellyAmount
      });
    }
    console.log(formData)

  };
 

  return (
    <Fragment>
      <SEO
        titleTemplate="젤리 결제"
        description="젤리를 결제합시다."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Jelly Payment", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ms-auto me-auto">
                <div className="login-register-wrapper">
                  <div className="login-form-container">
                    <div className="login-register-form">
                      <form>
                        <div className="row">
                          {jellyIconData.map((single, key) => (
                            <div className="col-lg-4 col-md-6 col-sm-6" key={key}>
                              <label
                                className="radio-card"
                                style={{ backgroundImage: single.backgroundImage }}
                              >
                                <input
                                  type="radio"
                                  name="amount"
                                  value={single.value}
                                  onChange={handleCheckboxChange}
                                />
                                <div className="radio-card-content" style={{position: 'relative'}}>
                                    <img
                                        src={single.iconImage}
                                        alt="icon"
                                        className="icon"
                                        style={{objectFit: 'cover', position:'relative'}} // Ensure aspect ratio is maintained
                                    />
                                    {single.label}
                                  </div>
                              </label>
                            </div>
                            ))}
                        </div>
                        <div className="button-box">
                          <button type="button" onClick={handleKakaoPayment}>
                            <span>카카오 결제</span>
                          </button>
                          {"  "}
                          <button type="button" onClick={handlePaykoPayment}>
                            <span>페이코 결제</span>
                          </button>
                          {"  "}
                          <button type="button" onClick={handleTossPayment}>
                            <span>토스 결제</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </LayoutOne>
    </Fragment>
  );
};

export default JellyTransction;
