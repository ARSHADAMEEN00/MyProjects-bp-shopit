import React from "react";
import { useAlert } from "react-alert";
import { useSelector, useDispatch } from "react-redux";
import { Link, Route } from "react-router-dom";
import { logoutUser } from "../../action/userAction";
import Search from "./Search";
const Header = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { user, loading } = useSelector((state) => state.auth);

  const onHandleLogout =()=>{
    dispatch(logoutUser())
    alert.success('Logged out successfully')
  }
  return (
    <>
      <nav className="navbar row">
        <div className="col-12 col-md-3">
          <div className="navbar-brand">
            <Link to="/">
              <img
                src="/images/NicePng_amazon-logo-png_167642.png"
                alt="logo-ecomme"
              />
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <Route render={({ history }) => <Search history={history} />} />
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          <Link to="/cart" style={{ textDecoration: 'none' }} >
            <span id="cart" className="ml-3">Cart</span>
            <span className="ml-1" id="cart_count">3</span>
          </Link>

          {user ? (
            <div className="ml-4 dropdown d-inline">
              <Link to="#!" className="btn dropdown-toggle text-white mr-5" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >

                <figure className="avatar avatar-nav">
                  <img
                    src={user.avatar?.url}
                    alt={user?.name}
                    className="rounded-circle"
                  />
                </figure>
                <span>{user?.name}</span>
              </Link>

              <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">

                {user?.role !== "admin" ?(
                    <Link to='/orders/me' className="dropdown-item" >Orders</Link>
                ):(
                  <Link to='/dashboard' className="dropdown-item" >Dashboard</Link>
                )}
                
                  <Link to='/me' className="dropdown-item" >Profile</Link>
                <Link className="dropdown-item text-danger" to="/" onClick={onHandleLogout}>
                  Logout
                </Link>

              </div>


            </div>

          ) : !loading && <Link to="/login" className="btn ml-4" id="login_btn">Login</Link>}


        </div>
      </nav>
    </>
  );
};

export default Header;
