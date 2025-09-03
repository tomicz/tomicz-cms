class PageLinks extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.registerClickEvents();

    // Load the newsletter component
    import("../ui-components/newsletter.js");
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = `
      <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
  />

    <style>
        :root {
          --primary-color: #10ac84;
          --secondary-color: #e8e8e9;
        }

        *,
        *:before,
        *:after{
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }

        .links-container{
            max-width: 1100px;
            margin: 2rem auto;
            display: flex;
        }

        .section{
            flex: 1;
        }

        .title{
            color: var(--primary-color);
            padding-bottom: 1rem; 
        }

        ul{
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        ul li{
            padding: 0rem 0rem 0.5rem 0rem;
            display: flex;
            gap: 0.5rem;
            justify-content: flex-start;
        }

        ul li:hover{
            transform: translateX(3px);
            transition: transform 0.3s ease-in-out;
        }

        ul li i{
            color: var(--primary-color);
        }

        a{
            color: var(--secondary-color);
            text-decoration: none;
            font-weight: 400;
        }

        .email{
            color: var(--secondary-color);
            text-decoration: none;
            font-weight: 400;
            display: flex;
        }

        .email i{
            padding-right: 0.5rem;
        }
        
        a:hover{
            color: var(--primary-color);
            transition: 0.5s ease-out;
        }

        .section-seperator {
          display: block;
          height: 2px;
          background: rgb(33, 39, 47);
          background: linear-gradient(
            90deg,
            rgba(33, 39, 47, 1) 0%,
            rgba(0, 0, 1, 1) 100%
          );
        }

        .fa-solid{
            color: var(--primary-color);
        }





        /* MEDIA */

        @media(max-width: 1400px){
            .links-container{
                padding: 1rem;
            }
        } 

        @media(max-width: 768px){
            .links-container{
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
            }
        }

        .social-media ul li {
            display: flex;
            align-items: center;
            gap: 0.75rem; /* Adjust as needed for perfect spacing */
            padding: 0.25rem 0;
        }

        .social-media ul li i {
            min-width: 1.5em;
            text-align: center;
        }

        .contact ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        .contact ul .email {
            display: flex;
            align-items: center;
            gap: 0.75rem; /* Adjust for perfect spacing */
            padding: 0.25rem 0;
        }

        .contact ul .email i {
            font-size: 1em; /* Match text size */
            min-width: 1.5em; /* Consistent icon width */
            text-align: center;
            color: var(--primary-color);
        }

    </style>

        <div class="section-seperator" id="tutorials"></div>
        <div class="links-container">
            <div class="navigation section">
                <div class="title"><h3>Navigation</h3></div>
                <ul>
                    <li><a href="#hero">Home</a></li>
                    <li><a href="#tutorials">Tutorials</a></li>
                    <li><a href="#mentorship">Mentorship</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>
            <div class="services section">
                <div class="title"><h3>Services</h3></div>
                <ul>
                    <li><a href="#mentorship">Mentorship</a></li>
                    <li><a href="../pages/newsletter.html">Newsletter</a></li>
                </ul>
            </div>
            <div class="social-media section">
                <div class="title"><h3>Social Media</h3></div>
                <ul>
                    <li>
                        <i class="fab fa-youtube"></i>
                        <a href="https://www.youtube.com/@tomiczdarko">Youtube</a>
                    </li>
                    <li>
                        <i class="fab fa-github"></i>
                        <a href="https://github.com/tomicz">Github</a>
                    </li>
                    <li>
                        <i class="fab fa-twitter"></i>
                        <a href="https://x.com/DarkoTo56635877">Twitter</a>
                    </li>
                    <li>
                        <i class="fab fa-linkedin"></i>
                        <a href="https://www.linkedin.com/in/darko-tomic-9b40b162/">Linkedin</a>
                    </li>
                    <li>
                        <i class="fab fa-discord"></i>
                        <a href="https://discord.gg/VTFGa5vKCS">Discord</a>
                    </li>
                </ul>
            </div>
            <div class="contact section">
                <div class="title"><h3>Contact</h3></div>
                <ul>
                    <li class="email">
                        <i class="fa-solid fa-envelope"></i>
                        <span>contact@darkounity.com</span>
                    </li>
                </ul>
                <news-letter></news-letter>
            </div>
        </div>
      `;

    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true)
    );
  }

  registerClickEvents() {
    const navigationLinks = this.shadowRoot.querySelectorAll(
      ".navigation ul li a"
    );

    const servicesLinks = this.shadowRoot.querySelectorAll(".services ul li a");

    navigationLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = link.getAttribute("href");

        // Check if it's an anchor link (starts with #)
        if (href.startsWith("#")) {
          const isIndexPage =
            window.location.pathname.endsWith("index.html") ||
            window.location.pathname === "/";

          if (isIndexPage) {
            const section = document.getElementById(href.substring(1));
            if (section) {
              const offsetTop = section.offsetTop - 120;
              window.scrollTo({
                top: offsetTop,
                behavior: "smooth",
              });
            }
          } else {
            window.location.href = "../index.html" + href;
          }
        } else {
          // Handle regular page links
          window.location.href = href;
        }
      });
    });

    servicesLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = link.getAttribute("href");

        // Check if it's an anchor link (starts with #)
        if (href.startsWith("#")) {
          const isIndexPage =
            window.location.pathname.endsWith("index.html") ||
            window.location.pathname === "/";

          if (isIndexPage) {
            const section = document.getElementById(href.substring(1));
            if (section) {
              const offsetTop = section.offsetTop - 120;
              window.scrollTo({
                top: offsetTop,
                behavior: "smooth",
              });
            }
          } else {
            window.location.href = "../index.html" + href;
          }
        } else {
          // Handle regular page links
          window.location.href = href;
        }
      });
    });
  }
}

customElements.define("page-links", PageLinks);
