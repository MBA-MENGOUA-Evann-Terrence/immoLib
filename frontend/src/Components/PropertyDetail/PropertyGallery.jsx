import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faImage } from '@fortawesome/free-solid-svg-icons';

export default function PropertyGallery({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images?.length) {
    return (
      <div className="flex items-center justify-center aspect-[16/10] rounded-2xl bg-immo-beige border border-gray-200">
        <div className="text-center text-gray-400">
          <FontAwesomeIcon icon={faImage} className="text-3xl mb-2" />
          <p className="text-sm">Aucune photo pour cette annonce</p>
        </div>
      </div>
    );
  }

  const goTo = (index) => {
    setActiveIndex((index + images.length) % images.length);
  };

  const thumbs = images.slice(0, 4);
  const remaining = images.length - thumbs.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_100px] gap-3">
      <div className="relative aspect-[16/10] lg:aspect-auto lg:h-[420px] rounded-2xl overflow-hidden group">
        <img
          src={images[activeIndex]}
          alt={title ? `${title} - photo ${activeIndex + 1}` : `Photo ${activeIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Photo précédente"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Photo suivante"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="hidden lg:flex flex-col gap-3">
          {thumbs.map((img, index) => (
            <button
              key={`${img}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative flex-1 min-h-[90px] rounded-xl overflow-hidden border-2 transition-colors ${
                activeIndex === index ? 'border-immo-green' : 'border-transparent'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
              {index === thumbs.length - 1 && remaining > 0 && (
                <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
                  +{remaining}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
