import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd"

import axios from "axios";

const SignUp = ({setCurrentTab}) => {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [country, setCountry] = useState("");
	const [confirmpassword, setConfirmpassword] = useState("");
	const [companyName, setCompanyName] = useState("")
	const [companyemail, setCompanyEmail] = useState("");
	const [copmpanyPassword, setCompanyPassword] = useState("");
	const [companyCountry, setCompanyCountry] = useState("");
	const [confirmcompanypassword, setConfirmCompanypassword] = useState("");
	const [currentTabSignUp, setCurrentTabSignUp] = useState("tab-3");
	const [isUserChecked, setIsUserChecked] = useState(false);
	const [isCompanyChecked, setCompanyIsChecked] = useState(false);

	const handleSignUpUser = async (e) => {
		if (!isUserChecked) {
			message.info("You must check the term");
			e.preventDefault();
		}
		else {
			e.preventDefault();
			const user = {
				country: country,
				username: username,
				email: email,
				firstName: firstName,
				lastName: lastName,
				password: password,
				confirmpassword: confirmpassword,
			};
			await axios
				.post("http://localhost:3001/auth/register", user)
				.then((res) => {
					setPassword("");
					if (res.data.isSuccess === 1) {
						message.info(res.data.message)
						setCurrentTab("tab-1")
					}
				})
				.catch((error) => {
					console.log(error);
					// Sử dụng message.error để hiển thị thông báo lỗi từ server
					message.error(error.response.data.message);
				});
		}
	};

	const handleSignUpCompany = async (e) => {
		if (!isCompanyChecked) {
			message.info("You must check the term");
			e.preventDefault();
		}
		else {
			e.preventDefault();
			const company = {
				country: companyCountry,
				companyname: companyName,
				email: companyemail,
				password: copmpanyPassword,
				confirmpassword: confirmcompanypassword,
			};
			await axios
				.post("http://localhost:3001/companyauth/register", company)
				.then((res) => {
					setCompanyPassword("");
					if (res.data.isSuccess === 1) {
						message.info(res.data.message)
						setCurrentTab("tab-1")
					}
				})
				.catch((error) => {
					console.log(error);
					// Sử dụng message.error để hiển thị thông báo lỗi từ server
					message.error(error.response.data.message);
				});
		}
	};

	const handleTabClick = (tab) => {
		setCurrentTabSignUp(tab);
	};
	return (
		<div className={`sign_in_sec animated fadeIn`} id="tab-2">
			<div className="signup-tab">
				<ul>
					<li data-tab="tab-3"
						className={`animated fadeIn ${currentTabSignUp == "tab-3" ? "current" : ""}`}>
						<button onClick={() => handleTabClick("tab-3")}>User</button></li>
					<li data-tab="tab-4"
						className={`animated fadeIn ${currentTabSignUp == "tab-4" ? "current" : ""}`}>
						<button onClick={() => handleTabClick("tab-4")}>Company</button></li>
				</ul>
			</div>
			<div className={`dff-tab animated fadeIn ${currentTabSignUp == "tab-3" ? "current" : ""}`} id="tab-3">
				<form>
					<div className="row">
						<div className="col-lg-12 no-pdd">
							<div className="sn-field">
								<input type="text" id="username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									placeholder="User Name" />
								<i className="la la-user"></i>
							</div>
						</div>
						<div className="col-lg-12 no-pdd">
							<div className="sn-field">
								<input type="text" id="firstName"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									placeholder="FirstName" />
								<i className="bi bi-journal-text"></i>
							</div>
						</div>
						<div className="col-lg-12 no-pdd">
							<div className="sn-field">
								<input type="text" id="lastName"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									placeholder="LastName" />
								<i className="bi bi-journal-text"></i>
							</div>
						</div>
						<div className="col-lg-12 no-pdd">
							<div className="sn-field">
								<input type="text" id="country"
									value={country}
									onChange={(e) => setCountry(e.target.value)}
									placeholder="Country" />
								<i className="la la-globe"></i>
							</div>
						</div>
						<div className="col-lg-12 no-pdd">
							<div className="sn-field">
								<input type="text" id="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Email" />
								<i className="fa fa-envelope"></i>
							</div>
						</div>
						<div className="col-lg-12 no-pdd">
							<div className="sn-field">
								<input type="password" id="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Password" />
								<i className="la la-lock"></i>
							</div>
						</div>
						<div className="col-lg-12 no-pdd">
							<div className="sn-field">
								<input type="password" id="confirmpassword"
									value={confirmpassword}
									onChange={(e) => setConfirmpassword(e.target.value)}
									placeholder="Repeat Password" />
								<i className="la la-lock"></i>
							</div>
						</div>
						<div className="col-lg-12 no-pdd">
							<div className="checky-sec st2">
								<div className="fgt-sec">
									<input type="checkbox" name="cc" id="c2" onClick={() => { setIsUserChecked(!isUserChecked) }} />
									<label htmlFor="c2">
										<span></span>
									</label>
									<small>Yes, I understand and agree to the workwise Terms &amp; Conditions.</small>
								</div>
							</div>
						</div>
						<div className="col-lg-12 no-pdd">
							<button onClick={handleSignUpUser}>Get Started</button>
						</div>
					</div>
				</form>
			</div>
			<div className={`dff-tab animated fadeIn ${currentTabSignUp == "tab-4" ? "current" : ""}`} id="tab-4">
				<form>
					<div className="row">
						<div className="col-lg-12 no-pdd">
							<div className="sn-field">
								<input type="text" id="companyName"
									value={companyName}
									onChange={(e) => setCompanyName(e.target.value)}
									placeholder="Company Name" />
								<i className="la la-building"></i>
							</div>
						</div>
						<div className="col-lg-12 no-pdd">
							<div className="sn-field">
								<input type="text" id="companyemail"
									value={companyemail}
									onChange={(e) => setCompanyEmail(e.target.value)}
									placeholder="Email" />
								<i className="fa fa-envelope"></i>
							</div>
						</div>
						<div className="col-lg-12 no-pdd">
							<div className="sn-field">
								<input type="text" id="companyCountry"
									value={companyCountry}
									onChange={(e) => setCompanyCountry(e.target.value)}
									placeholder="Country" />
								<i className="la la-globe"></i>
							</div>
						</div>
						<div className="col-lg-12 no-pdd">
							<div className="sn-field">
								<input type="password" id="copmpanyPassword"
									value={copmpanyPassword}
									onChange={(e) => setCompanyPassword(e.target.value)}
									placeholder="Password" />
								<i className="la la-lock"></i>
							</div>
						</div>
						<div className="col-lg-12 no-pdd">
							<div className="sn-field">
								<input type="password" id="confirmcompanypassword"
									value={confirmcompanypassword}
									onChange={(e) => setConfirmCompanypassword(e.target.value)}
									placeholder="Repeat Password" />
								<i className="la la-lock"></i>
							</div>
						</div>
						<div className="col-lg-12 no-pdd">
							<div className="checky-sec st2">
								<div className="fgt-sec">
									<input type="checkbox" name="cc" id="c3" onClick={() => { setCompanyIsChecked(!isCompanyChecked) }} />
									<label htmlFor="c3">
										<span></span>
									</label>
									<small>Yes, I understand and agree to the workwise Terms &amp; Conditions.</small>
								</div>
							</div>
						</div>
						<div className="col-lg-12 no-pdd">
							<button onClick={handleSignUpCompany}>Get Started</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}
export default SignUp