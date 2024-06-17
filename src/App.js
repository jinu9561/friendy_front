import { Suspense, createContext, lazy, useEffect, useState } from "react";
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export const LogingedContext = createContext();

// 메인페이지
const HomeBookStore = lazy(() => import("./pages/home/HomeBookStore"));

// 사진게시판 , 소모임게시판, 이벤트 게시판
const ShopGridStandard = lazy(() => import("./pages/shop/ShopGridStandard"));
const PhotoBoard = lazy(() => import("./pages/generalBoards/PhotoBoard")); //사진게시판
const ShopGridFilter = lazy(() => import("./pages/shop/ShopGridFilter")); //사진 게시판 데모
const ShopListTwoColumn = lazy(() => import("./pages/shop/ShopListTwoColumn"));

// 사진게시판 , 소모임게시판, 이벤트 게시판 상세보기
const Product = lazy(() => import("./pages/shop-product/Product"));
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
// 젤리 결제
const Wishlist = lazy(() => import("./pages/other/Wishlist"));

const NotFound = lazy(() => import("./pages/other/NotFound"));

const App = () => {
  //컴포넌트가 mount or update 될때 로그인 여부에 따른 상태값 변경
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    localStorage.getItem("userSeq") != null
      ? setIsLoggedIn(true)
      : setIsLoggedIn(false);
    console.log("isLoggeedIn = ", isLoggedIn);
  });

  const handleLoggedChange = (isLoggedIn) => {
    setIsLoggedIn(isLoggedIn);
  };

  return (
    <LogingedContext.Provider
      value={{ isLoggedIn: isLoggedIn, onLoggedChange: handleLoggedChange }}
    >
      <Router>
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
                path={process.env.PUBLIC_URL + "/shop-grid-standard"}
                element={<ShopGridStandard />}
              />

              {/* 사진 게시판 */}
              <Route
                path={process.env.PUBLIC_URL + "/photo-board"}
                element={<PhotoBoard />}
              />

              {/*사진 게시판 데모 */}
              <Route
                path={process.env.PUBLIC_URL + "/shop-grid-filter"}
                element={<ShopGridFilter />}
              />

              {/* 이벤트 게시판 */}
              <Route
                path={process.env.PUBLIC_URL + "/shop-list-two-column"}
                element={<ShopListTwoColumn />}
              />

              {/* 자유 게시판, 익명 게시판 */}
              <Route
                path={process.env.PUBLIC_URL + "/blog-no-sidebar"}
                element={<BlogNoSidebar />}
              />

              {/* 자유 게시판, 익명 게시판 상세보기 */}
              <Route
                path={process.env.PUBLIC_URL + "/blog-details-standard"}
                element={<BlogDetailsStandard />}
              />

              {/* 사진 게시판 상세보기 */}
              <Route
                path={process.env.PUBLIC_URL + "/product-slider/:id"}
                element={<ProductSlider />}
              />

              {/* 이벤트 게시판 상세보기 */}
              <Route
                path={process.env.PUBLIC_URL + "/product/:id"}
                element={<Product />}
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

              {/* 젤리 결제 */}
              <Route
                path={process.env.PUBLIC_URL + "/wishlist"}
                element={<Wishlist />}
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ScrollToTop>
      </Router>
    </LogingedContext.Provider>
  );
};

export default App;
