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
            setFilteredMeetUpList(meetUpList.filter(meetUp => meetUp.interestCate
                === selectedCategory));
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
    let seq = localStorage.getItem('userSeq');

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '70%',
            height: '100%',
            margin: '0 auto'
        }}>
            {/*필터 버튼 aaawsd*/}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width:'100%' , height:'50%'} }>
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
                        boxSizing: 'border-box',
                        display: 'flex',
                        justifyContent: 'center' // 중앙 정렬로 변경
                    }}>
                        <PostRow
                            meetUpName={meetUp.meetUpName}
                            meetUpSeq={meetUp.meetUpSeq}
                            meetUpDesc={meetUp.meetUpDesc}
                            interest={meetUp.interestCate}
                            meetUpBoardDetailImgNameList={meetUp.meetUpBoardDetailImgNameList}
                            meetUpDeadLine={meetUp.meetUpDeadLine}
                        />
                    </div>
                ))}
                {currentItems.length % 2 !== 0 && (
                    <div style={{width: '49%'}}>
                    </div>

                )}


            </div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem' }}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button key={index + 1} onClick={() => handlePageChange(index + 1)}
                            style={{
                                backgroundColor: currentPage === index + 1 ? '#ffb3b3' : '#ccc',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                margin: '10%'
                            }}>
                        {index + 1}
                    </button>
                ))}
            </div>

            {seq !== null && (
                <button onClick={onSaveButtonClick}
                        style={{
                            display: 'inline-block',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            verticalAlign: 'middle',
                            backgroundColor: '#ffb3b3',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            margin: '1%'
                        }}
                >
                    소모임 생성하기
                </button>
            )}
        </div>
    );
};

export default MeetUpBoardWrapper;
