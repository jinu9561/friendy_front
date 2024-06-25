import React, { useState } from 'react';

const ReportList = ({ layout, reportDataList }) => {
    const [selectedReport, setSelectedReport] = useState(null);

    const handleReportClick = (report) => {
        setSelectedReport(report);
    };

    const styles = {
        reportList: {
            width: '100%',
            margin: '0 auto',
        },
        reportListItem: {
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #eaeaea',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '10px',
            transition: 'box-shadow 0.3s ease',
            cursor: 'pointer',
        },
        reportListItemHover: {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        reportTitle: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '8px',
        },
        reportTitleHover: {
            color: '#007bff',
        },
        reportDescription: {
            fontSize: '14px',
            color: '#666',
        },
        reportMeta: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#999',
            marginTop: '10px',
        },
        reportDetails: {
            padding: '15px',
            borderTop: '1px solid #eaeaea',
            marginTop: '10px',
        },
    };

    return (
        <div style={styles.reportList}>
            <div className="row">
                {selectedReport ? (
                    <div className="col-12">
                        <div style={styles.reportDetails}>
                            <h3>{selectedReport.reportDescription}</h3>
                            <p>신고 URL: <a href={selectedReport.reportUrl} target="_blank"
                                          rel="noopener noreferrer">{selectedReport.reportUrl}</a></p>
                            <p>신고 상태: {selectedReport.reportStatus}</p>
                            <p>신고 결과: {selectedReport.reportResult}</p>
                            <p>신고 날짜: {new Date(selectedReport.reportRegDate).toLocaleDateString()}</p>
                            
                            <p>
                                <button>신고글 조회하기</button>
                            </p>
                            {/* Add other necessary details here */}
                            <button onClick={() => setSelectedReport(null)}>목록으로 돌아가기</button>
                        </div>
                    </div>
                ) : (
                    reportDataList.map(report => (
                        <div key={report.reportSeq} className="col-12">
                            <div
                                style={{ ...styles.reportListItem, ...(report.isHovered ? styles.reportListItemHover : {}) }}
                                onMouseEnter={() => report.isHovered = true}
                                onMouseLeave={() => report.isHovered = false}
                                onClick={() => handleReportClick(report)}
                            >
                                <div
                                    style={{ ...styles.reportTitle, ...(report.isHovered ? styles.reportTitleHover : {}) }}
                                >
                                    {report.reportDescription}
                                </div>
                                <div style={styles.reportDescription}>
                                    {report.reportUrl}
                                </div>
                                <div style={styles.reportMeta}>
                                    <span>상태: {report.reportStatus}</span>
                                    <span>결과: {report.reportResult}</span>
                                    <span>등록일: {new Date(report.reportRegDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReportList;
