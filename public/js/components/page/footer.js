class PageFooter extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  connectedCallback() {}

  render() {
    const template = document.createElement("template");
    const currentYear = new Date().getFullYear();

    template.innerHTML = `
    <div class="footer-container">
        <div class="section-seperator" id="tutorials"></div>

        <div><p>
            Copyright © ${currentYear} <a href="https://www.tomiczengineering.com">Tomicz Engineering LLC</a>
        </p></div>
        <div><p>
            Powered by <a href="https://github.com/tomicz/tomicz-cms">Tomicz CMS</a>
        </p></div>
    </div>
    <style>
        .footer-container{
            text-align: center;
            color: white;
        }
        p{
            color: white;
            font-weight: 300;
        }
        a{
            text-decoration: none;
            color: var(--primary-color);
        }
        a:hover{
            transition: 0.3s ease-in-out;
            color: var(--secondary-color); 
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
    </style>
    `;

    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true)
    );
  }
}

customElements.define("page-footer", PageFooter);
