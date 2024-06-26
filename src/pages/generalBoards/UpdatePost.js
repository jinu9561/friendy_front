import React, { Fragment, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { Modal } from "react-bootstrap";
import './BlogPosts.css';
const UpdatePost = () => {
  const location = useLocation();
  const { post } = location.state;
  const [content, setContent] = useState(post.boardContent);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userSeq = localStorage.getItem("userSeq");

    const communityBoardDTO = {
      userSeq: userSeq,
      boardTitle: post.boardTitle,
      boardContent: content,
      boardType: post.boardType,
      boardLike: post.boardLike,
      boardPwd: post.boardPwd,
    };

    if (window.confirm("수정 완료 하시겠습니까?")){
      try {
        await axios.put(
          `http://localhost:9000/community-boards/${post.commBoardSeq}`,
          communityBoardDTO
        );
        setModalMessage("게시물이 성공적으로 수정되었습니다!");
        setShowModal(true);
        navigate(-1); // 수정 후 이전 페이지로 이동
      } catch (error) {
        setModalMessage("게시물 수정에 실패하였습니다. 다시 시도해주세요.");
        setShowModal(true);
      }
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };
  
  const closeModal = () => setShowModal(false);

  return (
    <Fragment>
      {showModal && <Modal message={modalMessage} onClose={closeModal} />}
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            {
              label: post.boardType === 1 ? "Anonymous Board" : "Public Board",
              path: process.env.PUBLIC_URL + (post.boardType === 1 ? "/anonymous-board" : "/public-board"),
            },
            {
              label: "Update",
              path: process.env.PUBLIC_URL + (post.boardType === 1 ? "/anonymous-board/update" : "/public-board/update"),
            },
          ]}
        />
        <div className="blog-area pt-100 pb-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-9">
                <div className="blog-details-wrapper ml-20">
                  <h4 className="blog-dec-title">게시물 수정</h4>
                  <form className="blog-form" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="text-leave">
                          <input
                            type="text"
                            placeholder="Title"
                            value={post.boardTitle}
                            className="form-control mb-3"
                            readOnly
                            style={{ backgroundColor: "#f0f0f0" }}
                          />
                          <textarea
                            placeholder="Content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="form-control mb-3"
                            style={{ height: "200px" }}
                          />
                          <div className="d-flex justify-content-end">
                            <button
                              type="button"
                              className="btn btn-secondary mr-2"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              style={{
                                backgroundColor: "#ff6289",
                                opacity: 0.8,
                                border: "none",
                                marginLeft: "3px",
                              }}
                              className="btn btn-primary"
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default UpdatePost;
