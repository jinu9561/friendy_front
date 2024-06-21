import clsx from "clsx";
import PlaceList from "./PlaceList";


const AdminPlacesList = ({ places, layout , getStatus ,status }) => {
  return (
    <div className="shop-bottom-area mt-35">
      <div className={clsx("row", layout)}>
        <PlaceList places={places}  spaceBottomClass="mb-25" getStatus={getStatus} status={status}/>
      </div>
    </div>
  );
};

export default AdminPlacesList;
