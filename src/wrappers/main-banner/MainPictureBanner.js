import bannerData from "../../data/main-banner/friendy_banner.json";
import PictureBanner from "../../components/main-banner/PictureBanner";

const MainPictureBanner = () => {
  return (
    <div className="col-lg-4 col-md-12">
      <div className="row">
        {bannerData?.map((single, key) => (
          <div className="col-lg-12 col-md-6 col-sm-6" key={key}>
            <PictureBanner
              data={single}
              spaceBottomClass="mb-30"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPictureBanner;
