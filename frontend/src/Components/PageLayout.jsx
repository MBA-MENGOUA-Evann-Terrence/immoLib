import NavBar from './NavBar';
import Footer from './Footer';

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <div className="pt-16 lg:pt-[72px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
}
