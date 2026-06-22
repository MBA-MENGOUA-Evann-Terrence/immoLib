import { useParams, Navigate } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import PropertyGallery from '../Components/PropertyDetail/PropertyGallery';
import PropertyDetailHeader from '../Components/PropertyDetail/PropertyDetailHeader';
import PropertyPriceBlock from '../Components/PropertyDetail/PropertyPriceBlock';
import PropertyFeatures from '../Components/PropertyDetail/PropertyFeatures';
import PropertyOverview from '../Components/PropertyDetail/PropertyOverview';
import PropertyHighlights from '../Components/PropertyDetail/PropertyHighlights';
import PropertyLocation from '../Components/PropertyDetail/PropertyLocation';
import PropertySidebar from '../Components/PropertyDetail/PropertySidebar';
import { useListings } from '../context/ListingsContext';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { getListingById } = useListings();
  const listing = getListingById(id);

  if (!listing) {
    return <Navigate to="/annonces" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <main className="pt-16 lg:pt-[72px]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <PropertyDetailHeader listing={listing} />

          <div className="mt-8">
            <PropertyGallery images={listing.images} title={listing.title} />
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-12">
            <div className="space-y-10 min-w-0">
              <PropertyPriceBlock listing={listing} />
              <PropertyFeatures
                beds={listing.beds}
                baths={listing.baths}
                sqft={listing.sqft}
              />
              <PropertyOverview description={listing.description} />
              <PropertyHighlights highlights={listing.highlights} />
              <PropertyLocation address={listing.address} />
            </div>

            <PropertySidebar listing={listing} />
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <Footer />
        </div>
      </main>
    </div>
  );
}
