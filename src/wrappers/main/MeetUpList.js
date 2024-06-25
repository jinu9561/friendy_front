
import {Fragment, useEffect, useState} from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getProducts } from "../../helpers/product";
import MainMeetup from "../../components/main/MainMeetup";
import axios from "axios";
import defaultProfileImage from "../../assets/img/prof/default.jpeg";

const MeetUpList = ({
  spaceBottomClass,
  colorClass,
  titlePriceClass,
  category,
  type,
  limit
}) => {
  const { products } = useSelector((state) => state.product);
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);
  const prods = getProducts(products, category, type, limit);

  const [meetUpList,setMeetUpList] = useState([]);


  useEffect(() => {
    let userId = localStorage.getItem('userId');

    axios({
      method:"POST",
      url : "http://localhost:9000/main/meetup/",
      data: {
        userId: userId ? userId : "",
      },
      headers: {
        "Content-Type": "application/json"
      }
    })
        .then((res) => {
          console.log(res.data);
          setMeetUpList(res.data);
        })
        .catch((err)=>{
          console.log(err)
          console.log(err.response.data.title);
        });


  },[]);

  const getImg = (main,imgName) => {

    if (main) {

      return imgName ? "http://localhost:9000/main/meetup/main/img?imgName=" + imgName : defaultProfileImage;
    }

    return imgName ? "http://localhost:9000/main/meetup/detail/img?imgName=" + imgName : defaultProfileImage;
  }

  return (
    <Fragment>
      {meetUpList?.map((meetUp) => {
        return (
          <div className="col-xl-3 col-md-6 col-lg-4 col-sm-6" key={meetUp.meetUpSeq}>
            <MainMeetup
              spaceBottomClass={spaceBottomClass}
              colorClass={colorClass}
              meetUp={meetUp}
              currency={currency}
              getImg={getImg}
              titlePriceClass={titlePriceClass}
            />
          </div>
        );
      })}
    </Fragment>
  );
};

MeetUpList.propTypes = {
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  titlePriceClass: PropTypes.string,
  category: PropTypes.string,
  type: PropTypes.string,
  limit: PropTypes.number
};

export default MeetUpList;
