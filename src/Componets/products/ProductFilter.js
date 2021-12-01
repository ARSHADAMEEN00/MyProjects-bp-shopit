import React from "react";

//price slider Range
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);
const ProductFilter = ({setCategory,setRating,setPrice,price,categories}) => {
  return (
    <>
      <div className="col-6 col-md-3 mt-5 mb-5">
        <div className="px-5">
          {/* <RcSlider/> */}
          <Range
            marks={{
              1: `$1`,
              1000: `$1000`,
            }}
            min={1}
            max={1000}
            defaultValue={[1, 1000]}
            tipFormatter={(value) => `$${value}`}
            tipProps={{
              placement: "top",
              visible: true,
            }}
            value={price}
            onChange={(price) => setPrice(price)}
          />

          <hr className="my-5" />

          <div className="mt-5">
            <h4 className="mb-3">Categories</h4>

            <ul className="pl-0">
              {categories.map((category) => (
                <li
                  style={{ listStyle: "none", cursor: "pointer" }}
                  onClick={() => setCategory(category)}
                  key={category}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>

          <hr className="my-3" />

          <div className="mt-5">
            <h4 className="mb-3">Ratings</h4>

            <ul className="pl-0">
              {[5, 4, 3, 2, 1].map((star) => (
                <li
                  style={{ listStyle: "none", cursor: "pointer" }}
                  onClick={() => setRating(star)}
                  key={star}
                >
                  <div className="rating-outer">
                    <div
                      className="rating-inner"
                      style={{ width: `${star * 20}%` }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFilter;
