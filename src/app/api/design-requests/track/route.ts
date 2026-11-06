import { guestSubmission } from "@/lib/guest-submission";
export async function POST(request: Request) { return guestSubmission(request, "/v1/design-requests/track"); }
