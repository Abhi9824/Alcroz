import React from 'react';
import { filterByCategory, filterByGender, filterRating, sortByPrice, priceFilter, resetFilters } from "../../features/productSlice";
import { useDispatch, useSelector } from 'react-redux';

const Filter = () => {
  const dispatch = useDispatch();
  const { filterCategory, rating, price, gender,sortBy } = useSelector((state) => state.products);

  const priceHandler = (e) => {
    const selectedPrice = Number(e.target.value);
    dispatch(priceFilter(selectedPrice)); // Dispatch the price filter with the selected value
  };

  const genderHandler = (e) => {
    const { value } = e.target;
  
    let updatedGender;
    if (gender.includes(value)) {
      // Remove the selected value if it's already in the gender array
      updatedGender = gender.filter((g) => g !== value);
    } else {
      // Add the selected value if it's not in the gender array
      updatedGender = [...gender, value];
    }
  
    dispatch(filterByGender(updatedGender)); // Dispatch the updated gender array
  };
  
  
 
  const ratingHandler=(e)=>{
    const {value}=e.target;
    console.log(value)
    dispatch(filterRating(value))
  }

  const sortHandler=(e)=>{
    const{value}=e.target;
    dispatch(sortByPrice(value))
  }

  const handleClearFilters = () => {
    dispatch(resetFilters());
  };


  const filterCategoryhandler=(e)=>{
   const {value}=e.target;

   let updatedCategory;
   if(filterCategory.includes(value)){
    updatedCategory=filterCategory.filter((g)=>g!==value)
   }else{
    updatedCategory=[...filterCategory,value]
   }
dispatch(filterByCategory(updatedCategory))

  }
  

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h6 className="fw-bolder">Filters:</h6>
        <button className="btn btn-link text-decoration-none" onClick={handleClearFilters}>
          Clear
        </button>
      </div>
      <form>
        <div className="price-filter py-3">
          <label htmlFor="price" className="fw-bolder">Price</label>
          <div>
            <span>{price}</span><br />
            <input
              id="price"
              value={price}
              type="range"
              min={5000}
              max={80000}
              step={5000}
              onChange={priceHandler} // Update price using the handler
              className="form-range"
            />
          </div>
        </div>
        <div className='genderCategory py-3'>
          <label htmlFor="gender" className="fw-bolder">Gender:</label><br />
          <input
            type="checkbox"
            value="Mens"
            name="gender"
            checked={gender.includes("Mens")}
            onChange={genderHandler}
          /> Mens<br />

          <input
            type="checkbox"
            value="Womens"
            name="gender"
            checked={gender.includes("Womens")}
            onChange={genderHandler}
          /> Womens<br />

          <input
            type="checkbox"
            value="Unisex"
            name="gender"
            checked={gender.includes("Unisex")}
            onChange={genderHandler}
          /> Unisex<br />
        </div>

        <div className='filterCategory py-3'>
          <label htmlFor="filterCategory" className="fw-bolder">Category:</label><br />
          <input
            type="checkbox"
            value="Sneaker"
            name="filterCategory"
            checked={filterCategory.includes("Sneaker")}
            onChange={filterCategoryhandler}
          /> Sneaker<br />

          <input
            type="checkbox"
            value="Running"
            name="filterCategory"
            checked={filterCategory.includes("Running")}
            onChange={filterCategoryhandler}
          /> Running<br />


<input
            type="checkbox"
            value="Luxury"
            name="filterCategory"
            checked={filterCategory.includes("Luxury")}
            onChange={filterCategoryhandler}
          /> Luxury<br />


<input
            type="checkbox"
            value="Casual"
            name="filterCategory"
            checked={filterCategory.includes("Casual")}
            onChange={filterCategoryhandler}
          /> Casual<br />

          <input
            type="checkbox"
            value="StreetWear"
            name="filterCategory"
            checked={filterCategory.includes("StreetWear")}
            onChange={filterCategoryhandler}
          /> StreetWear<br />
        </div>

        <div className='rating py-3'>
        <label htmlFor="rating" className='fw-bolder'>Rating</label><br/>
        <input type="radio" 
            name='rating'
            value='4'
            onChange={ratingHandler}
            checked={rating==='4'}
        /> 4 stars & above<br/>

<input type="radio" 
            name='rating'
            value='3'
            onChange={ratingHandler}
            checked={rating==='3'}
        /> 3 stars & above<br/>


<input type="radio" 
            name='rating'
            value='2'
            onChange={ratingHandler}
            checked={rating==='2'}
        /> 2 stars & above<br/>

        </div>

        <div className='sortByPrice py-3'>
        <label htmlFor="sortByPrice" className='fw-bolder'>Sort By:</label><br/>
        <input type="radio" name='sortByPrice' value="asc" checked={sortBy==='asc'} onChange={sortHandler} /> Price - Low to High<br/>
        <input type="radio" name='sortByPrice' value="des" checked={sortBy==='des'} onChange={sortHandler} /> Price - High to Low<br/>
        </div>



      </form>
    </>
  );
};

export default Filter;
