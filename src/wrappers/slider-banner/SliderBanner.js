
import BannerEight from "../banner/BannerEight";
import HeroSliderSeven from "../hero-slider/HeroSliderSeven";
import EventBanner from "../event/EventBanner";
import MainPictureBanner from "../main-banner/MainPictureBanner";

const SliderBanner = () => {
  return (
    <div className="slider-banner-area">
      <div className="container">
        <div className="row flex-row-reverse">
          <div className="col-lg-8 col-md-12">
            {/* 이벤트 배너 */}
            <EventBanner />
          </div>
          {/* banner */}
          <MainPictureBanner />
        </div>
      </div>
    </div>
  );
};

export default SliderBanner;
