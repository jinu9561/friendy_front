import axios from "axios";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ICON from '../../assets/img/profile-img/여자1.png'

// 상세 글보기 안에 상세글 내용에 관한 컴포넌트
const BlogPost = ({ post, commBoardSeq }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleEdit = () => {
    navigate(`${pathname}/update`, { state: { post } });
  };

  const handleDelete = async () => {
    if (window.confirm("삭제하시겠습니까?")) {
      try {
        await axios.delete(`http://localhost:9000/community-boards/${commBoardSeq}`);
        alert("게시글이 성공적으로 삭제되었습니다.");
        navigate("/public-board");
      } catch (error) {
        alert("게시글 삭제에 실패했습니다.");
      }
    }
  };

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return (
    <>
      <div className="blog-details-top">
        <div className="blog-details-content">
          <div className="blog-meta-2" style={{ justifyContent: "end" }}>
            <div className="blog-comment-content">
              <h4>{post.nickName}</h4>
              
            </div>
            <div className="blog-comment-img">
              <img
                src={ICON}
                alt=""
                style={{ width: "60px", marginLeft: "5px" }}
              />
            </div>

            
          </div>
          <h1>{post.boardTitle}</h1><span><Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
              {post.replyList.length} <i className="fa fa-comments-o" />
            </Link></span>
            <span>
                {new Date(post.boardRegDate).toLocaleDateString(
                  "ko-KR",
                  options
                )}
              </span>
          <p>{post.boardContent}</p>
        </div>
      </div>
      <div className="dec-img-wrapper">
        <div className="row">
          <div className="col-md-6">
            <div className="dec-img mb-50"></div>
          </div>
          <div className="col-md-6">
            
            <div className="blog-meta-2" style={{ justifyContent: "end" }}>
            <div className="blog-comment-content" style={{ justifyContent: "end" }}>
            <h4>{post.nickName}</h4>
              
            
            <div className="blog-comment-img">
              <img
                src={ICON}
                alt=""
                style={{ width: "60px", marginLeft: "5px" }}
              />
            </div>

            
          </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end">
     
          
        <button
          type="button"
          className="btn btn-secondary mr-2"
          onClick={handleEdit}
        >
          수정
        </button>
        <button
          type="button"
          style={{ backgroundColor: "#ff6289", opacity: 0.8, border: "none", marginLeft: "3px" }}
          className="btn btn-primary"
          onClick={handleDelete}
        >
          삭제
        </button>
      </div>
      <div className="tag-share">{/* 태그 추가 필요 */}</div>
      <div className="next-previous-post">
        <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
          <i className="fa fa-angle-left" /> prev post
        </Link>
        <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
          next post <i className="fa fa-angle-right" />
        </Link>
      </div>
    </>
  );
};

export default BlogPost;
