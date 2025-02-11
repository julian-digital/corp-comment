import { ChevronUpIcon } from "@radix-ui/react-icons";
import { TFeedbackItem } from "../../lib/types";
import { useState } from "react";

export default function FeedbackItem({
  feedbackItem,
}: {
  feedbackItem: TFeedbackItem;
}) {
  const [open, setOpen] = useState(false);
  const [upVoteCount, setUpVoteCount] = useState(feedbackItem.upvoteCount);
  const handleUpvote = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setUpVoteCount((prev) => ++prev);
    e.stopPropagation();
    e.currentTarget.disabled = true;
  };

  return (
    <li
      onClick={() => {
        setOpen((prev) => !prev);
      }}
      className={`feedback ${open ? "feedback--expand" : ""} `}
    >
      <button onClick={handleUpvote}>
        <ChevronUpIcon />
        <span>{upVoteCount}</span>
      </button>
      <div>
        <p>{feedbackItem.badgeLetter}</p>
      </div>
      <div>
        <p>{feedbackItem.company}</p>
        <p>{feedbackItem.text}</p>
      </div>
      <p>{feedbackItem.daysAgo === 0 ? "NEW" : `${feedbackItem.daysAgo}d`}</p>
    </li>
  );
}
