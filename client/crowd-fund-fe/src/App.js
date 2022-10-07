import MuiButton from "./commons/MuiButton";
import Header from "./components/Header";
import Wallet from "./components/Wallet";
import Layout from "./components/Layout";

function App() {
  return (
    <div
      className="App"
      style={{
        //margin: "0 20px 0 20px",
        border: "1px solid black",
        width: "100vw",
        height: "100vh",
        // display: "grid",
        // placeItems: "centre",
      }}
    >
      <Layout />
    </div>
  );
}

export default App;
