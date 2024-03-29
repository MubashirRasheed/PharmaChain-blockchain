import { Suspense, lazy } from "react";
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RedirectComponent from "./pages/other/Redirect-components";

// home pages
const HomeMedicalEquipment = lazy(() =>
  import("./pages/home/HomeMedicalEquipment")
);

// shop pages
const ShopGridFullWidth = lazy(() => import("./pages/shop/ShopGridFullWidth"));
const ShopListFullWidth = lazy(() => import("./pages/shop/ShopListFullWidth"));

// product pages
const Product = lazy(() => import("./pages/shop-product/Product"));
// const ProductTabLeft = lazy(() =>

// other pages
const About = lazy(() => import("./pages/other/About"));
const Contact = lazy(() => import("./pages/other/Contact"));
const MyAccount = lazy(() => import("./pages/other/MyAccount"));
const LoginRegister = lazy(() => import("./pages/other/LoginRegister"));

const Cart = lazy(() => import("./pages/other/Cart"));
const CheckoutSuccess = lazy(() => import("./pages/other/CheckoutSuccess"));
const Wishlist = lazy(() => import("./pages/other/Wishlist"));
const Checkout = lazy(() => import("./pages/other/Checkout"));

const NotFound = lazy(() => import("./pages/other/NotFound"));

const App = () => {
  return (
      <Router>
        <ScrollToTop>
          <Suspense
            fallback={
              <div className="flone-preloader-wrapper">
                <div className="flone-preloader">
                  <span></span>
                  <span></span>
                </div>
              </div>
            }
          >
            <Routes>
              <Route
                path={process.env.PUBLIC_URL + "/"}
                element={<HomeMedicalEquipment/>}
              />

              {/* Homepages */}
              
              <Route
                path={process.env.PUBLIC_URL + "/home-medical-equipment"}
                element={<HomeMedicalEquipment/>}
              />
              
              {/* Shop pages */}
              {/* <Route
                path={process.env.PUBLIC_URL + "/shop-grid-standard"}
                element={<ShopGridStandard/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/shop-grid-filter"}
                element={<ShopGridFilter/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/shop-grid-two-column"}
                element={<ShopGridTwoColumn/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/shop-grid-no-sidebar"}
                element={<ShopGridNoSidebar/>}
              /> */}
              <Route
                path={process.env.PUBLIC_URL + "/shop-grid-full-width"}
                element={<ShopGridFullWidth/>}
              />
              {/* <Route
                path={process.env.PUBLIC_URL + "/shop-grid-right-sidebar"}
                element={<ShopGridRightSidebar/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/shop-list-standard"}
                element={<ShopListStandard/>}
              /> */}
              <Route
                path={process.env.PUBLIC_URL + "/shop-list-full-width"}
                element={<ShopListFullWidth/>}
              />
              {/* <Route
                path={process.env.PUBLIC_URL + "/shop-list-two-column"}
                element={<ShopListTwoColumn/>}
              /> */}

              {/* Shop product pages */}
              <Route
                path={process.env.PUBLIC_URL + "/product/:id"}
                element={<Product />}
              />
              {/* <Route
                path={process.env.PUBLIC_URL + "/product-tab-left/:id"}
                element={<ProductTabLeft/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/product-tab-right/:id"}
                element={<ProductTabRight/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/product-sticky/:id"}
                element={<ProductSticky/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/product-slider/:id"}
                element={<ProductSlider/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/product-fixed-image/:id"}
                element={<ProductFixedImage/>}
              />  */}

              {/* Blog pages */}
              {/* <Route
                path={process.env.PUBLIC_URL + "/blog-standard"}
                element={<BlogStandard/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/blog-no-sidebar"}
                element={<BlogNoSidebar/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/blog-right-sidebar"}
                element={<BlogRightSidebar/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/blog-details-standard"}
                element={<BlogDetailsStandard/>}
              />  */}

              {/* Other pages */}
              <Route
                path={process.env.PUBLIC_URL + "/about"}
                element={<About/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/contact"}
                element={<Contact/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/my-account"}
                element={<MyAccount/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/login-register"}
                element={<LoginRegister/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/login-dashboard"}
                element={<RedirectComponent/>}
              />

              <Route
                path={process.env.PUBLIC_URL + "/cart"}
                element={<Cart/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/checkout-success"}
                element={<CheckoutSuccess/>}
              />
              <Route
                path={process.env.PUBLIC_URL + "/wishlist"}
                element={<Wishlist/>}
              />
              {/* <Route
                path={process.env.PUBLIC_URL + "/compare"}
                element={<Compare/>}
              /> */}
              <Route
                path={process.env.PUBLIC_URL + "/checkout"}
                element={<Checkout/>}
              /> 

              <Route path="*" element={<NotFound/>} />
            </Routes>
          </Suspense>
        </ScrollToTop>
      </Router>
  );
};

export default App;