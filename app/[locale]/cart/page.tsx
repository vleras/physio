import { redirect } from "next/navigation";

/** Cart checkout flow is disabled for now — send shoppers to AVACR7. */
export default function CartPage() {
  redirect("https://avacr7.com/collections/all");
}
