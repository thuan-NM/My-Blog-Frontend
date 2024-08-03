import { Routes, Route ,useLocation} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"
import "font-awesome/css/font-awesome.min.css";
import "line-awesome/dist/font-awesome-line-awesome/css/all.css"
import "line-awesome/dist/line-awesome/css/line-awesome.css"
import "slick-carousel/slick/slick.min.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "animate.css/animate.css";
import "animate.css/source/animate.css";
import "./index.css";
import "./responsive.css"
import Header from "./components/Header";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import PostDetail from "./pages/PostDetail";
import Users from "./pages/Users";
import AboutUs from "./pages/AboutUs";
import MyProfile from "./pages/MyProfile";
import UserProfile from "./pages/UserProfile"; 
import Jobs from "./pages/Jobs";
import Footer from "./components/Footer";
import Companies from "./pages/Companies"
import { QueryClient, QueryClientProvider } from 'react-query'
import ChatBox from "./components/ChatBox";
import { SpeedInsights } from "@vercel/speed-insights/react"
const queryClient = new QueryClient()

function App() {
  const location = useLocation();

  // Kiểm tra xem đang ở trang đăng nhập hoặc đăng ký
  const isAuthPage = location.pathname.includes("/auth");
  return (
    <div className="wrapper">
      <QueryClientProvider client={queryClient}>
          {!isAuthPage&&<Header />}
          <SpeedInsights />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/posts/:postId" element={<PostDetail />} />
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/users" element={<Users />} />
            <Route path="/companies" element={<Companies/>}/>
            <Route path="/jobs" element={<Jobs/>}/>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<h1>Page not found</h1>} />
            <Route path="/userprofile/:id" element={<UserProfile />} />
          </Routes>
          {!isAuthPage&&<ChatBox />}
      </QueryClientProvider>
    </div>
  );
}

export default App;
