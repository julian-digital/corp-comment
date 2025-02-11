import { useContext, useEffect, useState } from "react";
import { FeedbackItemsContext } from "../contexts/FeedbackItemsContextProvider";
import { TFeedbackItem, TFeedbackItemsContext } from "./types";

export function useFeedbackItemsContext(): TFeedbackItemsContext {
  const context = useContext(FeedbackItemsContext);
  if (!context) {
    throw Error("FeddbackItemsContext is not defined");
  }
  return context;
}

export function useFeedbackItems() {
  const [feedbackItems, setFeedbackItems] = useState<TFeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getFeedbackItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks",
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error();
      }
      const data = await response.json();
      setFeedbackItems(data.feedbacks);
    } catch (error) {
      // network error, not 2xx response, or JSON parsing error
      setErrorMessage("Sorry. Something went wrong :(");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFeedbackItems();
  }, []);

  return {
    feedbackItems,
    setFeedbackItems,
    isLoading,
    setIsLoading,
    errorMessage,
  };
}
