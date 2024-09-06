import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./Pages/EventForm/Form";
// import LandingPage from "./Pages/LandingPage/LandingPage";
import LayoutComponent from "./Components/Shared/Layout/LayoutComponent/RegisterLayoutComponent";
import AdminLayoutComponent from "./Components/Shared/Layout/AdminLayoutComponent/AdminLayoutComponent";
import OverviewPage from "./Pages/AdminPages/OverviewPage";
import DiscountsPage from "./Pages/AdminPages/DiscountsPage";
import AdminLogin from "./Pages/AdminPages/AdminLogin";
import SuccessPage from "./Pages/PaymentPages/SuccessPage";
import FailurePage from "./Pages/PaymentPages/FailurePage";
import NotFoundPage from "./Pages/NotFoundPage";
import AttendeesPage from "./Pages/AdminPages/AttendeesPage";
import { Provider } from "react-redux";
import { store } from "./Redux/store/store";
import { PrivateRoute } from "./Components/PrivateRouteComponent";

function App() {
  const setCurrentTab = (tab: string) => {
    console.log(tab)
  };


  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            path="jKHd82jFJf83jKd8sjf9wke8jD8skf3TT"
            element={
              <LayoutComponent>
                <Form />
              </LayoutComponent>
            }
          />
          <Route
            path="/form"
            element={
              <LayoutComponent>
                <Form />
              </LayoutComponent>
            }
          />
          <Route path="/admin" element={<PrivateRoute />}>
          <Route
              path="/admin/login"
              element={
                // <AdminLayoutComponent>
                  <AdminLogin  />
                // </AdminLayoutComponent>
              }
            />

            <Route
              path="/admin/overview"
              element={
                <AdminLayoutComponent>
                  <OverviewPage setCurrentTab={setCurrentTab} />
                </AdminLayoutComponent>
              }
            />

            <Route
              path="/admin/attendees"
              element={
                <AdminLayoutComponent>
                  <AttendeesPage setCurrentTab={setCurrentTab} />
                </AdminLayoutComponent>
              }
            />
            <Route
              path="/admin/discounts"
              element={
                <AdminLayoutComponent>
                  <DiscountsPage />
                </AdminLayoutComponent>
              }
            />
          </Route>
          <Route path="/:tnxid/success" element={<SuccessPage />} />
          <Route path="/failed" element={<FailurePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </Provider>

  );
}

export default App;
