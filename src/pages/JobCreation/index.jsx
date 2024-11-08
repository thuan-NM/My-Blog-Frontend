import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import postServices from "../../services/post.services";
import { Button, message } from 'antd';
import CompanyIntroduce from "../../components/CompanyIntroduce";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import CSS

const JobCreation = () => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'link', 'image'
  ];
  const navigate = useNavigate();
  const location = useLocation();
  const [newPostData, setNewPostData] = useState(
    location.state.newPostData || {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  const [tempData, setTempData] = useState({});

  const [jobAuthor, setJobAuthor] = useState(newPostData.user);
  const [jobTitle, setJobTitle] = useState(newPostData.title);
  const [jobSkills, setJobSkills] = useState(newPostData.skills);
  const [jobPrice, setJobPrice] = useState(newPostData.price);
  const [jobWorkType, setJobWorkType] = useState(newPostData.workType);
  const [jobLocation, setJobLocation] = useState(newPostData.location);
  const [jobCreatedAt, setJobCreatedAt] = useState(newPostData.createdAt);
  const [jobDescription, setJobDescription] = useState("");

  const openJobModal = () => {
    setTempData({
      jobTitle,
      jobSkills: jobSkills.join(", "),
      jobPrice,
      jobWorkType,
      jobLocation,
    });
    setIsJobModalOpen(true);
  };

  const handleContinue = () => {
    setJobTitle(tempData.jobTitle);
    setJobSkills(
      (tempData.jobSkills || "").split(",").map((skill) => skill.trim())
    );
    setJobPrice(tempData.jobPrice);
    setJobWorkType(tempData.jobWorkType);
    setJobLocation(tempData.jobLocation);
    setIsJobModalOpen(false);
  };

  const handleCancel = () => {
    setIsJobModalOpen(false);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const newPost = {
      title: jobTitle,
      skills: jobSkills, // "vietnam,giaoduc,sachgiaokhoa"
      location: jobLocation,
      description: jobDescription,
      price: jobPrice,
      workType: jobWorkType,
      author: {
        id: jobAuthor._id,
        userdata: jobAuthor,
      },
    };
    try {
      setIsSubmitting(true);
      const response = await postServices.postJob(newPost);
      console.log(response.isSuccess);
      if (response.isSuccess) {
        message.success({
          content: "Đăng tải công việc thành công",
          style: { marginTop: '8vh' }, // Di chuyển vị trí thông báo xuống dưới
          duration: 2,
        });
        navigate("/");
        if (response.status === 401) {
          // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
          navigate("/auth");
        }
        // setSelectedFile(null);
        setJobTitle("");
        setJobPrice(0);
        setJobWorkType("At office");
        setJobSkills([]);
        setJobLocation("");
        setJobDescription("");
        setIsSubmitting(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to submit application:', error);
      if (error.response && error.response.status === 401) {
        // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
        navigate("/auth");
      }
      message.error('Nộp thông tin ứng tuyển không thành công');
    }
  };

  return (
    <main>
      <div className={`main-section ${isJobModalOpen ? "overlay" : ""}`}>
        <div className="container">
          <div className="main-section-data">
            <div className="row">
              <div className="col-lg-8 col-md-4 pd-left-none no-pd">
                <form>
                  <div className="detail_sec">
                    <div>
                      <div className="flex flex-row justify-between">
                        <h2>{jobTitle}</h2>
                        <button
                          className="edit-info"
                          onClick={(event) => {
                            event.preventDefault();
                            openJobModal();
                          }}
                        >
                          <i className="bi bi-pencil-fill w-auto h-auto"></i>
                        </button>
                      </div>
                      <div className="detail_companyname">
                        {jobAuthor.companyname}
                      </div>
                      <div className="detail_price">
                        <i className="bi bi-coin mr-4"></i>
                        {jobPrice}$/giờ
                      </div>
                    </div>
                    <div>
                      <div className="d-flex flex-column justify-content-center">
                        <div className="detail_companyname">
                          <i className="bi bi-geo-alt"></i>
                          {jobLocation}
                        </div>
                        <div className="detail_companyname">
                          <i className="bi bi-person-workspace"></i>
                          {jobWorkType}
                        </div>
                        <div className="detail_companyname">
                          <i className="bi bi-clock"></i>
                          {jobCreatedAt}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="mr-3">Skills:</span>
                      <ul className="job_skills">
                        {jobSkills.map((item) => (
                          <li key={item}>
                            <a>{item}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {/* <div className="detail_sec mt-4">
                    <div className="detail_sec_title">Mô tả công việc</div>
                    <div className="preview-overview">
                      <span className="!text-neutral-600 text-[12px] mb-[5px] float-right">5000 ký tự</span>
                      <textarea className="!h-80 border !border-neutral-400 w-full resize-none text-[17px] p-[15px] leading-normal text-black" id="description" placeholder="Nhập mô tả công việc" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}></textarea>
                    </div>
                  </div>
                  <div className="flex justify-center mt-3">
                    <Button className="bg-white text-[#e44d3a] hover:!bg-[#e44d3a] ease-in-out duration-500 text-lg p-1 h-[40px]" onClick={handleCreatePost} type="primary" htmlType="submit" block loading={isSubmitting} > {isSubmitting ? 'Đang đăng tải...' : 'Đăng tải công việc'}
                    </Button>
                  </div> */}
                  <div className="preview-overview">
                    <ReactQuill
                      theme="snow"
                      value={jobDescription}
                      onChange={setJobDescription}
                      placeholder="Nhập mô tả công việc"
                      modules={modules}
                      formats={formats}
                      className="mt-4"
                    />
                  </div>
                  <div className="flex justify-center mt-3">
                    <Button
                      className="bg-white text-red-600 hover:bg-red-600 hover:text-white transition duration-500 text-lg p-1 h-10"
                      onClick={handleCreatePost}
                      type="primary"
                      htmlType="submit"
                      block
                      loading={isSubmitting}
                    >
                      {isSubmitting ? 'Đang đăng tải...' : 'Đăng tải công việc'}
                    </Button>
                  </div>

                </form>
              </div>
              <CompanyIntroduce job={jobAuthor} />

            </div>
          </div>
        </div>
      </div>
      <div
        className={`post-popup job_post ${isJobModalOpen
          ? "active animate__animated animate__faster zoomIn"
          : "animate__animated animate__faster zoomOut"
          }`}
      >
        <div className="post-project">
          <h3>Đăng công việc</h3>
          <div className="post-project-fields">
            <div className="row">
              <div className="col-lg-12">
                <input
                  type="text"
                  placeholder={jobTitle}
                  value={tempData.jobTitle || jobTitle}
                  onChange={(e) =>
                    setTempData({ ...tempData, jobTitle: e.target.value })
                  }
                />
              </div>
              <div className="col-lg-6">
                <div className="price-br">
                  <input
                    type="text"
                    placeholder="Lương"
                    value={tempData.jobPrice || jobPrice}
                    onChange={(e) =>
                      setTempData({ ...tempData, jobPrice: e.target.value })
                    }
                  />
                  <i className="la la-dollar"></i>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="inp-field">
                  <select
                    placeholder="Loại công việc"
                    value={tempData.jobWorkType || jobWorkType}
                    onChange={(e) =>
                      setTempData({ ...tempData, jobWorkType: e.target.value })
                    }
                  >
                    <option>At office</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-12">
                <input
                  type="text"
                  placeholder="Kỹ năng công việc"
                  value={tempData.jobSkills || jobSkills.join(", ")}
                  onChange={(e) =>
                    setTempData({ ...tempData, jobSkills: e.target.value })
                  }
                />
              </div>
              <div className="col-lg-12">
                <input
                  type="text"
                  placeholder="Địa chỉ"
                  value={tempData.jobLocation || jobLocation}
                  onChange={(e) =>
                    setTempData({ ...tempData, jobLocation: e.target.value })
                  }
                />
              </div>
              <div className="col-lg-12">
                <ul>
                  <li>
                    <button onClick={handleContinue} className="active">
                      Tiếp tục
                    </button>
                  </li>
                  <li>
                    <button onClick={handleCancel}>Hủy bỏ</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <button onClick={handleCancel}>
            <i className="la la-times-circle-o"></i>
          </button>
        </div>
      </div>
    </main>
  );
};

export default JobCreation;