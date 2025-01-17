import React from 'react';
import { VscChromeClose } from 'react-icons/vsc';
import ReactPlayer from 'react-player';
import './FilePreviewer.css';


export const FilePreviewer = ({ url, inputId, acceptType, mimeType, opt, onChange, onClear }) => {
  const switchPlayer = (url, mimeType) => {
    if (mimeType?.includes('audio')) {
      return <ReactPlayer url={url} controls={true} height='54px' />;
    } else if (mimeType?.includes('video')) {
      return <ReactPlayer url={url} controls={true} width='100%' height='100%' />;
    } else if (mimeType?.includes('pdf')) {
      return <img src='/pdf-icon.jpeg' alt='pdf-icon' maxHeight='100%' maxWidth='100%' />;
    } else {
      return <img src={url} alt='selectedFile' height='100%' />;
    }
  };
  return (
    <div className="Container">
      {url ? (
        <div style={{ width: '100%', height: '100%' }}>
          <VscChromeClose className="Close-Button" onClick={onClear} />
          <div className="Preview-Image">
          {switchPlayer(url, mimeType)}
          </div>
        </div>
      ) : (
        <div className="Button-Content">
          <span className="Notification">
            Image（{acceptType}）
            <br />
            Max 1.5GB
          </span>
          <label className="Label" htmlFor={inputId} {...opt}>
            Choose File
            <input hidden id={inputId} type="file" {...opt} onChange={onChange} accept={acceptType} />
          </label>
        </div>
      )}
    </div>
  );
};
