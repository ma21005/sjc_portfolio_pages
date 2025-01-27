import '../style/Title.css';

const Title = ({ style }) => {
  return (
    <div className="title-container" style={style}>
      <img
        className="title-image"
        src="/img/cat_icons/title_image.png"
        alt="Title"
      />
      <div className="title-name-container">
        <h2>SJC-PORTFOLIO</h2>
      </div>
      <div className="title-message-container">
        <p>Please Button Click</p>
      </div>
    </div>
  );
};

export default Title;
