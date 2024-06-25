import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SectionTitleThree from "../../components/section-title/SectionTitleThree";
import MeetUpList from "../main/MeetUpList";

const TabProductFour = ({ spaceBottomClass, category, productTabClass }) => {
  return (
    <div className={clsx("product-area", spaceBottomClass)}>
      <div className="container">
        <SectionTitleThree
          titleText="MEETUP"
          positionClass="text-center"
        />
        <Tab.Container defaultActiveKey="bestSeller">
          <Nav
            variant="pills"
            className={clsx("product-tab-list pt-35 pb-60 text-center", productTabClass)}
          >
            <Nav.Item>
              <Nav.Link eventKey="bestSeller">
                <h4>Friendy Recommend</h4>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="bestSeller">
              <div className="row">
                <MeetUpList
                  category={category}
                  type="bestSeller"
                  limit={8}
                  spaceBottomClass="mb-25"
                />
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        <div className="view-more text-center mt-20 toggle-btn6 col-12">
          <Link
            className="loadMore6"
            to={process.env.PUBLIC_URL + "/MeetUpBoard"}
          >
            더 많은 소모임 보러가기
          </Link>
        </div>
      </div>
    </div>
  );
};

TabProductFour.propTypes = {
  category: PropTypes.string,
  spaceBottomClass: PropTypes.string
};

export default TabProductFour;
