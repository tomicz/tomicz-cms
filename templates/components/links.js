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
          margin: 2rem 0;
        }

        @media (max-width: 768px) {
            .links-container{
                flex-direction: column;
                gap: 2rem;
            }
        }
    </style>

    <div class="section-seperator"></div>

    <div class="links-container">
        <div class="section">
            <h3 class="title">Quick Links</h3>
            <ul>
                <li>
                    <i class="fas fa-home"></i>
                    <a href="../index.html">Home</a>
                </li>
                <li>
                    <i class="fas fa-blog"></i>
                    <a href="../pages/blog.html">Blog</a>
                </li>
                <li>
                    <i class="fas fa-user-graduate"></i>
                    <a href="../pages/mentorship.html">Mentorship</a>
                </li>
                <li>
                    <i class="fas fa-envelope"></i>
                    <a href="../pages/newsletter.html">Newsletter</a>
                </li>
            </ul>
        </div>

        <div class="section">
            <h3 class="title">Social Media</h3>
            <ul>
                <li>
                    <i class="fab fa-youtube"></i>
                    <a href="https://www.youtube.com/@darkotomic" target="_blank">YouTube</a>
                </li>
                <li>
                    <i class="fab fa-twitter"></i>
                    <a href="https://twitter.com/darkotomic" target="_blank">Twitter</a>
                </li>
                <li>
                    <i class="fab fa-linkedin"></i>
                    <a href="https://www.linkedin.com/in/darkotomic/" target="_blank">LinkedIn</a>
                </li>
                <li>
                    <i class="fab fa-github"></i>
                    <a href="https://github.com/darkotomic" target="_blank">GitHub</a>
                </li>
            </ul>
        </div>

        <div class="section">
            <h3 class="title">Contact</h3>
            <ul>
                <li>
                    <i class="fas fa-envelope"></i>
                    <a href="mailto:darko@tomiczengineering.com" class="email">darko@tomiczengineering.com</a>
                </li>
                <li>
                    <i class="fas fa-globe"></i>
                    <a href="https://www.tomiczengineering.com" target="_blank">tomiczengineering.com</a>
                </li>
            </ul>
        </div>
    </div>

    <div class="section-seperator"></div>

    <newsletter-component></newsletter-component>
    `;

    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true)
    );
  }

  registerClickEvents() {
    // Add any click event handlers here
    const links = this.shadowRoot.querySelectorAll("a");

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        // Add any link click handling logic here
        console.log("Link clicked:", link.href);
      });
    });
  }
}

customElements.define("page-links", PageLinks);
