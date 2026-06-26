import backgroundImage from '../assets/images/background_image.jpg';

export default function Header() {
  return (
    <section className="relative flex flex-col min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 sm:px-8 py-10 sm:py-12 lg:py-14">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight max-w-2xl">
          Trouvez le logement idéal pour votre famille
        </h1>
        <p className="mt-3 text-sm sm:text-base text-white/80 max-w-lg">
          Plus de 745 000 appartements, terrains et maisons disponibles au Gabon.
        </p>
      </div>
    </section>
  );
}
