import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import picture_banner from "../../assets/img/banner/pictureBanner.png"

const MeetupBanner = ({ data, spaceBottomClass }) => {
  return (
      <div className={clsx("single-banner", spaceBottomClass)}>

          <img src={picture_banner} alt="" />

        <div className="banner-content banner-pink">
          <h3 style={{ color: "white" }}>Picture</h3>
          <h4>
            <span></span>
          </h4>
          <Link to="/photo-board">
            <i className="fa fa-long-arrow-right" />
          </Link>
        </div>
      </div>
  );
};

MeetupBanner.propTypes = {
  data: PropTypes.shape({}),
  spaceBottomClass: PropTypes.string
};

export default MeetupBanner;
