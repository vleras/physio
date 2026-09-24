"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { toast } from "sonner";
import IonIcon from "@/components/IonIcon";
import AdminNav from "@/components/AdminNav";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type OrderLineItem = {
  product_id: number;
  name: string;
  quantity: number;
  unit_amount_cents: number;
  image?: string | null;
};

type Order = {
  id: string;
  product_id: number;
  product_name: string;
  product_image?: string | null;
  quantity: number | null;
  amount_cents: number;
  currency: string;
  status: string;
  customer_email: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  shipping_name: string | null;
  shipping_line1: string | null;
  shipping_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  line_items?: OrderLineItem[] | null;
  order_note?: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
};

function formatMoney(amountCents: number, currency = "eur") {
  try {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: (currency || "eur").toUpperCase(),
    }).format(amountCents / 100);
  } catch {
    return `€${(amountCents / 100).toFixed(2)}`;
  }
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("sq-AL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatAddress(order: Order) {
  const parts = [
    order.shipping_line1,
    order.shipping_line2,
    [order.shipping_postal_code, order.shipping_city].filter(Boolean).join(" "),
    order.shipping_state,
    order.shipping_country,
  ].filter(Boolean);

  return parts.length ? parts.join(", ") : null;
}

function getLineItems(order: Order): OrderLineItem[] {
  if (Array.isArray(order.line_items) && order.line_items.length > 0) {
    return order.line_items;
  }
  return [
    {
      product_id: order.product_id,
      name: order.product_name,
      quantity: order.quantity ?? 1,
      unit_amount_cents: Math.round(
        order.amount_cents / Math.max(1, order.quantity ?? 1)
      ),
      image: order.product_image ?? null,
    },
  ];
}

function LineThumb({
  name,
  image,
  size = 40,
}: {
  name: string;
  image?: string | null;
  size?: number;
}) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-md bg-neutral-100"
      style={{ width: size, height: size }}
    >
      {image ? (
        <Image src={image} alt={name} fill style={{ objectFit: "cover" }} />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-neutral-400">
          <IonIcon name="image-outline" size={Math.round(size * 0.4)} />
        </div>
      )}
    </div>
  );
}

function customerLabel(order: Order) {
  return order.customer_name || order.shipping_name || "Klient pa emër";
}

function DetailRow({
  icon,
  label,
  value,
  className,
}: {
  icon: string;
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-black/5 bg-white px-3.5 py-3",
        className
      )}
    >
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
        <IonIcon name={icon} size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
          {label}
        </div>
        <div className="mt-0.5 break-words text-sm font-medium text-neutral-900">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/orders");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Nuk u ngarkuan porositë");
        }
        const data = (await res.json()) as Order[];
        if (!cancelled) setOrders(data);
      } catch (error: any) {
        if (!cancelled) {
          toast.error(error.message || "Gabim në ngarkimin e porosive");
          setOrders([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadOrders();

    const onFocus = () => {
      loadOrders();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const paidTotal = useMemo(() => {
    return orders.filter((o) => o.status === "paid").reduce((sum, o) => sum + (o.amount_cents || 0), 0);
  }, [orders]);

  const selectedLines = selected ? getLineItems(selected) : [];
  const selectedAddress = selected ? formatAddress(selected) : null;

  return (
    <main className="main-content">
      <div
        className="container"
        style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h1 className="text-xl font-bold">Porositë</h1>
        </div>

        <AdminNav />

        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-black/10 bg-white px-4 py-3.5">
            <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Porosi të regjistruara
            </div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">
              {loading ? "—" : orders.length}
            </div>
          </div>
          <div className="rounded-xl border border-black/10 bg-white px-4 py-3.5">
            <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Totali i shitjeve
            </div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">
              {loading ? "—" : formatMoney(paidTotal)}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="modern-loader">
            <div className="modern-loader-spinner" />
            <span className="modern-loader-text">Duke ngarkuar porositë...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/15 bg-white px-6 py-16 text-center text-neutral-500">
            Nuk u gjetën porosi
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const lines = getLineItems(order);
              const address = formatAddress(order);
              const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-xl border border-black/10 bg-white"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 bg-neutral-200 px-4 py-3 sm:px-5">
                    <div>
                      <div className="text-sm font-medium text-neutral-900">
                        {formatDate(order.created_at)}
                        <div className="text-xs mt-1">{order.status === "paid" ? "E paguar" : "Në pritje të konfirmimit — mesazhi dhe pagesa nuk janë konfirmuar"}</div>
                        <div className="text-xs break-all">#{order.id}</div>
                      </div>
                      <div className="mt-0.5 text-xs text-neutral-500">
                        {itemCount} {itemCount === 1 ? "artikull" : "artikuj"}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-neutral-500">Shuma</div>
                        <div className="text-lg font-semibold tracking-tight text-neutral-900">
                          {formatMoney(order.amount_cents, order.currency)}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelected(order)}
                      >
                        Shiko
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 px-4 py-4 sm:grid-cols-[1.2fr_1fr] sm:px-5">
                    <div>
                      <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                        Produktet
                      </div>
                      <ul className="space-y-2.5">
                        {lines.map((line, index) => (
                          <li
                            key={`${order.id}-${line.product_id}-${index}`}
                            className="flex items-center justify-between gap-3"
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              <LineThumb name={line.name} image={line.image} />
                              <span className="min-w-0 text-sm font-medium text-neutral-900">
                                <span className="block truncate">{line.name}</span>
                                <span className="font-normal text-neutral-500">
                                  × {line.quantity}
                                </span>
                              </span>
                            </div>
                            <span className="shrink-0 text-sm text-neutral-700">
                              {formatMoney(
                                line.unit_amount_cents * line.quantity,
                                order.currency
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-black/5 pt-4 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                      <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                        Klienti
                      </div>
                      <div className="text-sm font-medium text-neutral-900">
                        {customerLabel(order)}
                      </div>
                      {order.customer_email ? (
                        <div className="mt-1 text-sm text-neutral-600">
                          {order.customer_email}
                        </div>
                      ) : null}
                      {order.customer_phone ? (
                        <div className="mt-1 text-sm text-neutral-600">
                          {order.customer_phone}
                        </div>
                      ) : null}
                      {address ? (
                        <div className="mt-2 text-sm leading-snug text-neutral-600">
                          {address}
                        </div>
                      ) : (
                        <div className="mt-2 text-sm text-neutral-400">
                          Pa adresë dorëzimi
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="gap-0 overflow-hidden border-0 p-0 sm:max-w-[520px]">
          <DialogHeader className="sr-only">
            <DialogTitle>Detajet e porosisë</DialogTitle>
            <DialogDescription>Detajet e porosisë</DialogDescription>
          </DialogHeader>

          {selected ? (
            <div>
              <div className="bg-neutral-950 px-6 pb-5 pt-6 text-white">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/55">
                  <IonIcon name="receipt-outline" size={14} />
                  {selected.status === "paid" ? "Porosi e paguar" : "Në pritje të konfirmimit"}
                </div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <div className="text-xs text-white/50">Shuma totale</div>
                    <div className="text-3xl font-semibold tracking-tight">
                      {formatMoney(selected.amount_cents, selected.currency)}
                    </div>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                    {formatDate(selected.created_at)}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 bg-neutral-50 px-5 py-5">
                <div className="rounded-lg border border-black/5 bg-white px-3.5 py-3">
                  <div className="mb-2.5 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                    Produktet e porositura
                  </div>
                  <ul className="space-y-2.5">
                    {selectedLines.map((line, index) => (
                      <li
                        key={`${selected.id}-detail-${line.product_id}-${index}`}
                        className="flex items-center justify-between gap-3 border-b border-black/5 pb-2.5 last:border-0 last:pb-0"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <LineThumb
                            name={line.name}
                            image={line.image}
                            size={44}
                          />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-neutral-900">
                              {line.name}
                            </div>
                            <div className="mt-0.5 text-xs text-neutral-500">
                              {formatMoney(line.unit_amount_cents, selected.currency)}{" "}
                              × {line.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 text-sm font-semibold text-neutral-900">
                          {formatMoney(
                            line.unit_amount_cents * line.quantity,
                            selected.currency
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <DetailRow
                  icon="person-outline"
                  label="Klienti"
                  value={customerLabel(selected)}
                />
                <DetailRow
                  icon="mail-outline"
                  label="Email"
                  value={selected.customer_email || "—"}
                />
                <DetailRow
                  icon="call-outline"
                  label="Telefoni"
                  value={selected.customer_phone || "—"}
                />
                <DetailRow
                  icon="location-outline"
                  label="Adresa e dorëzimit"
                  value={selectedAddress || "—"}
                />
                {selected.order_note ? (
                  <DetailRow
                    icon="document-text-outline"
                    label="Shënim"
                    value={selected.order_note}
                  />
                ) : null}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}
