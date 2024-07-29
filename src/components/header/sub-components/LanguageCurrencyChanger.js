import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setCurrency } from "../../../store/slices/currency-slice";
import { useEffect, useState } from "react";
import axios from "axios";

const LanguageCurrencyChanger = ({ currency }) => {
    const [profile, setProfile] = useState({}); // 빈 객체로 초기화

    const userSeq = localStorage.getItem('userSeq');

    useEffect(() => {
        if (userSeq) {
            axios.get(`http://localhost:9000/profile/${userSeq}`)
                .then((result) => {
                    console.log(result.data);
                    setProfile(result.data);
                })
                .catch((error) => {
                    console.error("프로필을 가져오는 도중 오류 발생:", error);
                });
        }
    }, [userSeq]);

    const { i18n } = useTranslation();
    const dispatch = useDispatch();

    const changeLanguageTrigger = (e) => {
        const languageCode = e.target.value;
        i18n.changeLanguage(languageCode);
    };

    const userId = localStorage.getItem('userId');
    const userJelly = localStorage.getItem('userJelly');

    const setCurrencyTrigger = (e) => {
        const currencyName = e.target.value;
        dispatch(setCurrency(currencyName));
    };

    return (
        <div style={{ marginTop: '3%' }} className="language-currency-wrap">
            <div className="same-language-currency language-style"></div>
            <div className="same-language-currency">
                {userSeq !== null && (
                    <p>환영합니다, {userId} 님</p>
                )}
            </div>
            <div>
                {profile.userJelly !== null && (
                    <p>보유 젤리: {profile.userJelly ? profile.userJelly : 0} 개</p>
                )}
            </div>
        </div>
    );
};

LanguageCurrencyChanger.propTypes = {
    currency: PropTypes.shape({}),
};

export default LanguageCurrencyChanger;
