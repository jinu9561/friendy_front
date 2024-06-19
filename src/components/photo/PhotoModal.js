import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap"; // react-bootstrap의 Modal 컴포넌트를 사용한 예시입니다.

const PhotoModal = ({ show, onHide, photo }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{photo.photoBoardTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img
          src={process.env.PUBLIC_URL + photo.photoImgSrc}
          alt={photo.photoBoardTitle}
        />
        <p>등록일: {new Date(photo.photoBoardRegDate).toLocaleDateString()}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

PhotoModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  photo: PropTypes.shape({
    photoBoardTitle: PropTypes.string.isRequired,
    photoImgSrc: PropTypes.string.isRequired,
    photoBoardRegDate: PropTypes.string.isRequired,
  }).isRequired,
};

export default PhotoModal;
