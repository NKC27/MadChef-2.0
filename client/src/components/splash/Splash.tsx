import './splash.scss';
import { InputGroup, Button } from 'react-bootstrap';

function Splash() {
  return (
    <div className="jumbotron">
      <h1 className="slogan">FEELING CREATIVE?</h1>
      <h2 className="sloganBelow">TIME TO COMBINE MAD INGREDIENTS</h2>
      <div className="button-input">
        <InputGroup className="mb-3 d-flex justify-content-center">
          <a href="/RecipeBuilder" className="recipeBtn">
            <Button className="btn-danger btnSearch">
              LET'S BISH, BASH AND BOSH!
            </Button>
          </a>
        </InputGroup>
      </div>
    </div>
  );
}

export default Splash;
