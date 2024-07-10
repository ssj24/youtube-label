import React, { useState, useEffect, useRef} from 'react';
import ReactPlayer from 'react-player'
import noimage from './assets/noimage.svg';
import './Youtube.css';

const options = [
  ['국어', '수학', '통합'],
  ['국어', '수학', '사회', '과학', '도덕', '영어', '음악', '미술', '체육'],
  ['국어', '수학', '사회', '과학', '도덕', '영어', '음악', '미술', '체육', '실과'],
]
function Youtube(props) {
  const [url, setUrl] = useState('');
  const [urlErr, setUrlErr] = useState('');
  const [trans, setTrans] = useState('');
  const [secondOps, setSecondOps] = useState(options[0]);
  const [tempHash, setTempHash] = useState('');
  const [buttons, setButtons] = useState([]);
  const input = useRef(null);
  const firstSel = useRef(null);
  const secondSel = useRef(null);
  const hash = useRef(null);

  const handleSubmit = () => {
    setUrl(input.current.value);
    const videoIdPart = input.current.value.split('watch?v=')[1];
    if (videoIdPart) {
      const id = videoIdPart.split('&')[0];
      getSubtitle(id);
      setUrlErr('');
    } else {
      setUrlErr('유튜브 주소를 정확히 입력해주세요.')
    }
  };
  const getSubtitle = async (id) => {
    const response = await fetch('https://cors-anywhere.herokuapp.com/http://tebahsoft.iptime.org:8310/main/youtube_script/', {
      method : 'POST',
      headers :{
          'Content-Type' : 'application/json',},
      body: JSON.stringify({video_id: id})
    });
    const body = await response.json();
    const transcript = body.transcript;
    let transcriptText = '';
    for (let i=0; i< transcript.length; i++) {
      transcriptText += transcript[i].text + ' ';
    }
    setTrans(transcriptText);
  }

  const firstSelChanged = (e) => {
    const val = Math.floor(e.target.value / 2);
    setSecondOps(options[val]);
  }

  const onHashChange = (e) => {
    setTempHash(e.target.value);
  }

  const onHashKeyDown = (e) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && hash.current.value.trim()) {
      e.preventDefault();
      console.log(hash.current.value);
      const hashContent = '#' + hash.current.value.trim();
      setButtons([...buttons, hashContent]);
      hash.current.value = '';
    }
  }

  const handleCompositionEnd = (e) => {
    if (e.key === 'Enter') {
      const hashContent = '#' + hash.current.value.trim();
      setButtons([...buttons, hashContent]);
      hash.current.value = '';
    }
  };

  const buttonClicked = (idx) => {
    console.log(idx);
    setButtons(buttons.filter((_, index) => index !== idx));
  }
  return (
    <div className="wrapper">
      <div className="row first">
        <input ref={input} placeholder='유튜브 주소를 입력해주세요.'></input>
        <button onClick={handleSubmit}>로드</button>
      </div>
      {urlErr.length ? <p>{urlErr}</p> : null}
      <div className="row second">
        <div className="playerDiv">
          {url.length && urlErr === ''
            ? <ReactPlayer
                url={url}
              />
            : <img src={noimage} alt='no url is provided.' />}
        </div>
        <div className="transDiv">
          <p className="subTitle">자막</p>
          <p className="trans">{trans}</p>
        </div>
      </div>
      <div className="row third">
        <p className="subTitle">교과과정</p>
        <select ref={firstSel} onChange={firstSelChanged} className="firstSel">
          <option value={0} defaultValue={true}>초등학교 1학년</option>
          <option value={1}>초등학교 2학년</option>
          <option value={2}>초등학교 3학년</option>
          <option value={3}>초등학교 4학년</option>
          <option value={4}>초등학교 5학년</option>
          <option value={5}>초등학교 6학년</option>
        </select>
        <select ref={secondSel} className="secondSel">
            {secondOps.map((ops) => {
              return <option key={ops} value={ops}>{ops}</option>
            })}
        </select>
      </div>
      <div className="row forth">
        <p className="subTitle">해시태그</p>
        <div className="hashContainer">
          {buttons.map((buttonText, index) => (
            <button
              key={index}
              onClick={() => buttonClicked(index)}>
              {buttonText}
            </button>
          ))}
          <input
            type="text"
            ref={hash}
            onChange={onHashChange}
            onKeyDown={onHashKeyDown}
            onCompositionEnd={handleCompositionEnd}
            style={{ flexGrow: 1 }}
          />
        </div>
      </div>
    </div>
  );
}

export default Youtube;