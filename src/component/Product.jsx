import ProductItem from './ProductItem'

const Product = (props) => {
  const {products, hoveredProductNum} = props;

  return (
    <div style={{ height: '100%' }}>
      {products.map((product, index) => (
        <ProductItem
          key={index + 1}
          product={product}
          isHovered={hoveredProductNum === index + 1}
          isFirst={index === 0}
          isLast={index === products.length - 1}
        />
      ))}
    </div>
  );
};
  
export default Product;
