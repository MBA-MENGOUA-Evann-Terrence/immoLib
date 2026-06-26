import propertyImage from '../assets/images/background_image.jpg';

/**
 * Extrait une valeur depuis la description structurée du formulaire.
 * @param {string} description
 * @param {string} label
 */
export function extractFromDescription(description, label) {
  if (!description) return null;
  const match = description.match(new RegExp(`${label}\\s*:\\s*([^\\n]+)`, 'i'));
  return match?.[1]?.trim() ?? null;
}

/**
 * Formate un prix en FCFA lisible.
 * @param {number} value
 */
export function formatPrix(value) {
  return `${Number(value).toLocaleString('fr-FR')} FCFA`;
}

export function mapApiTypeToTransaction(type) {
  if (type === 'location') return 'Location';
  if (type === 'vente') return 'Vente';
  return null;
}

export function mapTransactionToApiType(transaction) {
  if (!transaction) return undefined;
  const t = transaction.toLowerCase();
  if (t === 'location') return 'location';
  if (t === 'vente') return 'vente';
  return undefined;
}

function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const VILLES = new Set([
  'libreville', 'owendo', 'akanda', 'ntoum', 'glass', 'nzeng-ayong', 'gabon',
]);

const QUARTIERS_CONNUS = [
  'Akanda', 'Glass', 'Nzeng-Ayong', 'Louis', 'Oloumi', 'PK5', 'PK8', 'PK12',
  'Nombakélé', 'Camp des Boys', 'Baraka', 'Cocotiers', 'Derrière la Prison',
];

function resolveQuartier(doc, quartierNom = '') {
  if (doc.quartier) return doc.quartier;
  if (quartierNom) return quartierNom;

  const adresse = extractFromDescription(doc.description, 'Adresse');
  if (adresse) {
    const parts = adresse.split(',').map((p) => p.trim()).filter(Boolean);
    for (const part of parts) {
      if (!VILLES.has(part.toLowerCase())) return part;
    }
  }

  const texte = `${doc.titre ?? ''} ${doc.description ?? ''}`;
  for (const q of QUARTIERS_CONNUS) {
    if (texte.toLowerCase().includes(q.toLowerCase())) return q;
  }

  return null;
}

/**
 * Construit les caractéristiques affichables uniquement à partir des champs DB.
 * @param {object} doc
 */
export function buildSpecsFromDoc(doc) {
  const specs = [];

  if (doc.type) {
    specs.push({ label: 'Transaction', value: mapApiTypeToTransaction(doc.type) });
  }

  const propertyType =
    doc.categorie ?? extractFromDescription(doc.description, 'Type de bien');
  if (propertyType) {
    specs.push({ label: 'Type de bien', value: propertyType });
  }

  if (doc.surface != null && doc.surface !== '') {
    specs.push({ label: 'Surface', value: `${doc.surface} m²` });
  }

  if (doc.nbr_pieces != null) {
    specs.push({ label: 'Pièces', value: String(doc.nbr_pieces) });
  }

  if (doc.nbr_sdb != null) {
    specs.push({ label: 'Salles de bain', value: String(doc.nbr_sdb) });
  }

  if (doc.disponible != null) {
    specs.push({ label: 'Disponible', value: doc.disponible ? 'Oui' : 'Non' });
  }

  const charges = extractFromDescription(doc.description, 'Charges');
  if (charges) specs.push({ label: 'Charges', value: charges });

  const meuble = extractFromDescription(doc.description, 'Meublé');
  if (meuble) specs.push({ label: 'Meublé', value: meuble });

  const adresse = extractFromDescription(doc.description, 'Adresse');
  if (adresse) specs.push({ label: 'Adresse', value: adresse });

  if (doc.createdAt) {
    const date = new Date(doc.createdAt);
    if (!Number.isNaN(date.getTime())) {
      specs.push({
        label: 'Publié le',
        value: date.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      });
    }
  }

  return specs;
}

/**
 * Mappe le profil public du publieur (champ auteur de l'API).
 * @param {object} [auteur]
 */
export function mapPublisher(auteur) {
  if (!auteur) return null;
  const id = auteur._id?.toString?.() ?? auteur.id ?? null;
  const name = auteur.nom ?? null;
  const email = auteur.email ?? null;
  const phone = auteur.telephone ?? null;
  const photoUrl = auteur.photo_profil ?? null;

  if (!name && !email && !phone && !photoUrl) return null;

  return { id, name, email, phone, photoUrl, initials: getInitials(name || '') };
}

/**
 * Contact extrait de la description (données saisies à la publication).
 * @param {object} doc
 */
export function extractContactFromDoc(doc) {
  const name = extractFromDescription(doc.description, 'Contact');
  const phone = extractFromDescription(doc.description, 'Tél');
  if (!name && !phone) return null;
  return { name, phone, initials: getInitials(name || '') };
}

/**
 * @param {object} doc
 * @param {string} [quartierNom]
 */
export function mapAnnonceToListing(doc, quartierNom = '') {
  const id = doc._id?.toString?.() ?? doc._id;
  const photos = Array.isArray(doc.photos) ? doc.photos.filter(Boolean) : [];
  const transaction = mapApiTypeToTransaction(doc.type);
  const priceNumeric = doc.prix != null ? Number(doc.prix) : null;

  const propertyType =
    doc.categorie ?? extractFromDescription(doc.description, 'Type de bien') ?? null;

  const adresseBrute = extractFromDescription(doc.description, 'Adresse');
  const quartier = resolveQuartier(doc, quartierNom);

  const coords = doc.localisation?.coordinates;
  const coordinates =
    Array.isArray(coords) && coords.length >= 2
      ? { lng: coords[0], lat: coords[1] }
      : null;

  const description = doc.description?.trim() || null;

  return {
    id,
    image: photos[0] || propertyImage,
    images: photos,
    title: doc.titre ?? null,
    address: adresseBrute,
    location: quartier,
    quartier,
    price: priceNumeric != null ? formatPrix(priceNumeric) : null,
    priceNumeric,
    type: propertyType,
    transaction,
    beds: doc.nbr_pieces ?? null,
    baths: doc.nbr_sdb ?? null,
    sqft: doc.surface ?? null,
    description,
    specs: buildSpecsFromDoc(doc),
    contact: extractContactFromDoc(doc),
    publisher: mapPublisher(doc.auteur),
    coordinates,
    distanceM: doc.distanceM ?? null,
    disponible: doc.disponible ?? null,
    createdAt: doc.createdAt ?? null,
    _raw: doc,
  };
}

export function mapFormToAnnoncePayload(formData) {
  const payload = {
    titre: formData.titre?.trim(),
    description: formData.description?.trim() || '',
    type: formData.type,
    prix: Number(formData.prix),
    disponible: formData.disponible !== false,
    photos: [],
  };

  if (formData.surface !== '' && formData.surface != null) {
    payload.surface = Number(formData.surface);
  }

  if (formData.nbr_pieces !== '' && formData.nbr_pieces != null) {
    payload.nbr_pieces = Number(formData.nbr_pieces);
  }

  if (formData.quartierId) {
    payload.quartierId = formData.quartierId;
  }

  const lat = Number(formData.lat);
  const lng = Number(formData.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    payload.localisation = {
      type: 'Point',
      coordinates: [lng, lat],
    };
  }

  const photoUrl = formData.photoUrl?.trim();
  if (photoUrl) {
    payload.photos = [photoUrl];
  }

  return payload;
}

export { getInitials, propertyImage };
