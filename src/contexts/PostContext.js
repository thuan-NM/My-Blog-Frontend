import React, { createContext, useContext } from 'react';
import axios from 'axios';

const PostContext = createContext();

export const usePost = () => useContext(PostContext);

export const PostProvider = ({ children }) => {

    const handleUpdate = async (post, closeModal) => {
        const updatedPost = {
          author: post.author,
          content: content.value,
          title: title.value,
          hashtags: post.hashtags,
        };
      
        try {
          await axios.put(
            `http://localhost:3001/posts/${post._id}`,
            updatedPost,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          console.log("Post updated successfully");
      
          // Close the modal by invoking the provided callback
          closeModal();
      
          // Invoke the callback function passed as a prop in PostDetail
          onPostUpdated();
        } catch (error) {
          console.error(error);
        }
      };
      
    
    

  const handleDelete = async (data) => {
    try {
        await axios.delete(`http://localhost:3001/posts/${data._id}`);
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}
  return (
    <PostContext.Provider
      value={{
        handleUpdate,
        handleDelete,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
