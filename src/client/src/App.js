import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "./store";
import "./App.scss";
import Routes from "./AppRoutes";

function App() {
  const [screenSize, getDimension] = useState({
    dynamicWidth: window.innerWidth,
    dynamicHeight: window.innerHeight,
  });

  const setDimension = () => {
    getDimension({
      dynamicWidth: window.innerWidth,
      dynamicHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", setDimension);

    return () => {
      window.removeEventListener("resize", setDimension);
    };
  }, [screenSize]);

  return (
    <Provider store={store}>
      <div className="app-container">
        <header className="app-header">HEADER</header>
        {screenSize.dynamicWidth >= 1536 ? (
          <aside className="app-navigation">ASIDE</aside>
        ) : null}
        <main className="app-content">
          <Routes />
        </main>
      </div>
    </Provider>
  );
}

export default App;
