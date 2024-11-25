import "./CarouselsProducts.css"

const CarouselProducts = ({ productData }) => {
    if (!productData || !productData.images || !productData.images.length) {
        return <div>No images available</div>;
      }
  
    return (
      <div id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-inner">
          {productData.images.map((image, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 0 ? 'active' : ''}`}
            >
              <img src={image} className="d-block w-100" alt={productData.title} />
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    );
  };
  

  export default CarouselProducts;