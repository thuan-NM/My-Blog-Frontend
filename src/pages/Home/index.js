import React, { useState,useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";

import PostCreation from "../../components/PostCreation";
import PostItem from "../../components/PostItem";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import { useHashtags } from "../../contexts/HashtagContext";
import { useSearch } from "../../contexts/SearchContext";
import { Button, Modal } from 'antd';
import { FloatButton } from 'antd';


function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [totalPages, settotalPages] = useState(1);
  const [isLoading,setIsLoading] = useState(true);
  const pageSize = 5;
  const {showPostLists, hashtagResults, handleHashtags,setHashtagResults,setShowPostLists} = useHashtags();
  const {handleSearchPost,searchTerm,searchResults,showPostListsWithSearch,setSearchTerm,setSearchResults,setShowPostListsWithSearch} = useSearch();

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postResponse = await axios.get(`http://localhost:3001/posts/?page=${currentPage}&pageSize=${pageSize}`);
        setPosts(postResponse.data.data);
        settotalPages(postResponse.data.totalPages)
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [posts]);
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // if (error) {
  //   return <p>Error fetching posts: {error.message}</p>;
  // }
 
  const showModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = ()=>{
    setIsModalOpen(false)
  }
  return (
    <div className="home mt-4">
      <FloatButton className="floatbtn" icon={<i className="bi bi-pencil-square btnicon"></i>} onClick={showModal} onCancel={()=>setIsModalOpen(false)}/>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearchPost}
      />
      <div className="post-creation-container d-flex justify-content-center m-4">
            <Button className="buy p-0" onClick={showModal}>
              Create
            </Button>
            <Modal className="modal-container" title="Update Form" open={isModalOpen} footer={null} onCancel={()=>setIsModalOpen(false)}>
              <PostCreation closeModal={closeModal}/>
            </Modal>
      </div>
      {(showPostLists&&showPostListsWithSearch) && (
        <>
          <div className="posts-container"> 
          <ul>
            {posts.map((post) => (
            <PostItem key={post._id} post={post} handleHashtags={handleHashtags}/>
            ))}
          </ul>
          </div>
          <Pagination
          key={1}
          page={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={handlePageChange}/>
        </>
      )}
      {(!showPostLists && hashtagResults.length == 0) &&(
        <div className="d-flex justify-content-center my-5">
          <h3 className="searchstate me-1">Nothing found, try searching again </h3>
          <button className="btn-close-search" onClick={() => {setHashtagResults([]),setShowPostLists(true),setCurrentPage(1)}}>X</button>
        </div>
      )}
      {(hashtagResults.length > 0) && (
        <div className="posts-container">
          <button className="btn-back" onClick={() => {setHashtagResults([]),setShowPostLists(true),setCurrentPage(1)}}><i className="bi bi-chevron-compact-left text-center" ></i><p className="text-center">Back</p></button>
          <ul>
            {hashtagResults.map((result) => (
              <PostItem key={result._id} post={result} handleHashtags={handleHashtags}/>
          ))}</ul>
        </div>
      )}
      {(!showPostListsWithSearch && searchResults.length == 0) &&(
        <div className="d-flex justify-content-center my-5">
          <h3 className="searchstate me-1">Nothing found, try searching again </h3>
          <button className="btn-close-search" onClick={() => {setSearchResults([]),setShowPostListsWithSearch(true),setCurrentPage(1)}}>X</button>
        </div>
      )}
      {(searchResults.length > 0) && (
        <div className="posts-container">
        <button className="btn-back" onClick={() => {setSearchResults([]),setShowPostListsWithSearch(true),setCurrentPage(1)}}><i className="bi bi-chevron-compact-left text-center" ></i><p className="text-center">Back</p></button>
          <ul>
            {searchResults.map((result) => (
              <PostItem key={result._id} post={result} handleHashtags={handleHashtags}/>
          ))}</ul>
      </div>
      )}
    </div>
  );
}

export default Home;