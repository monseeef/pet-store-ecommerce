// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const MenuCart = ({ cartData, currency, removeFromCart }) => {
//   const navigate = useNavigate();
  
//   let cartTotalPrice = 0;

//   const handleRemoveFromCart = (item) => {
//     removeFromCart(item);
//     toast.success("Item removed from cart");
//   };

//   return (
//     <div className="shopping-cart-content">
//       <ToastContainer />
//       {cartData && cartData.length > 0 ? (
//         <ul>
//           {cartData.map((single, key) => {
//             const finalProductPrice = (single.price * currency.currencyRate).toFixed(2);
//             cartTotalPrice += finalProductPrice * single.quantity;

//             return (
//               <li className="single-shopping-cart" key={key}>
//                 <div className="shopping-cart-img">
//                   <button onClick={() => navigate(`/product/${single.id}`)}>
//                     <img
//                       alt=""
//                       src={process.env.PUBLIC_URL + single.image[0]}
//                       className="img-fluid"
//                     />
//                   </button>
//                 </div>
//                 <div className="shopping-cart-title">
//                   <h4>
//                     <button onClick={() => navigate(`/product/${single.id}`)}>
//                       {single.name}
//                     </button>
//                   </h4>
//                   <h6>Qty: {single.quantity}</h6>
//                   <span>{`${currency.currencySymbol}${finalProductPrice}`}</span>
//                   {single.selectedProductColor && single.selectedProductSize && (
//                     <div className="cart-item-variation">
//                       <span>Color: {single.selectedProductColor}</span>
//                       <span>Size: {single.selectedProductSize}</span>
//                     </div>
//                   )}
//                 </div>
//                 <div className="shopping-cart-delete">
//                   <button onClick={() => handleRemoveFromCart(single)}>
//                     <i className="fa fa-times-circle" />
//                   </button>
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       ) : (
//         <p className="text-center">No items added to cart</p>
//       )}
//       {cartData && cartData.length > 0 && (
//         <div className="shopping-cart-total">
//           <h4>
//             Total:{" "}
//             <span className="shop-total">
//               {`${currency.currencySymbol}${cartTotalPrice.toFixed(2)}`}
//             </span>
//           </h4>
//         </div>
//       )}
//       {cartData && cartData.length > 0 && (
//         <div className="shopping-cart-btn btn-hover text-center">
//           <button className="default-btn" onClick={() => navigate("/cart")}>
//             view cart
//           </button>
//           <button className="default-btn" onClick={() => navigate("/checkout")}>
//             checkout
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MenuCart;
