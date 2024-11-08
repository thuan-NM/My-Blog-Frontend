import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  Spin,
  message,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import postServices from "../../services/post.services";
import { useAuth } from "../../contexts/AuthContext";
import CompanyIntroduce from "../../components/CompanyIntroduce";

const { Option } = Select;

const JobCreation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // Lấy thông tin người dùng hiện tại từ context

  // Kiểm tra nếu có dữ liệu từ location.state để hỗ trợ chỉnh sửa
  const [isEditMode, setIsEditMode] = useState(
    location.state && location.state.existingPost ? true : false
  );

  // State để quản lý loading và submitting
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Form instances
  const [modalForm] = Form.useForm();
  const [form] = Form.useForm();

  // State để quản lý mô tả công việc sử dụng React Quill
  const [jobDescription, setJobDescription] = useState("");

  // Effect để tải dữ liệu nếu ở chế độ chỉnh sửa
  useEffect(() => {
    const fetchJobData = async () => {
      if (isEditMode) {
        try {
          const existingPost = location.state.existingPost;
          if (existingPost) {
            form.setFieldsValue({
              title: existingPost.title,
              price: existingPost.price,
              workType: existingPost.workType,
              skills: existingPost.skills.join(", "),
              location: existingPost.location.address,
            });
            setJobDescription(existingPost.description || "");
          } else {
            message.error("Không tìm thấy dữ liệu công việc để chỉnh sửa.");
            navigate("/");
          }
        } catch (error) {
          console.error("Error fetching job data:", error);
          message.error("Đã xảy ra lỗi khi tải dữ liệu công việc.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchJobData();
  }, [isEditMode, location.state, form, navigate]);

  // Hàm để mở modal chỉnh sửa thông tin công việc
  const showModal = () => {
    modalForm.setFieldsValue({
      title: form.getFieldValue("title"),
      price: form.getFieldValue("price"),
      workType: form.getFieldValue("workType"),
      skills: form.getFieldValue("skills"),
      location: form.getFieldValue("location"),
    });
    setIsModalVisible(true);
  };

  // Hàm xử lý khi người dùng nhấn "Tiếp tục" trong modal
  const handleModalOk = () => {
    modalForm
      .validateFields()
      .then((values) => {
        // Cập nhật các giá trị trong form chính
        form.setFieldsValue({
          title: values.title,
          price: values.price,
          workType: values.workType,
          skills: values.skills,
          location: values.location,
        });
        setJobDescription(form.getFieldValue("description") || "");
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Hàm xử lý khi người dùng hủy modal
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // Hàm xử lý gửi form
  const onFinish = async (values) => {
    const newPost = {
      title: values.title,
      skills: values.skills.split(",").map((skill) => skill.trim()),
      location: {
        type: "Point",
        coordinates: [], // Placeholder, có thể tích hợp API địa điểm để lấy tọa độ
        address: values.location,
      },
      description: jobDescription, // Mô tả dưới dạng HTML
      price: values.price,
      workType: values.workType,
      author: {
        id: user._id,
        userdata: user,
      },
    };

    try {
      setIsSubmitting(true);
      let response;
      if (isEditMode) {
        // Nếu ở chế độ chỉnh sửa, gọi API update
        response = await postServices.updateJob(
          location.state.existingPost._id,
          newPost
        );
      } else {
        // Nếu ở chế độ tạo mới, gọi API tạo mới
        response = await postServices.postJob(newPost);
      }

      if (response.isSuccess) {
        message.success({
          content: isEditMode
            ? "Chỉnh sửa công việc thành công!"
            : "Đăng tải công việc thành công!",
          style: { marginTop: "20vh" },
        });
        navigate("/");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Failed to submit job:", error);
      if (error.response && error.response.status === 401) {
        // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
        navigate("/auth");
      }
      message.error(
        isEditMode
          ? "Chỉnh sửa công việc không thành công."
          : "Đăng tải công việc không thành công."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm xử lý khi có lỗi trong form
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Vui lòng kiểm tra lại các trường thông tin.");
  };

  // Tạo đối tượng 'job' giả định để truyền vào CompanyIntroduce
  const job = {
    author: {
      userdata: user,
    },
  };

  return (
    <main>
      <div className={`main-section ${isModalVisible ? "overlay" : ""}`}>
        <div className="container">
          <div className="main-section-data">
            <div className="row">
              {/* Form Chính */}
              <div className="col-lg-8 col-md-4 pd-left-none no-pd">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Spin size="large" />
                  </div>
                ) : (
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                  >
                    <div className="detail_sec bg-white p-6 rounded shadow-md mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <Form.Item
                          label="Tiêu đề công việc"
                          name="title"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập tiêu đề công việc!",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Nhập tiêu đề công việc"
                            size="large"
                          />
                        </Form.Item>
                        <Button
                          type="default"
                          icon={<EditOutlined />}
                          onClick={showModal}
                        >
                          Chỉnh sửa
                        </Button>
                      </div>
                      <Form.Item
                        label="Mức lương ($/giờ)"
                        name="price"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mức lương!",
                          },
                          {
                            type: "number",
                            min: 0,
                            message: "Mức lương phải là số dương!",
                            transform: (value) => Number(value),
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập mức lương"
                          size="large"
                          type="number"
                        />
                      </Form.Item>
                      <Form.Item
                        label="Loại công việc"
                        name="workType"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn loại công việc!",
                          },
                        ]}
                      >
                        <Select placeholder="Chọn loại công việc" size="large">
                          <Option value="At office">At office</Option>
                          <Option value="Remote">Remote</Option>
                          <Option value="Hybrid">Hybrid</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Kỹ năng yêu cầu (ngăn cách bằng dấu phẩy)"
                        name="skills"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập kỹ năng yêu cầu!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Ví dụ: Python, Django, JavaScript"
                          size="large"
                        />
                      </Form.Item>
                      <Form.Item
                        label="Địa chỉ làm việc"
                        name="location"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập địa chỉ làm việc!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập địa chỉ làm việc"
                          size="large"
                        />
                      </Form.Item>
                      <Form.Item label="Mô tả công việc" required>
                        <ReactQuill
                          theme="snow"
                          value={jobDescription}
                          onChange={setJobDescription}
                          placeholder="Nhập mô tả công việc"
                          style={{ height: "200px", marginBottom: "50px" }}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={isSubmitting}
                          block
                          size="large"
                        >
                          {isEditMode
                            ? "Cập nhật công việc"
                            : "Đăng tải công việc"}
                        </Button>
                      </Form.Item>
                    </div>
                  </Form>
                )}
              </div>

              {/* Sidebar Công Ty */}
              <div className="col-lg-4 col-md-4 pd-right-none no-pd">
                <CompanyIntroduce job={job} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Chỉnh Sửa Thông Tin Công Việc */}
      <Modal
        title="Chỉnh sửa thông tin công việc"
        open={isModalVisible} // Thay 'visible' bằng 'open'
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Tiếp tục"
        cancelText="Hủy bỏ"
      >
        <Form form={modalForm} layout="vertical">
          <Form.Item
            label="Tiêu đề công việc"
            name="title"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tiêu đề công việc!",
              },
            ]}
          >
            <Input placeholder="Nhập tiêu đề công việc" />
          </Form.Item>
          <Form.Item
            label="Mức lương ($/giờ)"
            name="price"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mức lương!",
              },
              {
                type: "number",
                min: 0,
                message: "Mức lương phải là số dương!",
                transform: (value) => Number(value),
              },
            ]}
          >
            <Input
              placeholder="Nhập mức lương"
              type="number"
            />
          </Form.Item>
          <Form.Item
            label="Loại công việc"
            name="workType"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại công việc!",
              },
            ]}
          >
            <Select placeholder="Chọn loại công việc">
              <Option value="At office">At office</Option>
              <Option value="Remote">Remote</Option>
              <Option value="Hybrid">Hybrid</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Kỹ năng yêu cầu (ngăn cách bằng dấu phẩy)"
            name="skills"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập kỹ năng yêu cầu!",
              },
            ]}
          >
            <Input placeholder="Ví dụ: Python, Django, JavaScript" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ làm việc"
            name="location"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập địa chỉ làm việc!",
              },
            ]}
          >
            <Input placeholder="Nhập địa chỉ làm việc" />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
};

export default JobCreation;
