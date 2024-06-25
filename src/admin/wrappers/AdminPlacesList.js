import clsx from "clsx";
import PlaceList from "./PlaceList";
import PropTypes from "prop-types";


const AdminPlacesList = ({ places, layout , getStatus ,status,handleUpdate }) => {
  return (
    <div className="shop-bottom-area mt-35">
      <div className={clsx("row", layout)}>
          <PlaceList places={places} spaceBottomClass="mb-25" getStatus={getStatus} status={status} handleUpdate={handleUpdate} />
      </div>
    </div>
  );
};

AdminPlacesList.propTypes = {
    handleUpdate: PropTypes.func,
};
export default AdminPlacesList;
