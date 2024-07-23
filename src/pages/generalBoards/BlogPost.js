import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import defaultProfileImage from '../../assets/img/prof/default.jpeg';
import "./BlogPosts.css";
import SendReport from "../../components/report/SendReport";

// 상세 글보기 안에 상세글 내용에 관한 컴포넌트
const BlogPost = ({ post, commBoardSeq }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showReportModal, setShowReportModal] = useState(false);
    const [likes, setLikes] = useState(0); // 초기값을 0으로 설정
    const [hasLiked, setHasLiked] = useState(false); // Track if the user has liked the post
    const [hasDisliked, setHasDisliked] = useState(false); // Track if the user has disliked the post
    // const token = localStorage.getItem("Authorization"); // Retrieve token from localStorage
    const userSeq = localStorage.getItem("userSeq"); // Retrieve userSeq from localStorage

    useEffect(() => {
        if (post.boardLike !== undefined) {
            setLikes(post.boardLike);
        }
    }, [post.boardLike]);

    const handleEdit = () => {
        navigate(`${location.pathname}/update`, { state: { post } });
    };

    const getProfileImg = (imgName, profileMainApprove) => {
        if (profileMainApprove === "APPROVED") {
            return "http://localhost:9000/profile/main/img?imgName=" + imgName;
        }
        return defaultProfileImage;
    };

    const isAnonymousBoard = location.pathname.includes("/anonymous-board");

    const nickName = isAnonymousBoard ? "익명" : post.nickName;
    const profileImg = isAnonymousBoard ? "" : getProfileImg(post.profileMainImgName, post.profileMainApprove);

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

    const handleLike = (commBoardSeq, userSeq) => {
        axios({
            url: `http://localhost:9000/community-boards/${commBoardSeq}/like`,
            method: "post",
            headers: {
                Authorization: localStorage.getItem("Authorization"),
            },
            params: {
                // commBoardSeq: commBoardSeq,
                userSeq: userSeq,
            },
        })
            .then(response => {
                if (response.status === 200) {
                    setLikes(likes + 1); // 좋아요 수 증가
                    setHasLiked(true); // 좋아요 상태 업데이트
                    setHasDisliked(false); // 싫어요 상태 해제
                } else {
                    alert("이미 좋아요 또는 싫어요를 누른 게시물입니다.");
                }
            })
            .catch(error => {
                console.error("좋아요 실패:", error);
                alert("이미 좋아요 또는 싫어요를 누른 게시물입니다.");
            });
    };

    const handleDislike = (commBoardSeq, userSeq) => {
        axios({
            url: `http://localhost:9000/community-boards/${commBoardSeq}/dislike`,
            method: "post",
            headers: {
                Authorization: localStorage.getItem("Authorization"),
            },
            params: {
                // commBoardSeq: commBoardSeq,
                userSeq: userSeq,
            },
        })
            .then(response => {
                if (response.status === 200) {
                    setLikes(likes - 1); // 좋아요 수 감소
                    setHasLiked(false); // 좋아요 상태 해제
                    setHasDisliked(true); // 싫어요 상태 업데이트
                } else {
                    alert("이미 좋아요 또는 싫어요를 누른 게시물입니다.");
                }
            })
            .catch(error => {
                console.error("싫어요 실패:", error);
                alert("이미 좋아요 또는 싫어요를 누른 게시물입니다.");
            });
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
                    <span style={{ float: "right", fontSize: "1.3em" }}>
                        {post.replyList.length} <i className="fa fa-comments-o" style={{ fontSize: "1.3em" }} />&nbsp;
                        {likes-3} <i className="fa fa-thumbs-up" style={{ fontSize: "1.3em" }} />
                    </span>
                    <div>
                        <span style={{ marginRight: "15px" }}>
                            {new Date(post.boardRegDate).toLocaleDateString("ko-KR", options)}
                        </span>
                        <span>조회 수 : {post.commBoardCount}</span>
                    </div>
                    <p style={{ marginTop: "10px", fontSize: "20px" }}>{post.boardContent}</p>
                </div>
            </div>
            <div className="dec-img-wrapper">
                <div className="row">
                    <div className="col-md-6">
                        <div className="dec-img mb-50"></div>
                    </div>
                    <div className="col-md-6">
                        <div className="blog-meta-2" style={{ display: "flex", justifyContent: "flex-end" }}>
                            <div className="blog-comment-content" style={{ display: "flex", alignItems: "center" }}>
                                {!isAnonymousBoard && (
                                    <div className="blog-comment-img" style={{ marginLeft: "10px" }}>
                                        <img
                                            src={profileImg}
                                            alt="profileImage"
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                objectFit: "cover"
                                            }}
                                        />
                                    </div>
                                )}
                                &nbsp;&nbsp;
                                <h4 style={{ marginRight: "10px" }}>{nickName}</h4>
                                <button
                                    onClick={() => setShowReportModal(true)}
                                    style={{
                                        display: "inline-block",
                                        padding: "8px 15px",
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                        verticalAlign: "middle",
                                        backgroundColor: "#e0e0e0",
                                        color: "#858585",
                                        border: "none",
                                        borderRadius: "0.3rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    신고
                                </button>
                                {showReportModal && (
                                    <SendReport
                                        commBoardSeq={commBoardSeq}
                                        postUserSeq={post.userSeq}
                                        onReportSent={() => setShowReportModal(false)}
                                    />
                                )}
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
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
                <div className="row">
                    <div className="col-md-12 d-flex justify-content-center align-items-center">
                        <button onClick={() => handleLike(commBoardSeq, userSeq)} className="btn btn-success"
                                style={{marginRight: "20px", backgroundColor: "#9AB1FF", borderColor: "#9AB1FF"}}
                                disabled={hasLiked || hasDisliked}>
                            좋아요
                        </button>

                        <span style={{fontSize: "1.5em", color: likes < 0 ? 'red' : 'blue'}}>
                            {likes - 3}
                        </span>

                        <button onClick={() => handleDislike(commBoardSeq, userSeq)} className="btn btn-danger"
                                style={{marginLeft: "20px", backgroundColor: "#FF917A", borderColor: "#FF917A"}}
                                disabled={hasLiked || hasDisliked}>
                            싫어요
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogPost;
