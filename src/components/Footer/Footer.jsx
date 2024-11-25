import React from 'react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { MdAllInclusive } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='footer p-2 mt-4'>
    <div  className=" d-flex justify-content-between">
      <div className='mx-4'>
        {/* Brand Section */}
        <p className="brand-icon">
          <Link to="/" className="brandName text-decoration-none text-white fs-3 fw-bold me-1">Alcroz</Link>
          <MdAllInclusive style={{ width: "25px", height: "30px" }} />
        </p>

        {/* Description */}
        <p className="footer-description">
          ENJOY 100% ORIGINAL AUTHENTIC SNEAKERS & VINTAGE SHOES
        </p>
        <p className="contact-info">Contact: 1234567890</p>
        <p className="copyright">&copy; Alcroz</p>
</div>
<div className='mx-4'>
        {/* Social Media Icons */}
        <div className='d-flex flex-column align-items-center'>
        <div className="social-icons mt-3">
          <Link to="https://instagram.com" className="text-white mx-4 mb-1" aria-label="Instagram">
            <FaInstagram size={30} />
          </Link>
          <Link to="https://facebook.com" className="text-white mx-4 mb-1" aria-label="Facebook">
            <FaFacebook size={30} />
          </Link>
        </div>
        </div>
      </div>
    </div></div>
  );
};

export default Footer;
