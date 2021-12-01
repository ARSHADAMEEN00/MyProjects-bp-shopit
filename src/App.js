import "./App.css";
import Footer from "./Componets/layout/Footer";
import Header from "./Componets/layout/Header";
import { Route } from "react-router-dom";
import Home from "./Componets/Home";
import productDetails from "./Componets/products/ProductDetails";
import Login from "./Componets/user/Login";
import Register from "./Componets/user/Register";
import {loadUser} from "./action/userAction";
import store from "./store"
import { useEffect } from "react";
import Profile from "./Componets/user/Profile";
import ProtectedRoute from "./Componets/rout/ProtectedRoute";
import UpdateProfile from "./Componets/user/UpdateProfile";
function App() {

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <div className="App">
      <Header />
      <div className="container container-fluid">
        <Route path="/" exact component={Home} />
        <Route path="/search" exact component={Home} />
        <Route path="/search/:keyword" component={Home} />
        <Route path="/product/:id" component={productDetails} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <ProtectedRoute path="/me" exact component={Profile} />
        <ProtectedRoute path="/me/update" exact component={UpdateProfile} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
