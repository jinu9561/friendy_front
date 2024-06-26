import React, { useState } from 'react';

const ReportList = ({ layout, reportDataList }) => {
    const [selectedReport, setSelectedReport] = useState(null);

    const handleReportClick = (report) => {
        setSelectedReport(report);
    };

    const handleLinkClick = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const getStatusText = (status) => {
        switch (status) {
            case 0:
                return '처리중';
            case 1:
                return '처리완료';
            default:
                return '알 수 없음';
        }
    };

    const getResultText = (result) => {
        switch (result) {
            case 0:
                return '대기중';
            case 1:
                return '무혐의';
            case 2:
                return '3일 정지';
            case 3:
                return '영구 정지';
            default:
                return '알 수 없음';
        }
    };

    const parseCustomDate = (dateStr) => {
        // Assuming the date format is "YYYYMMDD" followed by irrelevant numbers
        if (dateStr && dateStr.length > 8) {
            const year = dateStr.substring(0, 4);
            const month = dateStr.substring(4, 6);
            const day = dateStr.substring(6, 8);
            const date = new Date(`${year}-${month}-${day}`);
            if (!isNaN(date)) {
                return date.toLocaleDateString();  // Adjust format as needed
            }
        }
        return '날짜 정보 없음';  // Fallback text for invalid or non-parseable dates
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
                            <p>
                                <button onClick={() => handleLinkClick(selectedReport.reportUrl)}>신고글로 이동</button>
                            </p>
                            <p>신고 상태: {getStatusText(selectedReport.reportStatus)}</p>
                            <p>신고 결과: {getResultText(selectedReport.reportResult)}</p>
                            <p>신고 날짜: {parseCustomDate(selectedReport.reportRegDate)}</p>
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
                                    <span>상태: {getStatusText(report.reportStatus)}</span>
                                    <span>결과: {getResultText(report.reportResult)}</span>
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
