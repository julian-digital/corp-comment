import { create } from "zustand";
import { TFeedbackItem } from "../lib/types";

type Store = {
  feedbackItems: TFeedbackItem[];
  isLoading: boolean;
  errorMessage: string;
  getFeedbackItems: () => Promise<void>;
  getFilteredFeedbackItems: () => TFeedbackItem[];
  postFeedbackItem: (newItem: TFeedbackItem) => Promise<boolean>;
  addItem: (text: string) => Promise<boolean>;
  selectedCompany: string;
  getCompanyList: () => string[];
  setCompany: (company: string) => void;
};

export const useFeedbackItemsStore = create<Store>((set, get) => ({
  feedbackItems: [],
  isLoading: false,
  errorMessage: "",
  getFeedbackItems: async () => {
    //setIsLoading(true);
    set(() => ({ isLoading: true }));
    try {
      const response = await fetch(
        "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks",
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error();
      }
      const data = await response.json();
      //setFeedbackItems(data.feedbacks);
      set(() => ({ feedbackItems: data.feedbacks }));
    } catch (error) {
      // network error, not 2xx response, or JSON parsing error
      //setErrorMessage("Sorry. Something went wrong :(");
      set(() => ({ errorMessage: "Sorry. Something went wrong :(" }));
    } finally {
      //setIsLoading(false);
      set(() => ({ isLoading: false }));
    }
  },
  getFilteredFeedbackItems: () => {
    const state = get();
    return state.feedbackItems.filter(
      (item) =>
        state.selectedCompany === "" || item.company === state.selectedCompany
    );
  },
  postFeedbackItem: async (newItem: TFeedbackItem): Promise<boolean> => {
    //setIsLoading(true);
    set(() => ({ isLoading: true }));
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
      set(() => ({ isLoading: false }));
      //setIsLoading(false);
    }
  },
  addItem: async (text: string): Promise<boolean> => {
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
    const response: boolean = await get().postFeedbackItem(newItem);
    if (response) {
      //setFeedbackItems([...feedbackItems, newItem]);
      set((state: { feedbackItems: TFeedbackItem[] }) => ({
        feedbackItems: [...state.feedbackItems, newItem],
      }));
    }
    return response;
  },
  selectedCompany: "",
  getCompanyList: () => {
    const state = get();
    return [...new Set(state.feedbackItems.map((item) => item.company))];
  },
  setCompany: (company: string) => {
    //setSelectedCompany(company);
    set(() => ({ selectedCompany: company }));
  },
}));
