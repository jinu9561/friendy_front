import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogSidebar from "../../wrappers/blog/BlogSidebar";

const WritePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // 서버에 새 글을 제출하는 로직 추가

    // 성공적으로 제출 후 게시판 페이지로 이동
    navigate("/public-board");
  };

  const handleCancel = () => {
    navigate("/public-board");
  };

  return (
    <Fragment>
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Public-board", path: process.env.PUBLIC_URL + "/public-board" },
            { label: "Write", path: process.env.PUBLIC_URL + "/public-board/write" },
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
                          />
                          <div className="d-flex justify-content-end">
                            <button type="button" className="btn btn-secondary mr-2" onClick={handleCancel}>
                              Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-lg-3">
                {/* blog sidebar */}
                <BlogSidebar />
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default WritePost;
