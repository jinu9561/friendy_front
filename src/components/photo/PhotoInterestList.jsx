import React from 'react';

const PhotoInterestList = ({ photoData }) => {
    return (
        <div>
            <ul className="interest-categories">
                {photoData.interestDTOList.length > 0 && photoData.interestDTOList.map((interestDTO, index) => (
                    <li key={interestDTO.interestSeq} className="interest-item">
                        <span className="interest-icon">⭐</span>
                        <span >{interestDTO.interestCategory}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default PhotoInterestList;