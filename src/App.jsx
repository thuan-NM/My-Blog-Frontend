// App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "font-awesome/css/font-awesome.min.css";
import "line-awesome/dist/font-awesome-line-awesome/css/all.css";
import "line-awesome/dist/line-awesome/css/line-awesome.css";
import "slick-carousel/slick/slick.min.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "animate.css/animate.css";
import "animate.css/source/animate.css";
import "./index.css";
import "./responsive.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Users from "./pages/Users";
import AboutUs from "./pages/AboutUs";
import MyProfile from "./pages/MyProfile";
import UserProfile from "./pages/UserProfile";
import CompanyProfile from "./pages/CompanyProfile";
import Jobs from "./pages/Jobs";
import Companies from "./pages/Companies";
import { QueryClient, QueryClientProvider } from "react-query";
import ChatBox from "./components/ChatBox";
import { SpeedInsights } from "@vercel/speed-insights/react";
import MyCompanyProfile from "./pages/MyCompanyProfile";
import VerifyEmail from "./pages/VerifyEmail";
import CompanyAuth from "./pages/CompanyAuth";
import JobDetail from "./pages/JobDetail";
import JobApplication from "./pages/JobApplications";
import CandidateList from "./pages/CandidatesList";
import ConfirmInterview from "./pages/ConfirmInterview";
import ConfirmationSuccess from "./components/ConfirmationSuccess";
import JobCreation from "./pages/JobCreation";
import InterviewSchedule from "./components/InterviewSchedule";
import InterviewActionPage from "./pages/InterviewActionPage";
import JobEditing from "./pages/JobEditing";

const queryClient = new QueryClient();

function App() {
  const location = useLocation();

  // Kiểm tra xem đang ở trang đăng nhập hoặc đăng ký
  const isAuthPage =
    location.pathname.includes("/auth") ||
    location.pathname.includes("/companyauth") ||
    location.pathname.includes("/jobapplication");

  return (
    <div className="wrapper">
      <QueryClientProvider client={queryClient}>
        {!isAuthPage && <Header />}
        <SpeedInsights />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/users" element={<Users />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<h1>Page not found</h1>} />
          <Route path="/userprofile/:id" element={<UserProfile />} />
          <Route path="/companyprofile/:id" element={<CompanyProfile />} />
          <Route path="/mycompanyprofile" element={<MyCompanyProfile />} />
          <Route path="/auth/verifyemail/:type" element={<VerifyEmail />} />
          <Route path="/companyauth" element={<CompanyAuth />} />
          <Route path="/jobdetail/:postId" element={<JobDetail />} />
          <Route path="/jobapplication/:postId" element={<JobApplication />} />
          <Route path="/viewcandidate/:postId" element={<CandidateList />} />
          <Route path="/sendrequest/confirm/:token" element={<ConfirmInterview />} /> {/* Confirmation route */}
          <Route path="/confirmation-success" element={<ConfirmationSuccess />} />
          <Route path="/jobcreation" element={<JobCreation />} />
          <Route path="/jobedit/:postId?" element={<JobEditing />} />
          <Route path="/schedule" element={<InterviewSchedule />} />
          <Route path="/interview/:action/:jobStatusId" element={<InterviewActionPage />} />
        </Routes>
        {!isAuthPage && <ChatBox />}
      </QueryClientProvider>
    </div>
  );
}

export default App;
