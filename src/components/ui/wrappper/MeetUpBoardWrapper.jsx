import React, { useState, useEffect } from 'react';
import FilterButton from "../button/FilterButton";
import PostRow from "../row/PostRow";

const MeetUpBoardWrapper = ({ interestList, meetUpList, onSaveButtonClick }) => {
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [filteredMeetUpList, setFilteredMeetUpList] = useState(meetUpList);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        if (selectedCategory === "전체") {
            setFilteredMeetUpList(meetUpList);
        } else {
            setFilteredMeetUpList(meetUpList.filter(meetUp => meetUp.interest === selectedCategory));
        }
        setCurrentPage(1); // Reset to the first page whenever the category changes
    }, [selectedCategory, meetUpList]);

    const handleFilterButtonClick = (category) => {
        setSelectedCategory(category);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredMeetUpList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMeetUpList.length / itemsPerPage);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '70%',
            margin: '0 auto'
        }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                <FilterButton interestCategory="전체" onClick={() => handleFilterButtonClick("전체")}></FilterButton>
                {interestList.map((interest) => (
                    <FilterButton
                        key={interest.interestSeq}
                        interestCategory={interest.interestCategory}
                        onClick={() => handleFilterButtonClick(interest.interestCategory)}
                    />
                ))}
            </div>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '1rem'
            }}>
                {currentItems.map((meetUp) => (
                    <div key={meetUp.meetUpSeq} style={{
                        flex: '1 1 calc(50% - 1rem)',
                        boxSizing: 'border-box'
                    }}>
                        <PostRow
                            meetUpName={meetUp.meetUpName}
                            meetUpSeq={meetUp.meetUpSeq}
                            meetUpDesc={meetUp.meetUpDesc}
                            interest={meetUp.interest}
                            meetUpBoardDetailImgNameList={meetUp.meetUpBoardDetailImgNameList}
                        />
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem' }}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button key={index + 1} onClick={() => handlePageChange(index + 1)}
                            style={{
                                margin: '0 5px',
                                padding: '5px 10px',
                                backgroundColor: currentPage === index + 1 ? '#007bff' : '#ccc',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}>
                        {index + 1}
                    </button>
                ))}
            </div>

            <button onClick={onSaveButtonClick}
                    style={{
                        display: 'inline-block',
                        width: 'auto',
                        padding: '5px 10px',
                        fontSize: '12px',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        verticalAlign: 'middle',
                        backgroundColor: '#ffb3b3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        margin: 2
                    }}
            >
                소모임 생성하기
            </button>
        </div>
    );
};

export default MeetUpBoardWrapper;
