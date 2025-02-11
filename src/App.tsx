import Footer from "./components/layout/Footer";
import Container from "./components/layout/Container";
import HashtagList from "./components/hashtag/HashtagList";
import { useFeedbackItemsStore } from "./stores/feedbackItemsStore";
import { useEffect } from "react";

function App() {
  const getFeedbackItems = useFeedbackItemsStore(
    (state) => state.getFeedbackItems
  );

  useEffect(() => {
    getFeedbackItems();
  }, [getFeedbackItems]);

  return (
    <div className="app">
      <Footer />
      <Container />
      <HashtagList />
    </div>
  );
}

export default App;
