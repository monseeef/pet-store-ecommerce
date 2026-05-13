// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import MenuCart from "./sub-components/MenuCart.jsx";
// import { removeFromCart } from "@/services/reducer/cartSlice";

// const CartIcon = ({ iconWhiteClass }) => {
//   const cartData = useSelector((state) => state.cartData);
//   const wishlistData = useSelector((state) => state.wishlistData);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleRemoveFromCart = (item, addToast) => {
//     dispatch(removeFromCart(item, addToast));
//   };

//   const handleClick = (e) => {
//     e.currentTarget.nextSibling.classList.toggle("active");
//   };

//   return (
//     <div className={`header-right-wrap ${iconWhiteClass ? iconWhiteClass : ""}`}>
//       <div className="same-style header-wishlist">
//         <button onClick={() => navigate('/wishlist')}>
//           <i className="pe-7s-like" />
//           <span className="count-style">
//             {wishlistData && wishlistData.length ? wishlistData.length : 0}
//           </span>
//         </button>
//       </div>
//       <div className="same-style cart-wrap d-none d-lg-block">
//         <button className="icon-cart" onClick={handleClick}>
//           <i className="pe-7s-shopbag" />
//           <span className="count-style">
//             {cartData && cartData.length ? cartData.length : 0}
//           </span>
//         </button>
//         <MenuCart cartData={cartData} removeFromCart={handleRemoveFromCart} />
//       </div>
//       <div className="same-style cart-wrap d-block d-lg-none">
//         <button className="icon-cart" onClick={() => navigate('/cart')}>
//           <i className="pe-7s-shopbag" />
//           <span className="count-style">
//             {cartData && cartData.length ? cartData.length : 0}
//           </span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CartIcon;


