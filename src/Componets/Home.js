import React, { useEffect, useState } from "react";
import MetaData from "./layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../action/productAction";
import Products from "./products/Products";
import Loader from "./layout/Loader";
import { useAlert } from "react-alert";
import Pagination from "react-js-pagination";
import ProductFilter from "./products/ProductFilter";
import { useLocation } from "react-router";

const Home = ({ match }) => {

  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, products, error, productsCount, resPerPage, filteredProductsCount } = useSelector(
    (state) => state.products
  ); // this data is from payload
  console.log(products);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  //price filter slider
  const [price, setPrice] = useState([1, 1000])
  //catogory filter
  const [category, setCategory] = useState('')

  const categories = [
    'Electronics',
    'Cameras',
    'Laptops',
    'Accessories',
    'Headphones',
    'Food',
    "Books",
    'Clothes/Shoes',
    'Beauty/Health',
    'Sports',
    'Outdoor',
    'Home'
  ]

  //filter by rating
  const [rating, setRating] = useState(0)

  const handleCurrentPageNo = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //search keyword
  const keyword = match.params.keyword;

  useEffect(() => {
    if (error) {
      //  return alert.success('Success')
      return alert.error(error);
    }
    dispatch(getProducts(keyword, currentPage, price, category, rating));
  }, [dispatch, alert, error, keyword, currentPage, price, category, rating]);

  //get filteredProductsCount
  let Count = productsCount
  if (keyword) {
    Count = filteredProductsCount
  }


  return (
    <>
      {
        useLocation().pathname === '/search' ? <div className='row'>
          <ProductFilter categories={categories} price={price} setPrice={setPrice} setCategory={setCategory} setRating={setRating} />

          <div className="col-6 col-md-9">
            <div className="row">
              {products?.map((product) => (
                <Products key={product._id} product={product} col={4} />
              ))}
            </div>
          </div>
        </div> : (<>
          {loading ? (
            <Loader />
          ) : (
            <>
              <MetaData title={"Buy Best Products Online"} />
              <h1 id="products_heading">Latest Products</h1>

              <section id="products" className="container mt-5">
                <div className="row">
                  {keyword ? (<>
                    <ProductFilter categories={categories} price={price} setPrice={setPrice} setCategory={setCategory} setRating={setRating} />

                    <div className="col-6 col-md-9">
                      <div className="row">
                        {products?.map((product) => (
                          <Products key={product._id} product={product} col={4} />
                        ))}
                      </div>
                    </div>
                  </>
                  ) : (
                    products?.map((product) => (
                      <Products key={product._id} product={product} col={3} />
                    ))
                  )}

                </div>
              </section>
              {resPerPage <= Count && (
                <div className="d-flex justify-content-center mt-5">
                  <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resPerPage}
                    totalItemsCount={productsCount}
                    nextPageText={"Next"}
                    prevPageText={"Prev"}
                    firstPageText={"First"}
                    lastPageText={"Last"}
                    onChange={handleCurrentPageNo}
                    itemClass="page-item"
                    linkClass="page-link"
                  />
                </div>
              )}
            </>
          )}
        </>)}

    </>
  );
};

export default Home;
