import { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import styles from "../styles/Home.module.css";

import FeedButton from "../components/FeedButton";

const Player = dynamic(() => import("../components/SpritePlayer"), {
  ssr: false,
});

export default function Home() {
  const [feed, setFeed] = useState(undefined);

  const feedClick = (num) => () => {
    setFeed(num);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>MuxLabs: Video Sprites</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ul>
          <li>
            <FeedButton onClick={feedClick()} currentFeed={feed} />
          </li>
          <li>
            <FeedButton onClick={feedClick(0)} feed={0} currentFeed={feed} />
          </li>
          <li>
            <FeedButton onClick={feedClick(1)} feed={1} currentFeed={feed} />
          </li>
          <li>
            <FeedButton onClick={feedClick(2)} feed={2} currentFeed={feed} />
          </li>
          <li>
            <FeedButton onClick={feedClick(3)} feed={3} currentFeed={feed} />
          </li>
        </ul>
        <Player
          playbackId="ZKiHXYr6MZ7cCQ00dIp7TUS7dIP014EtcCbVJPLHdzPDk"
          width={640}
          height={360}
          feed={feed}
        />
      </main>
    </div>
  );
}
