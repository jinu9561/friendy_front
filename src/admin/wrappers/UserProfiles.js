import PropTypes from "prop-types";
import clsx from "clsx";
import ProfileList from "./ProfileList";

const UserProfiles = ({ profileDataList, layout }) => {
  return (
    <div className="shop-bottom-area mt-35">
      <div className={clsx("row", layout)}>
        <ProfileList profileDataList={profileDataList} spaceBottomClass="mb-25" />
      </div>
    </div>
  );
};

export default UserProfiles;
