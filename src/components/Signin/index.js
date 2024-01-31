import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext";
import { message } from "antd"
import axios from "axios";

const SignIn = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [companyPassword, setCompanyPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [currentTabSignUp, setCurrentTabSignUp] = useState("tab-3");
	const { login } = useAuth();

	const handleLoginWithUser = async (e) => {
		e.preventDefault();
		const user = {
			username: username,
			password: password,
		};
		axios
			.post("http://localhost:3001/auth/login", user)
			.then((res) => {
				setPassword("");
				if (res.data.isSuccess === 1) {
					const { user, token } = res.data;
					login(user, token);
					message.success(res.data.message)
					navigate("/");
				}
			})
			.catch((error) => {
				console.log(error);
				message.error(error.response.data.message)
			});
	};
	const handleLoginWithCompany = async (e) => {
		e.preventDefault();
		const company = {
			email: email,
			password: password,
		};
		axios
			.post("http://localhost:3001/companyauth/login", company)
			.then((res) => {
				setPassword("");
				if (res.data.isSuccess === 1) {
					const { company, token } = res.data;
					login(company, token);
					message.success(res.data.message)
					navigate("/");
				}
			})
			.catch((error) => {
				console.log(error);
				message.error(error.response.data.message)
			});
	};
	const handleTabClick = (tab) => {
		setCurrentTabSignUp(tab);
	};
	return (
		<div className={`sign_in_sec animated fadeIn`} id="tab-1">
			<div className="signin-tab">
				<h3>Sign in {currentTabSignUp=="tab-3"?"with User":"with Company"}</h3>
				<ul>
					<li data-tab="tab-3"
						className={`animated fadeIn ${currentTabSignUp == "tab-3" ? "current" : ""}`}>
						<button onClick={() => handleTabClick("tab-3")}>User</button></li>
					<li data-tab="tab-4"
						className={`animated fadeIn ${currentTabSignUp == "tab-4" ? "current" : ""}`}>
						<button onClick={() => handleTabClick("tab-4")}>Company</button></li>
				</ul>
			</div>
			{currentTabSignUp == "tab-3" && <form>
				<div className="row">
					<div className="col-lg-12 no-pdd">
						<div className="sn-field">
							<input type="text" value={username}
								onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
							<i className="la la-user"></i>
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
								<small>Remember me</small>
							</div>
							<a href="#" title="">Forgot Password?</a>
						</div>
					</div>
					<div className="col-lg-12 no-pdd">
						<button onClick={handleLoginWithUser} disabled={isLoading}>
							{isLoading ? "Wait htmlFor a moment..." : "Sign In"}
						</button>
					</div>
				</div>
			</form>}
			{currentTabSignUp == "tab-4" && <form>
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
							<input type="password" value={companyPassword}
								onChange={(e) => setCompanyPassword(e.target.value)} placeholder="Password" />
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
								<small>Remember me</small>
							</div>
							<a href="#" title="">Forgot Password?</a>
						</div>
					</div>
					<div className="col-lg-12 no-pdd">
						<button onClick={handleLoginWithCompany} disabled={isLoading}>
							{isLoading ? "Wait htmlFor a moment..." : "Sign In"}
						</button>
					</div>
				</div>
			</form>}
			<div className="login-resources">
				<h4>Login Via Social Account</h4>
				<ul>
					<li><a href="#" title="" className="fb"><i className="fa fa-facebook"></i>Login Via Facebook</a></li>
					<li><a href="#" title="" className="tw"><i className="fa fa-twitter"></i>Login Via Twitter</a></li>
				</ul>
			</div>
		</div>
	)
}

export default SignIn

