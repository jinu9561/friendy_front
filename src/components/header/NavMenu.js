import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { LogingedContext } from "../../App";
import { useContext } from "react";

const NavMenu = ({ menuWhiteClass, sidebarMenu }) => {
  const { t } = useTranslation();


  let logingedCon =useContext(LogingedContext);
  
  return (
    <div
      className={clsx(
        sidebarMenu
          ? "sidebar-menu"
          : `main-menu ${menuWhiteClass ? menuWhiteClass : ""}`
      )}
    >
      <nav>
      <ul>
        {!logingedCon.isAdminIn ? (
          // 사용자 내비게이션
          <>
             <li>
            <Link to={process.env.PUBLIC_URL + "/"}>{t("Home")}</Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/blog-no-sidebar"}>
              {t("자유 게시판")}
            </Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/blog-no-sidebar"}>
              {t("익명 게시판")}
            </Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/photo-board"}>
              {t("사진 게시판")}
            </Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/MeetUpBoard"}>
              {t("소모임 게시판")}
            </Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/event"}>
              {t("이벤트 게시판")}
            </Link>
          </li>
          </>
        ) : (
          // 관리자 내비게이션
          <>
            <li>
              <Link to={process.env.PUBLIC_URL + "/adminUser"}>회원 관리</Link>
            </li>
           
          </>
        )}
      </ul>
      </nav>
    </div>
  );
};

NavMenu.propTypes = {
  menuWhiteClass: PropTypes.string,
  sidebarMenu: PropTypes.bool,
};

export default NavMenu;
