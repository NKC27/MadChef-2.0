import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import './footer.scss';

const Footer = () => {
  return (
    <section className="footer">
      <hr className="footer-seperator" />
      <section className="footer-social-media">
        <a
          href="/"
          className="footerLogo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="madchef-logo" src="/images/madchef.png" alt="MadChef logo" />
        </a>
      </section>
      <section className="footer-info">
        <section className="footer-info-left">
          <section className="footer-info__name">
            MadChef by <a href="https://github.com/sikandersultan">Sikander</a>,{' '}
            <a href="https://github.com/nkc27">Nick</a> &{' '}
            <a href="https://github.com/Ryocon">Ryan</a>
          </section>
          <section className="footer-info__returns">MERN Application</section>
        </section>
        <section className="footer-info-center">
          <section className="footer-info__terms">
            <br />
            Copyright © 2022 Sikander, Nick & Ryan
          </section>
        </section>
        <section className="footer-info-right">
          <section className="footer-info__contact">
            <a href="https://instagram.com" className="socialIcons">
              <FaInstagram size={50} />
            </a>
            <a href="https://twitter.com" className="socialIcons">
              <FaTwitter size={50} />
            </a>
            <a href="https://facebook.com" className="socialIcons">
              <FaFacebook size={50} />
            </a>
            <a href="https://youtube.com" className="socialIcons">
              <FaYoutube size={50} />
            </a>
          </section>
        </section>
      </section>
      <hr className="footer-seperator" />
    </section>
  );
};

export default Footer;
