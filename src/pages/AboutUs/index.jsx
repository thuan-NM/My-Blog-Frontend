import React from "react";
import { Link } from "react-router-dom";
import  Header from "../../components/Header"

const AboutUs = () => {
  const imagePath = process.env.PUBLIC_URL + '/images';
  return (
    <div className="bigcontainer">
      <section className="banner">
        <div className="bannerimage">
          <img src={`${imagePath}/about.png`} alt="image" />
        </div>
        <div className="bennertext">
          <div className="innertitle">
            <h2>World's largest freelancing and job portal<br />
              social networking marketplace.</h2>
            <p>We connect over 3 Million employers and freelancers globally from over 237<br /> countries, regions, and territories</p>
          </div>
        </div>
        <span className="banner-title">About us</span>
      </section>
      <section className="Company-overview">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <h2>
                Company Overview
              </h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean felis massa, commodo sed fringilla id, dignissim ut eros. Aliquam at lacinia diam, eget scelerisque massa. Nunc ut porta ante. Praesent blandit, neque nec hendrerit luctus, sem urna imperdiet ligula, eu egestas purus massa dictum arcu. Integer cursus enim nec magna dapibus laoreet. Donec egestas fringilla risus quis volutpat. Aliquam semper massa ut sollicitudin consectetur. Suspendisse ac iaculis ligula. Duis ut velit id nisi vulputate dapibus.
              </p>
            </div>
            <div className="col-md-6 col-sm-12">
              <img src={`${imagePath}/about3.png`} alt="image" />
            </div>
          </div>
        </div>
      </section>
      <section className="services">
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <div className="blog">
                <img src={`${imagePath}/blog.png`} alt="image" />
                <h2>Our Blog</h2>
                <a href="#">View Blog</a>
              </div>
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="blog">
                <img src={`${imagePath}/career.png`} alt="image" />
                <h2>Career Opportunites</h2>
                <a href="#">Join Our Team</a>
              </div>
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="blog">
                <img src={`${imagePath}/forum.png`} alt="image" />
                <h2>Help Forum</h2>
                <a href="#">Visit Help Forum</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer>
        <div className="footy-sec mn no-margin">
          <div className="container">
            <ul>
              <li><a href="help-center.html" title="">Help Center</a></li>
              <li><Link to={"/about"}>About</Link></li>
              <li><a href="#" title="">Privacy Policy</a></li>
              <li><a href="#" title="">Community Guidelines</a></li>
              <li><a href="#" title="">Cookies Policy</a></li>
              <li><a href="#" title="">Career</a></li>
              <li><a href="forum.html" title="">Forum</a></li>
              <li><a href="#" title="">Language</a></li>
              <li><a href="#" title="">Copyright Policy</a></li>
            </ul>
            <p><img src="images/copy-icon2.png" alt="" />Copyright 2019</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
