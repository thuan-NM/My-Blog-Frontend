import React from "react";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <div className="footy-sec">
				<div className="container">
					<ul>
						<li><a href="help-center.html" title="">Trung tâm hỗ trợ</a></li>
						<li><Link to={"/about"} title="">Về chúng tôi</Link></li>
						<li><a href="#" title="">Chính sách bảo mật</a></li>
						<li><a href="#" title="">Cộng đồng</a></li>
						<li><a href="#" title="">Chính sách Cookies</a></li>
						<li><a href="#" title="">Hồ sơ</a></li>
						<li><a href="forum.html" title="">Diễn đàn</a></li>
						<li><a href="#" title="">Ngôn ngữ</a></li>
						<li><a href="#" title="">Chính sách bản quyền</a></li>
					</ul>
					<p><img alt=""/>Bản quyền 2019</p>
				</div>
			</div>
  );
}

export default Footer;
