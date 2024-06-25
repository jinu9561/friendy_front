import PropTypes from "prop-types";
import clsx from "clsx";
import {useNavigate} from "react-router-dom";

const FeatureIconFourSingle = ({ data, spaceBottomClass }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (data.id === 3) {
      // 스크롤할 대상 요소를 가져옵니다.
      const targetElement = document.getElementById("scroll-target");

      if (targetElement) {
        // 스크롤을 부드럽게 수행합니다.
        targetElement.scrollIntoView({ behavior: "smooth" });
      } else {
        console.error("Scroll target element not found");
      }
    } else {
      // 페이지 이동을 수행합니다.
      if (data.link) {
        navigate(process.env.PUBLIC_URL + data.link);
      }
    }
  };

  return (
      <div
        className={clsx("support-wrap-3 text-center", spaceBottomClass)}
        style={{ backgroundColor: `${data.backgroundColor}` }}
        onClick={handleClick}
      >
        <div className="support-icon-2">
          <img
            className="animated"
            src={process.env.PUBLIC_URL + data.iconImage}
            alt=""
          />
        </div>
        <div className="support-content-3">
          <img src={process.env.PUBLIC_URL + data.titleImage} alt="" />
          <p>{data.title}</p>
        </div>
      </div>
  );
};

FeatureIconFourSingle.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    link: PropTypes.string,
    titleImage: PropTypes.string,
    iconImage: PropTypes.string,
    backgroundColor: PropTypes.string,
    title: PropTypes.string
  }),
  spaceBottomClass: PropTypes.string
};

export default FeatureIconFourSingle;
