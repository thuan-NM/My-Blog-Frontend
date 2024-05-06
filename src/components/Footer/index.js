import React from "react";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <div className="footy-sec">
				<div className="container">
					<ul>
						<li><a href="help-center.html" title="">Help Center</a></li>
						<li><Link to={"/about"} title="">About</Link></li>
						<li><a href="#" title="">Privacy Policy</a></li>
						<li><a href="#" title="">Community Guidelines</a></li>
						<li><a href="#" title="">Cookies Policy</a></li>
						<li><a href="#" title="">Career</a></li>
						<li><a href="forum.html" title="">Forum</a></li>
						<li><a href="#" title="">Language</a></li>
						<li><a href="#" title="">Copyright Policy</a></li>
					</ul>
					<p><img alt=""/>Copyright 2019</p>
				</div>
			</div>
  );
}

export default Footer;
