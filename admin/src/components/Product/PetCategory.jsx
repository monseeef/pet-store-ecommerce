// // import React,{useState, useEffect} from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import {fetchCategories} from '../../services/reducer/petCategorySlice'
// // export default function PetCategory() {
// //   return (
// //     <>
// //       <div>PetCategory</div>
// //     </>
// //   );
// // }

// //     //   <div className="mb-5">
// //     //     <label htmlFor="category" className="block mb-2 text-sm text-gray-900">
// //     //       Category
// //     //     </label>
// //     //     {/* <input
// //     //           type="text"
// //     //           id="category"
// //     //           value={category}
// //     //           onChange={(e) => setCategory(e.target.value)}
// //     //           className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
// //     //         /> */}
// //     //     <select
// //     //       id="category"
// //     //       value={category}
// //     //       onChange={(e) => setCategory(e.target.value)}
// //     //       className="block w-full p-1 text-gray-900 border-none border-gray-300 rounded-lg bg-gray-50  "
// //     //     >
// //     //       <option value=""></option>
// //     //       {/* {categories.map((cat) => (
// //     //         <option key={cat._id} value={cat._id}>{cat.name}</option>
// //     //         ))} */}
// //     //       {categories.map(
// //     //         (cat) =>
// //     //           cat.name != category && (
// //     //             <option key={cat._id} value={cat._id}>
// //     //               {cat.name}
// //     //             </option>
// //     //           )
// //     //       )}
// //     //     </select>
// //     //   </div>

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCategories, selectCategories } from '../../services/reducer/petCategorySlice';

// const PetCategory = () => {
//   const dispatch = useDispatch();
//   const categories = useSelector(selectCategories);
//   // const categories = useSelector((state) => state.petCategory.categories);

//   useEffect(() => {
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   useEffect(() => {
//   }, [categories]);

//   const category = categories.categories ;

//   return (
//     <div className="mb-5">
//       <label htmlFor="category" className="block mb-2 text-sm text-gray-900">
//         Category
//       </label>
//       <select
//         id="category"
//         className="block w-full p-1 text-gray-900 border-none border-gray-300 rounded-lg bg-gray-50"
//       >
//         <option value="">All Categories</option>
//         {Array.isArray(category) && category.length > 0 && category.map(cat =>
//         (
//           <option key={cat._id} value={cat._id}>
//              {cat.name}
//           </option>
//         )
//         )}
//       </select>
//     </div>
//   );
// };

// export default PetCategory;
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  selectCategories,
} from "../../services/reducer/petCategorySlice";

const PetCategory = ({ onChange }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    onChange(categoryId); // Call the onChange callback with the selected category ID
  };

  const category = categories.categories;

  return (
    <div>
      <select
        id="category"
        value={selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="admin-select min-w-48"
      >
        <option value="">All Categories</option>
        {Array.isArray(category) &&
          category.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default PetCategory;
