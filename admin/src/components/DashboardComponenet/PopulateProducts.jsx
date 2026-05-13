import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mostPopularProduct } from '@/services/reducer/orderSlice';

function PopularProducts() {
  const dispatch = useDispatch();
  const popularProducts = useSelector((state) => state.orders.mostPopularProduct);

  useEffect(() => {
    dispatch(mostPopularProduct());
  }, [dispatch]);

  return (
    <div className="admin-card w-full p-4">
      <strong className="font-semibold text-slate-800">Popular Products</strong>
      <div className="mt-4 flex flex-col gap-3">

        {popularProducts?._id ? (
          <div className="flex items-start">
            <div className="w-10 h-10 min-w-[2.5rem] bg-gray-200 rounded-sm">
              <img
                className="w-full h-full object-cover rounded-sm"
                src={popularProducts.image || "https://source.unsplash.com/100x100?pet-product"}
                alt={popularProducts.name || "Popular product"}
              />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm text-gray-800">{popularProducts.name || "Unnamed product"}</p>
              <span
                className={classNames(
                  popularProducts.stock === 0
                    ? 'text-red-500'
                    : popularProducts.stock > 50
                    ? 'text-green-500'
                    : 'text-orange-500',
                  'text-xs font-medium'
                )}
              >
                {popularProducts.stock === 0 ? 'Out of Stock' : (popularProducts.stock ?? 0) + ' in Stock'}
              </span>
            </div>
            <div className="text-xs text-gray-400 pl-1.5">${Number(popularProducts.price || 0).toFixed(2)}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">No popular product yet.</div>
        )}

      </div>
    </div>
  );
}

export default PopularProducts;
