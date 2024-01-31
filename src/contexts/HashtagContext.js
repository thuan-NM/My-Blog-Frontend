import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"

const HashtagsContext = createContext();

export const useHashtags = () => useContext(HashtagsContext);

export const HashtagsProvider = ({ children }) => {
    const [hashtagResults, setHashtagResults] = useState([]);
    const [showPostLists, setShowPostLists] = useState(true);
    const navigate = useNavigate(); 
    const handleHashtags = async (hashtag) => {
        if (hashtag !== "") {
          console.log(hashtag)
          setShowPostLists(false);
          navigate("/");
          
          try {
            const response = await axios.get(
              `http://localhost:3001/posts/search?searchTerm=${hashtag}`
            );
            setHashtagResults(response.data.data);
          } catch (error) {
            console.error("Error searching users:", error);
            // Xử lý lỗi tìm kiếm nếu cần
          }
        }
    console.log(`Handling hashtag: ${hashtag}`);
    };

    return (
        <HashtagsContext.Provider value={{showPostLists, hashtagResults, handleHashtags,setHashtagResults,setShowPostLists}}>
        {children}
        </HashtagsContext.Provider>
    );
};
