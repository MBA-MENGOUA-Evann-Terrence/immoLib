import NavBar from '../Components/NavBar';
import Header from '../Components/Header';
import HomeListingsSection from '../Components/SearchResults/HomeListingsSection';
import Footer from '../Components/Footer';
import { SearchResultsProvider } from '../context/SearchResultsContext';

export default function HomePage() {
  return (
    <SearchResultsProvider>
      <div className="min-h-screen bg-white">
        <NavBar />

        <div className="pt-16 lg:pt-[72px]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
            <div className="rounded-[32px] lg:rounded-[40px] overflow-hidden bg-white shadow-card">
              <Header />
            </div>

            <HomeListingsSection />

            <Footer />
          </div>
        </div>
      </div>
    </SearchResultsProvider>
  );
}
