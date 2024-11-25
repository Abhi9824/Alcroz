import React from 'react';
import { Link } from 'react-router-dom';

const RelatedProducts = ({ relatedProducts }) => {
  return (
    <div className="related-products py-1 ">
       <h3>Similar Products</h3>
       {/* <p>Here are some related products you might like.</p> */}
      <div className="row">
        {relatedProducts.map((prod) => (
          <div className="col-md-4" key={prod._id}>
            <div className="product-card">
              <Link to={`/productDetails/${prod._id}`} className="linkDecoration">
                <img
                  src={prod.images[0]}
                  alt={prod.title}
                  className="product-image"
                  onMouseOver={(e) => (e.currentTarget.src = prod.images[1])}
                  onMouseOut={(e) => (e.currentTarget.src = prod.images[0])}
                />
              </Link>
              <div className="card-body cardBody">
                <h5 className="card-title">{prod.brand}</h5>
                <p className="card-text fw-bold productTitle">{prod.title}</p>
                <p className="card-text fs-5 fw-bold">${prod.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
