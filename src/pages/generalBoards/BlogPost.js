import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ICON from "../../assets/img/profile-img/여자1.png";
import "./BlogPosts.css";
import SendReport from "../../components/report/SendReport";

// 상세 글보기 안에 상세글 내용에 관한 컴포넌트
const BlogPost = ({ post, commBoardSeq }) => {
  const navigate = useNavigate();
  const location = useLocation(); // useLocation 훅을 사용하여 location 객체를 가져옴
  const { pathname } = useLocation();
  const [showReportModal, setShowReportModal] = useState(false); //신고버튼에서 사용

  const handleEdit = () => {
    navigate(`${location.pathname}/update`, { state: { post } });
  };

  // location.pathname을 사용하여 경로를 올바르게 확인
  const isAnonymousBoard = location.pathname.includes("/anonymous-board");

  const nickName = isAnonymousBoard ? "익명" : post.nickName;
  const profileImg = isAnonymousBoard ? "" : ICON;

  const handleDelete = async () => {
    if (window.confirm("삭제하시겠습니까?")) {
      try {
        await axios.delete(
          `http://localhost:9000/community-boards/${commBoardSeq}`
        );
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

          <h1>{post.boardTitle}</h1>
          <span style={{float:"right"}}>{post.replyList.length} <i className="fa fa-comments-o" /></span>
          <div>
          <span style={{ marginRight: "15px" }}>
            {new Date(post.boardRegDate).toLocaleDateString("ko-KR", options)}
          </span>
          <span>조회 수 : {post.commBoardCount}</span>
          </div>

          <p style={{ marginTop: "10px" }}>{post.boardContent}</p>
        </div>
      </div>
      <div className="dec-img-wrapper">
        <div className="row">
          <div className="col-md-6">
            <div className="dec-img mb-50"></div>
          </div>
          <div className="col-md-6">
            <div
              className="blog-meta-2"
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <div
                className="blog-comment-content"
                style={{ display: "flex", alignItems: "center" }}
              >
                <h4 style={{ marginRight: "10px" }}>{nickName}</h4>
                  {/*신고버튼*/}
                  <button onClick={() => setShowReportModal(true)}
                          style={{
                              display: 'inline-block',
                              padding: '8px 15px',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              textAlign: 'center',
                              whiteSpace: 'nowrap',
                              verticalAlign: 'middle',
                              backgroundColor: '#e0e0e0',
                              color: '#858585',
                              border: 'none',
                              borderRadius: '0.3rem',
                              cursor: 'pointer',
                          }}>
                      신고
                  </button>
                  {showReportModal && (
                      <SendReport
                          commBoardSeq={commBoardSeq}
                          postUserSeq={post.userSeq}
                          onReportSent={() => setShowReportModal(false)}
                      />
                  )}
                {!isAnonymousBoard && ( // 익명 게시판이 아닐 때만 이미지 렌더링
                  <div className="blog-comment-img">
                    <img src={profileImg} alt="profileImage" style={{ width: "60px" }} />
                  </div>
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "10px",
              }}
            >
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
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
