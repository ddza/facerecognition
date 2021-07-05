import React from 'react';
import "./FaceRecognition.css";

const FaceRecognition = ({imageUrl, box}) =>{
    return (
        <div className="center ma">
           <div className="absolute mt2">
                <img id="input-image" style={{maxWidth: "600px"}} src={imageUrl}  alt="face recognition" />
                {/* <img style={{maxWidth: "600px"}} src={'https://cdn.stocksnap.io/img-thumbs/960w/business%20meeting-people_QVIEE1UZSX.jpg'}  alt="face recognition" /> */}
                <div className="bounding-box" style={{top: box.topRow, right:box.rightCol, bottom:box.bottomRow, left: box.leftCol }}></div>
           </div>
        </div>
    )
}
export default FaceRecognition;