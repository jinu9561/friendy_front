import React, { Fragment } from "react";
import SEO from "../../components/seo";
import LayoutTwo from "../../layouts/LayoutTwo";
import FeatureIconFour from "../../wrappers/feature-icon/FeatureIconFour";
import SliderBanner from "../../wrappers/slider-banner/SliderBanner";
import TabProductFour from "../../wrappers/product/TabProductFour";
import CtaOne from "../../wrappers/cta/CtaOne";
import BlogFeatured from "../../wrappers/blog-featured/BlogFeatured";
import BrandLogoSliderTwo from "../../wrappers/brand-logo/BrandLogoSliderTwo";
import PlaceRecommendSlider from "../../wrappers/place/PlaceRecommendSlider";

const HomeBookStore = () => {
  return (
    <Fragment>
      <SEO
        titleTemplate="Book Store Home"
        description="Book Store Home of flone react minimalist eCommerce template."
      />
        <LayoutTwo>
            {/* slider banner */}
            <SliderBanner/>
            {/* feature icon */}
            <FeatureIconFour
                spaceBottomClass="pb-70"
                containerClass="container"
                responsiveClass="res-mrg-md-mt"
            />
            {/* 소모임 추천 */}
            <TabProductFour category="book" productTabClass="product-tab-pink2"/>
            <br></br>
            <br></br>
            <BrandLogoSliderTwo/>
            {/* 장소 추천 */}
            <PlaceRecommendSlider
                spaceTopClass="pt-100"
                spaceBottomClass="pb-95"
                category="book"
                limit={6}
            />
            {/* brand logo slider */}


        </LayoutTwo>
    </Fragment>
  );
};

export default HomeBookStore;
