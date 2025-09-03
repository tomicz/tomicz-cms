class PageHeader extends HTMLElement {
  constructor() {
    super();
    this.isScrolling = null;
    this.scrollPosition = 0;
  }

  connectedCallback() {
    this.render();
    this.openMobileMenu();
    this.closeMobileMenu();
    this.registerMenuLinkEvents();
    this.registerDesktopMenuEvents();
    this.goToLogo();
    this.onPageScroll();
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

       .main-container{
            background: rgb(0, 0, 0);
            background: linear-gradient(
                90deg,
                rgba(0, 0, 0, 1) 0%,
                rgba(33, 39, 47, 1) 100%
            );
            z-index: 999;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            transition: top 0.3s ease;
       } 

       .scroll-active{
            box-shadow: 1px 27px 31px -13px rgba(0,0,0,0.75);
            -webkit-box-shadow: 1px 27px 31px -13px rgba(0,0,0,0.75);
            -moz-box-shadow: 1px 27px 31px -13px rgba(0,0,0,0.75);
       }

       .scroll-hidden{
            top: -120px;
       }

       .header{
            max-width: 1100px;
            display: flex;
            height: 120px; 
            margin: 0 auto;
       }

       .center-side{
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 2;
       }

       .center-side ul{
            display: flex; 
            list-style: none;
            justify-content: center; 
       }

       .center-side ul li{
            cursor: pointer;
            color: var(--secondary-color);
            padding: 0.7rem;
            padding-right: 1.5rem;
       }

       .center-side ul li:hover{
            color: var(--primary-color);
       }

       .center-side ul li:nth-child(5){
            border: 2px solid transparent; 
            border-radius: 10px;
       }

       .center-side ul li:nth-child(5):hover{
            color: var(--secondary-color);
            border: 2px solid var(--primary-color); 
            background-color: transparent;
            transition: 0.2s ease-in-out;
       }

       .center-side ul li a{
            text-decoration: none;
            color: var(--secondary-color);
       }

       .center-side ul li a:hover{
            text-decoration: none;
            transition: 0.2s ease-in-out;
            color: var(--primary-color);
       }

       .right-side{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex: 1;
       }

       .logo{
            cursor: pointer;
       }

       .social-icons ul{
            display: flex; 
            list-style: none;
            gap: 1rem;
            margin-right: 1rem;
       }

       .social-icons ul li a{
            text-decoration: none;
            color: var(--secondary-color);
            font-size: 1.2rem;
            transition: 0.2s ease-in-out;
       }

       .social-icons ul li a:hover{
            color: var(--primary-color);
       }

       .left-side{
            flex: 1;
            height: 100%;
            display:flex;
            padding: 2.5rem 0;
       }

       .contact-btn{
            background-color: var(--primary-color);
            display: flex;
            align-items: center;
            padding: 0.7rem 1.5rem;
            border-radius: 10px;
            border: 2px solid transparent;
            transition: 0.2s ease-in-out;
            cursor: pointer;
       }

       .contact-btn:hover{
            border: 2px solid var(--primary-color);
            background-color: transparent;
            color: var(--secondary-color);
       }

       .btn-text{
            padding-left: 10px;
       }

       .fa-bars{
            color: var(--secondary-color);
            cursor: pointer;
       }

       .fa-bars:hover{
            color: var(--primary-color);
            transition: 0.2s ease-in-out;
       }

       .fa-xmark{
            cursor: pointer;
            color: var(--secondary-color);
       }

       .fa-xmark:hover{
            color: var(--primary-color);
            transition: 0.2s ease-in-out;
       }

       .burger-btn{
            display: none;
       }

       @keyframes rotateOnce{
            from{
                transform: rotate(0deg);
            } 
            to{
                transform: rotate(360deg);
            }
       }

       @keyframes rotateOnceClockwise{
            from{
                transform: rotate(360deg);
            } 
            to{
                transform: rotate(0deg);
            }
       }

       .active{
            display: block;
       }

       .rotate{
            animation: rotateOnce 0.3s ease-out;
       }

       .rotate-clockwise{
            animation: rotateOnceClockwise 0.3s ease-out;
       }
            
       .hidden{
            display: none;
       }

       /* MOBILE MENU */

       .mobile-menu{
            background: rgb(0, 0, 0);
            background: linear-gradient(
                90deg,
                rgba(0, 0, 0, 1) 0%,
                rgba(33, 39, 47, 1) 100%
            );
            border-top: 1px solid var(--primary-color);
            position: fixed;
            top: 120px;
            left: 0;
            width: 100%;
            height: calc(100vh - 120px);
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            transform: translateX(100%);
            z-index: 999;
       }

       .mobile-menu.activated{
            transform: translateX(0);
            transition: 0.3s ease-in-out;
       }

       .mobile-menu.deactivated{
            transform: translateX(100%);
            transition: 0.3s ease-in-out;
       }

       .mobile-buttons{
            display: flex;
            flex-direction: column;
            text-decoration: none;
            align-items: center;
            padding: 1rem;
       }

        .mobile-buttons li {
            cursor: pointer;
            list-style: none; 
            text-decoration: none;
            width: 100%;
            display: flex;
            gap: 1rem;
            border-bottom: 0.5px solid var(--primary-color);
        }

        .mobile-buttons li a:hover{
            color: var(--primary-color);
            transition: 0.2s ease-in-out;
        }

        .mobile-buttons li a{
            padding: 2rem;
            list-style: none; 
            text-decoration: none;
            color: var(--secondary-color);
        }

        .social-buttons{
            display: flex;
            justify-content: center;
        }

        .social-buttons li{
            list-style: none; 
            padding: 0.2rem;
        }

        .social-buttons li a{
            text-decoration: none;
            color: var(--secondary-color);
        }

        .social-buttons li a:hover{
            color: var(--primary-color);
            transition: 0.2s ease-in-out;
        }


        .mobile-contact-btn{
            cursor: pointer;
            color: var(--secondary-color);
            background-color: var(--primary-color);
            padding: 1rem 2rem;
            margin: 1rem 1rem;
            border-radius: 15px;
            text-align: center;
            border: 2px solid transparent;
        }

        .mobile-contact-btn:hover{
            border: 2px solid var(--primary-color);
            background-color: transparent;
            transition: 0.2s ease-in-out;
        }


        /* MEDIA */

        @media (max-width: 1400px){
            .header{
                margin: 0 auto;
                padding: 0 1rem 0 1rem;
            }
        }

        @media (max-width: 768px){
            .center-side{
                display: none;
            }

            .social-icons{
                display: none;
            }

            .burger-btn{
                display: block;
            }
        }

    </style>
    <div class="main-container">
        <div class="header">
            <div class="left-side">
                <img class="logo" src="../../../images/Logo_Light_Text.svg" alt="company logo"/>
            </div>
            <div class="center-side">
                <div class="menu-buttons">
                    <ul>
                        <li><a href="#tutorials">Tutorials</a></li>
                        <li><a href="#mentorship">Mentorship</a></li>
                        <li><a href="../pages/blog.html">Blog</a></li>
                        <li><a href="#about">About</a></li>
                        <li class="contact-btn">
                           <i class="fa-solid fa-arrow-right">
                        </i>
                        <div class="btn-text">Contact</div> 
                    </ul>
                </div>
            </div>
            <div class="right-side">
                <div class="social-icons">
                    <ul>
                        <li><a href="https://www.youtube.com/@tomiczdarko"><i class="fab fa-youtube"></i></a></li>
                        <li><a href="https://github.com/tomicz"><i class="fab fa-github"></i></a></li>
                        <li><a href="https://x.com/DarkoTo56635877"><i class="fab fa-twitter"></i></a></li>
                        <li><a href="https://www.linkedin.com/in/darko-tomic-9b40b162/"><i class="fab fa-linkedin"></i></a></li>
                        <li><a href="https://discord.com/invite/VTFGa5vKCS"><i class="fab fa-discord"></i></a></li>
                    </ul>
                </div>
                <div class="burger-btn">
                    <div class="fa-solid fa-bars fa-2x active "></div>
                    <div class="fa-solid fa-xmark fa-2x hidden"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="mobile-menu">
        <ul class="mobile-buttons">
            <li><a href="#hero">Home</a></li> 
            <li><a href="#tutorials">Tutorials</a></li> 
            <li><a href="#mentorship">Mentorship</a></li> 
            <li><a href="../pages/blog.html">Blog</a></li> 
            <li><a href="#about">About</a></li> 
        </ul> 
        <div class="mobile-contact-btn"<a href="#">Contact</a></div>
        <ul class="social-buttons">
            <li><a href="https://www.youtube.com/@tomiczdarko"><i class="fab fa-youtube fa-2x"></i></a></li> 
            <li><a href="https://github.com/tomicz"><i class="fab fa-github fa-2x"></i></a></li> 
            <li><a href="https://x.com/DarkoTo56635877"><i class="fab fa-twitter fa-2x"></i></a></li> 
            <li><a href="https://www.linkedin.com/in/darko-tomic-9b40b162/"><i class="fab fa-linkedin fa-2x"></i></a></li> 
            <li><a href="https://discord.com/invite/VTFGa5vKCS"><i class="fab fa-discord fa-2x"></i></a></li> 
        </ul>
    </div>

      `;
    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true)
    );
  }

  openMobileMenu() {
    const hamburgerButtonShow = this.shadowRoot.querySelector(".fa-bars");
    const hamburgerButtonClose = this.shadowRoot.querySelector(".fa-xmark");

    hamburgerButtonShow.addEventListener("click", () => {
      this.showMenu(hamburgerButtonShow, hamburgerButtonClose);
    });

    hamburgerButtonClose.addEventListener("click", () => {
      this.hideMenu();
    });
  }

  showMenu(showButton, closeButton) {
    const mobileMenu = this.shadowRoot.querySelector(".mobile-menu");

    showButton.classList.add("hidden");
    showButton.classList.remove("active");
    closeButton.classList.add("active");
    closeButton.classList.remove("hidden");
    closeButton.classList.add("rotate-clockwise");
    showButton.classList.remove("rotate-clockwise");
    mobileMenu.classList.add("activated");
    mobileMenu.classList.remove("deactivated");

    // Prevent body scrolling when menu is open
    document.body.style.overflow = "hidden";
  }

  hideMenu() {
    const hamburgerButtonClose = this.shadowRoot.querySelector(".fa-xmark");
    const hamburgerButtonShow = this.shadowRoot.querySelector(".fa-bars");
    const mobileMenu = this.shadowRoot.querySelector(".mobile-menu");

    hamburgerButtonShow.classList.add("active");
    hamburgerButtonShow.classList.remove("hidden");
    hamburgerButtonClose.classList.add("hidden");
    hamburgerButtonClose.classList.remove("active");
    hamburgerButtonShow.classList.add("rotate");
    hamburgerButtonClose.classList.remove("rotate");
    mobileMenu.classList.add("deactivated");
    mobileMenu.classList.remove("activated");

    // Re-enable body scrolling when menu is closed
    document.body.style.overflow = "";
  }

  closeMobileMenu() {
    const mobileButtons = this.shadowRoot.querySelectorAll(
      ".mobile-buttons li a"
    );
    const contactButton = this.shadowRoot.querySelector(".mobile-contact-btn");
    const socialButtons =
      this.shadowRoot.querySelectorAll(".social-buttons li");

    mobileButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const href = button.getAttribute("href");

        // Handle blog link specifically - always go to blog page
        if (href.includes("blog.html")) {
          window.location.href = href;
          this.hideMenu();
          return;
        }

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
        this.hideMenu();
      });
    });

    contactButton.addEventListener("click", (e) => {
      e.preventDefault();
      const isIndexPage =
        window.location.pathname.endsWith("index.html") ||
        window.location.pathname === "/";

      if (isIndexPage) {
        const section = document.getElementById("contact");
        if (section) {
          const offsetTop = section.offsetTop - 120;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      } else {
        window.location.href = "../index.html" + "#contact";
      }

      this.hideMenu();
    });

    socialButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.hideMenu();
      });
    });
  }

  registerMenuLinkEvents() {
    const links = this.shadowRoot.querySelectorAll("a[data-scroll]");
    const offset = 120;

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const y = targetElement.offsetTop - offset;

          window.scrollTo({
            top: y,
            behavior: "smooth",
          });
        }
      });
    });
  }

  registerDesktopMenuEvents() {
    const desktopMenuLinks = this.shadowRoot.querySelectorAll(
      ".menu-buttons ul li a"
    );
    const contactButton = this.shadowRoot.querySelector(".contact-btn");

    desktopMenuLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = link.getAttribute("href");

        // Handle blog link specifically - always go to blog page
        if (href.includes("blog.html")) {
          window.location.href = href;
          return;
        }

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
      });
    });

    contactButton.addEventListener("click", (e) => {
      e.preventDefault();
      const isIndexPage =
        window.location.pathname.endsWith("index.html") ||
        window.location.pathname === "/";

      if (isIndexPage) {
        const section = document.getElementById("contact");
        if (section) {
          const offsetTop = section.offsetTop - 120;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      } else {
        window.location.href = "../index.html" + "#contact";
      }
    });
  }

  goToLogo() {
    const logo = this.shadowRoot.querySelector(".logo");

    logo.addEventListener("click", () => {
      window.location.assign("../index.html");
    });
  }

  onPageScroll() {
    window.addEventListener("scroll", () => {
      const header = this.shadowRoot.querySelector(".main-container");
      if (window.scrollY > 0) {
        header.classList.add("scroll-active", "scroll-hidden");

        clearTimeout(this.isScrolling);
        this.isScrolling = setTimeout(() => {
          header.classList.remove("scroll-hidden");
        }, 200);
      } else {
        header.classList.remove("scroll-active");
      }
    });
  }
}

customElements.define("page-header", PageHeader);
