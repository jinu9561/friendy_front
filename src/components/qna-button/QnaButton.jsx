import React from 'react';
import '../../assets/css/qna-button.css';
import chatbotBtn from '../../assets/img/button/chatbotBtn.png'
import {useQnaVisibility} from "./QnaVisibilityContext";

const QnaButton = () => {

    // const { isVisible } = useQnaVisibility();

  const handleClick = () => {
    window.open('http://pf.kakao.com/_SxkLcG/chat', '_blank')
  }

    // if (!isVisible) {
    //     return null;
    // }

  return (
    <button className="qna-button" onClick={handleClick}>
      <img
        src={chatbotBtn}
        alt="카카오톡 상담하기"
        style={{ width: '100%', height: '100%' }}
      />
    </button>
  )
};

export default QnaButton;