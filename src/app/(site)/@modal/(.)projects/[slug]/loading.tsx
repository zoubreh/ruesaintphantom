export default function ModalLoading() {
  return (
    <div className="fixed inset-0 z-40 bg-white/90 flex items-center justify-center">
      <div className="h-5 w-5 border-2 border-[#e5e5e5] border-t-[#525252] animate-spin" />
    </div>
  );
}
