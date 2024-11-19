import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Form, Input, Button, Upload, Typography, message, Modal } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import postServices from "../../services/post.services";
import jobstatusServices from "../../services/jobstatus.services"; // Import your job status services
import Footer from "../../components/Footer";

const { TextArea } = Input;
const JobApplication = () => {
    const { user } = useAuth();
    const { postId } = useParams();
    const [job, setJob] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postResponse = await postServices.getJobsWithId(postId);
                setJob(postResponse.data);
                setIsLoading(false);
            } catch (error) {
                message.error("Failed to load job data");
            }
        };
        fetchPost();
    }, [postId]);

    const onFinish = async (values) => {
        setIsSubmitting(true);  // Start form submission
        try {
            if (fileList.length === 0) {
                message.error("Vui lòng tải lên CV của bạn!");
                setIsSubmitting(false);
                return;
            }

            const formData = new FormData();
            formData.append('cv', fileList[0].originFileObj);  // Gửi file CV
            formData.append('postid', postId);
            formData.append('userid', user._id);
            formData.append('companyid', job.author.id);
            formData.append('status', 'Applied');
            formData.append('coverLetter', values.coverLetter);  // Only send cover letter
            console.log(formData)
            const response = await jobstatusServices.postJobstatus(formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data", // Đặt header multipart
                },
            });

            if (response.isSuccess) {
                message.success({
                    content: response.message,
                    style: { marginTop: '8vh' }, // Di chuyển vị trí thông báo xuống dưới
                    duration: 2,
                });
                setIsFormDirty(false);
                navigate(`/jobdetail/${job._id}`);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('Failed to submit application:', error);
            message.error('Submission failed');
        } finally {
            setIsSubmitting(false);  // Stop form submission
        }
    };

    const uploadProps = {
        beforeUpload: (file) => {
            const isValidFileType = file.type === 'application/pdf' ||
                file.type === 'application/msword' ||
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            if (!isValidFileType) {
                message.error(`${file.name} is not a valid file format.`);
                return Upload.LIST_IGNORE;
            }
            if (file.size / 1024 / 1024 > 3) {
                message.error('File must be smaller than 3MB.');
                return Upload.LIST_IGNORE;
            }
            return true;
        },
        onChange: ({ fileList: newFileList }) => {
            setFileList(newFileList);
            setIsFormDirty(true);
        },
        fileList,
        maxCount: 1,
    };

    const handleBackClick = (e) => {
        if (isFormDirty) {
            e.preventDefault();
            setIsModalVisible(true);
        }
    };

    const handleConfirmBack = () => {
        setIsModalVisible(false);
        navigate(`/jobdetail/${job._id}`);
    };

    const handleCancelBack = () => {
        setIsModalVisible(false);
    };

    if (isLoading || user == null) {
        return (
            <div className="process-comm">
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </div>
        );
    }


    return (
        <div className="wrapper relative z-10">
            <div className="appication_page relative z-20">
                <div className="absolute top-14 right-80 text-black z-30">
                    <Link
                        to={`/jobdetail/${job._id}`}
                        className="flex items-center text-white hover:underline hover:underline-offset-4 p-1 back-button"
                        onClick={handleBackClick}
                    >
                        <i className="bi bi-caret-left-fill text-white text-lg"></i>
                        <p className="text-white text-lg">Back</p>
                    </Link>
                </div>
                <div className="appication_popup relative z-40">
                    <div className="appication_pop">
                        <div className="row p-5">
                            <Form
                                name="job-application-form"
                                layout="vertical"
                                onFinish={onFinish}
                                initialValues={{
                                    fullName: `${user?.firstName || ''} ${user?.lastName || ''}`,
                                }}
                                style={{ height: "490px" }}
                            >
                                <Typography.Title level={3} style={{ fontWeight: 'bold' }}>
                                    {job.title} tại {job.author.userdata.companyname}
                                </Typography.Title>
                                <Form.Item
                                    name="fullName"
                                    label={<strong className="text-md font-semibold">Họ và Tên</strong>}
                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên của bạn!' }]}
                                >
                                    <Input placeholder="Nhập họ và tên" className="p-2 !z-10" disabled={true} />
                                </Form.Item>

                                {/* Tải lên CV */}
                                <Form.Item
                                    name="cv"
                                    label={<strong className="text-md font-semibold">CV ứng tuyển</strong>}
                                    rules={[{ required: true, message: 'Vui lòng tải lên CV của bạn!' }]}
                                >
                                    <div>
                                        <Upload {...uploadProps} className="file-upload-button"
                                            action="https://api.cloudinary.com/v1_1/dca8kjdlq/upload"
                                            data={{
                                                upload_preset: "sudykqqg",
                                            }}>
                                            <Button icon={<UploadOutlined />}>Upload New CV</Button>
                                        </Upload>
                                        <Typography.Text type="secondary">
                                            Hỗ trợ định dạng .doc, .docx, .pdf, không chứa mật khẩu bảo vệ, dung lượng dưới 3MB
                                        </Typography.Text>
                                    </div>
                                </Form.Item>
                                {/* Thư xin việc */}
                                <Form.Item
                                    name="coverLetter"
                                    label={<strong className="text-md font-semibold">Thư giới thiệu</strong>}
                                    rules={[{ required: true, message: 'Vui lòng điền đầy đủ thông tin!' }]}
                                >
                                    <TextArea
                                        placeholder="Những kỹ năng, dự án hay thành tựu nào chứng tỏ bạn là một ứng viên tiềm năng cho vị trí này?"
                                        maxLength={500}
                                        rows={4}
                                        showCount
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block loading={isSubmitting}>
                                        {isSubmitting ? 'Đang gửi...' : 'Gửi CV của tôi'}
                                    </Button>
                                </Form.Item>
                            </Form>

                        </div>
                    </div>
                </div>
                <Footer />
            </div>
            <Modal
                open={isModalVisible}
                onCancel={handleCancelBack}
                onOk={handleConfirmBack}
                okText="Confirm"
                cancelText="Continue applying"
                className="z-50"
            >
                <p>Changes you made so far will not be saved. Are you sure you want to quit this page?</p>
            </Modal>
        </div>
    );
};

export default JobApplication;
