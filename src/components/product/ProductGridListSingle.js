import PropTypes from "prop-types"; // PropTypes 라이브러리를 가져와서 props의 타입을 정의하고 검사하는 데 사용합니다.
import { Fragment, useState } from "react"; // React의 Fragment와 useState 훅을 가져옵니다.
import { useDispatch } from "react-redux"; // useDispatch 훅을 가져와서 Redux 액션을 디스패치할 수 있습니다.
import { Link } from "react-router-dom"; // react-router-dom의 Link 컴포넌트를 가져와서 내비게이션 링크를 만듭니다.
import clsx from "clsx"; // clsx 라이브러리를 가져와서 조건부 클래스를 편리하게 결합합니다.
import { getDiscountPrice } from "../../helpers/product"; // getDiscountPrice 헬퍼 함수를 가져와서 할인가를 계산합니다.
import Rating from "./sub-components/ProductRating"; // Rating 컴포넌트를 가져와서 제품의 평점을 표시합니다.
import ProductModal from "./ProductModal"; // ProductModal 컴포넌트를 가져옵니다.
import { addToCart } from "../../store/slices/cart-slice"; // addToCart 액션을 가져와서 장바구니에 추가할 수 있습니다.
import { addToWishlist } from "../../store/slices/wishlist-slice"; // addToWishlist 액션을 가져와서 위시리스트에 추가할 수 있습니다.
import { addToCompare } from "../../store/slices/compare-slice"; // addToCompare 액션을 가져와서 비교 목록에 추가할 수 있습니다.

const ProductGridListSingle = ({
  product, // 제품 정보가 포함된 객체입니다.
  currency, // 통화 정보가 포함된 객체입니다.
  cartItem, // 장바구니에 있는 제품 정보가 포함된 객체입니다.
  wishlistItem, // 위시리스트에 있는 제품 정보가 포함된 객체입니다.
  compareItem, // 비교 목록에 있는 제품 정보가 포함된 객체입니다.
  spaceBottomClass, // CSS 클래스를 추가로 적용하기 위한 문자열입니다.
}) => {
  const [modalShow, setModalShow] = useState(false); // modalShow 상태를 관리하기 위한 useState 훅을 사용합니다. 초기값은 false입니다.

  // 할인 가격을 계산합니다. product.price와 product.discount를 사용하여 계산합니다.
  const discountedPrice = getDiscountPrice(product.price, product.discount);
  // 최종 제품 가격을 계산합니다. 통화 환율을 적용하여 소수점 둘째 자리까지 반올림합니다.
  const finalProductPrice = +(product.price * currency.currencyRate).toFixed(2);
  // 최종 할인 가격을 계산합니다. 통화 환율을 적용하여 소수점 둘째 자리까지 반올림합니다.
  const finalDiscountedPrice = +(
    discountedPrice * currency.currencyRate
  ).toFixed(2);
  const dispatch = useDispatch(); // useDispatch 훅을 사용하여 Redux 액션을 디스패치할 수 있습니다.

  return (
    <Fragment>
      <div className={clsx("product-wrap", spaceBottomClass)}>
        {/* clsx를 사용하여 "product-wrap" 클래스와 함께 전달된 spaceBottomClass를 조건부로 추가합니다. */}
        <div className="product-img">
          <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
            {/* Link 컴포넌트를 사용하여 클릭 시 제품 상세 페이지로 이동할 수 있도록 합니다. */}
            <img
              className="default-img"
              src={process.env.PUBLIC_URL + product.image[0]}
              alt=""
              // product.image 배열의 첫 번째 이미지를 기본 이미지로 렌더링합니다.
            />
            {product.image.length > 1 ? (
              <img
                className="hover-img"
                src={process.env.PUBLIC_URL + product.image[1]}
                alt=""
                // product.image 배열의 두 번째 이미지가 있으면, hover 상태에서 표시할 이미지로 렌더링합니다.
              />
            ) : (
              ""
            )}
          </Link>
          {product.discount || product.new ? (
            <div className="product-img-badges">
              {/* product.discount 또는 product.new가 true일 경우 배지를 렌더링합니다. */}
              {product.discount ? (
                <span className="pink">-{product.discount}%</span>
              ) : (
                // 할인 배지를 렌더링합니다.
                ""
              )}
              {product.new ? <span className="purple">New</span> : ""}
              {/* 새 제품 배지를 렌더링합니다. */}
            </div>
          ) : (
            ""
          )}

          <div className="product-action">
            <div className="pro-same-action pro-wishlist">
              <button
                className={wishlistItem !== undefined ? "active" : ""}
                disabled={wishlistItem !== undefined}
                title={
                  wishlistItem !== undefined
                    ? "Added to wishlist"
                    : "Add to wishlist"
                }
                onClick={() => dispatch(addToWishlist(product))}
                // 위시리스트에 추가 버튼을 렌더링합니다. 이미 추가된 경우 비활성화됩니다.
              >
                <i className="pe-7s-like" />
              </button>
            </div>
            <div className="pro-same-action pro-cart">
              {product.affiliateLink ? (
                <a
                  href={product.affiliateLink}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {" "}
                  Buy now{" "}
                  {/* 제품이 제휴 링크가 있는 경우 'Buy now' 링크를 렌더링합니다. */}
                </a>
              ) : product.variation && product.variation.length >= 1 ? (
                <Link to={`${process.env.PUBLIC_URL}/product/${product.id}`}>
                  Select Option
                  {/* 제품에 여러 가지 변형이 있는 경우 'Select Option' 링크를 렌더링합니다. */}
                </Link>
              ) : product.stock && product.stock > 0 ? (
                <button
                  onClick={() => dispatch(addToCart(product))}
                  className={
                    cartItem !== undefined && cartItem.quantity > 0
                      ? "active"
                      : ""
                  }
                  disabled={cartItem !== undefined && cartItem.quantity > 0}
                  title={
                    cartItem !== undefined ? "Added to cart" : "Add to cart"
                  }
                  // 장바구니에 추가 버튼을 렌더링합니다. 이미 추가된 경우 비활성화됩니다.
                >
                  {" "}
                  <i className="pe-7s-cart"></i>{" "}
                  {cartItem !== undefined && cartItem.quantity > 0
                    ? "Added"
                    : "Add to cart"}
                </button>
              ) : (
                <button disabled className="active">
                  Out of Stock
                  {/* 제품이 재고가 없는 경우 'Out of Stock' 버튼을 렌더링합니다. */}
                </button>
              )}
            </div>
            <div className="pro-same-action pro-quickview">
              <button onClick={() => setModalShow(true)} title="Quick View">
                <i className="pe-7s-look" />
                {/* 'Quick View' 버튼을 렌더링합니다. 클릭 시 모달이 표시됩니다. */}
              </button>
            </div>
          </div>
        </div>
        <div className="product-content text-center">
          <h3>
            <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
              {product.name}
              {/* 제품 이름을 렌더링합니다. 클릭 시 제품 상세 페이지로 이동합니다. */}
            </Link>
          </h3>
          {product.rating && product.rating > 0 ? (
            <div className="product-rating">
              <Rating ratingValue={product.rating} />
              {/* 제품 평점을 렌더링합니다. */}
            </div>
          ) : (
            ""
          )}
          <div className="product-price">
            {discountedPrice !== null ? (
              <Fragment>
                <span>{currency.currencySymbol + finalDiscountedPrice}</span>{" "}
                <span className="old">
                  {currency.currencySymbol + finalProductPrice}
                </span>
                {/* 할인가와 원가를 렌더링합니다. */}
              </Fragment>
            ) : (
              <span>{currency.currencySymbol + finalProductPrice} </span>
              // 할인이 없는 경우 원가만 렌더링합니다.
            )}
          </div>
        </div>
      </div>
      <div className="shop-list-wrap mb-30">
        <div className="row">
          <div className="col-xl-4 col-md-5 col-sm-6">
            <div className="product-list-image-wrap">
              <div className="product-img">
                <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                  <img
                    className="default-img img-fluid"
                    src={process.env.PUBLIC_URL + product.image[0]}
                    alt=""
                    // product.image 배열의 첫 번째 이미지를 기본 이미지로 렌더링합니다.
                  />
                  {product.image.length > 1 ? (
                    <img
                      className="hover-img img-fluid"
                      src={process.env.PUBLIC_URL + product.image[1]}
                      alt=""
                      // product.image 배열의 두 번째 이미지가 있으면, hover 상태에서 표시할 이미지로 렌더링합니다.
                    />
                  ) : (
                    ""
                  )}
                </Link>
                {product.discount || product.new ? (
                  <div className="product-img-badges">
                    {product.discount ? (
                      <span className="pink">-{product.discount}%</span>
                    ) : (
                      // 할인 배지를 렌더링합니다.
                      ""
                    )}
                    {product.new ? <span className="purple">New</span> : ""}
                    // 새 제품 배지를 렌더링합니다.
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-8 col-md-7 col-sm-6">
            <div className="shop-list-content">
              <h3>
                <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                  {product.name}
                  {/* 제품 이름을 렌더링합니다. 클릭 시 제품 상세 페이지로 이동합니다. */}
                </Link>
              </h3>
              <div className="product-list-price">
                {discountedPrice !== null ? (
                  <Fragment>
                    <span>
                      {currency.currencySymbol + finalDiscountedPrice}
                    </span>{" "}
                    <span className="old">
                      {currency.currencySymbol + finalProductPrice}
                    </span>
                    {/* 할인가와 원가를 렌더링합니다. */}
                  </Fragment>
                ) : (
                  <span>{currency.currencySymbol + finalProductPrice} </span>
                  // 할인이 없는 경우 원가만 렌더링합니다.
                )}
              </div>
              {product.rating && product.rating > 0 ? (
                <div className="rating-review">
                  <div className="product-list-rating">
                    <Rating ratingValue={product.rating} />
                    {/* 제품 평점을 렌더링합니다. */}
                  </div>
                </div>
              ) : (
                ""
              )}
              {product.shortDescription ? (
                <p>{product.shortDescription}</p>
              ) : (
                // 제품의 짧은 설명을 렌더링합니다.
                ""
              )}

              <div className="shop-list-actions d-flex align-items-center">
                <div className="shop-list-btn btn-hover">
                  {product.affiliateLink ? (
                    <a
                      href={product.affiliateLink}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {" "}
                      Buy now{" "}
                      {/* 제품이 제휴 링크가 있는 경우 'Buy now' 링크를 렌더링합니다. */}
                    </a>
                  ) : product.variation && product.variation.length >= 1 ? (
                    <Link
                      to={`${process.env.PUBLIC_URL}/product/${product.id}`}
                    >
                      Select Option
                      {/* 제품에 여러 가지 변형이 있는 경우 'Select Option' 링크를 렌더링합니다. */}
                    </Link>
                  ) : product.stock && product.stock > 0 ? (
                    <button
                      onClick={() => dispatch(addToCart(product))}
                      className={
                        cartItem !== undefined && cartItem.quantity > 0
                          ? "active"
                          : ""
                      }
                      disabled={cartItem !== undefined && cartItem.quantity > 0}
                      title={
                        cartItem !== undefined ? "Added to cart" : "Add to cart"
                      }
                      // 장바구니에 추가 버튼을 렌더링합니다. 이미 추가된 경우 비활성화됩니다.
                    >
                      {" "}
                      <i className="pe-7s-cart"></i>{" "}
                      {cartItem !== undefined && cartItem.quantity > 0
                        ? "Added"
                        : "Add to cart"}
                    </button>
                  ) : (
                    <button disabled className="active">
                      Out of Stock
                      {/* 제품이 재고가 없는 경우 'Out of Stock' 버튼을 렌더링합니다. */}
                    </button>
                  )}
                </div>

                <div className="shop-list-wishlist ml-10">
                  <button
                    className={wishlistItem !== undefined ? "active" : ""}
                    disabled={wishlistItem !== undefined}
                    title={
                      wishlistItem !== undefined
                        ? "Added to wishlist"
                        : "Add to wishlist"
                    }
                    onClick={() => dispatch(addToWishlist(product))}
                    // 위시리스트에 추가 버튼을 렌더링합니다. 이미 추가된 경우 비활성화됩니다.
                  >
                    <i className="pe-7s-like" />
                  </button>
                </div>
                <div className="shop-list-compare ml-10">
                  <button
                    className={compareItem !== undefined ? "active" : ""}
                    disabled={compareItem !== undefined}
                    title={
                      compareItem !== undefined
                        ? "Added to compare"
                        : "Add to compare"
                    }
                    onClick={() => dispatch(addToCompare(product))}
                    // 비교 목록에 추가 버튼을 렌더링합니다. 이미 추가된 경우 비활성화됩니다.
                  >
                    <i className="pe-7s-shuffle" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        currency={currency}
        discountedPrice={discountedPrice}
        finalProductPrice={finalProductPrice}
        finalDiscountedPrice={finalDiscountedPrice}
        wishlistItem={wishlistItem}
        compareItem={compareItem}
        // ProductModal 컴포넌트를 사용하여 모달을 표시합니다. show는 modalShow 상태를 따르며, onHide는 모달을 숨기기 위한 콜백 함수입니다.
      />
    </Fragment>
  );
};

// propTypes를 사용하여 ProductGridListSingle 컴포넌트가 받는 props의 타입을 정의합니다.
ProductGridListSingle.propTypes = {
  cartItem: PropTypes.shape({}), // cartItem은 객체 타입이어야 합니다.
  compareItem: PropTypes.shape({}), // compareItem은 객체 타입이어야 합니다.
  currency: PropTypes.shape({}), // currency는 객체 타입이어야 합니다.
  product: PropTypes.shape({}), // product는 객체 타입이어야 합니다.
  spaceBottomClass: PropTypes.string, // spaceBottomClass는 문자열 타입이어야 합니다.
  wishlistItem: PropTypes.shape({}), // wishlistItem은 객체 타입이어야 합니다.
};

export default ProductGridListSingle; // ProductGridListSingle 컴포넌트를 기본으로 내보냅니다.
