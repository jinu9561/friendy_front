import React, { Fragment, useState } from "react";
import axios from "axios";
import ICON from "../../assets/img/profile-img/남자1.png";
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
        <h4 className="blog-dec-title">
          comments : {replies.length.toString().padStart(2, "0")}
        </h4>
        {replies.map((reply, index) => {
          const nickName = isAnonymousBoard ? "익명" : reply.nickName;
          const profileImg = isAnonymousBoard ? "" : ICON;

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
              <div style={{ display: "flex" }}>
                {profileImg && (
                  <img
                    src={profileImg}
                    alt="profileImage"
                    style={{ width: "100px", height: "100px", marginRight: "10px" }}
                  />
                )}
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
          <h4 className="blog-dec-title">댓글을 입력하세요.</h4>
          <form className="blog-form" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <div className="text-leave">
                  <textarea
                    placeholder="Message"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    style={{ height: "100px" }}
                  />
                  <input type="submit" value="SEND MESSAGE" />
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
