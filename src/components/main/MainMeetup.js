
import PropTypes from "prop-types";
import {Fragment, useContext, useState} from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";
import { addToCompare } from "../../store/slices/compare-slice";
import meetupIcon from '../../assets/img/meetup/meetup-icon.png';
import placeIcon from "../../assets/img/place/place-icon.png";
import '../../assets/css/MainMeetup.css';
import {LogingedContext} from "../../App";

const MainMeetup = ({
                      meetUp,
                      currency,
                      cartItem,
                      wishlistItem,
                      compareItem,
                      spaceBottomClass,
                      colorClass,
                      titlePriceClass,
                      getImg
                    }) => {
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();

  // 클릭 이벤트!!
    let logingedCon =useContext(LogingedContext);

    const handleRegisterClick = () => {
        if (logingedCon.isLoggedIn) {
            setModalShow(true);
        } else {
            alert("로그인 후 이용해주세요!");
        }
    };

  return (
      <Fragment>
          <div className={clsx("product-wrap-2", spaceBottomClass, colorClass)}>
              <div className="meetup-img">
                  <Link to="#" onClick={handleRegisterClick}>
                      <img
                          className="default-img"
                          src={getImg(true, meetUp.meetUpDetailImgName[0])}
                          alt=""
                      />
                      {meetUp.meetUpDetailImgName.length > 1 ? (
                          <img
                              className="hover-img"
                              src={getImg(true, meetUp.meetUpDetailImgName[1])}
                              alt=""
                          />
                      ) : (
                          ""
                      )}
                  </Link>
                  <button onClick={handleRegisterClick} title="Quick View">
                      <img src={meetupIcon} alt="Quick View" className="meetup-icon"/>
                  </button>
              </div>
              <div className="meet-up">
                  <h3>
                      <Link to="#" onClick={handleRegisterClick}>
                          {meetUp.meetUpName}
                      </Link>
                  </h3>
              </div>
          </div>
      </Fragment>
  );
};

MainMeetup.propTypes = {
  cartItem: PropTypes.shape({}),
  compareItem: PropTypes.shape({}),
  wishlistItem: PropTypes.shape({}),
  currency: PropTypes.shape({}),
  meetUp: PropTypes.shape({
    id: PropTypes.number,
    meetUpName: PropTypes.string,
    meetUpDetailImgName: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  titlePriceClass: PropTypes.string,
  getImg: PropTypes.func.isRequired
};

export default MainMeetup;