import { useState } from "react";
import { Link } from "react-router-dom";

const BlogSidebar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');

  // 검색 버튼 클릭 핸들러
  const handleSearch = async (e) => {
    e.preventDefault();
    onSearch(keyword);
  };
  return (
   <div className="sidebar-style">
      <div className="sidebar-widget">
        <h4 className="pro-sidebar-title">Search</h4>
        <div className="pro-sidebar-search mb-55 mt-25">
          <form className="pro-sidebar-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search here..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit">
              <i className="pe-7s-search" />
            </button>
          </form>
        </div>
      </div>
      
    

      <div className="sidebar-widget mt-50">
        <h4 className="pro-sidebar-title">Tag </h4>
        <div className="sidebar-widget-tag mt-25">
          <ul>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>운동</Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>동물</Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>인형</Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>스터디</Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>맛집</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;
