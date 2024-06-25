import React, { Fragment, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import Select from "react-select";
import '../../assets/css/photoUpload.css'

function PhotoUpload({ show, onHide, handleUpdate }) {
  const [formData, setFormData] = useState({
    photoBoardPwd: '',
    photoBoardTitle: '',
    interestCategory: []
  });
  const [mainSaveImage, setMainSaveImage] = useState(null);
  const [detailSaveImage, setDetailSaveImage] = useState(null);
  const [interestOptions, setInterestOptions] = useState([]);
  const [userSeq, setUserSeq] = useState(localStorage.getItem("userSeq"));
  const [isDetail, setIsDetail] = useState(false);
  const [curPhotoData, setCurPhotoData] = useState({
    msg:"",
    photoBoardSeq:"",
  });

  useEffect(() => {
    axios.get("http://localhost:9000/interest/", {
      headers: { Authorization: localStorage.getItem("Authorization") },
    })
        .then((res) => {
          const options = res.data.map(interest => ({
            value: interest.interestSeq,
            label: interest.interestCategory
          }));
          setInterestOptions(options);
        })
        .catch((err) => {
          console.error("Error fetching interests:", err);
        });

    setIsDetail(false);
  }, []);

  const handleInterestChange = (selectedOptions) => {
    const interests = selectedOptions ? selectedOptions.map(option => option.label) : [];
    setFormData({
      ...formData,
      interestCategory: interests
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "photoMainImg") {
      setMainSaveImage(files[0]);
    } else {
      setDetailSaveImage(files[0]);
    }
  };

  const handleSave = () => {
    let errorMessage = "";

    if (formData.interestCategory.length === 0) {
      errorMessage = "관심사를 등록해 주세요.";
    } else if (!formData.photoBoardTitle) {
      errorMessage = "제목을 등록해 주세요.";
    } else if (!mainSaveImage) {
      errorMessage = "사진을 등록해 주세요.";
    }

    if (errorMessage !== "") {
      alert(errorMessage);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("interestCategory", formData.interestCategory);
    formDataToSend.append("photoBoardTitle", formData.photoBoardTitle);
    formDataToSend.append("photoBoardPwd", formData.photoBoardPwd);
    formDataToSend.append("userSeq", userSeq);
    formDataToSend.append("file", mainSaveImage);

    axios({
      method: "POST",
      url: `http://localhost:9000/photo/`,
      data: formDataToSend,
      headers: {
        Authorization: localStorage.getItem("Authorization"),
      }
    })
        .then((res) => {
          console.log(res.data)
          alert(res.data.msg);
          setCurPhotoData(res.data);
          const isCheck = window.confirm("사진을 추가 등록 하시겠습니까?");
          setIsDetail(isCheck);
          handleUpdate();
        })
        .catch((err) => {
          alert(err.response?.data?.title || "오류가 발생했습니다. 다시 시도해 주세요.");
        });
  };

  const handleDetailSave = () => {
    let errorMessage = "";

    if (!detailSaveImage) {
      errorMessage = "사진을 등록해 주세요.";
    }
    if (errorMessage !== "") {
      alert(errorMessage);
      return;
    }
    console.log(curPhotoData);
    const formDataToSend = new FormData();
    formDataToSend.append("file", detailSaveImage);

    axios({
      method: "POST",
      url: `http://localhost:9000/photo/detail/${curPhotoData.photoBoardSeq}`,
      data: formDataToSend,
      headers: {
        Authorization: localStorage.getItem("Authorization"),
      }
    })
        .then((res) => {
          alert(res.data);
          const isCheck = window.confirm("사진을 추가 등록 하시겠습니까?");
          setIsDetail(isCheck);
          handleUpdate();
        })
        .catch((err) => {
          console.log(curPhotoData.photoBoard);
          alert(err.response?.data?.title || "오류가 발생했습니다. 다시 시도해 주세요.");
        });
  };

  useEffect(() => {
    if (show) {
      resetForm();
    }
  }, [show]);

  const resetForm = () => {
    setFormData({
      photoBoardPwd: '',
      photoBoardTitle: '',
      interestCategory: []
    });
    setMainSaveImage(null);
  };

  return (
      <Modal show={show} onHide={onHide} className="photo-upload-modal">
        <Modal.Header closeButton />
        <div className="modal-body">
          <div className="form-group">
            {!isDetail ? (
                <>
                  <label className="label-title">Title</label>
                  <input
                      type="text"
                      name="photoBoardTitle"
                      value={formData.photoBoardTitle}
                      onChange={handleChange}
                      className="form-control"
                  />
                  <div className="image-upload-container">
                    <h4>Main Image</h4>
                    <input
                        type="file"
                        name="photoMainImg"
                        onChange={handleFileChange}
                        className="form-control"
                    />
                  </div>
                  <div className="select-container">
                    <Select
                        isMulti
                        name="interestCategory"
                        options={interestOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleInterestChange}
                        value={interestOptions.filter(option => formData.interestCategory.includes(option.label))}
                    />
                  </div>
                  <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSave}
                  >
                    Register Photo
                  </button>
                  <button
                      type="button"
                      className="btn btn-danger"
                      onClick={onHide}
                  >
                    Back
                  </button>
                </>
            ) : (
                <>
                  <div className="image-upload-container">
                    <h4>Detail Image</h4>
                    <input
                        type="file"
                        name="photoDetailImg"
                        onChange={handleFileChange}
                        className="form-control"
                    />
                  </div>
                  <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleDetailSave}
                  >
                    Register Photo
                  </button>
                  <button
                      type="button"
                      className="btn btn-danger"
                      onClick={onHide}
                  >
                    Back
                  </button>
                </>
            )}
          </div>
        </div>
      </Modal>
  );
}

PhotoUpload.propTypes = {
  handleUpdate: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired
};

export default PhotoUpload;