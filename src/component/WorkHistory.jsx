// import { useState } from 'react';
import "../style/WorkHistory.css";

const WorkHistory = (props) => {
    const {item, isHovered} = props;

    return (
      <div className={`work-history-container ${isHovered ? 'work-history-container-hoverd' : ''}`}>
        <div className={`work-history ${isHovered
          ? 'work-history-hovered nes-balloon from-right'
          : 'nes-container is-rounded is-dark'}`}>
          {item}
        </div>
        {isHovered && <img className="work-history-icon" src="/img/cat_icons/face_zoomed.png" alt="Cat Icon" style={{ width: '50px', height: '50px' }} />}
      </div>
    );
  };
  
export default WorkHistory;
