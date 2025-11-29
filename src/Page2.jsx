import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

  const navigate = useNavigate();
  const location = useLocation();

  // API CALL + ERROR HANDLING in useEffect:
  // Fetch all countries once when the component mounts.
  useEffect(() => {
    async function fetchAllDestinations() {
      try {
        setStatus("Loading destinations…");

        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,capital,region,subregion,cca3"
        );

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();

        const mapped = data.map((c) => {
          const code = (c.cca3 || "").toUpperCase();
          return {
            id: code,
            name: c.name?.common ?? "Unknown",
            capital: Array.isArray(c.capital) ? c.capital[0] : c.capital ?? "—",
            region: c.region ?? "—",
            subregion: c.subregion ?? "",
            flag: (c.flags && (c.flags.svg || c.flags.png)) || "",
            photoLocal: LOCAL_PHOTOS[code] || null,
            price: PRICE_MAP[code] ?? null,
          };
        });

        mapped.sort((a, b) => a.name.localeCompare(b.name));
        setAllDestinations(mapped);
        setStatus("Search Results");
      } catch (err) {
        console.error("Failed to load destinations:", err);
        setAllDestinations([]);
        setStatus("Failed to load destinations. Please refresh and try again.");
      }
    }

    fetchAllDestinations();
  }, []); // runs once on mount

  // Read ?q= from the URL (e.g. /find?q=japan) and sync it into the search box.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setFilter(q);
  }, [location.search]);

  function handleSubmit(e) {
    e.preventDefault();
    // Filtering is client-side only; no new API call here.
  }

  const normalizedFilter = filter.trim().toLowerCase();

  const filteredDestinations =
    normalizedFilter.length === 0
      ? allDestinations
      : allDestinations.filter((it) => {
          const haystacks = [it.name, it.capital, it.region, it.subregion]
            .filter(Boolean)
            .map((v) => v.toLowerCase());
          return haystacks.some((text) => text.includes(normalizedFilter));
        });

  const noResults =
    normalizedFilter.length > 0 &&
    filteredDestinations.length === 0 &&
    !status.startsWith("Failed");

  return (
    <div className="page2">
      <header id="siteHeader">
        <div id="headerWrapper">
          <a href="/" id="logoLink" aria-label="Seek & Find Adventure - Home">
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

            <button type="submit" className="searchbtn" aria-label="Search">
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
          {filteredDestinations.map((it) => {
            const src = it.photoLocal || it.flag || "";
            return (
              <article
                className="card"
                key={it.id}
                onClick={() => navigate(`/country/${it.id}`)}
                style={{ cursor: "pointer" }}
              >
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
                  {it.price != null
                    ? `From ${fmtUSD(it.price)}`
                    : "Pricing available upon request"}
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
