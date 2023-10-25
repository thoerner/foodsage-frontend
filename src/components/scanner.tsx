import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { lookupProduct } from "../utils/api";

const qrcodeRegionId = "html5qr-code-full-region";

interface Offer {
  merchant: string;
  domain: string;
  title: string;
  currency: string;
  list_price: string;
  price: number;
  shipping: string;
  condition: string;
  availability: string;
  link: string;
  updated_t: number;
}

interface Item {
  ean: string;
  title: string;
  description: string;
  upc: string;
  brand: string;
  model: string;
  color: string;
  size: string;
  dimension: string;
  weight: string;
  category: string;
  currency: string;
  lowest_recorded_price: number;
  highest_recorded_price: number;
  images: string[];
  offers: Offer[];
}

export interface ProductInfo {
  code: string;
  total: number;
  offset: number;
  items: Item[];
}

interface Html5QrcodeScannerConfig {
  fps: number;
  qrbox?: number;
  aspectRatio?: number;
  disableFlip?: boolean;
}

const Html5QrcodePlugin = ({
  fps,
  qrbox,
  aspectRatio,
  disableFlip,
  verbose,
  qrCodeSuccessCallback,
  qrCodeErrorCallback,
}: {
  fps?: number;
  qrbox?: number;
  aspectRatio?: number;
  disableFlip?: boolean;
  verbose?: boolean;
  qrCodeSuccessCallback: (decodedText: string, decodedResult: unknown) => void;
  qrCodeErrorCallback: (errorMessage: string) => void;
}) => {
  useEffect(() => {
    // Create config function equivalent
    const createConfig = () => {
      const config: Html5QrcodeScannerConfig = {
        fps: 10,
      };
      if (fps) {
        config.fps = fps;
      }
      if (qrbox) {
        config.qrbox = qrbox;
      }
      if (aspectRatio) {
        config.aspectRatio = aspectRatio;
      }
      if (disableFlip !== undefined) {
        config.disableFlip = disableFlip;
      }
      return config;
    };

    const config = createConfig();
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose === true
    );

    // Check if the success callback is defined, otherwise throw an error
    if (!qrCodeSuccessCallback) {
      throw new Error("qrCodeSuccessCallback is required callback.");
    }

    html5QrcodeScanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);

    // Equivalent of componentWillUnmount
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [
    fps,
    qrbox,
    aspectRatio,
    disableFlip,
    verbose,
    qrCodeSuccessCallback,
    qrCodeErrorCallback,
  ]);

  return <div id={qrcodeRegionId} />;
};

const Scanner = ({
  resultCallback,
}: {
  resultCallback: (result: ProductInfo) => void;
}) => {
  const [scanResult, setScanResult] = useState<string>("");
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    code: "",
    total: 0,
    offset: 0,
    items: [],
  });
  const [scannerVisible, setScannerVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchProductInfo = async () => {
      const productInfo = await lookupProduct(scanResult);
      setProductInfo(productInfo);
    };
    if (scanResult !== "") {
      fetchProductInfo();
    }
  }, [scanResult]);

  useEffect(() => {
    resultCallback(productInfo);
  }, [productInfo, resultCallback])

  const handleScanSuccess = (decodedText: string, decodedResult: unknown) => {
    setScanResult(decodedText);
    setScannerVisible(false);
    console.log("Success", decodedText, decodedResult);
  };

  const handleScanError = (errorMessage: string) => {
    console.log("Error", errorMessage);
  };

  const handleScanButtonClicked = () => {
    setScanResult("");
    setScannerVisible(true);
  };

  return (
    <>
      <div
        style={{
          display: scannerVisible ? "block" : "none",
          width: "100%",
          height: "100%",
        }}
      >
        <Html5QrcodePlugin
          fps={10}
          qrbox={250}
          aspectRatio={1}
          disableFlip={false}
          verbose={false}
          qrCodeSuccessCallback={(decodedText, decodedResult) => {
            handleScanSuccess(decodedText, decodedResult);
          }}
          qrCodeErrorCallback={(errorMessage) => {
            handleScanError(errorMessage);
          }}
        />
      </div>
      <div className="card">
        <button onClick={() => handleScanButtonClicked()}>Scan</button>
      </div>
    </>
  );
};

export default Scanner;
