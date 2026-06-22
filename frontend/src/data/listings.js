import propertyImage from '../assets/images/background_image.jpg';

export const INITIAL_LISTINGS = [
  {
    id: 1,
    image: propertyImage,
    images: [propertyImage, propertyImage, propertyImage, propertyImage],
    title: 'Villa avec piscine',
    address: 'Quartier Louis, Libreville, Gabon',
    location: 'Libreville, Gabon',
    price: '850 000 FCFA',
    priceNumeric: 850000,
    downPayment: '170 000 FCFA',
    type: 'Villa',
    transaction: 'Vente',
    beds: 4,
    baths: 3,
    sqft: 220,
    rating: 4.8,
    description:
      'Magnifique villa moderne avec piscine privée, située dans un quartier résidentiel calme de Libreville. Ce bien offre de vastes espaces de vie lumineux, une cuisine équipée, un jardin tropical et un garage pour deux véhicules. Idéal pour une famille recherchant confort et tranquillité.',
    highlights: [
      { label: 'Type', value: 'Villa', icon: 'home' },
      { label: 'Charges', value: 'Aucune', icon: 'fee' },
      { label: 'Année', value: '2019', icon: 'year' },
      { label: 'Parking', value: '2 places', icon: 'parking' },
      { label: 'Meublé', value: 'Non', icon: 'furniture' },
      { label: 'Étage', value: 'RDC + 1', icon: 'floor' },
    ],
    agent: {
      name: 'Marie Obame',
      initials: 'MO',
      color: '#008080',
      agency: 'ImmoLib Premium',
      license: 'GA-2024-0012',
      phone: '+241 062 45 21 12',
      badges: ['Top Rated', 'Agent Pro'],
    },
  },
  {
    id: 2,
    image: propertyImage,
    images: [propertyImage, propertyImage, propertyImage, propertyImage],
    title: 'Maison tropicale',
    address: 'Zone Industrielle, Owendo, Gabon',
    location: 'Owendo, Gabon',
    price: '620 000 FCFA',
    priceNumeric: 620000,
    downPayment: '62 000 FCFA/mois',
    type: 'Maison',
    transaction: 'Location',
    beds: 3,
    baths: 2,
    sqft: 165,
    rating: 4.5,
    description:
      'Charmante maison tropicale à Owendo, proche des commodités et des axes principaux. Grand salon, terrasse ombragée et cour arrière spacieuse. Parfaite pour un couple ou une petite famille.',
    highlights: [
      { label: 'Type', value: 'Maison', icon: 'home' },
      { label: 'Charges', value: 'Incluses', icon: 'fee' },
      { label: 'Année', value: '2015', icon: 'year' },
      { label: 'Parking', value: '1 place', icon: 'parking' },
      { label: 'Meublé', value: 'Oui', icon: 'furniture' },
      { label: 'Étage', value: 'RDC', icon: 'floor' },
    ],
    agent: {
      name: 'Jean Nguema',
      initials: 'JN',
      color: '#F28500',
      agency: 'ImmoLib Owendo',
      license: 'GA-2023-0087',
      phone: '+241 074 12 34 56',
      badges: ['Agent Pro'],
    },
  },
  {
    id: 3,
    image: propertyImage,
    images: [propertyImage, propertyImage, propertyImage, propertyImage],
    title: 'Résidence premium',
    address: 'Akanda Golf, Akanda, Gabon',
    location: 'Akanda, Gabon',
    price: '1 200 000 FCFA',
    priceNumeric: 1200000,
    downPayment: '240 000 FCFA',
    type: 'Appartement',
    transaction: 'Vente',
    beds: 3,
    baths: 2,
    sqft: 145,
    rating: 4.9,
    description:
      'Appartement haut standing dans une résidence sécurisée avec piscine commune et salle de sport. Vue dégagée, finitions premium et proximité du golf d\'Akanda.',
    highlights: [
      { label: 'Type', value: 'Appartement', icon: 'home' },
      { label: 'Charges', value: '150 000 FCFA/an', icon: 'fee' },
      { label: 'Année', value: '2021', icon: 'year' },
      { label: 'Parking', value: '1 place', icon: 'parking' },
      { label: 'Meublé', value: 'Non', icon: 'furniture' },
      { label: 'Étage', value: '3ème', icon: 'floor' },
    ],
    agent: {
      name: 'Sophie Mba',
      initials: 'SM',
      color: '#006666',
      agency: 'ImmoLib Akanda',
      license: 'GA-2024-0034',
      phone: '+241 066 78 90 12',
      badges: ['Top Rated', 'Agent Pro'],
    },
  },
  {
    id: 4,
    image: propertyImage,
    images: [propertyImage, propertyImage, propertyImage, propertyImage],
    title: 'Maison contemporaine',
    address: 'Centre-ville, Ntoum, Gabon',
    location: 'Ntoum, Gabon',
    price: '740 000 FCFA',
    priceNumeric: 740000,
    downPayment: '148 000 FCFA',
    type: 'Maison',
    transaction: 'Vente',
    beds: 3,
    baths: 2,
    sqft: 180,
    rating: 4.6,
    description:
      'Maison contemporaine au design épuré, avec de grandes baies vitrées et une cuisine ouverte. Située dans un environnement verdoyant à Ntoum.',
    highlights: [
      { label: 'Type', value: 'Maison', icon: 'home' },
      { label: 'Charges', value: 'Aucune', icon: 'fee' },
      { label: 'Année', value: '2018', icon: 'year' },
      { label: 'Parking', value: '2 places', icon: 'parking' },
      { label: 'Meublé', value: 'Non', icon: 'furniture' },
      { label: 'Étage', value: 'RDC + 1', icon: 'floor' },
    ],
    agent: {
      name: 'Paul Essono',
      initials: 'PE',
      color: '#008080',
      agency: 'ImmoLib Ntoum',
      license: 'GA-2022-0156',
      phone: '+241 077 23 45 67',
      badges: ['Agent Pro'],
    },
  },
  {
    id: 5,
    image: propertyImage,
    images: [propertyImage, propertyImage, propertyImage, propertyImage],
    title: 'Duplex standing',
    address: 'Nzeng-Ayong, Libreville, Gabon',
    location: 'Nzeng-Ayong, Gabon',
    price: '680 000 FCFA',
    priceNumeric: 680000,
    downPayment: '68 000 FCFA/mois',
    type: 'Appartement',
    transaction: 'Location',
    beds: 2,
    baths: 2,
    sqft: 120,
    rating: 4.4,
    description:
      'Duplex lumineux avec mezzanine, idéal pour jeunes professionnels. Proche des transports et commerces de Nzeng-Ayong.',
    highlights: [
      { label: 'Type', value: 'Appartement', icon: 'home' },
      { label: 'Charges', value: 'Incluses', icon: 'fee' },
      { label: 'Année', value: '2020', icon: 'year' },
      { label: 'Parking', value: '1 place', icon: 'parking' },
      { label: 'Meublé', value: 'Oui', icon: 'furniture' },
      { label: 'Étage', value: '4ème', icon: 'floor' },
    ],
    agent: {
      name: 'Claire Bongo',
      initials: 'CB',
      color: '#F28500',
      agency: 'ImmoLib Premium',
      license: 'GA-2023-0099',
      phone: '+241 062 98 76 54',
      badges: ['Top Rated'],
    },
  },
  {
    id: 6,
    image: propertyImage,
    images: [propertyImage, propertyImage, propertyImage, propertyImage],
    title: 'Villa moderne',
    address: 'Glass, Libreville, Gabon',
    location: 'Glass, Gabon',
    price: '950 000 FCFA',
    priceNumeric: 950000,
    downPayment: '190 000 FCFA',
    type: 'Villa',
    transaction: 'Vente',
    beds: 5,
    baths: 4,
    sqft: 250,
    rating: 4.7,
    description:
      'Villa moderne avec architecture contemporaine, piscine et espace barbecue. Quartier prisé de Glass, à proximité des écoles internationales.',
    highlights: [
      { label: 'Type', value: 'Villa', icon: 'home' },
      { label: 'Charges', value: 'Aucune', icon: 'fee' },
      { label: 'Année', value: '2022', icon: 'year' },
      { label: 'Parking', value: '3 places', icon: 'parking' },
      { label: 'Meublé', value: 'Non', icon: 'furniture' },
      { label: 'Étage', value: 'RDC + 2', icon: 'floor' },
    ],
    agent: {
      name: 'Marc Ondo',
      initials: 'MO',
      color: '#006666',
      agency: 'ImmoLib Glass',
      license: 'GA-2024-0021',
      phone: '+241 065 43 21 09',
      badges: ['Top Rated', 'Agent Pro'],
    },
  },
];

export const LOCATIONS = [
  'Akanda',
  'Glass',
  'Nzeng-Ayong',
  'Libreville',
  'Owendo',
  'Ntoum',
];

export const PROPERTY_TYPES = [
  'Appartement',
  'Maison',
  'Villa',
  'Terrain',
  'Bureau',
  'Commerce',
];

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatPrice(value) {
  return `${Number(value).toLocaleString('fr-FR')} FCFA`;
}

export function buildListing(formData, id) {
  const priceNumeric = Number(formData.price);
  const transaction = formData.transaction;
  const downPayment =
    transaction === 'Vente'
      ? formatPrice(Math.round(priceNumeric * 0.2))
      : `${formatPrice(Math.round(priceNumeric * 0.1))}/mois`;

  return {
    id,
    image: propertyImage,
    images: [propertyImage, propertyImage, propertyImage, propertyImage],
    title: formData.title,
    address: `${formData.address}, ${formData.location}, Gabon`,
    location: `${formData.location}, Gabon`,
    price: formatPrice(priceNumeric),
    priceNumeric,
    downPayment,
    type: formData.type,
    transaction,
    beds: Number(formData.beds),
    baths: Number(formData.baths),
    sqft: Number(formData.sqft),
    rating: 5.0,
    description: formData.description,
    highlights: [
      { label: 'Type', value: formData.type, icon: 'home' },
      { label: 'Charges', value: formData.charges || 'À définir', icon: 'fee' },
      { label: 'Année', value: formData.year || new Date().getFullYear().toString(), icon: 'year' },
      { label: 'Parking', value: formData.parking || 'Non précisé', icon: 'parking' },
      { label: 'Meublé', value: formData.furnished || 'Non précisé', icon: 'furniture' },
      { label: 'Étage', value: formData.floor || 'Non précisé', icon: 'floor' },
    ],
    agent: {
      name: formData.contactName,
      initials: getInitials(formData.contactName),
      color: '#008080',
      agency: 'Annonce particulier',
      license: 'N/A',
      phone: formData.contactPhone,
      badges: ['Nouveau'],
    },
  };
}
