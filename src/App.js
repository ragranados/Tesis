import './App.css';
import esriConfig from "@arcgis/core/config.js";//config
import Map from './components/Map/map';

esriConfig.assetsPath = "./assets";
esriConfig.apiKey = process.env.REACT_APP_ARCGIS_API_KEY;

function App() {
  return (
      <div>
        <Map/>
      </div>
  );
}

export default App;
