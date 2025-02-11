import FeedbackItem from "./FeedbackItem";
import Spinner from "../common/Spinner";
import ErrorMessage from "../common/ErrorMessage";
import { useFeedbackItemsContext } from "../../lib/hooks";

export default function FeedbackList() {
  const { isLoading, errorMessage, filteredFeedbackItems } =
    useFeedbackItemsContext();

  return (
    <ol className="feedback-list">
      {isLoading && <Spinner />}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {filteredFeedbackItems.map((item) => (
        <FeedbackItem key={item.id} feedbackItem={item} />
      ))}
    </ol>
  );
}
