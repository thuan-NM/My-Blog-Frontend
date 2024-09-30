import React from "react";
import { Link } from "react-router-dom";

const KeySkill = ({ keyskill, isKeySkillModalOpen, setIsKeySkillModalOpen, isAuthor }) => {
    return (
        <div className={`user-profile-ks animate__animated animate__faster zoomIn`}>
            <h3>
                <Link className="keyskill-open" >Kỹ năng thiết yếu</Link>
                {isAuthor && <Link className="keyskill-open" onClick={() => setIsKeySkillModalOpen(!isKeySkillModalOpen)}><button className="edit-info"><i className="bi bi-pencil-fill ms-2"></i></button></Link>}
            </h3>
            <ul className="keyskill-tags">
                {(keyskill.data) && (
                    keyskill.data.map((p) => (
                        <li key={p}>
                            <p>{p}</p>
                        </li>
                    ))
                )}
            </ul>
            
        </div>
    )
}

export default KeySkill