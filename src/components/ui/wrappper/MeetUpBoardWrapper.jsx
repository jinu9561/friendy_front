import React, { useState, useEffect } from 'react';
import FilterButton from '../button/FilterButton';
import PostRow from '../row/PostRow';
import axios from "axios";

const MeetUpBoardWrapper = ({ interestList, meetUpListDesc, meetUpListAsc, onSaveButtonClick }) => {
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [filteredMeetUpList, setFilteredMeetUpList] = useState(meetUpListDesc);
    const [searchMeetUp, setSearchMeetUp] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isDescOrder, setIsDescOrder] = useState(true);
    const itemsPerPage = 6;

    useEffect(() => {
        let listToFilter = isDescOrder ? meetUpListDesc : meetUpListAsc;
        if (selectedCategory === "전체") {
            setFilteredMeetUpList(listToFilter);
        } else {
            setFilteredMeetUpList(listToFilter.filter(meetUp => meetUp.interestCate === selectedCategory));
        }
        setCurrentPage(1);
    }, [selectedCategory, isDescOrder, meetUpListDesc, meetUpListAsc]);

    const searchMeetUpByName = () => {
        axios
            .get("http://localhost:9000/partyBoard/search/meetUpName", {
                params: { meetUpName: searchTerm }
            })
            .then((result) => {
                setSearchMeetUp(result.data);
                console.log(result.data + "+++++++");
            })
            .catch((err) => {
                let errMessage = err.response.data.type + "\n";
                errMessage += err.response.data.title + "\n";
                errMessage += err.response.data.detail + "\n";
                errMessage += err.response.data.status + "\n";
                errMessage += err.response.data.instance + "\n";
                errMessage += err.response.data.timestamp;
                alert(errMessage);
            });
    };


    const handleFilterButtonClick = (category) => {
        setSelectedCategory(category);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleOrderChange = (isDesc) => {
        setIsDescOrder(isDesc);
    };

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = (searchMeetUp ? searchMeetUp : filteredMeetUpList).slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil((searchMeetUp ? searchMeetUp : filteredMeetUpList).length / itemsPerPage);
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
            <div style={{
                margin: '1%',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                width: '100%',
                height: '50%'
            }}>
                <FilterButton
                    interestCategory="전체"
                    onClick={() => handleFilterButtonClick("전체")}
                    isActive={selectedCategory === "전체"}
                />
                {interestList.map((interest) => (
                    <FilterButton
                        key={interest.interestSeq}
                        interestCategory={interest.interestCategory}
                        onClick={() => handleFilterButtonClick(interest.interestCategory)}
                        isActive={selectedCategory === interest.interestCategory}
                    />
                ))}

            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
                marginRight:'10%',
                margin: '2%'
            }} className={'meetUpBoardSearch'}>
                <input
                    style={{ width: '30%' }}
                    type={"text"}
                    placeholder={"제목으로 검색"}
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                />
                <button style={{
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    backgroundColor: '#ffb3b3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    marginLeft:'0.25rem'
                }}
                        onClick={searchMeetUpByName}
                >검색</button>
            </div>


            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginRight:'10%',
                width: '100%',
                margin: '0.1%'
            }} className={'meetUpBoardFilter'}>

                <button onClick={() => handleOrderChange(true)} style={{
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    backgroundColor: isDescOrder ?   '#ccc' : '#ffb3b3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    margin: '0.25rem'
                }}>
                    최신순
                </button>
                <button onClick={() => handleOrderChange(false)} style={{
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    backgroundColor: !isDescOrder ? '#ccc' : '#ffb3b3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    margin: '0.25rem'
                }}>
                    오래된순
                </button>
            </div>
            </div>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '1rem',
                width: '100%'
            }}>
                {currentItems.map((meetUp) => (
                    <div key={meetUp.meetUpSeq} style={{
                        flex: '1 1 calc(50% - 1rem)',
                        boxSizing: 'border-box',
                        display: 'flex',
                        justifyContent: 'center'
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
                    <div style={{
                        flex: '1 1 calc(50% - 1rem)',
                        boxSizing: 'border-box',
                        display: 'flex',
                        justifyContent: 'center'
                    }}></div>
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
                                margin: '0.5rem'
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
