import PropTypes from "prop-types";
import clsx from "clsx";
import {Link} from "react-router-dom";

const PictureBanner = ({ data, spaceBottomClass }) => {


    return (
        <div className={clsx("single-banner", spaceBottomClass)} >
            <Link to={process.env.PUBLIC_URL + data.link}>
                <img src={process.env.PUBLIC_URL + data.image} alt="" />
            </Link>
            <div className="banner-content banner-content--style2">
                <h3 style={{ color: data.titleColor }}>{data.title}</h3>
                <h4>{data.subtitle}</h4>
                <Link to={process.env.PUBLIC_URL + data.link}>
                    <i className="fa fa-long-arrow-right" />
                </Link>
            </div>
        </div>
    );
};

PictureBanner.propTypes = {
    data: PropTypes.shape({}),
    spaceBottomClass: PropTypes.string
};

export default PictureBanner;
