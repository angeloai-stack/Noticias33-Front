// ============================================================================
// Tarjeta de Reels de la barra lateral. Por ahora usa una captura estática
// del diseño; cuando se integre la API de Instagram/reels, la imagen y el
// texto vendrán de ahí.
// ============================================================================

import Image from "next/image";

// Texto de muestra tomado del mockup de Figma
const REELS_TEXT =
  "Alejandro Ramírez acudió a los juzgados penales y laborales de Tijuana para solicitar una revisión de las medidas cautelares impuestas a Máximo “N”, a quien señala como responsable de un ataque ocurrido en septiembre de 2024.";

export function ReelsCard() {
  return (
    <section aria-label="Reels">
      <div className="group relative w-[233px] overflow-hidden rounded-[14px] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_50px_-18px_rgba(31,95,170,0.5)]">
        <Image
          src="/design/reels-screenshot.png"
          alt="Reel de Noticias 33"
          width={233}
          height={419}
          className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute left-[10px] top-[10px] inline-flex h-[24px] w-[72px] items-center justify-center rounded-[12px] bg-n33-blue/90 text-[12px] font-bold text-white shadow-md backdrop-blur-sm">
          Reels
        </span>
      </div>
      <p className="mt-6 w-[250px] text-[13px] leading-[1.5] text-[#262626]">
        {REELS_TEXT}
      </p>
    </section>
  );
}
