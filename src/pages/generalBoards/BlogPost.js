import axios from "axios";
import React, { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";

//상세 글보기 안에 상세글내용에 관한 컴포넌트
const BlogPost = ({ post, commBoardSeq }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/update-post/${commBoardSeq}`); // UpdatePost 페이지로 이동
  };

  const handleDelete = async () => {
    if (window.confirm("삭제하시겠습니까?")) {
      // 사용자에게 삭제 확인 요청
      try {
        await axios.delete(
          `http://localhost:9000/community-boards/${commBoardSeq}`
        );
        alert("게시글이 성공적으로 삭제되었습니다.");
        navigate("/public-board"); // 게시글 삭제 후 게시판으로 이동
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
    <Fragment>
      <div className="blog-details-top">
        <div className="blog-details-content">
          <div className="blog-meta-2">
            <ul>
              <li>
                {new Date(post.boardRegDate).toLocaleDateString(
                  "ko-KR",
                  options
                )}
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
                  {post.replyList.length} <i className="fa fa-comments-o" />
                </Link>
              </li>
            </ul>
          </div>
          <h3>{post.boardTitle}</h3>
          <p>{post.boardContent}</p>
        </div>
      </div>
      <div className="dec-img-wrapper">
        <div className="row">
          <div className="col-md-6">
            <div className="dec-img mb-50"></div>
          </div>
          <div className="col-md-6">
            <div className="dec-img mb-50"></div>
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
          style={{
            backgroundColor: "#ff6289",
            opacity: 0.8,
            border: "none",
            marginLeft: "3px",
          }}
          className="btn btn-primary"
          onClick={handleDelete}
        >
          삭제
        </button>
      </div>
      <div className="tag-share">
        <div className="dec-tag">
          <ul>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                lifestyle ,
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                interior ,
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                outdoor
              </Link>
            </li>
          </ul>
        </div>
        <div className="blog-share">
          <span>share :</span>
          <div className="share-social">
            <ul>
              <li>
                <a className="facebook" href="#!">
                  <i className="fa fa-facebook" />
                </a>
              </li>
              <li>
                <a className="twitter" href="#!">
                  <i className="fa fa-twitter" />
                </a>
              </li>
              <li>
                <a className="instagram" href="#!">
                  <i className="fa fa-instagram" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="next-previous-post">
        <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
          {" "}
          <i className="fa fa-angle-left" /> prev post
        </Link>
        <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
          next post <i className="fa fa-angle-right" />
        </Link>
      </div>
    </Fragment>
  );
};

export default BlogPost;
