import { useSelector } from 'react-redux';

const WishlistPage = () => {
    const wishlistItems = useSelector((state) => state.wishlist.items);

    return (
        <div>
            <h2>Wishlist</h2>
            <div>
                {wishlistItems.map((item) => (
                    <div key={item._id}>
                        <p>{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;
