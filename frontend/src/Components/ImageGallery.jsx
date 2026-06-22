import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination } from 'swiper/modules';
import villa1 from '../assets/images/villa.jpg';
import villa2 from '../assets/images/villa2.jpg';
import villa3 from '../assets/images/villa3.jpg';
import villa4 from '../assets/images/villa4.jpg';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import '../styles/ImageGallery.css';

const galleryImages = [
  { id: 1, src: villa1, title: 'Villa avec piscine', location: 'Libreville', price: '850 000 FCFA' },
  { id: 2, src: villa2, title: 'Maison tropicale', location: 'Owendo', price: '620 000 FCFA' },
  { id: 3, src: villa3, title: 'Résidence premium', location: 'Akanda', price: '1 200 000 FCFA' },
  { id: 4, src: villa4, title: 'Maison contemporaine', location: 'Ntoum', price: '740 000 FCFA' },
  { id: 5, src: villa1, title: 'Villa moderne', location: 'Libreville', price: '950 000 FCFA' },
  { id: 6, src: villa3, title: 'Duplex standing', location: 'Akanda', price: '680 000 FCFA' },
];

export default function ImageGallery() {
  return (
    <div className="property-gallery">
      <Swiper
        modules={[EffectCoverflow, Autoplay, Pagination]}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop
        loopAdditionalSlides={3}
        slidesPerView="auto"
        initialSlide={2}
        speed={600}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        coverflowEffect={{
          rotate: 0,
          stretch: -55,
          depth: 220,
          modifier: 2.4,
          slideShadows: false,
        }}
        className="property-gallery-swiper"
      >
        {galleryImages.map((image) => (
          <SwiperSlide key={image.id} className="property-gallery-slide">
            <div className="property-gallery-card">
              <img src={image.src} alt={image.title} className="property-gallery-image" />
              <div className="property-gallery-overlay">
                <div>
                  <p className="property-gallery-title">{image.title}</p>
                  <p className="property-gallery-location">{image.location}</p>
                </div>
                <p className="property-gallery-price">{image.price}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
