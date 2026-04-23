import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent lg:flex">
      <Sidebar />
      <main className="min-h-screen flex-1 lg:ml-72">
        <div className="mx-auto max-w-[1520px] p-4 sm:p-5 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
