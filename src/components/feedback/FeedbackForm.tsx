import { useState } from "react";
import { MAX_CHARACTERS } from "../../lib/constants";

type FeedbackFormProps = {
  onAddItem: (text: string) => Promise<boolean>;
};

const MIN_TEXT_LENGTH = 5;

export default function FeedbackForm({ onAddItem }: FeedbackFormProps) {
  const [text, setText] = useState("");
  const [showValidIndicator, setShowValidIndicator] = useState(false);
  const [showInvalidIndicator, setShowInvalidIndicator] = useState(false);
  const charLeft = MAX_CHARACTERS - text.length;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length > MAX_CHARACTERS) return;
    setText(newText);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (text.includes("#") && text.length > MIN_TEXT_LENGTH) {
      if (await onAddItem(text)) {
        setShowValidIndicator(true);
        setText("");
      } else {
        // Fetch error
        setShowInvalidIndicator(true);
      }
    } else {
      setShowInvalidIndicator(true);
    }
    setTimeout(() => {
      setShowValidIndicator(false);
      setShowInvalidIndicator(false);
    }, 2000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`form ${showValidIndicator ? "form--valid" : ""} ${
        showInvalidIndicator ? "form--invalid" : ""
      }`}
    >
      <textarea
        value={text}
        id="feedback-textarea"
        spellCheck={false}
        placeholder="Enter your feedback here, remember to #hashtag the company name"
        onChange={handleChange}
      />
      <div>
        <p className="u-italic">{charLeft}</p>
        <button type="submit">
          <span>Submit</span>
        </button>
      </div>
    </form>
  );
}
