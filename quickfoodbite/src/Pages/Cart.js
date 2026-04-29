// // CartPage.js
// import React from "react";
// import { useCart } from "../context/cart";
// import Layout from "../Components/Layout/Layout";
// import { toast } from "react-toastify";
// import { Button } from "react-bootstrap";

// const CartPage = () => {
//   const { cart, setCart } = useCart();

//   // delete booking
//   const removecart = async (pid) => {
//     try {
//       let mycart = [...cart];
//       let index = mycart.findIndex((item) => item._id === pid);
//       mycart.splice(index, 1);
//       setCart(mycart);
//       localStorage.setItem("cart", JSON.stringify(mycart));
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const totalPrice = () => {
//     try {
//       let total = 0;
//       cart?.map((item) => {
//         total = total + item.totalPrice;
//       });
//       return total.toLocaleString("en-us", {
//         style: "currency",
//         currency: "USD",
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <Layout title="Cart - BurgerShop">

//       <div className="row justify-content-center m-0">
//         <div className="col-md-8 mt-5 mb-5 cardsdetails">
//           <div className="card">
//             <div
//               className="card-header p-3"
//               style={{ backgroundColor: "rgb(126, 34, 206)" }}
//             >
//               <div className="card-header-flex">
//                 <h5 className="text-white m-0">
//                   Cart Calculation
//                   {cart.length > 0 ? `(${cart.length})` : ""}
//                 </h5>
//               </div>
//             </div>
//             <div className="card-body p-0">
//               {cart.length === 0 ? (
//                 <table className="table cart-table mb-0">
//                   <tbody>
//                     <tr>
//                       <td colSpan={6}>
//                         <div className="cart-empty">
//                           <i className="fa fa-shopping-cart"></i>
//                           <p>Your cart Is Empty</p>
//                         </div>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               ) : (
//                 <table className="table cart-table mb-0 table-responsive-sm">
//                   <thead>
//                     <tr>
                
//                       <th>Product</th>
//                       <th>Name</th>
                     
//                       <th>Price</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {cart?.map((p, index) => {
//                       return (
//                         <>
//                           <tr>
//                             <td>
//                               <button
//                                 className="prdct-delete"
//                                 onClick={() => removecart(p._id)}
//                               >
//                                 <i className="fa fa-trash-alt"></i>
//                               </button>
//                             </td>
                            
//                             <td>
//                               <div className="product-name">
//                                 <p>{p.name}</p>
//                               </div>
//                             </td>
                       
//                             <td>{p.price}</td>
//                           </tr>
//                         </>
//                       );
//                     })}
//                   </tbody>
//                   <tfoot>
//                     <tr>
//                       <th>&nbsp;</th>
//                       <th colSpan={2}>&nbsp;</th>
//                       <th className="text-right">
//                         Total Price<span className="ml-2 mr-2">:</span>
//                         <span className="text-danger">{totalPrice()}</span>
//                       </th>
//                       <th className="text-right">
//                 <Button
//   variant="success"
//   className="w-100 mt-2"
//   onClick={() => {
//     const phone = "923437648604"; // your WhatsApp number
//     const url = `https://wa.me/${phone}`;
//     window.open(url, "_blank"); // opens WhatsApp chat
//   }}
// >
//   Order Now
// </Button>
                        
//                       </th>
//                     </tr>
//                   </tfoot>
//                 </table>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default CartPage;
