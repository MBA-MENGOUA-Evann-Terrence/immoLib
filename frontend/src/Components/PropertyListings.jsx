import { useListings } from '../context/ListingsContext';
import PropertyListingGrid from './PropertyListingGrid';

export default function PropertyListings() {
  const { listings } = useListings();

  return (
    <PropertyListingGrid
      listings={listings}
      className="mt-6 lg:mt-8"
    />
  );
}
