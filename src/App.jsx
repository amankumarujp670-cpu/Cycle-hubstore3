import { useMemo, useState } from "react";
import { ArrowRight, Bike, Check, ChevronDown, Heart, Menu, Search, ShieldCheck, ShoppingBag, SlidersHorizontal, Truck, X } from "lucide-react";

const products = [
  { id: 1, name: "Urban Explorer", type: "Mountain", price: 5499, old: 6299, tag: "BESTSELLER", color: "blue", wheel: "26 inch", image: "🚵" },
  { id: 2, name: "City Comfort", type: "Ladies", price: 4899, old: 5599, tag: "POPULAR", color: "rose", wheel: "26 inch", image: "🚲" },
  { id: 3, name: "Junior Sprint", type: "Kids", price: 3299, old: 3799, tag: "KIDS FAVOURITE", color: "yellow", wheel: "20 inch", image: "🚴" },
  { id: 4, name: "Trail Blazer", type: "Mountain", price: 6999, old: 7799, tag: "NEW ARRIVAL", color: "green", wheel: "27.5 inch", image: "🚵‍♂️" },
];

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function App() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "All" || product.type === category;
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  }), [category, query]);

  const addToCart = (product) => {
    setCart((items) => [...items, product]);
    setNotice(product.name + " added to your bag");
    window.setTimeout(() => setNotice(""), 2200);
  };

  return (
    <div className="site-shell">
      <div className="announcement">A better ride starts here <span>·</span> Visit our store for expert guidance</div>
      <header className="header">
        <a className="brand" href="#" aria-label="CYCLE HUB home"><span className="brand-mark"><Bike size={25} /></span><span>CYCLE<span className="brand-light">HUB</span><small>RIDE YOUR WAY</small></span></a>
        <nav className={menuOpen ? "nav nav-open" : "nav"}>
          <a href="#bikes" onClick={() => setMenuOpen(false)}>Bicycles</a>
          <a href="#collections" onClick={() => setMenuOpen(false)}>Collections</a>
          <a href="#promise" onClick={() => setMenuOpen(false)}>Why Cycle Hub</a>
          <a href="#visit" onClick={() => setMenuOpen(false)}>Visit store</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button search-toggle" aria-label="Search"><Search size={19} /></button>
          <button className="bag-button" onClick={() => setNotice(cart.length ? `Your bag has ${cart.length} item(s)` : "Your bag is empty")}><ShoppingBag size={18} /><span>Bag</span><b>{cart.length}</b></button>
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> THE FREEDOM TO MOVE</div>
            <h1>Find your<br /><em>next ride.</em></h1>
            <p>From the first school ride to everyday adventures, find a bicycle that moves with you.</p>
            <div className="hero-buttons"><a className="button button-primary" href="#bikes">Explore bicycles <ArrowRight size={17} /></a><a className="text-link" href="#visit">Visit our store</a></div>
            <div className="hero-proof"><span><ShieldCheck size={17} /> Expert guidance</span><span><Check size={17} /> Quality checked</span></div>
          </div>
          <div className="hero-art">
            <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
            <div className="hero-sticker">YOUR<br />RIDE.<br /><b>YOUR RULES.</b></div>
            <div className="hero-bike">🚴</div>
            <div className="hero-caption"><span>01 / EVERYDAY SERIES</span><b>Made for the miles ahead.</b></div>
          </div>
          <div className="hero-index">CYCLE HUB <span>—</span> EST. FOR EVERY RIDER</div>
        </section>

        <section className="benefits" id="promise">
          <div><ShieldCheck /><span><b>Quality checked</b><small>Every ride matters</small></span></div>
          <div><Truck /><span><b>Local delivery</b><small>Ask us about availability</small></span></div>
          <div><Bike /><span><b>Expert support</b><small>Help before and after purchase</small></span></div>
          <div><Heart /><span><b>Rider first</b><small>Find your perfect fit</small></span></div>
        </section>

        <section className="products-section" id="bikes">
          <div className="section-heading"><div><div className="eyebrow">THE CYCLE HUB EDIT</div><h2>Made for every <em>journey.</em></h2></div><a className="text-link desktop-link" href="#collections">Explore all bicycles <ArrowRight size={16} /></a></div>
          <div className="catalog-tools">
            <div className="filters"><SlidersHorizontal size={17} /> {["All", "Mountain", "Ladies", "Kids"].map((item) => <button key={item} className={category === item ? "filter active" : "filter"} onClick={() => setCategory(item)}>{item}</button>)}</div>
            <label className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find your bicycle" /></label>
          </div>
          <div className="product-grid">
            {visibleProducts.map((product) => <article className="product-card" key={product.id}>
              <div className={`product-visual ${product.color}`}><span className="product-tag">{product.tag}</span><button className="wishlist" aria-label="Add to wishlist"><Heart size={18} /></button><div className="product-emoji">{product.image}</div><span className="wheel-label">{product.wheel}</span></div>
              <div className="product-info"><span className="product-type">{product.type} bicycle</span><h3>{product.name}</h3><div className="price-row"><b>{money(product.price)}</b><del>{money(product.old)}</del><span className="discount">{Math.round((1 - product.price / product.old) * 100)}% OFF</span></div><button className="add-button" onClick={() => addToCart(product)}>Add to bag <ArrowRight size={16} /></button></div>
            </article>)}
          </div>
          {visibleProducts.length === 0 && <div className="empty-state">No bicycles found. Try another search or category.</div>}
          <p className="catalog-note">Product images, specifications and prices shown here are sample placeholders until your actual inventory is added.</p>
        </section>

        <section className="collection-banner" id="collections"><div><div className="eyebrow">THE RIGHT FIT FOR EVERY AGE</div><h2>Big adventures<br />start <em>small.</em></h2><p>Explore comfortable, confidence-building rides for young cyclists.</p><a className="button button-light" href="#bikes" onClick={() => setCategory("Kids")}>Shop kids bicycles <ArrowRight size={17} /></a></div><div className="collection-graphic">🚲<span>LET'S<br />ROLL</span></div></section>

        <section className="visit-section" id="visit"><div><div className="eyebrow">COME SAY HELLO</div><h2>Your next ride<br />is closer than <em>you think.</em></h2><p>Visit CYCLE HUB for help choosing the right bicycle, size and fit.</p></div><a className="button button-primary" href="https://wa.me/918404842598" target="_blank" rel="noreferrer">Talk to our team <ArrowRight size={17} /></a></section>
      </main>

      <footer className="footer"><a className="brand brand-footer" href="#"><span className="brand-mark"><Bike size={23} /></span><span>CYCLE<span className="brand-light">HUB</span><small>RIDE YOUR WAY</small></span></a><span>Every ride has a beginning.</span><span>© {new Date().getFullYear()} CYCLE HUB</span></footer>
      {notice && <div className="toast"><Check size={17} />{notice}<button onClick={() => setNotice("")} aria-label="Dismiss"><X size={15} /></button></div>}
    </div>
  );
}