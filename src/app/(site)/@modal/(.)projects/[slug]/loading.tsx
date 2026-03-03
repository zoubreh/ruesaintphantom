export default function ModalLoading() {
  return (
    <div className="fixed inset-0 z-40 bg-surface/80 backdrop-blur-sm flex items-center justify-center">
      <div className="h-5 w-5 border-2 border-neutral-600 border-t-neutral-300 rounded-full animate-spin" />
    </div>
  );
}
