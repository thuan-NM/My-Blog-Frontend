import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import keyskillServices from "../../services/keyskill.services";

const KeySkillModal = ({
  user,
  role,
  keyskill,
  isKeySkillModalOpen,
  setIsKeySkillModalOpen,
  setKeySkill,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [keyskilldata, setKeySkilldata] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (keyskill && keyskill.data) {
      setKeySkilldata(keyskill.data);
    }
  }, []);

  const handleModal = (e) => {
    e.preventDefault();
    setIsKeySkillModalOpen(!isKeySkillModalOpen);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setKeySkilldata([...keyskilldata, inputValue.trim()]);
      setInputValue(""); // Clear input after adding
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) { // Check if Enter key is pressed
      e.preventDefault();
      handleAddSkill(e);
    }
  };


  const handleRemoveSkill = (e, index) => {
    e.preventDefault();
    setKeySkilldata((prevKeySkilldata) =>
      prevKeySkilldata.filter((_, i) => i !== index)
    );
  };

  const handleEdit = async (e) => {
    try {
      e.preventDefault();
      const newKeySkill = {
        keyskilldata: keyskilldata,
        user: user,
      };

      const res = await keyskillServices.postCompanyKeySkills(newKeySkill);

      message.success({
        content: res.message,
        style: { marginTop: '8vh' }, // Di chuyển vị trí thông báo xuống dưới
        duration: 2,
      });
      if (res.status === 401) {
        navigate("/auth");
      }
      setKeySkill(newKeySkill.keyskilldata);
    } catch (error) {
      message.error(error.response.data.message);
      if (error.response && error.response.status === 401) {
        navigate("/auth");
      }
    }
    handleModal(e);
  };

  return (
    <div
      className={`keyskill-box ${
        isKeySkillModalOpen
          ? "active animate__animated animate__faster zoomIn"
          : "animate__animated animate__faster zoomOut"
      }`}
    >
      <div className="keyskill-edit">
        <h3>Kỹ năng thiết yếu</h3>
        <span>Nhập từng kỹ năng và nhấn "Thêm".</span>
        <form>
          <ul className="keyskill-tags">
            {keyskilldata.map((skill, index) => (
              <li key={index}>
                <div>
                  <p>{skill}</p>
                  <button onClick={(e) => handleRemoveSkill(e, index)}>
                    <i className="la la-close"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Thêm kỹ năng mới"
          />
          <button className="save" onClick={handleAddSkill}>
            Thêm
          </button>
          <button className="save" onClick={handleEdit}>
            Lưu
          </button>
          <button className="cancel" onClick={handleModal}>
            Hủy bỏ
          </button>
        </form>
        <Link className="close-box">
          <i className="la la-close" onClick={handleModal}></i>
        </Link>
      </div>
    </div>
  );
};

export default KeySkillModal;
