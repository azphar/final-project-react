import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function CountryDetails() {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [status, setStatus] = useState("Loading…");

  useEffect(() => {
    async function fetchDetails() {
      try {
        setStatus("Loading…");
        const res = await fetch(
          `https://restcountries.com/v3.1/alpha/${code}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setCountry(data[0]);
        setStatus("Loaded");
      } catch (err) {
        console.error(err);
        setStatus("Failed to load details");
      }
    }

    fetchDetails();
  }, [code]);

  if (!country) {
    return (
      <main className="container">
        <p>{status}</p>
      </main>
    );
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
                <a href="/find">Find Your Paradise</a>
              </li>
            </ul>
          </nav>

          <a href="#contactSection" id="contactBtn">
            Contact
          </a>
        </div>
      </header>

      <main className="container" style={{ paddingTop: "160px", paddingBottom: "80px" }}>

        <Link to="/find" style={{ display: "inline-block", marginBottom: 16 }}>
          ← Back to search results
        </Link>

        <h1>{country.name?.common}</h1>

        <img
          src={country.flags?.svg || country.flags?.png}
          alt={country.name?.common}
          style={{ maxWidth: "320px", margin: "16px 0" }}
        />

        <p><strong>Official name:</strong> {country.name?.official}</p>
        <p><strong>Capital:</strong> {country.capital?.[0] || "—"}</p>
        <p><strong>Region:</strong> {country.region}</p>
        <p><strong>Subregion:</strong> {country.subregion || "—"}</p>
        <p>
          <strong>Population:</strong>{" "}
          {country.population?.toLocaleString("en-US")}
        </p>
        <p>
          <strong>Timezones:</strong>{" "}
          {country.timezones?.join(", ") || "—"}
        </p>
      </main>
    </div>
  );
}

export default CountryDetails;

