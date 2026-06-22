import backgroundImage from '../assets/images/background_image.jpg';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <section className="relative flex flex-col min-h-[520px] lg:min-h-[620px]">
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-14 lg:py-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold text-white leading-tight tracking-tight max-w-3xl">
          Trouvez le logement idéal pour votre famille
        </h1>
        <p className="mt-4 text-sm sm:text-base text-white/80 max-w-md">
          Plus de 745 000 appartements, terrains et maisons disponibles au Gabon.
        </p>

        <div className="mt-8 lg:mt-10 w-full">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
