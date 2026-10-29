import { AdminRequests } from "@/components/custom-terrarium/admin-requests";
export const metadata = { title: "Quản lý yêu cầu · Petite Terre", robots: { index: false, follow: false } };
export default function AdminRequestsPage() { return <AdminRequests clientId={process.env.TERRALA_GOOGLE_CLIENT_ID ?? null} />; }

// Never freeze an unavailable API response or runtime configuration at build time.
export const dynamic = "force-dynamic";
