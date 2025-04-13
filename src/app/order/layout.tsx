import { FormProvider } from "@/provider/FormProvider";

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FormProvider>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col max-w-md mx-auto">{children}</div>
        </div>
      </div>
    </FormProvider>
  );
}
