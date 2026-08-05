import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import './footer.scss';

const Footer = () => {
  return (
    <section className="footer">
      <div className="footer-inner">
        <section className="footer-top">
          <a href="/" className="footerLogo">
            <span className="brand-wordmark">
              <span className="brand-wordmark__mad">Mad</span>
              <span className="brand-wordmark__chef">Chef</span>
            </span>
          </a>

          <section className="footer-info__contact">
            <a
              href="https://instagram.com"
              className="socialIcons"
              aria-label="Instagram"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://twitter.com"
              className="socialIcons"
              aria-label="Twitter"
            >
              <FaTwitter size={18} />
            </a>
            <a
              href="https://facebook.com"
              className="socialIcons"
              aria-label="Facebook"
            >
              <FaFacebook size={18} />
            </a>
            <a
              href="https://youtube.com"
              className="socialIcons"
              aria-label="YouTube"
            >
              <FaYoutube size={18} />
            </a>
          </section>
        </section>

        <hr className="footer-seperator" />

        <section className="footer-info">
          <section className="footer-info__name">
            MadChef by <a href="https://github.com/nkc27">Nick</a>{' '}
            <span className="footer-dot">·</span>
            MERN Application
          </section>

          <section className="footer-info__terms">
            Copyright © 2026 NKC27
          </section>
        </section>
      </div>
    </section>
  );
};

export default Footer;
