import PropTypes from "prop-types";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { getDiscountPrice } from "../../helpers/product";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";
import { addToCompare } from "../../store/slices/compare-slice";
import ProductRating from "../../components/product/sub-components/ProductRating";
import ProductModal from "../../components/product/ProductModal";
import defaultProfileImage from '../../assets/img/prof/default.jpeg';
import axios from "axios";

const Profile = ({
  profileData,
  currency,
  spaceBottomClass
}) => {
  const [modalShow, setModalShow] = useState(false);
  const [profileDetailList,setProfileDetailList] = useState([]);

  console.log(profileData);

  //상세이미지 데이터 받아 오기
  useEffect(()=>{

    // 상세 이미지
    axios.get("http://localhost:9000/admin/users/profile/detail/"+profileData.userSeq,
        {
          headers :  {Authorization: sessionStorage.getItem("Authorization")},
        })
          .then((response) => {
            // 날짜순으로 정렬
            //const sortedPurchaseHistory = [...response.data.purchaseHistory].sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
            //setProfileData({ ...response.data, purchaseHistory: sortedPurchaseHistory });
            setProfileDetailList(response.data);
            console.log(profileDetailList);
          })
          .catch((err) => {
            if (err.response && err.response.data && err.response.data.title === undefined) {
              alert("로그아웃 후 다시 로그인해 주세요");
          } else {
              alert(err.response.data.title);
          }
          });
        

},[profileData.userSeq])

  const getImg = (main,imgName) => {

    if(main){
      
      return  imgName ? "http://localhost:9000/profile/main/img?imgName="  + imgName : defaultProfileImage ;
    }

    return  imgName ? "http://localhost:9000/profile/detail/img?imgName=" + imgName : defaultProfileImage ;
  };

  return (
    <Fragment>
        <div className={clsx("product-wrap", spaceBottomClass)}>
          <div className="product-img">
            <Link to={process.env.PUBLIC_URL + "/product/" + profileData.userSeq}>
              <img
                className="default-img"
                src={getImg(true,profileData.profileMainImgName)}
                alt=""
              />
              {profileDetailList.length > 0 ? (
                <img
                  className="hover-img"
                  src={getImg(false,profileDetailList[0].profileDetailImgName)}
                  alt=""
                />
              ) : (
                ""
              )}
            </Link>
            <div className="product-action">
             
              <div className="pro-same-action pro-quickview">
                <button onClick={() => setModalShow(true)} title="Quick View">
                  <i className="pe-7s-look" />
                </button>
              </div>
            </div>
          </div>
        </div>
          {/* 이미지 밑에 내용*/}
              <div className="shop-list-content">
                <h3>
                  <Link to={process.env.PUBLIC_URL + "/product/" + profileData.userSeq}>
                    {profileData.userName}
                  </Link>
                </h3>         
                {profileData.userRate && profileData.userRate > 0 ? (
                  <div className="rating-review">
                    <div className="product-list-rating">
                      <ProductRating ratingValue={profileData.userRate} />
                    </div>
                  </div>
                ) : (
                  ""
                )}
            
              </div>
          
        
      {/* 프로필 상세보기 */}
      {/* <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        currency={currency}
        discountedPrice={discountedPrice}
        finalProductPrice={finalProductPrice}
        finalDiscountedPrice={finalDiscountedPrice}
        wishlistItem={wishlistItem}
        compareItem={compareItem}
      /> */}
    </Fragment>
  );
};



export default Profile;
