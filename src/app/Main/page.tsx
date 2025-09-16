import MainContent from "@/components/pages/MainContent";
import FetchReels from "@/components/pages/FetchReels";

export default function Main() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <MainContent />
      <FetchReels />
    </div>
  );
}
