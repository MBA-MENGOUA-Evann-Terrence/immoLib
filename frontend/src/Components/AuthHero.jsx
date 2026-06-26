import { Link } from 'react-router-dom';
import backgroundImage from '../assets/images/background_image.jpg';

export default function AuthHero() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-10 xl:p-14 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-immo-green/80 via-immo-green-dark/70 to-immo-green/60" />
      </div>

      <Link to="/" className="relative z-10 text-2xl font-bold text-white tracking-tight">
        ImmoLib
      </Link>

      <div className="relative z-10 max-w-md">
        <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
          Trouvez votre chez-vous idéal
        </h2>
        <p className="mt-4 text-sm xl:text-base text-white/80 leading-relaxed">
          Visiter le bien de vos rêves n&apos;est plus qu&apos;à quelques clics —
          rapide, simple, fiable.
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-2">
        <span className="w-8 h-1 rounded-full bg-immo-orange" />
        <span className="w-2 h-2 rounded-full bg-white/50" />
        <span className="w-2 h-2 rounded-full bg-white/50" />
      </div>
    </div>
  );
}
