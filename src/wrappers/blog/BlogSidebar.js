import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import './BlogSidebar.css'; // 스타일 파일을 임포트합니다.

const BlogSidebar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [topLikedPosts, setTopLikedPosts] = useState([]);
  const location = useLocation();

  const detailPath = location.pathname.includes("/anonymous-board")
      ? "/anonymous-board/"
      : "/public-board/";

  // 검색 버튼 클릭 핸들러
  const handleSearch = async (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  useEffect(() => {
    const fetchTopLikedPosts = async () => {
      try {
        const response = await axios.get("http://localhost:9000/community-boards");
        const filteredPosts = response.data.filter(post =>
            detailPath.includes("anonymous-board") ? post.boardType === 1 : post.boardType === 0
        );
        const sortedPosts = filteredPosts
            .sort((a, b) => b.boardLike - a.boardLike)
            .slice(0, 10);
        setTopLikedPosts(sortedPosts);
      } catch (error) {
        console.error("좋아요 많은 게시글을 불러오는 중 오류 발생:", error);
      }
    };

    fetchTopLikedPosts();
  }, [detailPath]);

  const truncateContent = (content, limit) => {
    if (content.length > limit) {
      return content.substring(0, limit) + "...";
    }
    return content;
  };

  return (
      <div className="sidebar-style">
        <div className="sidebar-widget search-widget">
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

        <div className="sidebar-widget popular-posts-widget mt-50">
          <hr/><h4 className="pro-sidebar-title" style={{fontWeight: "bolder"}}>인기 게시물</h4><hr/>
          {topLikedPosts.length > 0 ? (
              <div className="recent-post">
                {topLikedPosts.map((post, index) => (
                    <div key={post.commBoardSeq} className="recent-single-post styled-post">
                      <div className="recent-post-content">
                        <div className="post-info">
                          <span style={{width: "25px", fontSize: "15px", fontWeight: "bold"}}>{index + 1}. </span>
                          <Link className="post-title" to={detailPath + post.commBoardSeq}>
                            {truncateContent(post.boardTitle, 20)}
                          </Link>
                          <span className="post-likes">
                            <i className="fa fa-thumbs-up post-likes-icon"/>
                            <span className="post-likes-count">
                              {post.boardLike - 3}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          ) : (
              <p>좋아요 많은 게시글이 없습니다.</p>
          )}
        </div>
      </div>
  );
};

export default BlogSidebar;
