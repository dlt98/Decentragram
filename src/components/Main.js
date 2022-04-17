import React, { useRef } from "react";
import Image from "./Image";

const Main = ({ captureFile, uploadImage, images, tipImageOwner }) => {
  const descriptionRef = useRef();
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 ml-auto mr-auto"
          style={{ maxWidth: "500px" }}
        >
          <div className="content mr-auto ml-auto">
            <h2>Input image</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                uploadImage(descriptionRef.current.value);
              }}
            >
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .bmp, .gif"
                onChange={captureFile}
              />
              <div className="form-group mr-sm-2">
                <br></br>
                <input
                  id="imageDescription"
                  type="text"
                  ref={descriptionRef}
                  className="form-control"
                  placeholder="Image description..."
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
              >
                Upload!
              </button>
            </form>
          </div>
          <div>
            {images.map((image, index) => (
              <Image
                author={image.author}
                hash={image.hash}
                description={image.description}
                tipAmount={image.tipAmount}
                id={image.id}
                tipImageOwner={tipImageOwner}
                key={index}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Main;
