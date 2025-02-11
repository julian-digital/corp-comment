import { createContext, useMemo, useState } from "react";
import { TFeedbackItem, TFeedbackItemsContext } from "../lib/types";
import { useFeedbackItems } from "../lib/hooks";

export const FeedbackItemsContext = createContext<TFeedbackItemsContext | null>(
  null
);
type FeedbackItemsContextProviderProps = {
  children: React.ReactNode;
};

export default function FeedbackItemsContextProvider({
  children,
}: FeedbackItemsContextProviderProps) {
  const {
    feedbackItems,
    setFeedbackItems,
    isLoading,
    setIsLoading,
    errorMessage,
  } = useFeedbackItems();
  const [selectedCompany, setSelectedCompany] = useState("");

  const filteredFeedbackItems = useMemo(() => {
    return feedbackItems.filter(
      (item) => selectedCompany === "" || item.company === selectedCompany
    );
  }, [selectedCompany, feedbackItems]);

  const companyList = useMemo(() => {
    return [...new Set(feedbackItems.map((item) => item.company))];
  }, [feedbackItems]);
  const handleSelectCompany = (company: string) => {
    setSelectedCompany(company);
  };

  const addFeedbackItem = async (newItem: TFeedbackItem): Promise<boolean> => {
    setIsLoading(true);
    try {
      await fetch(
        "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks",
        {
          method: "POST",
          body: JSON.stringify(newItem),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddItem = async (text: string): Promise<boolean> => {
    const companyName = (text: string) => {
      return (
        text
          .split(" ")
          .find((word: string) => word.includes("#"))
          ?.substring(1) || "General"
      );
    };
    const newItem: TFeedbackItem = {
      id: new Date().getTime(),
      company: companyName(text),
      badgeLetter: companyName(text).substring(0, 1).toUpperCase(),
      daysAgo: 0,
      upvoteCount: 0,
      text: text,
    };
    const response: boolean = await addFeedbackItem(newItem);
    if (response) {
      setFeedbackItems([...feedbackItems, newItem]);
    }
    return response;
  };

  return (
    <FeedbackItemsContext.Provider
      value={{
        isLoading,
        errorMessage,
        companyList,
        handleAddItem,
        handleSelectCompany,
        filteredFeedbackItems,
      }}
    >
      {children}
    </FeedbackItemsContext.Provider>
  );
}
