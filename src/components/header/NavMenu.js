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
            <Link to={process.env.PUBLIC_URL + "/"}>{("Home")}</Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/blog-no-sidebar"}>
              {("COMMUNITY")}
            </Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/blog-no-sidebar"}>
              {("ANONYMOUS")}
            </Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/photo-board"}>
              {("PHOTO")}
            </Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/MeetUpBoard"}>
              {("MEETUP")}
            </Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/event"}>
              {("EVENT")}
            </Link>
          </li>
          </>
        ) : (
          // 관리자 내비게이션
            <>
                <li>
                    <Link to={process.env.PUBLIC_URL + "/adminUser"}>회원 관리</Link>
                </li>
                <li>
                    <Link to={process.env.PUBLIC_URL + "/adminPlace"}>Hot Place</Link>
                </li>

                <li>
                    <Link to={process.env.PUBLIC_URL + "/adminEvent"}>ADMIN EVENT</Link>
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
