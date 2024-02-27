import React, { useState } from "react";

const ExperienceModal = () => {
    const [subject,setSupject] = useState("");
    const [description,setDescription] = useState("");
    return (
        <div className="overview-box open" id="experience-box">
			<div className="overview-edit">
				<h3>Experience</h3>
				<form>
					<input type="text" name="subject" placeholder="Subject" onChange={(e)=>{setSupject(e.target.value)}}/>
					<textarea onChange={(e)=>{setDescription(e.target.value)}}></textarea>
					<button type="submit" className="save">Save</button>
					<button type="submit" className="save-add">Save &amp; Add More</button>
					<button type="submit" className="cancel">Cancel</button>
				</form>
				<a href="#" title="" className="close-box"><i className="la la-close"></i></a>
			</div>
		</div>
    )
}

export default ExperienceModal;