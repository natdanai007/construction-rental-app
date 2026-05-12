 "use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  dailyPrice: number;
  deposit: number;
  stock: number;
};

type CartItem = Product & {
  qty: number;
};

type Order = {
  id: string;
  customerName: string;
  phone: string;
  startDate: string;
  endDate: string;
  rentalDays: number;
  total: number;
  status: string;
  items: CartItem[];
};

const products: Product[] = [
  {
    id: 1,
    name: "นั่งร้านเหล็ก",
    category: "นั่งร้าน",
    dailyPrice: 120,
    deposit: 1000,
    stock: 20,
  },
  {
    id: 2,
    name: "สว่านโรตารี่",
    category: "เครื่องมือไฟฟ้า",
    dailyPrice: 250,
    deposit: 1500,
    stock: 8,
  },
  {
    id: 3,
    name: "เครื่องตัดไฟเบอร์",
    category: "เครื่องมือไฟฟ้า",
    dailyPrice: 300,
    deposit: 2000,
    stock: 5,
  },
  {
    id: 4,
    name: "แบบเหล็กเทคอนกรีต",
    category: "แบบก่อสร้าง",
    dailyPrice: 80,
    deposit: 500,
    stock: 50,
  },
  {
    id: 5,
    name: "เครื่องปั่นไฟ",
    category: "เครื่องจักร",
    dailyPrice: 700,
    deposit: 5000,
    stock: 3,
  },
  {
    id: 6,
    name: "รถเข็นปูน",
    category: "อุปกรณ์ไซต์งาน",
    dailyPrice: 90,
    deposit: 800,
    stock: 12,
  },
];

function money(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

function daysBetween(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return Math.max(diff, 1);
}

export default function Home() {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ทั้งหมด");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);

  const rentalDays = daysBetween(startDate, endDate);

  const categories = useMemo(() => {
    return ["ทั้งหมด", ...Array.from(new Set(products.map((p) => p.category)))];
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchQuery = product.name.toLowerCase().includes(query.toLowerCase());
      const matchCategory = category === "ทั้งหมด" || product.category === category;
      return matchQuery && matchCategory;
    });
  }, [query, category]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.dailyPrice * item.qty * rentalDays,
    0
  );

  const depositTotal = cart.reduce(
    (sum, item) => sum + item.deposit * item.qty,
    0
  );

  const grandTotal = subtotal + depositTotal;

  function addToCart(product: Product) {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);

      if (found) {
        return current.map((item) => {
          if (item.id !== product.id) return item;
          return {
            ...item,
            qty: Math.min(item.qty + 1, item.stock),
          };
        });
      }

      return [...current, { ...product, qty: 1 }];
    });
  }

  function updateQty(id: number, change: number) {
    setCart((current) =>
      current.map((item) => {
        if (item.id !== id) return item;

        return {
          ...item,
          qty: Math.min(Math.max(item.qty + change, 1), item.stock),
        };
      })
    );
  }

  function removeItem(id: number) {
    setCart((current) => current.filter((item) => item.id !== id));
  }

  function createOrder() {
    if (!customerName || !phone || cart.length === 0) return;

    const newOrder: Order = {
      id: `RENT-${String(orders.length + 1).padStart(4, "0")}`,
      customerName,
      phone,
      startDate,
      endDate,
      rentalDays,
      total: grandTotal,
      status: "รอยืนยัน",
      items: cart,
    };

    setOrders((current) => [newOrder, ...current]);
    setCart([]);
    setCustomerName("");
    setPhone("");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">
              เว็บเช่าวัสดุก่อสร้าง
            </h1>
            <p className="text-sm text-slate-500">
              ระบบจองเช่าวัสดุ เครื่องมือ และอุปกรณ์ไซต์งาน
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2">
            <ShoppingCart size={18} />
            <span className="font-medium">{cart.length} รายการในตะกร้า</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-3">
        <section className="space-y-5 lg:col-span-2">
          <div className="grid grid-cols-1 gap-3 rounded-3xl border bg-white p-4 shadow-sm md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ค้นหา เช่น นั่งร้าน สว่าน"
                className="w-full rounded-2xl border px-10 py-2.5 outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-2xl border px-3 py-2.5 outline-none"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <div className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-3 py-2.5">
              <CalendarDays size={18} />
              <span>{rentalDays} วัน</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-3xl border bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4 flex h-32 items-center justify-center rounded-3xl bg-slate-100">
                  <Package size={44} className="text-slate-400" />
                </div>

                <p className="text-xs text-slate-500">{product.category}</p>
                <h2 className="text-lg font-bold">{product.name}</h2>

                <div className="mt-3 space-y-1 text-sm">
                  <p>
                    ค่าเช่า: <b>{money(product.dailyPrice)}</b> / วัน
                  </p>
                  <p>
                    มัดจำ: <b>{money(product.deposit)}</b>
                  </p>
                  <p>
                    คงเหลือ: <b>{product.stock}</b> ชิ้น
                  </p>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-700"
                >
                  เพิ่มลงตะกร้า
                </button>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-3xl border bg-white p-4 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <ClipboardList size={20} />
              รายละเอียดการเช่า
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1 text-sm">
                <span>วันรับของ</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="w-full rounded-2xl border px-3 py-2"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span>วันคืนของ</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="w-full rounded-2xl border px-3 py-2"
                />
              </label>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3">
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="ชื่อลูกค้า"
                className="rounded-2xl border px-3 py-2"
              />

              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="เบอร์โทร"
                className="rounded-2xl border px-3 py-2"
              />
            </div>

            <div className="mt-4 space-y-3">
              {cart.length === 0 ? (
                <div className="rounded-3xl bg-slate-100 py-8 text-center text-sm text-slate-500">
                  ยังไม่มีสินค้าในตะกร้า
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="rounded-3xl border p-3">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm text-slate-500">
                          {money(item.dailyPrice)} x {rentalDays} วัน
                        </p>
                        <p className="text-sm font-medium">
                          {money(item.dailyPrice * item.qty * rentalDays)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="h-fit text-slate-400 hover:text-red-500"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="rounded-xl border p-1.5"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="w-8 text-center">{item.qty}</span>

                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="rounded-xl border p-1.5"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span>ค่าเช่า</span>
                <b>{money(subtotal)}</b>
              </div>

              <div className="flex justify-between">
                <span>ค่ามัดจำ</span>
                <b>{money(depositTotal)}</b>
              </div>

              <div className="flex justify-between text-lg">
                <span>รวมทั้งหมด</span>
                <b>{money(grandTotal)}</b>
              </div>
            </div>

            <button
              onClick={createOrder}
              disabled={!customerName || !phone || cart.length === 0}
              className="mt-4 w-full rounded-2xl bg-green-600 px-4 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              สร้างออเดอร์เช่า
            </button>
          </div>

          <div className="rounded-3xl border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-xl font-bold">ออเดอร์ล่าสุด</h2>

            {orders.length === 0 ? (
              <p className="text-sm text-slate-500">ยังไม่มีออเดอร์</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-3xl border p-3">
                    <div className="flex justify-between">
                      <b>{order.id}</b>
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                        {order.status}
                      </span>
                    </div>

                    <p className="mt-1 text-sm">ลูกค้า: {order.customerName}</p>
                    <p className="text-sm">โทร: {order.phone}</p>
                    <p className="text-sm">
                      {order.startDate} ถึง {order.endDate}
                    </p>
                    <p className="mt-1 font-bold">{money(order.total)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
