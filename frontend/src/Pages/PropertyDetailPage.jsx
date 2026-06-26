import { useEffect, useState } from 'react';
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
import { useAuth } from '../context/AuthContext';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { fetchListingById } = useListings();
  const { isAuthenticated } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    fetchListingById(id)
      .then((result) => {
        if (!cancelled) {
          setListing(result);
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, fetchListingById]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchListingById(id).then(setListing).catch(() => {});
  }, [isAuthenticated, id, fetchListingById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <NavBar />
        <main className="pt-16 lg:pt-[72px] flex items-center justify-center min-h-[50vh]">
          <p className="text-sm text-gray-500">Chargement de l&apos;annonce...</p>
        </main>
      </div>
    );
  }

  if (notFound || !listing) {
    return <Navigate to="/" replace />;
  }

  const hasSidebar = Boolean(listing.publisher);

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <main className="pt-16 lg:pt-[72px]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <PropertyDetailHeader listing={listing} />

          <div className="mt-8">
            <PropertyGallery images={listing.images} title={listing.title} />
          </div>

          <div
            className={`mt-10 grid grid-cols-1 gap-8 lg:gap-12 ${
              hasSidebar ? 'lg:grid-cols-[1fr_360px]' : ''
            }`}
          >
            <div className="space-y-10 min-w-0">
              <PropertyPriceBlock listing={listing} />
              <PropertyFeatures
                beds={listing.beds}
                baths={listing.baths}
                sqft={listing.sqft}
              />
              <PropertyOverview description={listing.description} />
              <PropertyHighlights specs={listing.specs} />
              <PropertyLocation
                address={listing.address || listing.quartier}
                coordinates={listing.coordinates}
                title={listing.title}
              />
            </div>

            {hasSidebar && <PropertySidebar listing={listing} />}
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <Footer />
        </div>
      </main>
    </div>
  );
}
