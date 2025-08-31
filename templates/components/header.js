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

       .right-side{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex: 1;
       }

       .logo{
            cursor: pointer;
       }

       .right-side ul{
            display: flex; 
            list-style: none;
            justify-content: flex-end; 
       }

       .right-side ul li{
            cursor: pointer;
            color: var(--secondary-color);
            padding: 0.7rem;
            padding-right: 1.5rem;
       }

       .right-side ul li:hover{
            color: var(--primary-color);
       }

       .right-side ul li:nth-child(5){
            border: 2px solid transparent; 
            border-radius: 20px;
            background: var(--primary-color);
            color: white;
            padding: 0.7rem 1.5rem;
            margin-left: 1rem;
       }

       .right-side ul li:nth-child(5):hover{
            background: transparent;
            border: 2px solid var(--primary-color);
            color: var(--primary-color);
       }

       .mobile-menu-btn{
            display: none;
            background: none;
            border: none;
            color: var(--secondary-color);
            font-size: 1.5rem;
            cursor: pointer;
       }

       .mobile-menu{
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            flex-direction: column;
            justify-content: center;
            align-items: center;
       }

       .mobile-menu.active{
            display: flex;
       }

       .mobile-menu ul{
            list-style: none;
            text-align: center;
       }

       .mobile-menu ul li{
            margin: 2rem 0;
            font-size: 1.5rem;
       }

       .mobile-menu ul li a{
            color: var(--secondary-color);
            text-decoration: none;
            transition: color 0.3s ease;
       }

       .mobile-menu ul li a:hover{
            color: var(--primary-color);
       }

       .close-menu{
            position: absolute;
            top: 2rem;
            right: 2rem;
            background: none;
            border: none;
            color: var(--secondary-color);
            font-size: 2rem;
            cursor: pointer;
       }

       @media (max-width: 768px) {
            .right-side ul{
                display: none;
            }
            .mobile-menu-btn{
                display: block;
            }
       }
    </style>

    <div class="main-container" id="header">
        <div class="header">
            <div class="left-side">
                <div class="logo" id="logo">
                    <img src="../images/Logo_Light_Text.svg" alt="Logo" />
                </div>
            </div>
            <div class="right-side">
                <ul>
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="../pages/blog.html">Blog</a></li>
                    <li><a href="../pages/mentorship.html">Mentorship</a></li>
                    <li><a href="../pages/newsletter.html">Newsletter</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <button class="mobile-menu-btn" id="mobile-menu-btn">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>
    </div>

    <div class="mobile-menu" id="mobile-menu">
        <button class="close-menu" id="close-menu">
            <i class="fas fa-times"></i>
        </button>
        <ul>
            <li><a href="../index.html">Home</a></li>
            <li><a href="../pages/blog.html">Blog</a></li>
            <li><a href="../pages/mentorship.html">Mentorship</a></li>
            <li><a href="../pages/newsletter.html">Newsletter</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </div>
    `;

    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true)
    );
  }

  openMobileMenu() {
    const mobileMenuBtn = this.shadowRoot.getElementById("mobile-menu-btn");
    const mobileMenu = this.shadowRoot.getElementById("mobile-menu");

    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.add("active");
    });
  }

  closeMobileMenu() {
    const closeMenuBtn = this.shadowRoot.getElementById("close-menu");
    const mobileMenu = this.shadowRoot.getElementById("mobile-menu");

    closeMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
    });

    // Close menu when clicking outside
    mobileMenu.addEventListener("click", (e) => {
      if (e.target === mobileMenu) {
        mobileMenu.classList.remove("active");
      }
    });
  }

  registerMenuLinkEvents() {
    const menuLinks = this.shadowRoot.querySelectorAll("ul li a");

    menuLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        // Close mobile menu if open
        const mobileMenu = this.shadowRoot.getElementById("mobile-menu");
        mobileMenu.classList.remove("active");
      });
    });
  }

  registerDesktopMenuEvents() {
    const menuItems = this.shadowRoot.querySelectorAll(".right-side ul li");

    menuItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        item.style.transform = "translateY(-2px)";
        item.style.transition = "transform 0.3s ease";
      });

      item.addEventListener("mouseleave", () => {
        item.style.transform = "translateY(0)";
      });
    });
  }

  goToLogo() {
    const logo = this.shadowRoot.getElementById("logo");

    logo.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  }

  onPageScroll() {
    const header = this.shadowRoot.getElementById("header");

    window.addEventListener("scroll", () => {
      this.scrollPosition = window.scrollY;

      if (this.scrollPosition > 100) {
        header.classList.add("scroll-active");
      } else {
        header.classList.remove("scroll-active");
      }

      // Hide header on scroll down, show on scroll up
      if (
        this.scrollPosition > this.lastScrollPosition &&
        this.scrollPosition > 200
      ) {
        header.classList.add("scroll-hidden");
      } else {
        header.classList.remove("scroll-hidden");
      }

      this.lastScrollPosition = this.scrollPosition;
    });
  }
}

customElements.define("page-header", PageHeader);
