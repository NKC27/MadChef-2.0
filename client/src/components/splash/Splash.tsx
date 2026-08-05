import './splash.scss';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import platter from '../../assets/ingredients platter.jpeg';

function Splash() {
  return (
    <section className="hero">
      <div className="hero__glow" aria-hidden="true" />

      <Container>
        <Row className="align-items-center gy-5">
          <Col lg={6}>
            <p className="mc-eyebrow">Cook smarter</p>

            <h1 className="hero__headline">
              Turn what&rsquo;s in your kitchen into your{' '}
              <span className="mc-serif-italic">next favourite dish</span>.
            </h1>

            <p className="hero__subcopy">
              Tell us what you have on hand and MadChef finds recipes that
              actually match — so nothing in the fridge goes to waste.
            </p>

            <div className="hero__actions">
              <Link to="/RecipeBuilder" className="btn btn-primary btn-lg">
                Build a Recipe
              </Link>
              <Link
                to="/search"
                className="btn btn-outline-light btn-lg hero__secondary-btn"
              >
                Search Recipes
              </Link>
            </div>
          </Col>

          <Col lg={6}>
            <div className="hero__image-frame">
              <img src={platter} alt="A spread of fresh ingredients" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Splash;
