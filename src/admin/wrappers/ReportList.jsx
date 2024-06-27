import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ReportList = ({ reportDataList }) => {
    const [selectedReport, setSelectedReport] = useState(null);
    const [statusToUpdate, setStatusToUpdate] = useState('');
    const [resultToUpdate, setResultToUpdate] = useState('');
    const navigate = useNavigate();

    const handleReportClick = (report) => {
        setSelectedReport(report);
    };

    const handleDetailClick = () => {
        navigate(process.env.PUBLIC_URL + "/MeetUpDetail", {
            state: {
                meetUpSeq: selectedReport.reportTypeDTO.seqByType,
                meetUpName: selectedReport.reportUrl
            }
        });
    };

    const selectStyle = {
        width: '150px', // smaller width
        display: 'inline-block', // align inline
        marginLeft: '10px', // spacing between text and select box
    };

    const labelStyle = {
        display: 'inline-block',
        margin: '0 5px 0 0', // Right margin for spacing
        verticalAlign: 'middle', // Align text vertically
    };


    const handleLinkClick = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const getStatusText = (status) => {
        switch (status) {
            case 0: return '처리중';
            case 1: return '처리완료';
            default: return '알 수 없음';
        }
    };

    const getResultText = (result) => {
        switch (result) {
            case 0: return '대기중';
            case 1: return '무혐의';
            case 2: return '3일 정지';
            case 3: return '영구 정지';
            default: return '알 수 없음';
        }
    };

    const parseCustomDate = (dateStr) => {
        if (!dateStr || !Array.isArray(dateStr)) return '날짜 정보 없음';
        if (dateStr.length < 6) return '날짜 정보 없음';

        const [year, month, day, hour, minute] = dateStr;
        const date = new Date(year, month - 1, day, hour, minute);
        if (!isNaN(date)) {
            const options = {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Seoul',
            };
            return date.toLocaleString('ko-KR', options);
        }
        return '날짜 정보 없음';
    };

    const handleUpdateStatus = (report) => {
        if (statusToUpdate) {
            const updatedReport = { ...report, reportStatus: parseInt(statusToUpdate) };
            updateReportStatusInBackend(updatedReport);
        }
    };

    const updateReportStatusInBackend = (report) => {
        axios.post('http://localhost:9000/admin/report/updateStatus', report)
            .then(response => {
                alert('상태 업데이트 성공!');
                setSelectedReport(response.data);
            })
            .catch(error => {
                console.error('상태 업데이트 실패:', error);
                alert('상태 업데이트 실패');
            });
    };

    const handleUpdateResult = (report) => {
        if (resultToUpdate) {
            const updatedReport = { ...report, reportResult: parseInt(resultToUpdate) };
            const newState = getResultState(resultToUpdate);
            updateReportResultInBackend(updatedReport, newState);
        }
    };

    const getResultState = (result) => {
        switch (parseInt(result)) {
            case 0: case 1: return 1; // 정상
            case 2: return 4; // 일시정지
            case 3: return 5; // 영구정지
            default: return 1; // 디폴트값(정상)
        }
    };

    const updateReportResultInBackend = (report, newState) => {
        const payload = { ...report, newState };
        axios.post('http://localhost:9000/admin/report/updateResult', payload)
            .then(response => {
                alert('결과 업데이트 성공!');
                setSelectedReport(response.data);
            })
            .catch(error => {
                console.error('결과 업데이트 실패:', error);
                alert('결과 업데이트 실패');
            });
    };

    const styles = {
        reportList: {
            width: '60%', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px'
        },
        reportListItem: {
            display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #eaeaea',
            borderRadius: '8px', padding: '15px', marginBottom: '10px', transition: 'box-shadow 0.3s ease',
            cursor: 'pointer', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
        },
        reportTitle: {
            fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '5px',
        },
        reportDescription: {
            fontSize: '14px', color: '#666', marginBottom: '10px',
        },
        reportMeta: {
            display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999',
        },
        reportDetails: {
            padding: '20px', borderTop: '1px solid #eaeaea', backgroundColor: '#fff',
            borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
        },
    };

    const buttonStyle = {
        display: 'inline-block', padding: '5px 10px', fontSize: '13px', fontWeight: 'bold',
        textAlign: 'center', whiteSpace: 'nowrap', verticalAlign: 'middle', backgroundColor: '#ffb3b3',
        color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer',
    };

    return (
        <div style={styles.reportList}>
            <div className="row">
                {selectedReport ? (
                    <div className="col-12" style={styles.reportDetails}>
                        <h3>신고 내용 : {selectedReport.reportDescription}</h3>
                        <hr/>
                        {selectedReport.reportTypeDTO && selectedReport.reportTypeDTO.reportType === 'meetup_boards' ? (
                            <button style={buttonStyle} onClick={handleDetailClick}>신고글로 이동</button>
                        ) : (
                            <button style={buttonStyle} onClick={() => handleLinkClick(selectedReport.reportUrl)}>신고글로
                                이동</button>
                        )}
                        <br/><br/>
                        <p>
                            <span style={labelStyle}>신고 상태 : {getStatusText(selectedReport.reportStatus)}</span>
                            <select style={selectStyle} value={statusToUpdate}
                                    onChange={(e) => setStatusToUpdate(e.target.value)}>
                                <option value="">상태 선택</option>
                                <option value="0">처리중</option>
                                <option value="1">처리완료</option>
                            </select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button style={buttonStyle} onClick={() => handleUpdateStatus(selectedReport)}>처리상태변경
                            </button>
                        </p>
                        <p>
                            <span style={labelStyle}>신고 결과 : {getResultText(selectedReport.reportResult)}</span>
                            <select style={selectStyle} value={resultToUpdate}
                                    onChange={(e) => setResultToUpdate(e.target.value)}>
                                <option value="">결과 선택</option>
                                <option value="0">대기중</option>
                                <option value="1">무혐의</option>
                                <option value="2">3일 정지</option>
                                <option value="3">영구 정지</option>
                            </select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button style={buttonStyle} onClick={() => handleUpdateResult(selectedReport)}>유저상태변경
                            </button>
                        </p>
                        <p>신고 날짜 : {parseCustomDate(selectedReport.reportRegDate)}</p>
                        <p>신고한 유저 번호 : {selectedReport.senderSeq}</p>
                        <p>신고받은 유저 번호 : {selectedReport.receiverSeq}</p>
                        <hr/>
                        <button style={buttonStyle} onClick={() => setSelectedReport(null)}>목록으로 돌아가기</button>
                    </div>
                ) : (
                    reportDataList.slice().reverse().map(report => (
                        <div key={report.reportSeq} className="col-12" style={styles.reportListItem}
                             onClick={() => handleReportClick(report)}>
                            <div style={styles.reportTitle}>{report.reportDescription}</div>
                            <div style={styles.reportDescription}>{report.reportUrl}</div>
                            <div style={styles.reportMeta}>
                                <span>
                                    상태 : {getStatusText(report.reportStatus)}&nbsp;&nbsp;&nbsp;
                                    결과 : {getResultText(report.reportResult)}&nbsp;&nbsp;&nbsp;
                                    등록일 : {parseCustomDate(report.reportRegDate)}&nbsp;&nbsp;&nbsp;
                                    신고유저번호: {report.senderSeq}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReportList;