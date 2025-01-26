import SettingsSelectors from './SettingsSelectors';
import "./Menu.scss";

const Menu = () => {

  return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <div className='menu-container'>
          <div className="row">
            <div className="col-md-12">
              <h1>New Game</h1>
            </div>
            <div className="col-md-12">
              <SettingsSelectors />
            </div>
          </div>
        </div>
      </div>
  );
};

export default Menu;
