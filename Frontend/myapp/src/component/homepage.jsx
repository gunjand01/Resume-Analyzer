import Navbar from "./navbar";
import Footer from "./footer";
import BookShelf from "./bookshelf";
import "../styles/homepage.css";
const Homepage = () => {
  return (
    <div>
      <Navbar />
      <BookShelf/>
      <Footer />
    </div>
  );
};

export default Homepage;
