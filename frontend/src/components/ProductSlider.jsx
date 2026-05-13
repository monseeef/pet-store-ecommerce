import Slider from "react-slick"; // Assuming 'react-slick' for slider functionality

const ProductSlider = ({ products }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  return (
    <div>
      <Slider {...settings}>
        {products.map((product, index) => (
          <div key={index}>
            <h3>{product.name}</h3>
            <img src={product.image} alt={product.name} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductSlider;
