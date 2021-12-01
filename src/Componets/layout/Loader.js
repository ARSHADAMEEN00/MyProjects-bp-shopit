import React from 'react'

const Loader = () => {
    return (
        <>
          <div class="preloaderBg" id="preloader" onload="preloader()">
            <div class="preloader">
              <img src="/images/logo_r.png" alt="logo" />
              <div class="preloader2"></div>
            </div>
          </div>   
        </>
    )
}

export default Loader
