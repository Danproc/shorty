import AssetDetailPage from "@/components/dashboard/AssetDetailPage";

export const dynamic = "force-dynamic";

export default async function AssetDetail({ params, searchParams }) {
  const { id } = await params;
  const { type } = await searchParams;

  return <AssetDetailPage assetId={id} assetType={type} />;
}
