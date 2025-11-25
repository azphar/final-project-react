import { Routes, Route } from "react-router-dom";
import Page2 from "./Page2.jsx";
import CountryDetails from "./CountryDetails.jsx";

function HomePage() {
  return (
    <>
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

      <main>
        <section id="heroSearch">
          <div className="hero-search">
            <h2 className="hero-search_title">
              We <span className="purple">SEEK</span> far &amp; wide to{" "}
              <span className="purple">FIND</span> your kind of paradise
            </h2>
            <p className="hero-search_subtitle">
              Where would you like to go?
            </p>

            <form className="searchrow" action="/find" method="GET">
              <label
                htmlFor="searchQuery"
                className="sr-only"
              >
                Search by City, Country or Continent
              </label>

              <div className="searchbar">
                <input
                  id="searchQuery"
                  name="q"
                  type="search"
                  placeholder="Search by City, Country or Region"
                />
              </div>

              <button
                type="submit"
                className="searchbtn"
                aria-label="Search"
              >
                🔍
              </button>
            </form>
          </div>
        </section>

        <img
          src="/assets/undraw_explore_kfv3.svg"
          alt="Explore"
          className="explore"
        />
      </main>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/find" element={<Page2 />} />
      <Route path="/country/:code" element={<CountryDetails />} />
    </Routes>
  );
}

export default App;
