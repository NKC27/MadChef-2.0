import Splash from '../components/splash/Splash';
import './home.scss';

// Note: the global nav (AppNavbar) is already rendered once for every
// route in App.tsx, so this page only needs its own content.
const Home = () => {
  return (
    <div className="home">
      <Splash />
    </div>
  );
};

export default Home;
