// src/components/JobForm.js

import React from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const JobForm = ({
    editableJob,
    handleInputChange,
    handleDescriptionChange,
    handleSubmit,
    isSubmitting,
    error,
    modules,
    formats,
    isEditing,
    handleCancel
}) => {
    return (
        <form onSubmit={handleSubmit}>
            {/* Tiêu đề */}
            <div className="mb-3">
                <label htmlFor="title" className="!text-lg font-semibold mb-2">Tên công việc:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={editableJob.title}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                />
            </div>

            {/* Lương */}
            <div className="mb-3">
                <label htmlFor="price" className="!text-lg font-semibold mb-2">Lương ($/giờ)</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={editableJob.price}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                    min="0"
                    step="0.01"
                />
            </div>

            {/* Địa chỉ */}
            <div className="mb-3">
                <label htmlFor="location.address" className="!text-lg font-semibold mb-2">Nơi làm việc</label>
                <input
                    type="text"
                    id="location.address"
                    name="location.address"
                    value={editableJob.location.address}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                />
            </div>

            {/* Loại hình công việc */}
            <div className="mb-3">
                <label htmlFor="workType" className="!text-lg font-semibold mb-2">Loại hình công việc:</label>
                <input
                    type="text"
                    id="workType"
                    name="workType"
                    value={editableJob.workType}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                />
            </div>

            {/* Kỹ năng */}
            <div className="mb-3">
                <label htmlFor="skills" className="!text-lg font-semibold mb-2">Kỹ năng:</label>
                <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={editableJob.skills.join(', ')}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="e.g., JavaScript, React, Node.js"
                />
            </div>

            {/* Mô tả công việc */}
            <div className="preview-overview mb-3">
                <label htmlFor="description" className="!text-lg font-semibold mb-2">Mô tả công việc</label>
                <ReactQuill
                    theme="snow"
                    value={editableJob.description}
                    onChange={handleDescriptionChange}
                    modules={modules}
                    formats={formats}
                    className="mt-4"
                    style={{ height: '200px', marginBottom: '50px' }}
                />
            </div>

            {/* Thông báo lỗi */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Nút hành động */}
            <div className="d-flex justify-content-end">
                {isEditing && (
                    <button
                        type="button"
                        className="p-2 rounded-sm me-2 bg-neutral-300"
                        onClick={handleCancel}
                    >
                        Hủy
                    </button>
                )}
                <button
                    type="submit"
                    className="bg-custom-red p-2 rounded-sm text-white"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Saving..." : isEditing ? "Lưu thay đổi" : "Đăng công việc"}
                </button>
            </div>
        </form>
    );
};

JobForm.modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
    ],
};

JobForm.formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image'
];

export default JobForm;
