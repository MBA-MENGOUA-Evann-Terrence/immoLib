import Header from '../Components/Header';
import HomeListingsSection from '../Components/SearchResults/HomeListingsSection';
import Footer from '../Components/Footer';
import { SearchResultsProvider } from '../context/SearchResultsContext';

export default function HomePage() {
  return (
    <SearchResultsProvider>
      <div className="min-h-screen bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <Header />

          <HomeListingsSection />

          <Footer />
        </div>
      </div>
    </SearchResultsProvider>
  );
}
