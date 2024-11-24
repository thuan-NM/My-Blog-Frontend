import React, { useEffect, useState } from "react";
import { message } from "antd"
import AuthServices from "../../services/auth.services";
import { Link } from "react-router-dom"

const SignUp = ({ setCurrentTab }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [confirmpassword, setConfirmpassword] = useState("");
	const [companyName, setCompanyName] = useState("")
	const [companyemail, setCompanyEmail] = useState("");
	const [copmpanyPassword, setCompanyPassword] = useState("");
	const [companyCountry, setCompanyCountry] = useState("");
	const [confirmcompanypassword, setConfirmCompanypassword] = useState("");
	const [currentTabSignUp, setCurrentTabSignUp] = useState("tab-3");
	const [isUserChecked, setIsUserChecked] = useState(false);
	const [isCompanyChecked, setCompanyIsChecked] = useState(false);
	const [country, setCountry] = useState("");
	const [countryOptions, setCountryOptions] = useState([]);

	useEffect(() => {
		fetch('https://restcountries.com/v3.1/all')
			.then(response => response.json())
			.then(data => {
				const countries = data.map((item) => ({ value: item.cca2, label: item.name.common }));
				setCountryOptions(countries);
			});
	}, []);
	const handleSignUpUser = async (e) => {
		if (!isUserChecked) {
			message.info("Bạn phải đồng ý với điều khoản sử dụng");
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
			try {
				const res = await AuthServices.signUp(user)
				setPassword("");
				console.log(res);
				if (res.isSuccess === 1) {
					message.success({
						content: res.message,
						style: { marginTop: '8vh' }, // Di chuyển vị trí thông báo xuống dưới
						duration: 2,
					});
					setCurrentTab("tab-1")
				}
			}
			catch (error) {
				console.log(error);
				message.error(error.response.data.message)
			}
		}
	};

	return (
		<div className='sign_in_sec'>
			<div className='dff-tab animated current'>
				<form>
					<div className="row">
						<div className="col-lg-12 no-pdd">
							<div className="sn-field">
								<input type="text" id="username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									placeholder="Username" />
								<i className="la la-user"></i>
							</div>
						</div>
						<div className="col-lg-12 no-pdd">
							<div className="sn-field">
								<input type="text" id="firstName"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									placeholder="Họ" />
								<i className="bi bi-journal-text"></i>
							</div>
						</div>
						<div className="col-lg-12 no-pdd">
							<div className="sn-field">
								<input type="text" id="lastName"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									placeholder="Tên" />
								<i className="bi bi-journal-text"></i>
							</div>
						</div>
						<div className='col-lg-12 no-pdd'>
							<div className='sn-field'>
								<select id="country"
									value={country}
									onChange={(e) => setCountry(e.target.value)}
								>
									<option value="" disabled>Chọn quốc gia</option>
									{countryOptions.map(option => (
										<option key={option.value} value={option.label}>
											{option.label}
										</option>
									))}
								</select>
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
									<small>Tôi hiểu và đồng ý với Điều khoản &amp; Điều kiện tương ứng.</small>
								</div>
							</div>
						</div>
						<div className="no-pdd flex flex-col">
							<button onClick={handleSignUpUser}>Đăng ký</button>
							<Link to={"/companyauth"}>
								<button className="!w-full mt-2">Đăng ký doanh nghiệp</button>
							</Link>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}
export default SignUp