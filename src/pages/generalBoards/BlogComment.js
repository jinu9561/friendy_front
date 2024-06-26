import React, { Fragment, useState } from "react";
import axios from "axios";

const BlogComment = ({ replyList, commBoardSeq }) => {
  const [replyContent, setReplyContent] = useState("");
  const [replies, setReplies] = useState(replyList);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
        <h4 className="blog-dec-title">
          comments : {replies.length.toString().padStart(2, "0")}
        </h4>
        {replies.map((reply, index) => (
          <div
            className="single-comment-wrapper mt-35"
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="blog-comment-img">
                <img
                  src={
                    process.env.PUBLIC_URL +
                    `/assets/img/blog/comment-${index + 1}.jpg`
                  }
                  alt=""
                />
              </div>
              <div className="blog-comment-content">
                <h4>{reply.nickName}</h4>
                <span>
                  {new Date(reply.replyRegDate).toLocaleDateString(
                    "ko-KR",
                    options
                  )}
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
        ))}
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
