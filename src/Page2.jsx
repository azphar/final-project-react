import { useEffect, useState } from "react";

const LOCAL_PHOTOS = {
  NZL: "/assets/destinations/new-zealand.jpg",
  FJI: "/assets/destinations/fiji.jpg",
  KNA: "/assets/destinations/st-kitts.jpg",
  MDV: "/assets/destinations/maldives.jpg",
  PAN: "/assets/destinations/panama.jpg",
  NLD: "/assets/destinations/netherlands.jpg",
};

const PRICE_MAP = {
  NZL: 1899,
  FJI: 1499,
  MDV: 2299,
  KNA: 1099,
  PAN: 999,
  NLD: 899,
};

function fmtUSD(n) {
  return n != null
    ? n.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })
    : "—";
}

function Page2() {
  const [allDestinations, setAllDestinations] = useState([]);
  const [status, setStatus] = useState("Loading…");
  const [filter, setFilter] = useState("");

  // read ?q= from URL on first load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qParam = (params.get("q") || "").trim();
    if (qParam) {
      setFilter(qParam);
    }
  }, []);

  // fetch destinations once
  useEffect(() => {
    async function fetchDestinations() {
      setStatus("Loading destinations…");

      const codes = ["fji", "mdv", "nzl", "nld", "kna", "pan"];
      const url = `https://restcountries.com/v3.1/alpha?codes=${codes.join(
        ","
      )}&fields=name,flags,capital,region,subregion,cca3`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const mapped = data.map((c) => {
          const code = (c.cca3 || "").toUpperCase();
          return {
            id: code,
            name: c.name?.common ?? "Unknown",
            capital: Array.isArray(c.capital)
              ? c.capital[0]
              : c.capital ?? "—",
            region: c.region ?? "—",
            subregion: c.subregion ?? "",
            flag: (c.flags && (c.flags.svg || c.flags.png)) || "",
            photoLocal: LOCAL_PHOTOS[code] || null,
            price: PRICE_MAP[code] ?? null,
          };
        });

        setAllDestinations(mapped);
        setStatus("Search Results");
      } catch (e) {
        console.error(e);
        setStatus("Failed to load. Please try again.");
        setAllDestinations([]);
      }
    }

    fetchDestinations();
  }, []);

  // filter list based on search text
  const q = filter.trim().toLowerCase();
  const filtered = q
    ? allDestinations.filter((it) => {
        return (
          it.name.toLowerCase().includes(q) ||
          it.region.toLowerCase().includes(q) ||
          it.subregion.toLowerCase().includes(q) ||
          it.capital.toLowerCase().includes(q)
        );
      })
    : allDestinations;

  // show "no results" once data is loaded and user has typed something
  const noResults =
    allDestinations.length > 0 &&
    filter.trim().length > 0 &&
    filtered.length === 0;

  function handleSubmit(e) {
    // keep the page from reloading, filtering is live as you type
    e.preventDefault();
  }

  return (
    <div className="page2">
      <header id="siteHeader">
        <div id="headerWrapper">
          <a
            href="/"
            id="logoLink"
            aria-label="Seek & Find Adventure - Home"
          >
            <img
              src="/assets/fulllogo_transparent.png?v=1"
              alt="Seek & Find Adventure"
              id="siteLogo"
            />
          </a>

          <nav id="mainNav" aria-label="Primary">
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/find" aria-current="page">
                  Find Your Paradise
                </a>
              </li>
            </ul>
          </nav>

          <a href="#contactSection" id="contactBtn">
            Contact
          </a>
        </div>
      </header>

      <section id="page2Hero">
        <div className="hero__inner container">
          <h1 className="hero-title">Find Your Paradise</h1>

          <form
            id="filterForm"
            className="searchrow searchrow--hero"
            role="search"
            onSubmit={handleSubmit}
          >
            <label htmlFor="filter" className="sr-only">
              Search by city, country or region
            </label>

            <div className="searchbar">
              <input
                id="filter"
                type="search"
                placeholder="Search by city, country or region"
                autoComplete="off"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="searchbtn"
              aria-label="Search"
            >
              🔎
            </button>
          </form>
        </div>
      </section>

      <main className="container">
        <div id="status" aria-live="polite">
          {status}
        </div>

        {noResults && (
          <p className="results-message">
            No results found for "{filter}". Please try another destination or
            spelling.
          </p>
        )}

        <div id="destGrid" className="grid">
          {filtered.slice(0, 6).map((it) => {
            const src = it.photoLocal || it.photo || it.flag || "";
            return (
              <article className="card" key={it.id}>
                <img src={src} alt={it.name} />
                <h3>{it.name}</h3>
                <p>
                  <strong>Capital:</strong> {it.capital}
                </p>
                <p>
                  <strong>Region:</strong> {it.region}
                  {it.subregion ? " · " + it.subregion : ""}
                </p>
                <p className="price">
                  From{" "}
                  {it.price != null
                    ? fmtUSD(it.price)
                    : "Contact for pricing"}
                </p>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Page2;



