import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function PropertyGallery({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const extraCount = 24;

  const goTo = (index) => {
    setActiveIndex((index + images.length) % images.length);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_100px] gap-3">
      <div className="relative aspect-[16/10] lg:aspect-auto lg:h-[420px] rounded-2xl overflow-hidden group">
        <img
          src={images[activeIndex]}
          alt={`${title} - photo ${activeIndex + 1}`}
          className="w-full h-full object-cover"
        />

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
      </div>

      <div className="hidden lg:flex flex-col gap-3">
        {images.slice(0, 4).map((img, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative flex-1 min-h-[90px] rounded-xl overflow-hidden border-2 transition-colors ${
              activeIndex === index ? 'border-immo-green' : 'border-transparent'
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
            {index === 3 && (
              <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
                +{extraCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
