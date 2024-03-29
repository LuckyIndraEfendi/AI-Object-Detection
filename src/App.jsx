import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocoModel from "@tensorflow-models/coco-ssd";
import { useEffect, useRef, useState } from "react";
function App() {
  const webcamRef = useRef(null);
  const [modelDetect, setModelDetect] = useState(null);
  const [dataModel, setDataModel] = useState([]);
  const loadModel = async () => {
    try {
      const dataset = await cocoModel.load();
      setModelDetect(dataset);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    tf.ready().then(() => {
      loadModel();
    });
  }, []);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const img = document.createElement("a");
    img.href = imageSrc;
    img.download = "image.png";
    document.body.appendChild(img);
    img.click();
    return () => document.body.removeChild(img);
  };

  const detectObject = async () => {
    const prediction = await modelDetect.detect(webcamRef.current.video);
    setDataModel(prediction);
  };
  return (
    <>
      {console.log(dataModel)}
      <main>
        <div className="container">
          <h1 className="title">AI Object Detection Using TensorFlow</h1>
          <div className="face">
            <div className="face-container">
              <section id="face-detection">
                <Webcam ref={webcamRef} height={250} src="" id="webcam" />
              </section>
              <div className="btn-group">
                <button className="btn blueBtn" onClick={capture}>
                  Take Screenshoot
                </button>
                <button className="btn redBtn" onClick={detectObject}>
                  Detect Object
                </button>
              </div>
            </div>
            <div className="result">
              {dataModel?.map((item, index) => (
                <div className="myresult" key={index}>
                  <h1 className="result_title">
                    Object Detect : <span className="ril">{item.class}</span>
                  </h1>
                  <h1 className="accuration_title">
                    Accuration :{" "}
                    <span className="ril">{item.score.toFixed(1)}</span>
                  </h1>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
