import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import Profile from "../components/Profile";

const ProfileList = ({
  profileDataList,
  spaceBottomClass
}) => {
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);
  console.log(profileDataList);
  
  return (
    <Fragment>
      {profileDataList.map(profileData => {
        return (
          <div className="col-xl-4 col-sm-6" key={profileData.userSeq}>
            <Profile
              spaceBottomClass={spaceBottomClass}
              profileData={profileData}
              currency={currency}
            />
          </div>
        );
      })}
    </Fragment>
  );
};

export default ProfileList;
