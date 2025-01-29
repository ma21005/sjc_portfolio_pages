import WorkHistory from './WorkHistory';
import Title from './Title';
import ReturnTitle from './ReturnTitle';

const ScreenComponent = ({
  screenPower,
  titleScreen,
  menuScreen,
  showReturnTitle,
  detailScreen,
  careers,
  skills,
  products,
  hoveredMenuNum,
  hoveredProductNum,
  selectedOption,
  columns,
  ColumnComponent,
  screenStyle,
  menuScreenRef,
  setSelectedOption,
}) => {
  return (
    <div className="gba-upper">
      {screenPower ? (
        <div
          className={titleScreen ? 'gba-screen-top' : 'gba-screen-menu'}
          ref={!titleScreen && !menuScreen ? menuScreenRef : null}
        >
          {titleScreen ? (
            <Title style={screenStyle} />
          ) : menuScreen ? (
            Array.from({ length: columns.length }, (_, index) => index + 1).map(
              (num) => (
                <WorkHistory
                  key={num}
                  item={columns[num - 1]}
                  isHovered={hoveredMenuNum === num}
                />
              )
            )
          ) : showReturnTitle ? (
            <ReturnTitle
              selectedOption={selectedOption}
              onSelectOption={setSelectedOption}
            />
          ) : detailScreen ? (
            <ColumnComponent
              careers={careers}
              skills={skills}
              products={products}
              hoveredProductNum={hoveredProductNum}
            />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="gba-screen-off"></div>
      )}
    </div>
  );
};

export default ScreenComponent;
