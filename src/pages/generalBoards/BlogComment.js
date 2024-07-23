import React, { Fragment, useState } from "react";
import axios from "axios";
import defaultProfileImage from '../../assets/img/prof/default.jpeg';
import { useLocation } from "react-router-dom";

const BlogComment = ({ replyList, commBoardSeq }) => {
  const [replyContent, setReplyContent] = useState("");
  const [replies, setReplies] = useState(replyList);
  const location = useLocation(); // useLocation 훅을 사용하여 location 객체를 가져옴
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  };

  const isAnonymousBoard = location.pathname.includes("/anonymous-board");

  // getProfileImg 함수를 컴포넌트 내부에서 정의합니다.
  const getProfileImg = (imgName, profileMainApprove) => {
    if (profileMainApprove === "APPROVED") {
      return "http://localhost:9000/profile/main/img?imgName=" + imgName;
    }
    return defaultProfileImage;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userSeq = localStorage.getItem("userSeq");

    const replyDTO = {
      userSeq: userSeq,
      replyContent: replyContent,
    };

    try {
      const response = await axios.post(
          `http://localhost:9000/community-boards/${commBoardSeq}/replies`,
          replyDTO
      );

      // 새 댓글을 기존 댓글 목록에 추가
      setReplies([...replies, response.data]);
      setReplyContent(""); // 입력 필드를 초기화
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleDelete = async (replySeq) => {
    if (window.confirm("삭제하시겠습니까?")) {
      try {
        await axios.delete(
            `http://localhost:9000/community-boards/${commBoardSeq}/replies/${replySeq}`
        );

        // 댓글을 성공적으로 삭제한 후, UI에서 해당 댓글을 제거
        setReplies(replies.filter((reply) => reply.replySeq !== replySeq));
      } catch (error) {
        console.error("Error deleting reply:", error);
      }
    }
  };

  return (
      <Fragment>
        <div className="blog-comment-wrapper mt-55">
          <style>
            {`
              .comment-box {
                border: 1px solid #d3d3d3; /* 연한 회색 테두리 */
                background-color: transparent; /* 배경색 없음 */
                border-radius: 8px; /* 둥근 모서리 */
                padding: 20px; /* 내부 여백 */
                display: block; /* 블록 요소로 설정 */
                width: 100%; /* 너비를 100%로 설정 */
                box-sizing: border-box; /* 패딩과 테두리를 너비에 포함 */=
              }
            `}
          </style>
          <h4 className="blog-dec-title comment-box">
            댓글 {replies.length}개
          </h4><br/>
          {replies.map((reply, index) => {
            const nickName = isAnonymousBoard ? "익명" : reply.nickName;
            const profileImg = isAnonymousBoard ? "" : getProfileImg(reply.profileMainImgName, reply.profileMainApprove);

            return (
                <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: "10px 0px",
                    }}
                >
                  <div style={{display: "flex"}}>
                    {profileImg && (
                        <img
                            src={profileImg}
                            alt="profileImage"
                            style={{
                              width: "80px",
                              height: "80px",
                              marginRight: "10px",
                              borderRadius: "50%",
                              objectFit: "cover"
                            }}
                        />
                    )} &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="blog-comment-content">
                      <h4>{nickName}</h4>
                      <span>
                    {new Date(reply.replyRegDate).toLocaleString("ko-KR", options)}
                  </span>
                      <p>{reply.replyContent}</p>
                    </div>
                  </div>
                  <button
                      type="button"
                      style={{
                        backgroundColor: "#ff6289",
                        opacity: 0.8,
                        border: "none",
                        marginLeft: "3px",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDelete(reply.replySeq)}
                  >
                    삭제
                  </button>
                </div>
            );
          })}
          <div className="blog-reply-wrapper mt-50">
            <hr/>
            <br/>
            <h4 className="blog-dec-title">댓글 작성</h4>
            <form className="blog-form" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-12">
                  <div className="text-leave">
                  <textarea
                      placeholder="댓글을 입력해주세요"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      style={{height: "100px"}}
                  />
                    <input type="submit" value="댓글 입력" style={{fontSize: "15px", fontWeight: "550"}}/>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Fragment>
  );
};

export default BlogComment;
