import React, { useState } from 'react';
import axios from 'axios';

const Address = () => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);

    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
    };

    const checkSearchedWord = (keyword) => {
        if (keyword.length > 0) {
            const expText = /[%=><]/;
            if (expText.test(keyword)) {
                alert("특수문자를 입력 할수 없습니다.");
                setKeyword(keyword.split(expText).join(""));
                return false;
            }

            const sqlArray = ["OR", "SELECT", "INSERT", "DELETE", "UPDATE", "CREATE", "DROP", "EXEC", "UNION", "FETCH", "DECLARE", "TRUNCATE"];
            for (let i = 0; i < sqlArray.length; i++) {
                const regex = new RegExp(sqlArray[i], "gi");
                if (regex.test(keyword)) {
                    alert(`"${sqlArray[i]}"와(과) 같은 특정문자로 검색할 수 없습니다.`);
                    setKeyword(keyword.replace(regex, ""));
                    return false;
                }
            }
        }
        return true;
    };

    const getAddrLoc = (e) => {
        e.preventDefault();
        if (!checkSearchedWord(keyword)) {
            return;
        }

        axios.post("http://localhost:9000/address/find", {
            keyword: keyword,
            currentPage: 1,
            countPerPage: 10,
            resultType: 'json'
        })
            .then((response) => {
                const jsonStr = response.data;
                const errCode = jsonStr.results.common.errorCode;
                const errDesc = jsonStr.results.common.errorMessage;
                if (errCode !== "0") {
                    alert(errCode + "=" + errDesc);
                } else {
                    if (jsonStr) {
                        setResults(jsonStr.results.juso);
                    }
                }
            })
            .catch((error) => {
                console.error("에러발생", error);
                alert("에러발생");
            });
    };

    const handleAddressSelect = (address) => {
        window.opener.postMessage({ address }, '*');
        window.close();
    };

    const makeListJson = (results) => {
        return (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th>도로명 주소</th>
                    <th>도로명 주소 (부분 1)</th>
                    <th>도로명 주소 (부분 2)</th>
                    <th>지번 주소</th>
                    <th>선택</th>
                </tr>
                </thead>
                <tbody>
                {results.map((result, index) => (
                    <tr key={index}>
                        <td>{result.roadAddr}</td>
                        <td>{result.roadAddrPart1}</td>
                        <td>{result.roadAddrPart2}</td>
                        <td>{result.jibunAddr}</td>
                        <td>
                            <button
                                onClick={() => handleAddressSelect(result.roadAddr)}
                                style={{
                                    backgroundColor: '#ffb3b3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                선택
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    const enterSearch = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            getAddrLoc(e);
        }
    };

    return (
        <div style={{ width: '80%', margin: '0 auto', padding: '2rem', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: '#fff' }}>
            <form id="form" onSubmit={getAddrLoc} style={{ marginBottom: '1rem' }}>
                <input type="hidden" name="currentPage" value="1" />
                <input type="hidden" name="countPerPage" value="10" />
                <input type="hidden" name="resultType" value="json" />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        name="keyword"
                        value={keyword}
                        onChange={handleKeywordChange}
                        onKeyDown={enterSearch}
                        placeholder="검색어 입력"
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '2px solid #ffb3b3',
                            marginRight: '0.5rem'
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#ffb3b3',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        주소검색하기
                    </button>
                </div>
            </form>
            <div id="list" style={{ marginTop: '1rem' }}>
                {results.length > 0 ? makeListJson(results) : "검색 결과가 없습니다."}
            </div>
        </div>
    );
};

export default Address;
