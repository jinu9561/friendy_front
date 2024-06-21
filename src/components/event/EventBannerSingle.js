import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import defaultProfileImage from "../../assets/img/prof/default.jpeg";

const getMainImg = (imgName) => {
  return imgName ? `http://localhost:9000/admin/event/main/img?imgName=${imgName}` : defaultProfileImage;
};

const EventBannerSingle = ({ data }) => {

  return (
      <Link to="/event">
    <div
      className="single-slider-2 slider-height-18 d-flex align-items-center slider-overly-res bg-cover"
      style={{
        backgroundImage: `url(${getMainImg(data .eventMainImgName)})`
      }}
    >

      <div className="slider-content-7 slider-animated-1 ml-70"
           style={{ transform: 'translateY(150px)' }}
      >

        {/*<div className="slider-btn-9 btn-hover">*/}
        {/*  <Link className="animated" to="/event">*/}
        {/*    Go To Event*/}
        {/*  </Link>*/}
        {/*</div>*/}
      </div>
    </div>
      </Link>
  );
};

EventBannerSingle.propTypes = {
  data: PropTypes.shape({
    eventSeq: PropTypes.number.isRequired,
    eventName: PropTypes.string.isRequired,
    eventDescription: PropTypes.string,
    eventMainImgName: PropTypes.string,
  }).isRequired,
};

export default EventBannerSingle;
