
export default function CategoryCard({ category, index = 0 }) {
  const pastelStyles = [
    { bg: 'bg-[#FCE7F3]', border: 'border-pink-200/70', accent: 'bg-pink-50' },
    { bg: 'bg-[#E0F2FE]', border: 'border-sky-200/70', accent: 'bg-sky-50' },
    { bg: 'bg-[#DCFCE7]', border: 'border-emerald-200/70', accent: 'bg-emerald-50' },
    { bg: 'bg-[#FEF3C7]', border: 'border-amber-200/70', accent: 'bg-amber-50' },
    { bg: 'bg-[#EDE9FE]', border: 'border-purple-200/70', accent: 'bg-purple-50' },
    { bg: 'bg-[#FFEDD5]', border: 'border-orange-200/70', accent: 'bg-orange-50' },
    { bg: 'bg-[#E0E7FF]', border: 'border-indigo-200/70', accent: 'bg-indigo-50' },
    { bg: 'bg-[#CCFBF1]', border: 'border-teal-200/70', accent: 'bg-teal-50' },
  ];

  const style = pastelStyles[index % pastelStyles.length];
  const cardBg = category.bg || style.bg;
  const cardBorder = category.border || style.border;

  return (
    <div
      className={`relative h-28 sm:h-32 p-4 sm:p-5 rounded-2xl sm:rounded-3xl ${cardBg} border ${cardBorder} flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer select-none group`}
    >

      <h3 className="font-black text-lg sm:text-xl text-brand-secondary tracking-tight z-10">
        {category.name}
      </h3>

      <div className="absolute -bottom-2 -right-2 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/95 border border-white/80 shadow-md transform rotate-18 translate-x-2 translate-y-2 flex items-center justify-center p-2.5 group-hover:rotate-12 group-hover:scale-105 transition-all duration-300 overflow-hidden">
        {category.icon ? (
          <span className="text-3xl sm:text-4xl filter drop-shadow-xs select-none">
            {category.icon}
          </span>
        ) : (
          <div className="w-full h-full rounded-xl bg-linear-to-tr from-black/5 to-black/0 flex items-center justify-center font-bold text-xs text-text-muted">
            ZOCO
          </div>
        )}
      </div>
    </div>
  );
}