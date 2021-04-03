import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import "media-chrome";

import styles from "../styles/SpritePlayer.module.css";

export default function SpritePlayer(props) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const feedRef = useRef(null);

  const src = `https://stream.mux.com/${props.playbackId}.m3u8`;
  const storyboardSrc = `https://image.mux.com/${props.playbackId}/storyboard.vtt`;

  const feedCoordinates = (video, feed) => {
    const width = video.videoWidth;
    const height = video.videoHeight;

    switch (feed) {
      case 0:
        return [0, 0, width / 2, height / 2];
      case 1:
        return [width / 2, 0, width / 2, height / 2];
      case 2:
        return [0, height / 2, width / 2, height / 2];
      case 3:
        return [width / 2, height / 2, width / 2, height / 2];
      default:
        // Just show the whole thing.
        return [0, 0, width, height];
    }
  };

  const startCanvas = () => {
    requestAnimationFrame(updateCanvas);
  };

  const updateCanvas = (once = false) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = contextRef.current;

    if (!context) {
      return;
    }

    const [sX, sY, sWidth, sHeight] = feedCoordinates(video, feedRef.current);

    context.drawImage(
      video,
      sX,
      sY,
      sWidth,
      sHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    if (once !== true && !video.ended && !video.paused) {
      requestAnimationFrame(updateCanvas);
    }
  };

  useEffect(() => {
    feedRef.current = props.feed;
    updateCanvas(true);
  }, [props.feed]);

  useEffect(() => {
    console.log("oh hai");
    const context = canvasRef.current.getContext("2d");
    contextRef.current = context;
    updateCanvas(true);
  }, [canvasRef]);

  useEffect(() => {
    let hls;
    if (videoRef.current) {
      const video = videoRef.current;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Some browers (safari and ie edge) support HLS natively
        video.src = src;
      } else if (Hls.isSupported()) {
        // This will run in all other modern browsers
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        console.error("This is a legacy browser that doesn't support MSE");
      }

      video.addEventListener("play", startCanvas, false);
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoRef]);

  const { width, height } = props;
  return (
    <div
      className={styles.SpritePlayer}
      style={{
        width,
        height,
      }}
    >
      <media-container style={{ width, height }}>
        <video
          crossOrigin="anonymous"
          slot="media"
          ref={videoRef}
          height={height}
          width={width}
          playsInline
        >
          <track
            label="thumbnails"
            default
            kind="metadata"
            src={storyboardSrc}
          ></track>
        </video>
        <canvas slot="media" ref={canvasRef} height={height} width={width} />
        <media-control-bar>
          <media-play-button>Play</media-play-button>
          <media-progress-range>Progress</media-progress-range>
          <media-mute-button>Mute</media-mute-button>
        </media-control-bar>
      </media-container>
    </div>
  );
}
