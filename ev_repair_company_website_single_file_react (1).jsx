import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// Fix EV Garage — Multi-page React single-file app
// - TailwindCSS utility classes assumed
// - React Router for multi-page navigation
// - Simple in-memory cart + checkout (no backend)
// - Branding, logo placeholder, pricing, product pages, training pages, VFD repair, parts & tools
// - Contact & booking, and lightweight SEO-friendly sections

/* ------------------------- Data -------------------------------- */
const COMPANY = {
  name: "Fix EV Garage",
  tagline: "EV • ECU • BCM • VFD • Training",
  email: "service@fixevgarage.example",
  phone: "+91 98765 43210",
  address: "123 Tech Lane, Industrial Estate, YourCity",
};

const services = [
  {
    id: "ev-repair",
    title: "EV Car Repair",
    description:
      "High-voltage battery diagnosis, motor/inverter repair, charging & BMS troubleshooting, software updates and ECU flashing.",
  },
  {
    id: "module-repair",
    title: "ECM / BCM & Module Repair",
    description:
      "Board-level diagnostics and repair for vehicle controllers, solder/BGA-level fixes, connector repair and firmware recovery.",
  },
  {
    id: "aux-modules",
    title: "Chargers & Converters",
    description: "Charger repairs, DC–DC converter troubleshooting, CAN bus simulation and bench testing.",
  },
];

const vfdService = {
  title: "Industrial VFD Repair",
  bullets: [
    "Power stage & IGBT replacement",
    "Control board fault repair",
    "Encoder & feedback loop testing",
    "Parameter recovery, backup & onsite support",
  ],
};

const products = [
  { id: "p1", title: "Refurbished ECM", price: 6500, sku: "ECM-RF-01", stock: 4 },
  { id: "p2", title: "VFD 2.2kW (3ph)", price: 24500, sku: "VFD-2K2", stock: 7 },
  { id: "p3", title: "OBD-II Advanced Scanner", price: 12800, sku: "SCAN-ADV", stock: 12 },
  { id: "p4", title: "HV Connector Kit", price: 1450, sku: "HV-KIT", stock: 25 },
];

const trainingCourses = [
  { id: "t1", title: "EV Fundamentals", length: "2 days", price: 6000 },
  { id: "t2", title: "Module Repair & Diagnostics", length: "3 days", price: 12500 },
  { id: "t3", title: "Industrial VFD Repair", length: "2 days", price: 9000 },
];

/* ------------------------- Simple helpers ----------------------- */
const formatINR = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

/* ------------------------- Cart Context ------------------------- */
const CartContext = createContext();
function useCart() {
  return useContext(CartContext);
}

function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("fixev_cart");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => localStorage.setItem("fixev_cart", JSON.stringify(items)), [items]);

  const add = (product, qty = 1) => {
    setItems((cur) => {
      const found = cur.find((i) => i.id === product.id);
      if (found) return cur.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
      return [...cur, { ...product, qty }];
    });
  };
  const remove = (id) => setItems((cur) => cur.filter((i) => i.id !== id));
  const updateQty = (id, qty) => setItems((cur) => cur.map((i) => (i.id === id ? { ...i, qty } : i)));
  const clear = () => setItems([]);
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  return (
    <CartContext.Provider value={{ items, add, remove, updateQty, clear, subtotal }}>{children}</CartContext.Provider>
  );
}

/* ------------------------- UI Components ------------------------ */
function Logo({ className = "h-10 w-10" }) {
  // simple SVG logo — replace with real asset if available
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="6" width="16" height="12" rx="2" stroke="#0f172a" strokeWidth="1.2" />
        <path d="M5 6V4a3 3 0 0 1 6 0v2" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 10v6" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="18" cy="8" r="2" stroke="#0f172a" strokeWidth="1.2" />
      </svg>
      <div className="flex flex-col">
        <span className="font-bold text-slate-900">{COMPANY.name}</span>
        <span className="text-xs -mt-1 text-slate-500">{COMPANY.tagline}</span>
      </div>
    </div>
  );
}

function TopNav() {
  const { items } = useCart();
  const cartCount = items.reduce((s, i) => s + i.qty, 0);
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3"><Logo /></Link>
        <nav className="hidden md:flex gap-4 items-center">
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/vfd">Industrial VFD</NavLink>
          <NavLink to="/parts">Parts & Tools</NavLink>
          <NavLink to="/training">Training</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-600 hidden sm:block">{COMPANY.phone}</div>
          <Link to="/cart" className="relative inline-flex items-center gap-2 px-3 py-2 border rounded-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6h15l-1.5 9h-12L4 3H2" stroke="#0f172a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-sm">Cart</span>
            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-amber-400 text-xs text-slate-900 px-2 rounded-full">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, children }) {
  const loc = useLocation();
  const active = loc.pathname.startsWith(to);
  return (
    <Link to={to} className={`px-3 py-2 rounded text-sm ${active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"}`}>{children}</Link>
  );
}

function Hero() {
  const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          <motion.h1 initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-5xl font-extrabold">Professional EV & Module Repair</motion.h1>
          <p className="mt-4 text-lg text-slate-200">{COMPANY.name} offers workshop and onsite repairs for EV cars, ECU/BCM/module repairs, industrial VFDs, plus parts and certified training for technicians.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => navigate('/contact')} className="rounded-lg px-6 py-3 bg-amber-400 text-slate-900 font-semibold">Book Service</button>
            <Link to="/training" className="rounded-lg px-6 py-3 border border-white/30">Training Courses</Link>
          </div>
        </div>
        <div className="md:w-1/2">
          <img src="https://images.unsplash.com/photo-1611095564984-8a2b7b4ca0b7?auto=format&fit=crop&w=1200&q=60" alt="EV repair" className="rounded-lg shadow-lg w-full object-cover h-72 md:h-96" />
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <main>
      <Hero />
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold">Our Services</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <article key={s.id} className="p-6 border rounded-lg bg-white">
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="text-slate-600 mt-2">{s.description}</p>
              <div className="mt-4">
                <Link to={`/services#${s.id}`} className="px-4 py-2 rounded bg-slate-900 text-white text-sm">Learn more</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold">Industrial VFD Repair</h2>
          <p className="text-slate-600 mt-2">Fast turnaround for production-critical drives. We do both bench repair and onsite diagnostics.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border rounded">
              <h4 className="font-semibold">What we do</h4>
              <ul className="list-disc pl-5 mt-2 text-slate-600">
                {vfdService.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
            <div className="p-6 bg-white border rounded">
              <h4 className="font-semibold">Onsite Support</h4>
              <p className="text-slate-600 mt-2">Portable bench and experienced technicians for critical failures plus scheduled maintenance contracts.</p>
              <div className="mt-4"><Link to="/vfd" className="px-4 py-2 rounded bg-amber-400 text-slate-900">Request Onsite</Link></div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold">Parts & Tools</h2>
        <p className="text-slate-600 mt-2">Genuine and refurbished modules, scanners and workshop tools. Competitive pricing and bulk sourcing available.</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p.id} className="p-4 border rounded bg-white">
              <div className="h-36 rounded bg-slate-100 flex items-center justify-center mb-3">Image</div>
              <div className="font-semibold">{p.title}</div>
              <div className="text-slate-600 text-sm mt-1">{formatINR(p.price)}</div>
              <div className="text-slate-500 text-xs mt-1">SKU: {p.sku}</div>
              <div className="mt-3 flex gap-2">
                <Link to={`/parts/${p.id}`} className="px-3 py-2 rounded border text-sm">Details</Link>
                <Link to="/cart" className="px-3 py-2 rounded bg-slate-900 text-white text-sm">Buy / Enquire</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold">Training for Technicians</h2>
          <p className="text-slate-600 mt-2">Hands-on courses with safety, diagnostics and board-level repair modules. Certification provided after assessment.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {trainingCourses.map((t) => (
              <div key={t.id} className="p-6 border rounded-lg bg-slate-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{t.title}</h3>
                  <div className="text-sm text-slate-500">{t.length}</div>
                </div>
                <div className="mt-3 text-slate-700 font-semibold">{formatINR(t.price)}</div>
                <div className="mt-4">
                  <Link to={`/training/${t.id}`} className="px-4 py-2 rounded bg-amber-400 text-slate-900">Enroll</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ServicesPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold">Services & Diagnostics</h2>
      <p className="text-slate-600 mt-2">Full workshop facilities for EV systems, modules and related electronics.</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s) => (
          <div key={s.id} className="p-6 border rounded bg-white">
            <h3 className="text-xl font-semibold">{s.title}</h3>
            <p className="text-slate-600 mt-2">{s.description}</p>
            <ul className="mt-3 list-disc pl-5 text-slate-600">
              <li>Bench testing with simulated sensors</li>
              <li>Firmware reprogramming & cloning</li>
              <li>Connector & harness repair</li>
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function VFDPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold">Industrial VFD Repair</h2>
      <p className="text-slate-600 mt-2">Our VFD service covers a wide range of brands and power ranges. We provide component-level repair and parameter recovery.</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded bg-white">
          <h4 className="font-semibold">Diagnostics & Repair</h4>
          <ul className="mt-2 list-disc pl-5 text-slate-600">
            {vfdService.bullets.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </div>
        <div className="p-6 border rounded bg-white">
          <h4 className="font-semibold">Maintenance Plans</h4>
          <p className="text-slate-600 mt-2">Preventive maintenance and scheduled health checks to reduce downtime for critical systems.</p>
        </div>
      </div>
      <div className="mt-6"><Link to="/contact" className="px-4 py-2 rounded bg-amber-400 text-slate-900">Request Quote</Link></div>
    </section>
  );
}

function PartsPage() {
  const { add } = useCart();
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold">Parts, Scanners & Tools</h2>
      <p className="text-slate-600 mt-2">We supply new and refurbished modules, diagnostic tools and workshop essentials.</p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="p-6 border rounded bg-white">
            <div className="h-36 rounded bg-slate-100 mb-3 flex items-center justify-center">Image</div>
            <div className="font-semibold">{p.title}</div>
            <div className="text-slate-600 mt-1">{formatINR(p.price)}</div>
            <div className="mt-3 flex gap-2">
              <Link to={`/parts/${p.id}`} className="px-3 py-2 rounded border text-sm">Details</Link>
              <button onClick={() => add(p)} className="px-3 py-2 rounded bg-slate-900 text-white text-sm">Add to cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductDetail() {
  const { pathname } = useLocation();
  const id = pathname.split('/').pop();
  const p = products.find((x) => x.id === id);
  const { add } = useCart();
  if (!p) return <div className="p-6">Product not found</div>;
  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <div className="p-6 border rounded bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 h-48 rounded bg-slate-100">Image</div>
          <div className="col-span-2">
            <h1 className="text-2xl font-bold">{p.title}</h1>
            <div className="text-slate-600 mt-2">SKU: {p.sku} • Stock: {p.stock}</div>
            <div className="text-2xl font-semibold mt-4">{formatINR(p.price)}</div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => add(p)} className="px-4 py-2 rounded bg-amber-400 text-slate-900">Add to Cart</button>
              <Link to="/contact" className="px-4 py-2 rounded border">Enquire</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrainingPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold">Training & Certification</h2>
      <p className="text-slate-600 mt-2">We run instructor-led, hands-on training focused on safety and practical repairs for EV and industrial electronics.</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {trainingCourses.map((t) => (
          <div key={t.id} className="p-6 border rounded bg-slate-50">
            <h3 className="text-xl font-semibold">{t.title}</h3>
            <div className="text-sm text-slate-500">{t.length}</div>
            <div className="mt-3 font-semibold">{formatINR(t.price)}</div>
            <div className="mt-4"><Link to={`/training/${t.id}`} className="px-4 py-2 rounded bg-amber-400 text-slate-900">Enroll</Link></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrainingDetail() {
  const { pathname } = useLocation();
  const id = pathname.split('/').pop();
  const t = trainingCourses.find((x) => x.id === id);
  const navigate = useNavigate();
  if (!t) return <div className="p-6">Course not found</div>;
  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <div className="p-6 border rounded bg-white">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <div className="text-slate-600 mt-2">Duration: {t.length}</div>
        <div className="mt-4 font-semibold">{formatINR(t.price)}</div>
        <p className="mt-4 text-slate-700">This course includes hands-on bench exercises, safety briefings and an assessed practical test. Certification issued on successful completion.</p>
        <div className="mt-6 flex gap-3">
          <Link to="/contact" className="px-4 py-2 rounded border">Request Info</Link>
          <button onClick={() => navigate('/contact')} className="px-4 py-2 rounded bg-amber-400 text-slate-900">Enroll / Book</button>
        </div>
      </div>
    </section>
  );
}

function ContactPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold">Contact & Book Service</h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <form className="p-6 border rounded bg-white" onSubmit={(e) => { e.preventDefault(); alert('Request sent — we will contact you.'); }}>
          <div className="grid gap-3">
            <input name="name" placeholder="Full name" required className="p-3 border rounded" />
            <input name="email" type="email" placeholder="Email" required className="p-3 border rounded" />
            <input name="phone" placeholder="Phone" required className="p-3 border rounded" />
            <select name="service" className="p-3 border rounded">
              <option value="ev-repair">EV Car Repair</option>
              <option value="module-repair">ECM / BCM Repair</option>
              <option value="vfd">Industrial VFD Repair</option>
              <option value="training">Training / Enrollment</option>
            </select>
            <textarea name="details" placeholder="Describe the issue / module" className="p-3 border rounded h-28" />
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 rounded bg-slate-900 text-white">Send Request</button>
              <button type="button" className="px-4 py-2 rounded border">Schedule Call</button>
            </div>
          </div>
        </form>
        <div className="p-6 border rounded bg-white">
          <h3 className="font-semibold">Workshop & Contact</h3>
          <p className="text-slate-600 mt-2">{COMPANY.address}</p>
          <div className="mt-4 text-sm text-slate-600">
            <div>Phone: {COMPANY.phone}</div>
            <div>Email: {COMPANY.email}</div>
            <div>Hours: Mon–Sat 9:00–18:00</div>
          </div>
          <div className="mt-4"><iframe title="map" src="https://www.google.com/maps?q=New+Delhi&output=embed" className="w-full h-44 rounded" /></div>
        </div>
      </div>
    </section>
  );
}

function CartPage() {
  const { items, remove, updateQty, clear, subtotal } = useCart();
  const navigate = useNavigate();
  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold">Cart</h2>
      {items.length === 0 ? (
        <div className="mt-6 p-6 border rounded bg-white">Your cart is empty. <Link to="/parts" className="text-amber-500">Browse parts</Link></div>
      ) : (
        <div className="mt-6 bg-white border rounded p-4">
          <ul className="space-y-4">
            {items.map((it) => (
              <li key={it.id} className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{it.title}</div>
                  <div className="text-sm text-slate-600">{formatINR(it.price)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <input type="number" value={it.qty} min={1} onChange={(e) => updateQty(it.id, Number(e.target.value))} className="w-20 p-1 border rounded" />
                  <button onClick={() => remove(it.id)} className="px-3 py-1 border rounded">Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between">
            <div className="text-lg font-semibold">Subtotal: {formatINR(subtotal)}</div>
            <div className="flex gap-3">
              <button onClick={() => clear()} className="px-4 py-2 border rounded">Clear</button>
              <button onClick={() => navigate('/checkout')} className="px-4 py-2 rounded bg-amber-400 text-slate-900">Checkout</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    // In production: send to backend / payment gateway.
    alert('Order placed — we will contact you to confirm.');
    clear();
    navigate('/');
  };
  if (items.length === 0) return <div className="p-6">Cart is empty.</div>;
  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold">Checkout</h2>
      <form onSubmit={handleSubmit} className="mt-6 bg-white border rounded p-6 grid gap-3">
        <input name="name" placeholder="Full name" required className="p-3 border rounded" />
        <input name="phone" placeholder="Phone" required className="p-3 border rounded" />
        <input name="email" type="email" placeholder="Email" required className="p-3 border rounded" />
        <textarea name="address" placeholder="Address for delivery / workshop" className="p-3 border rounded h-20" />
        <div className="text-lg font-semibold">Total: {formatINR(subtotal)}</div>
        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate('/cart')} className="px-4 py-2 border rounded">Back to cart</button>
          <button type="submit" className="px-4 py-2 rounded bg-slate-900 text-white">Place order</button>
        </div>
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <div className="font-bold text-xl">{COMPANY.name}</div>
          <div className="text-sm mt-2 text-slate-300">{COMPANY.tagline}</div>
        </div>
        <div className="text-sm text-slate-300">
          <div>© {new Date().getFullYear()} {COMPANY.name}</div>
          <div className="mt-2">Terms • Privacy • Warranty info</div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------- App ---------------------------------- */
export default function App() {
  return (
    <Router>
      <CartProvider>
        <TopNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/vfd" element={<VFDPage />} />
          <Route path="/parts" element={<PartsPage />} />
          <Route path="/parts/:id" element={<ProductDetail />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/training/:id" element={<TrainingDetail />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
        <Footer />
      </CartProvider>
    </Router>
  );
}

// To use:
// 1) Create a React app (Vite or CRA) and install react-router-dom and framer-motion.
// 2) Add TailwindCSS (optional) or convert classes to your CSS.
// 3) Replace the default App with this file and run 'npm start'.
// Need help integrating with payments, backend, or a real logo? Tell me which and I'll add it.
