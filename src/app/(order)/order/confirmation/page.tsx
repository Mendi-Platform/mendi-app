import { Suspense } from "react";
import ConfirmationClient from "./ConfirmationClient";

// Loading component
function ConfirmationLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006EFF] mb-4" />
      <p className="text-[#797979]">Laster ordredetaljer...</p>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<ConfirmationLoading />}>
      <ConfirmationClient />
    </Suspense>
  );
}
