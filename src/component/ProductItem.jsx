import "../style/ProductItem.css";

const ProductItem = (props) => {
  const {product, isHovered, isFirst, isLast} = props;

  return (
    <div className={`product-container ${isHovered ? 'product-container-hoverd' : ''}`}>
      <div className={`product nes-container is-rounded is-dark ${isHovered
          ? 'product-hovered'
          : ''}`}>
        <div className='up-arrow-container'>
          {isHovered && !isFirst && (
            <p className="up-arrow">▲</p>
          )}
        </div>
        <div className='product-name-container'>
          {product.name}
        </div>
        <div className='product-description-container'>
          {product.description}
        </div>
        <div className='product-url-and-down-arrow-container'>
          <div className='product-url-container'>
            <i className="nes-icon google"></i>
            <button type="button" className="url-button nes-btn is-primary">Press A Button</button>
          </div>
          <div className='down-arrow-container'>
          {isHovered && !isLast && (
            <p className="down-arrow">▲</p>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
