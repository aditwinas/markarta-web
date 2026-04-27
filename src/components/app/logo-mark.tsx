export function LogoMark() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 shadow-inner shadow-white/10">
      <div className="relative h-6 w-6">
        <span className="absolute inset-x-1 top-0 h-3 rounded-full border border-white/60" />
        <span className="absolute inset-x-2 bottom-0 h-3 rounded-full border border-white/60" />
        <span className="absolute inset-x-0 top-2 h-2 rounded-full bg-gradient-to-r from-white/80 to-cyan-200/80 blur-[1px]" />
      </div>
    </div>
  );
}
