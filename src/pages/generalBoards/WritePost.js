import React, { Fragment, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { Modal } from "react-bootstrap";
import './BlogPosts.css';

const WritePost = () => {
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const boardType = location.pathname.includes("/anonymous-board") ? 1 : 0;
  const boardPath = boardType === 1 ? "anonymous-board" : "public-board";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userSeq = localStorage.getItem("userSeq");

    const communityBoardDTO = {
      userSeq: userSeq,
      boardTitle: title,
      boardContent: content,
      boardType: boardType,
      boardLike: 3,
      boardPwd: 1234,
    };

    if (window.confirm("게시글을 등록 하시겠습니까?")) {
      try {
        const response = await axios.post(
            `http://localhost:9000/community-boards`,
            communityBoardDTO
        );
        setModalMessage("게시물이 성공적으로 등록되었습니다!");
        setShowModal(true);
        await addJelly(userSeq); // 젤리 추가 로직 호출
        navigate(`/${boardPath}`); // 제출 후 게시판 페이지로 이동
      } catch (error) {
        setModalMessage("게시물 등록에 실패하였습니다. 다시 시도해주세요.");
        setShowModal(true);
      }
    }
  };

  const addJelly = async (userSeq) => {
    try {
      const token = localStorage.getItem("Authorization");
      console.log(`Calling addJelly with userSeq: ${userSeq}`);
      console.log(`userSeq: ${userSeq}, token: ${token}`);
      const response = await axios.post(`http://localhost:9000/jelly/add/board/${userSeq}`, {
        jellyAmount: "2", // 예시로 젤리 2개 추가
        amount: "0",
        transactionType: "ADD" // 트랜잭션 타입
      }, {
        headers: {
          Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert(response.data);
    } catch (error) {
      console.error("젤리 획득 실패:", error);
    }
  };

  const handleCancel = () => {
    navigate("/public-board");
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
                  label: boardType === 1 ? "Anonymous Board" : "Public Board",
                  path: process.env.PUBLIC_URL + `/${boardPath}`,
                },
                {
                  label: "Write",
                  path: process.env.PUBLIC_URL + `/${boardPath}/write`,
                },
              ]}
          />
          <div className="blog-area pt-100 pb-100">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-9">
                  <div className="blog-details-wrapper ml-20">
                    <h4 className="blog-dec-title">새 글 작성</h4>
                    <form className="blog-form" onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="text-leave">
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="form-control mb-3"
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

export default WritePost;