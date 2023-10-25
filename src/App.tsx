import { useState } from "react";
import Scanner from "./components/scanner";
import type { ProductInfo } from "./components/scanner";
import "./App.css";

function App() {
  const [scanResult, setScanResult] = useState<ProductInfo>({
    code: "",
    total: 0,
    offset: 0,
    items: [],
  });

  return (
    <>
      <h1>Food Sage</h1>
      <Scanner resultCallback={setScanResult} />
      {scanResult.items.length > 0 && (
        <div>
          <p>{scanResult.items[0].title}</p>
          {scanResult.items[0].images.length > 0 && (
            <img
              style={{ width: "200px" }}
              src={scanResult.items[0].images[0]}
              alt="product"
            />
          )}
        </div>
      )}
    </>
  );
}

export default App;
