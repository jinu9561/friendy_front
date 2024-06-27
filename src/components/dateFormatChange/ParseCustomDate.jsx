import React from 'react';

const ParseCustomDate = (dateStr) => {
    // Check if dateStr is not null or undefined
    if (!dateStr || !Array.isArray(dateStr)) {
        return '날짜 정보 없음'; // Handle null, undefined, or invalid format
    }

    // Ensure we have enough components
    if (dateStr.length < 6) {
        return '날짜 정보 없음'; // Handle invalid format
    }

    // Extract components
    const [year, month, day, hour, minute] = dateStr;

    // Create a new Date object
    const date = new Date(year, month - 1, day, hour, minute);

    // Check if the date is valid
    if (!isNaN(date)) {
        // Format the date as "Month Day, Year HH:mm" in Korean
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Use 24-hour format
            timeZone: 'Asia/Seoul', // Optionally set timezone
        };

        const formattedDate = date.toLocaleString('ko-KR', options);
        return formattedDate;
    }

    // If dateStr is not a valid format or cannot be parsed
    return '날짜 정보 없음'; // Fallback text for invalid or non-parseable dates
};

export default ParseCustomDate;