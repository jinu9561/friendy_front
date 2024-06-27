import React, { useEffect } from 'react';
import axios from 'axios';

const SendReportMeetUp = ({ meetUpSeq, meetUpName, postUserSeq, onReportSent }) => {

    useEffect(() => {
        const report = async () => {
            const reportReason = prompt("신고 사유를 입력해 주세요.");



            if (!reportReason || reportReason.trim() === "") {
                alert("신고 사유를 입력하지 않으면 신고를 진행할 수 없습니다.");
                onReportSent(); // 신고 취소 시 호출
                return;
            }

            if (!window.confirm("이 게시글을 신고하시겠습니까?")) {
                onReportSent(); // 신고 취소 시 호출
                return;
            }

            const reportData = {
                report: {
                    senderSeq: parseInt(localStorage.getItem("userSeq")), // Assuming sender's user ID is stored in localStorage
                    receiverSeq: parseInt(postUserSeq),
                    reportUrl: meetUpName,
                    reportDescription: reportReason
                },
                reportType: {
                    reportType: "meetup_boards",
                    seqByType: parseInt(meetUpSeq)
                }
            };

            console.log("reportData = ", reportData);

            try {
                await axios.post('http://localhost:9000/report/send', reportData, {
                    headers: {
                        Authorization: localStorage.getItem("Authorization"),
                        'Content-Type': 'application/json'
                    }
                });
                alert("신고가 접수되었습니다.");
            } catch (error) {
                console.error("신고 접수 실패:", error);
                alert("신고 처리 중 오류가 발생했습니다.");
            } finally {
                onReportSent(); // 신고 절차 완료 후 호출
            }
        };

        report();
    }, [meetUpSeq, meetUpName, postUserSeq, onReportSent]); // 의존성 배열에 변수들 추가

    return null; // UI가 필요없으므로 null 반환
};

export default SendReportMeetUp;
