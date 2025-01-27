import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import WorkHistory from './WorkHistory';
import Title from './Title'
import Profile from './Profile';
import Career from './Career';
import Skill from './Skill';
import Product from './Product';
import ReturnTitle from './ReturnTitle';
import titleBGMAudio from '../audio/TitleBGM.mp3';
import basicBGMdAudio from '../audio/BasicBGM.mp3';
import titleScreenButtonAudio from '../audio/titleScreenButton.mp3';
import menuScreenButtonAudio from '../audio/menuScreenButton.mp3';
import detailScreenBButtonAudio from '../audio/detailScreenBButton.mp3'
import cursorAudio from '../audio/cursor.mp3';
import powerOnAudio from '../audio/screenPowerOn.mp3';
import powerOffAudio from '../audio/screenPowerOff.mp3';

import "nes.css/css/nes.min.css";
import "../style/GameBoy.css";

const GameBoy = () => {

  // ========== 表示されている画面の判定、状態の保存を行うState ========== //

  // タイトル画面
  const [titleScreen, setTitleScreen] = useState(true);
  // メニュー画面
  const [menuScreen, setMenuScreen] = useState(false);
  // メニュー画面に表示されている各項目の詳細画面
  // （プロフィール画面、経歴画面、スキル画面、成果物画面のいずれか）
  const [detailScreen, setDetailScreen] = useState(false);
  // 経歴画面
  const [careerScreen, setCareerScreen] = useState(false);
  // 成果物画面
  const [productScreen, setProductScreen] = useState(false);
  // タイトル画面に戻るかどうかを選べる画面（以降：リターン画面）
  const [showReturnTitle, setShowReturnTitle] = useState(false);

  // 電源がオンかオフかを保存する
  const [screenPower, setScreenPower] = useState(false);
  // 電源オン時にタイトル画面をフェードインさせるため
  const [screenStyle, setScreenStyle] = useState({});
  // メニュー画面で現在どの項目を選択しているかを保存する
  const [hoveredMenuNum, setHoveredMenuNum] = useState(1);
  // 成果物画面で現在どの項目を選択しているかを保存する
  const [hoveredProductNum, setHoveredProductNum] = useState(1);
  // 経歴画面で表示される経歴を保存する
  const [careers, setCareers] = useState([]);
  // スキル画面で表示されるスキルを保存する
  const [skills, setSkills] = useState([]);
  // 成果物画面で表示される成果物を保存する
  const [products, setProducts] = useState([]);
  // リターン画面から前画面に戻る際に前画面が menuScreen か detailScreen かを保存する
  const [wasMenuScreen, setWasMenuScreen] = useState(false);
  // リターン画面のラジオボタンの状態を保存する（デフォルトは yes にチェック）
  const [selectedOption, setSelectedOption] = useState("yes");

  // メニュー画面の項目
  const columns = ['PROFILE', 'CAREER', 'SKILL', 'PRODUCT'];
  // 定義したメニュー画面の項目と各コンポーネントをマッピングさせる
  const columnsMap = {
    PROFILE: Profile,
    CAREER: Career,
    SKILL: Skill,
    PRODUCT: Product
  };
  const ColumnComponent = columnsMap[columns[hoveredMenuNum - 1]];
  // 詳細画面で 十字キー によるスクロールを実現する
  const menuScreenRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);


  // ===================== ボタンクリック音・BGM ===================== //

  // タイトル画面での A・Bボタン クリック
  const titleScreenButton = new Audio(titleScreenButtonAudio);
  // メニュー画面での Aボタン クリック
  const menuScreenButton = new Audio(menuScreenButtonAudio);
  // 詳細画面での Bボタン クリック
  const detailScreenBButton = new Audio(detailScreenBButtonAudio);
  // 電源ボタン クリック（オン）
  const powerOn = new Audio(powerOnAudio);
  // 電源ボタン クリック（オフ）
  const powerOff = new Audio(powerOffAudio);
  // 十字キー クリック
  const cursor = new Audio(cursorAudio);
  // タイトル画面 BGM
  const titleBGMRef = useRef(new Audio(titleBGMAudio));
  titleBGMRef.current.loop = true;
  // 基本BGM（タイトル画面以外）
  const basicBGMRef = useRef(new Audio(basicBGMdAudio));
  basicBGMRef.current.loop = true;


  // ================== 画面遷移時のState設定 ================== //

  // タイトル画面遷移時に各stateをリセット
  const setTitleScreenStates = () => {
    setTitleScreen(true);
    setMenuScreen(false);
    setDetailScreen(false);
    setCareerScreen(false);
    setProductScreen(false);
    setHoveredMenuNum(1);
    setHoveredProductNum(1);
    setShowReturnTitle(false);
    setWasMenuScreen(false);
    setSelectedOption("yes");
  };

  // メニュー画面遷移時の各state設定
  const setMenuScreenStates = () => {
    setTitleScreen(false);
    setMenuScreen(true);
    setDetailScreen(false);
    setCareerScreen(false);
    setProductScreen(false);
    setHoveredProductNum(1);
    setShowReturnTitle(false);
    setWasMenuScreen(false);
    setSelectedOption("yes");
  };

  // 詳細画面遷移時の各state設定
  const setDetailScreenStates = () => {
    setTitleScreen(false);
    setMenuScreen(false);
    setDetailScreen(true);
    setHoveredProductNum(1);
    setShowReturnTitle(false);
    setWasMenuScreen(false);
    setSelectedOption("yes");
  };


  // ================== ボタンクリック時の挙動 ================== //

  // ===== 電源ボタン ===== //
  const powerButtonClick = () => {
    if (screenPower) { // 電源オンの場合
      basicBGMRef.current.pause(); // BGMをリセット
      basicBGMRef.current.currentTime = 0;
      titleBGMRef.current.pause();
      titleBGMRef.current.currentTime = 0;
      powerOff.play();
      setTitleScreenStates();
    } else { // 電源オフの場合
      powerOn.play();
      titleBGMRef.current.play();
    }
    setScreenPower(prevScreenPower => !prevScreenPower);
  };
  // 電源ボタン クリック時にタイトル画面をフェードイン
  useEffect(() => {
    if (screenPower) {
      setScreenStyle({
        // 2秒かけてTitleコンポーネントのopacityを1に
        transition: 'opacity 2s ease'
      });
      requestAnimationFrame(() => {
        setScreenStyle(prevStyle => ({
          ...prevStyle,
          opacity: 1,
        }));
      });
    } else {
      setScreenStyle({ // 電源オフ時にopacityを再度0に設定
        opacity: 0,
      });
    }
  }, [screenPower]);
  // ===== Aボタン ===== //
  const buttonAClick = () => {
    if (!screenPower) return; // 電源オフの場合

    if (titleScreen) { // タイトル画面の場合
        titleScreenButton.play();
        setMenuScreenStates();
        titleBGMRef.current.pause();
        titleBGMRef.current.currentTime = 0;
        basicBGMRef.current.play();
    } else if (menuScreen) { // メニュー画面の場合
        menuScreenButton.play();
        setDetailScreenStates();
        if (columns[hoveredMenuNum - 1] === 'PRODUCT') {
          setProductScreen(true); // 成果物画面への遷移を保存
        } else if (columns[hoveredMenuNum - 1] === 'CAREER') {
          setCareerScreen(true); // 経歴画面への遷移を保存
        }
    } else if (showReturnTitle) { // リターン画面の場合
      if (selectedOption === "yes") {
        menuScreenButton.play();
        setTitleScreenStates();
        basicBGMRef.current.pause();
        basicBGMRef.current.currentTime = 0;
        titleBGMRef.current.play();
      } else if (selectedOption === "no") {
        menuScreenButton.play();
        if (wasMenuScreen) { // 前画面（メニュー画面 or 詳細画面）に戻る
          setMenuScreenStates();
        } else {
          setDetailScreenStates();
        }
      }
    } else if (productScreen) { // 成果物画面の場合
      menuScreenButton.play();
      window.open(products[hoveredProductNum - 1].url, "_blank")
    }
  };
  // ===== Bボタン ===== //
  const buttonBClick = () => {
    if (!screenPower) return; // 電源オフの場合

    if (titleScreen) { // タイトル画面の場合
        titleScreenButton.play();
        setMenuScreenStates();
        titleBGMRef.current.pause();
        titleBGMRef.current.currentTime = 0;
        basicBGMRef.current.play();
    } else if (showReturnTitle) { // リターン画面の場合
      detailScreenBButton.play();
      if (wasMenuScreen) {
        setMenuScreenStates();
      } else {
        setDetailScreenStates();
      }
    } else if (detailScreen) { // 詳細画面の場合
      detailScreenBButton.play();
      setMenuScreenStates();
    }
  };
  // ===== セレクトボタン ===== //
  const selectButtonClick = () => {
    if (!screenPower) return; // 電源オフの場合

    if (showReturnTitle) { // 既に リターン画面 の場合は前の画面に戻る
      menuScreenButton.play();
      if (wasMenuScreen) {
        setMenuScreenStates();
      } else {
        setDetailScreenStates();
      }
    } else if (!titleScreen) { // タイトル画面 以外の場合は リターン画面 を表示
      menuScreenButton.play();
      setShowReturnTitle(true);
      if (menuScreen) { // 前の画面に戻れるよう状態も保存しておく
        setMenuScreen(false);
        setWasMenuScreen(true);
      } else {
        setDetailScreen(false);
        setWasMenuScreen(false);
      }
    }
  };
  // 十字キーを押している間だけ border の色を変化させる
  const handleMouseDown = (event) => {
    event.target.style.borderColor = 'black';
  };
  // 十字キーを離すと border の色を元に戻す
  const handleMouseUp = (event) => {
    event.target.style.borderColor = '#555555';
  };
  // 詳細画面で 十字キー 連打時にクリック音を連続して出せるようにする
  let isCursorPlaying = false;
  const playCursorSound = () => {
    if (isCursorPlaying) return; // 再生中なら何もしない
    isCursorPlaying = true;
    cursor.pause();
    cursor.currentTime = 0;
    cursor.play().finally(() => {
        isCursorPlaying = false; // 再生が完了したらフラグを戻す
    });
  };
  // スキル画面と成果物画面で十字キー（上、下）を連打した場合にスクロールがズレるので
  // 待機時間内であればスクロール中は別のスクロールを行わないようにする
  let time;
  const resetScrolling = (time) => {
    setTimeout(() => {
      setIsScrolling(false);
    }, time);
  };
  // ===== 十字キー（上） ===== //
  const topBottomClick = () => {
    if (!screenPower) return; // 電源オフの場合

    if (menuScreen) { // メニュー画面の場合
      setHoveredMenuNum(prevNum => (prevNum > 1 ? prevNum - 1 : columns.length));
      cursor.play();
    } else if (productScreen) { // 成果物画面の場合
      if (menuScreenRef.current && !isScrolling) { // 十字キー（上）で画面をスクロール
        setHoveredProductNum(prevNum => (prevNum > 1 ? prevNum - 1 : products.length));
        setIsScrolling(true);
        const scrollHeight = menuScreenRef.current.scrollHeight; // 全体の高さ
        const clientHeight = menuScreenRef.current.clientHeight; // 表示領域の高さ

        if (hoveredProductNum === 1) {
          // 一番上の成果物で十字キー（上）をクリックした際には一番下までスクロールする
          menuScreenRef.current.scrollTo({ top: scrollHeight - clientHeight, behavior: 'smooth' });
          time = products.length * 100 // 成果物の数に応じて待機時間を調整
        } else {
          // それ以外は通常通り上にスクロールする
          menuScreenRef.current.scrollBy({ top: -clientHeight, behavior: 'smooth' });
          time = 300
        }
        // スクロールが終了した後、フラグをリセット
        resetScrolling(time);
      }
      cursor.play();
    } else if (detailScreen && ColumnComponent !== Profile) { // 経歴画面かスキル画面の場合
      playCursorSound();
      if (menuScreenRef.current && !isScrolling) { // 十字キー（上）で画面をスクロール
        setIsScrolling(true);
        const { scrollTop } = menuScreenRef.current; // 現在のスクロール位置
        const scrollHeight = menuScreenRef.current.scrollHeight; // 全体の高さ

        if (scrollTop === 0) {
          // 一番上で十字キー（上）を押した場合は一番下までスクロール
          menuScreenRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' });
          if (careerScreen) {
            time = careers.length * 170 // 成果物の数に応じて待機時間を調整
          } else {
            time = skills.length * 60 // スキルの数に応じて待機時間を調整
          }
          resetScrolling(time);
        } else {
          // 通常通り上にスクロール
          menuScreenRef.current.scrollBy({ top: -80, behavior: 'smooth' });
          setIsScrolling(false);
        }
      }
    }
  };
  // ===== 十字キー（下） ===== //
  const bottomBottomClick = () => {
    if (!screenPower) return; // 電源オフの場合

    if (menuScreen) { // メニュー画面の場合
      setHoveredMenuNum(prevNum => (prevNum < columns.length ? prevNum + 1 : 1));
      cursor.play();
    } else if (productScreen) { // 成果物画面の場合
      if (menuScreenRef.current && !isScrolling) { // 十字キー（下）で画面をスクロール
        setHoveredProductNum(prevNum => (prevNum < products.length ? prevNum + 1 : 1));
        setIsScrolling(true);
        const clientHeight = menuScreenRef.current.clientHeight; // 表示領域の高さ

        if (hoveredProductNum === products.length) {
          // 一番下の成果物で十字キー（下）をクリックした際には一番上までスクロールする
          menuScreenRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          time = products.length * 100; // 成果物の数に応じて待機時間を調整
        } else {
          // それ以外は通常通り下にスクロールする
          menuScreenRef.current.scrollBy({ top: clientHeight, behavior: 'smooth' });
          time = 300;
        }
        // スクロールが終了した後、フラグをリセット
        resetScrolling(time);
      }
      cursor.play();
    } else if (detailScreen && ColumnComponent !== Profile) { // 経歴画面かスキル画面の場合
      playCursorSound();
      if (menuScreenRef.current && !isScrolling) { // 十字キー（下）で画面をスクロール
        setIsScrolling(true);
        const { scrollTop } = menuScreenRef.current; // 現在のスクロール位置
        const scrollHeight = menuScreenRef.current.scrollHeight; // 全体の高さ
        const clientHeight = menuScreenRef.current.clientHeight; // 表示領域の高さ

        if (scrollTop + clientHeight >= scrollHeight - 1) {
          menuScreenRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          if (careerScreen) {
            time = careers.length * 170 // 成果物の数に応じて待機時間を調整
          } else {
            time = skills.length * 60 // スキルの数に応じて待機時間を調整
          }
          resetScrolling(time);
        } else {
          menuScreenRef.current.scrollBy({ top: 80, behavior: 'smooth' });
          setIsScrolling(false);
        }
      }
    }
  };
  // ===== 十字キー（左） ===== //
  const leftBottomClick = () => {
    if (showReturnTitle) { // リターン画面の場合
      cursor.play();
      if (selectedOption === "yes") {
        setSelectedOption("no");
      } else if (selectedOption === "no") {
        setSelectedOption("yes");
      }
    }
  }
  // ===== 十字キー（右） ===== //
  const rightBottomClick = () => {
    if (showReturnTitle) { // リターン画面の場合
      cursor.play();
      if (selectedOption === "yes") {
        setSelectedOption("no");
      } else if (selectedOption === "no") {
        setSelectedOption("yes");
      }
    }
  }

  // ================== バックエンドからデータベースのデータを取得 ================== //

  // ===== 経歴 ===== //
  // 経歴画面でページの端で十字キーを押した場合に逆側にスクロールさせるが
  // そのスクロール中に別のスクロールを行わないようにするためにここで取得
  // 成果物の数（careers.length）を待機時間の設定に利用し Product コンポーネントに渡す
  useEffect(() => {
    axios.get('https://sjc-portfolio.hockey0513hockey.workers.dev/api/careers')
      .then(response => setCareers(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);
  // ===== スキル ===== //
  // スキル画面でページの端で十字キーを押した場合に逆側にスクロールさせるが
  // そのスクロール中に別のスクロールを行わないようにするためにここで取得
  // スキルの数（skills.length）を待機時間の設定に利用し Skill コンポーネントに渡す
  useEffect(() => {
    axios.get('https://sjc-portfolio.hockey0513hockey.workers.dev/api/skills')
      .then(response => setSkills(response.data))
      .catch(error => console.error('Error fetching skills:', error));
  }, []);
  // ===== 成果物 ===== //
  // 成果物画面でページの端で十字キーを押した場合に逆側にスクロールさせるが
  // そのスクロール中に別のスクロールを行わないようにするためにここで取得
  // 成果物の数（products.length）を待機時間の設定に利用し Product コンポーネントに渡す
  useEffect(() => {
    axios.get('https://sjc-portfolio.hockey0513hockey.workers.dev/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="gba">
      {/* ↓↓ ============== 上画面 ============== ↓↓ */}
      <div className="gba-upper">
        {screenPower ? (
          <div className={titleScreen ? "gba-screen-top" : "gba-screen-menu"} ref={!titleScreen && !menuScreen ? menuScreenRef : null}>
            {titleScreen ? (
              <Title style={screenStyle} />
            ) : menuScreen ? (
              Array.from({ length: columns.length }, (_, index) => index + 1).map(num => (
                <WorkHistory key={num} item={columns[num - 1]} isHovered={hoveredMenuNum === num} />
              ))
            ) : showReturnTitle ? (
              <ReturnTitle
                selectedOption={selectedOption}
                onSelectOption={setSelectedOption}
              />
            ) : detailScreen ? (
              // メニュー画面にある各項目のコンポーネントを呼び出す
              <ColumnComponent careers={careers} skills={skills} products={products} hoveredProductNum={hoveredProductNum} />
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div className="gba-screen-off"></div>
        )}
      </div>
      {/* ↑↑ ============== 上画面 ============== ↑↑ */}
      <div className="gba-joint">
        <div className="gba-joint-line-1"></div>
        <div className="gba-joint-line-2"></div>
      </div>
      {/* ↓↓ ============== 下画面 ============== ↓↓ */}
      <div className="gba-lower">
        <div className="power">POWER</div>
        <button className="power-button" onClick={powerButtonClick}></button>
        <div className="power-circle"></div>
        {/* ↓↓ ============ 電源ランプ ============ ↓↓ */}
        <div className={screenPower ? "power-lamp-1-on" : "power-lamp-1-off"}></div>
        <div className="power-lamp-2"></div>
        {/* ↑↑ ============ 電源ランプ ============ ↑↑ */}
        <div className="gba-dpad">
          {/* ↓↓ ============ 十字キー ============== ↓↓ */}
          <div className="cross-layout">
            <div className="position-top" onClick={topBottomClick}  onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>▲</div>
            <div className="position-left" onClick={leftBottomClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
              <span className="left-mark">▲</span>
            </div>
            <div className="position-right" onClick={rightBottomClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
              <span className="right-mark">▲</span>
            </div>
            <div className="position-bottom" onClick={bottomBottomClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
              <span className="bottom-mark">▲</span>
            </div>
            <div className="position-center"></div>
          </div>
          <div className="cross-circle"></div>
          {/* ↑↑ ============ 十字キー ============== ↑↑ */}
          {/* ↓↓ ============ ABボタン ============== ↓↓ */}
          <button className="button button-a" onClick={buttonAClick}>A</button>
          <button className="button button-b" onClick={buttonBClick}>B</button>
          <div className="a-b-circle"></div>
          {/* ↑↑ ============ ABボタン ============== ↑↑ */}
        </div>
        <div className="gba-start-select">
          <button className="select-button" onClick={selectButtonClick}></button>
          <button className="start-button"></button>
          <div className="select-circle"></div>
          <div className="start-circle"></div>
          <div className="select">SELECT</div>
          <div className="start">START</div>
        </div>
      </div>
      {/* ↑↑ ============== 下画面 ============== ↑↑ */}
    </div>
  );
};

export default GameBoy;
