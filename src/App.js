import { Suspense, createContext, lazy,useEffect, useState } from "react";
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import QnaButton from "./components/qna-button/QnaButton";
import SaveForm from "./components/ui/wrappper/SaveForm";
import Detail from "./components/ui/wrappper/MeetUpDetailPage";
import MeetUpDetailPage from "./components/ui/wrappper/MeetUpDetailPage";
import MeetUpUpdatePage from "./components/ui/wrappper/MeetUpUpdatePage";
import MeetUpRequestList from "./components/ui/wrappper/MeetUpRequestList";
import ChattingRoom from "./components/ui/wrappper/ChattingRoom";
import PublicBoard from "./pages/generalBoards/PublicBoard";
import UpdatePost from "./pages/generalBoards/UpdatePost";
import AnonymousBoard from "./pages/generalBoards/AnonymousBoard";
import WritePost from "./pages/generalBoards/WritePost";
import PublicDetail from "./pages/generalBoards/PublicDetail";
import AnonymousDetail from "./pages/generalBoards/AnonymousDetail";
import MyMeetUpPage from "./components/ui/wrappper/myMeetUpPage";
import Test from "./pages/shop/Address";
import Address from "./pages/shop/Address";

export const LogingedContext = createContext();

// 메인페이지
const HomeBookStore = lazy(() => import("./pages/home/HomeBookStore"));

// 사진게시판 , 소모임게시판, 이벤트 게시판
const MeetUpBoard = lazy(() => import("./pages/shop/MeetUpBoard"));
const PhotoBoard = lazy(() => import("./pages/generalBoards/PhotoBoard")); //사진게시판
const ShopGridFilter = lazy(() => import("./pages/shop/ShopGridFilter")); //사진 게시판 데모
const Event = lazy(() => import("./pages/event/Event"));
const ShopListTwoColumn = lazy(() => import("./pages/shop/ShopListTwoColumn"));

// 사진게시판 , 소모임게시판, 이벤트 게시판 상세보기
const EventDetail = lazy(() => import("./pages/event/EventDetail"));
const ProductSticky = lazy(() => import("./pages/shop-product/ProductSticky"));
const ProductSlider = lazy(() => import("./pages/shop-product/ProductSlider"));

// 자유게시판 , 익명게시판 , + 상세보기
const BlogNoSidebar = lazy(() => import("./pages/blog/BlogNoSidebar"));
const BlogDetailsStandard = lazy(() =>
    import("./pages/blog/BlogDetailsStandard")
);

// 나의 프로필
const MyProfile = lazy(() => import("./pages/other/MyProfile"));
// 로그인 회원가입
const LoginRegister = lazy(() => import("./pages/other/LoginRegister"));
// 비밀번호 찾기
const FindPassword = lazy(() => import("./pages/other/FindPassword"));
// 비밀번호 변경
const PasswordAlter = lazy(() => import("./pages/other/PasswordAlter"));
// 이메일 인증
const EmailVerification = lazy(() => import("./pages/other/EmailVerification"));
// 이메일 재발글
const FindEmailVerification = lazy(() =>
    import("./pages/other/FindEmailVerification")
);
// SMS 인증번호 발급
const SMSVerification = lazy(() => import("./pages/other/SMSVerification"));
// SMS 인증
const SMSConfirm = lazy(() => import("./pages/other/SMSConfirm"));
// 젤리 결제
const JellyTransctiont = lazy(() => import("./pages/other/JellyTransction"));

const NotFound = lazy(() => import("./pages/other/NotFound"));

// 메인에서 소모임 디테일 열기
const MainMeetUpDetail = lazy(() => import("./wrappers/main/MainMeetUpDetailPage"));

// 관리자 전용

// 관리자 로그인
const AdminLogin = lazy(()=> import('./admin/pages/other/AdminLogin'));
// 관리자 회원 조회
const AdminUser = lazy(()=> import('./admin/pages/users/AdminUser'));
// 관리자 장소 추천
const AdminPlace = lazy(()=> import('./admin/pages/place/AdminPlace'));
// 관리자 사진게시판 조회
const AdminPhoto = lazy(()=> import('./admin/pages/photo/AdminPhotoBoard'));

// 관리자 이벤트 조회
const AdminEvent = lazy(()=> import('./admin/pages/event/AdminEvent'));
// 관리자 이벤트 등록
const AdminEventInsert = lazy(()=> import('./admin/components/event/AdminEventInsert'));
// 관리자 이벤트 세부이미지 등록
const AdminEventDetailImgInsert = lazy(()=> import('./admin/components/event/AdminEventDetailImgInsert'));


// 관리자 신고 조회
const AdminReport = lazy(()=> import('./admin/pages/report/AdminReport'));

const App = () => {
    //컴포넌트가 mount or update 될때 로그인 여부에 따른 상태값 변경
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [isAdminIn, setIsAdminIn] = useState(false);
    const [userSeq,setUserSeq] = useState('');
    const [adminSeq,setAdminSeq] = useState('');

    useEffect(()=>{
        localStorage.getItem("userSeq")!=null ? setIsLoggedIn(true) : setIsLoggedIn(false);
        console.log("isLoggeedIn = ", isLoggedIn);

        sessionStorage.getItem("userId") !=null ? setIsAdminIn(true) : setIsAdminIn(false);
        console.log("isAdminIn = ", isAdminIn);

        const seq = localStorage.getItem("userSeq");
        setUserSeq(seq);

        const amdinSeq = sessionStorage.getItem("userSeq");
        setAdminSeq(amdinSeq);
    });

    const handleLoggedChange = (isLoggedIn)=>{
        setIsLoggedIn(isLoggedIn);
    }
    const handleAdminInChange = (isAdminIn)=>{
        setIsAdminIn(isAdminIn);
    }

    useEffect(() => {
        // Axios 인터셉터 설정
        const interceptor = axios.interceptors.response.use(
            response => response,
            async (error) => {
                if (error.response && error.response.status === 401) {
                    // 토큰 만료 시 로그아웃 처리
                    setIsLoggedIn(false);
                    let formData = new FormData(); //폼전송으로 보내기 위한 작업
                    formData.append("userId", localStorage.getItem("userId"));

                    try {
                        // 로그아웃 요청 전송
                        await axios({
                            method: "POST",
                            url: "http://localhost:9000/logout",
                            data: formData
                        });

                        // 로컬 스토리지 데이터 삭제
                        localStorage.removeItem("userId");
                        localStorage.removeItem("country");
                        localStorage.removeItem("gender");
                        localStorage.removeItem("userName");
                        localStorage.removeItem("userSeq");
                        localStorage.removeItem("nickName");
                        localStorage.removeItem("userJelly");
                        localStorage.removeItem("Authorization");

                        // 로그인 페이지로 리다이렉트
                        window.location.href = 'http://localhost:3000/login-register';
                    } catch (err) {
                        console.log(err);
                        alert(err.response.data.title);
                    }
                }
                return Promise.reject(error);
            }
        );

        // 컴포넌트 언마운트 시 인터셉터 제거
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);


    return (
        <LogingedContext.Provider value={ {isLoggedIn:isLoggedIn , onLoggedChange:handleLoggedChange , isAdminIn:isAdminIn, onAdminInChange:handleAdminInChange
            ,userSeq:userSeq , adminSeq:adminSeq} }>

            <Router>
                <QnaButton/>
                <ScrollToTop>
                    {" "}
                    {/* url이 변동이 있을때 페이지를 맨위로 스크롤 하는 기능 */}
                    <Suspense
                        fallback={
                            <div className="flone-preloader-wrapper">
                                <div className="flone-preloader">
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        }
                    >
                        <Routes>
                            {/* 메인페이지 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/"}
                                element={<HomeBookStore />}
                            />

                            {/* 소모임 게시판 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/MeetUpBoard"}
                                element={<MeetUpBoard />}
                            />

                            {/* 사진 게시판 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/photo-board"}
                                element={<PhotoBoard />}
                            />

                            <Route
                                path={process.env.PUBLIC_URL + "/myMeetUpPage"}
                                element={<MyMeetUpPage />}
                            />


                            {/*사진 게시판 데모 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/shop-grid-filter"}
                                element={<ShopGridFilter />}
                            />

                            {/* 이벤트 게시판 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/event"}
                                element={<Event />}
                            />

                            {/* 자유 게시판 */}

                            <Route path="/public-board" element={<PublicBoard />} />
                            <Route path="/public-board/write" element={<WritePost />} />
                            <Route
                                path="/public-board/:commBoardSeq/update"
                                element={<UpdatePost />}
                            />

                            {/* 익명 게시판 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/anonymous-board"}
                                element={<AnonymousBoard />}
                            />
                            <Route path="/anonymous-board/write" element={<WritePost />} />
                            <Route
                                path="/anonymous-board/:commBoardSeq/update"
                                element={<UpdatePost />}
                            />

                            {/* 자유 게시판 상세보기*/}
                            <Route
                                path={process.env.PUBLIC_URL + "/public-board/:commBoardSeq"}
                                element={<PublicDetail />}
                            />

                            {/* 익명 게시판 상세보기 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/anonymous-board/:commBoardSeq"}
                                element={<AnonymousDetail />}
                            />

                            {/* 사진 게시판 상세보기 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/product-slider/:id"}
                                element={<ProductSlider />}
                            />

                            {/* 사진 게시판 상세보기 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/product-slider/:id"}
                                element={<ProductSlider />}
                            />

                            {/* 이벤트 게시판 상세보기 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/event/:eventSeq"}
                                element={<EventDetail />}
                            />

                            {/* 소모임 게시판 상세보기 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/product-sticky/:id"}
                                element={<ProductSticky />}
                            />

                            {/* 나의 프로필 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/my-profile"}
                                element={<MyProfile />}
                            />

                            {/* 로그인 회원가입 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/login-register"}
                                element={<LoginRegister />}
                            />
                            {/* 이메일 인증 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/emailVerification"}
                                element={<EmailVerification />}
                            />
                            {/* 비밀 번호 찾기 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/findPassword"}
                                element={<FindPassword />}
                            />
                            {/* 비밀 변경 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/passwordAlter"}
                                element={<PasswordAlter />}
                            />
                            {/* 이메일 재발급 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/findEmailVerification"}
                                element={<FindEmailVerification />}
                            />
                            {/* SMS 번호 발급 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/smsVerification"}
                                element={<SMSVerification />}
                            />

                            {/* SMS 번호 인증 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/smsVerification/cofirm"}
                                element={<SMSConfirm />}
                            />

                            {/* 젤리 결제 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/jellyTransction"}
                                element={<JellyTransctiont />}
                            />

                            {/* 관리자 전용*/}


                            {/* 관리자 로그인*/}
                            <Route
                                path={process.env.PUBLIC_URL + "/adminLogin"}
                                element={<AdminLogin/>}
                            />
                            {/* 관리자 유저 조회*/}
                            <Route
                                path={process.env.PUBLIC_URL + "/adminUser"}
                                element={<AdminUser/>}
                            />
                            {/* 관리자 장소 추천*/}
                            <Route
                                path={process.env.PUBLIC_URL + "/adminPlace"}
                                element={<AdminPlace/>}
                            />
                            {/* 관리자 사진게시판 조회*/}
                            <Route
                                path={process.env.PUBLIC_URL + "/adminPhoto"}
                                element={<AdminPhoto/>}
                            />
                            {/* 이벤트 게시판 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/adminEvent"}
                                element={<AdminEvent />}
                            />

                            {/* 관리자 이벤트 등록 게시판 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/adminEventInsert"}
                                element={<AdminEventInsert />}
                            />
                            {/* 관리자 이벤트 세부 이미지 등록 게시판 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/adminEventDetailImgInsert"}
                                element={<AdminEventDetailImgInsert />}
                            />
                            {/* 관리자용 신고 게시판 */}
                            <Route
                                path={process.env.PUBLIC_URL + "/adminReport"}
                                element={<AdminReport />}
                            />

                            <Route
                                path={process.env.PUBLIC_URL + "/SaveForm"}
                                element={<SaveForm/>}
                            />


                            <Route
                                path={process.env.PUBLIC_URL + "/MeetUpDetail"}
                                element={<MeetUpDetailPage/>}
                            />

                            <Route
                                path={process.env.PUBLIC_URL + "/MeetUpUpdate"}
                                element={<MeetUpUpdatePage/>}
                            />
                            <Route
                                path={process.env.PUBLIC_URL + "/MeetUpRequestList"}
                                element={<MeetUpRequestList/>}
                            />

                            <Route
                                path={process.env.PUBLIC_URL + "/ChattingRoom"}
                                element={<ChattingRoom/>}
                            />


                            <Route
                                path={process.env.PUBLIC_URL + "/MainMeetUpDetail"}
                                element={<MainMeetUpDetail/>}
                            />

                            <Route
                                path={process.env.PUBLIC_URL + "/Address"}
                                element={<Address/>}
                            />





                            <Route path="*" element={<NotFound/>} />
                        </Routes>
                    </Suspense>
                </ScrollToTop>
            </Router>
        </LogingedContext.Provider>
    );
};

export default App;
