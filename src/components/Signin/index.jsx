import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext";
import { message } from "antd"
import AuthServices from "../../services/auth.services"
import CompanyAuthServices from "../../services/companyAuth.services";
import GoogleLoginComponent from "../GoogleLogin";

const SignIn = () => {
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [currentTabSignIn, setcurrentTabSignIn] = useState("user");
	const { login } = useAuth();

	const handleLogin = async (e) => {
		e.preventDefault();
		const user = {
			email: email,
			password: password,
		};
		try {
			const res =  currentTabSignIn=="user"?await AuthServices.signIn(user): await CompanyAuthServices.signIn(user)
			setPassword("")
			if (res.isSuccess === 1 && currentTabSignIn=="user") {
				const { user, token } = res;
				login(user, token);
				message.success({
					content: res.message,
					style: { marginTop: '8vh' }, // Di chuyển vị trí thông báo xuống dưới
					duration: 2,
				  });
				navigate("/")
			}
			else if (res.isSuccess === 1 && currentTabSignIn=="company") {
				const { company , token } = res;
				login(user, token);
				message.success(res.message)
				navigate("/")
			}
		}
		catch (error) {
			console.log(error)
			message.error(error.response.data.message)
		}
	};
	const handleTabClick = (tab) => {
		setcurrentTabSignIn(tab);
	};
	return (
		<div className="sign_in_sec animated fadeIn">
			<div className="signin-tab flex !items-center mb-4">
				<div className="flex items-center">
					<h3 className="m-0">Tài khoản {currentTabSignIn == "user" ? "" : "công ty"}</h3>

				</div>
				<ul>
					<li data-tab="tab-3"
						className={`animated fadeIn ${currentTabSignIn == "user" ? "current" : ""}`}>
						<button onClick={() => handleTabClick("user")}>User</button></li>
					<li data-tab="tab-4"
						className={`animated fadeIn ${currentTabSignIn == "company" ? "current" : ""}`}>
						<button onClick={() => handleTabClick("company")}>Company</button></li>
				</ul>
			</div>
			<form>
				<div className="row">
					<div className="col-lg-12 no-pdd">
						<div className="sn-field">
							<input type="text" value={email}
								onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
							<i className="fa fa-envelope"></i>
						</div>
					</div>
					<div className="col-lg-12 no-pdd">
						<div className="sn-field">
							<input type="password" value={password}
								onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
							<i className="la la-lock"></i>
						</div>
					</div>
					<div className="col-lg-12 no-pdd">
						<div className="checky-sec">
							<div className="fgt-sec">
								<input type="checkbox" name="cc" id="c1" />
								<label htmlFor="c1">
									<span></span>
								</label>
								<small>Ghi nhớ tài khoản</small>
							</div>
							<a href="#" title="">Quên mật khẩu?</a>
						</div>
					</div>
					<div className="col-lg-12 no-pdd">
						<button onClick={handleLogin} disabled={isLoading}>
							{isLoading ? "Wait htmlFor a moment..." : "Đăng nhập"}
						</button>
					</div>
				</div>
			</form>
			<div className="login-resources flex justify-center flex-col">
				<h4 className="mb-2">Đăng nhập bằng tài khoản khác</h4>
				<ul>
					<li><GoogleLoginComponent /></li>
				</ul>
			</div>
		</div>
	)
}

export default SignIn

