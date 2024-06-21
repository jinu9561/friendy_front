import clsx from "clsx";
import PlaceList from "./PlaceList";

<<<<<<< HEAD
const AdminPlacesList = ({ places, layout }) => {
  return (
    <div className="shop-bottom-area mt-35">
      <div className={clsx("row", layout)}>
        <PlaceList places={places} spaceBottomClass="mb-25" />
=======
const AdminPlacesList = ({ places, layout , getStatus ,status }) => {
  return (
    <div className="shop-bottom-area mt-35">
      <div className={clsx("row", layout)}>
        <PlaceList places={places}  spaceBottomClass="mb-25" getStatus={getStatus} status={status}/>
>>>>>>> 0a5eaa0e5ec1eb5db14f847738ee2bcf588612a0
      </div>
    </div>
  );
};

export default AdminPlacesList;
