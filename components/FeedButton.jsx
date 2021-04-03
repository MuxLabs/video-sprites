import styles from "../styles/FeedButton.module.css";

export default function FeedButton(props) {
  const className = [
    styles.FeedButton,
    props.feed === props.currentFeed && styles.active,
  ].join(" ");

  const title = props.feed === undefined ? "All" : `Feed ${props.feed}`;

  return (
    <button className={className} onClick={props.onClick}>
      {title}
    </button>
  );
}
