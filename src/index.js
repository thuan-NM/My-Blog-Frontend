import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { HashtagsProvider } from "./contexts/HashtagContext";
import { FriendProvider } from "./contexts/FriendContext";
import { SearchProvider } from "./contexts/SearchContext";
import { PostProvider } from "./contexts/PostContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider><HashtagsProvider><FriendProvider><SearchProvider><PostProvider>
        <App />
        </PostProvider></SearchProvider></FriendProvider></HashtagsProvider></AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
