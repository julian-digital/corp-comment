export interface TFeedbackItem {
  id: number;
  company: string;
  badgeLetter: string;
  daysAgo: number;
  upvoteCount: number;
  text: string;
}

export type TFeedbackItemsContext = {
  filteredFeedbackItems: TFeedbackItem[];
  isLoading: boolean;
  errorMessage: string;
  companyList: string[];
  handleAddItem: (text: string) => Promise<boolean>;
  handleSelectCompany: (company: string) => void;
};
