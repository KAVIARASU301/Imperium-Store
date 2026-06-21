import DashboardLayout from "@/components/DashboardLayout";
import DownloadButton from "@/components/DownloadButton";
import { getActiveProducts } from "@/lib/products";

export default function DashboardPage() {
  const products = getActiveProducts();
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold text-white">My Purchases</h1>
      <p className="mt-3 max-w-2xl text-slate-400">After Razorpay webhook confirmation, paid products unlock here. The MVP renders configured products and protected download buttons; the API still checks your authenticated paid access before signing files.</p>
      <div className="mt-8 space-y-5">{products.map((product) => <article key={product.slug} className="border border-slate-800 bg-[#0B1020] p-5"><h2 className="text-xl font-semibold text-white">{product.name}</h2><p className="mt-2 text-sm text-slate-400">{product.short_description}</p><div className="mt-4 space-y-3">{product.files?.map((file) => <div key={file.id} className="flex flex-col gap-3 border border-slate-800 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium text-white">{file.file_name}</p><p className="font-mono text-xs uppercase text-slate-500">Version {file.version} / {file.platform}</p></div><DownloadButton fileId={file.id} /></div>)}</div></article>)}</div>
    </DashboardLayout>
  );
}
