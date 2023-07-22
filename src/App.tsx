import "./stylesheets/index.scss";
import { Curve } from "./components/Curve";

function App() {
  return (
    <div className="py-3">
      <div className="container" style={{ height: "200px" }}>
        <Curve />
      </div>
    </div>
  );
}

export default App;
