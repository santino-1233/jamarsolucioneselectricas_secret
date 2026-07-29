/* ==========================================================================
   JAMAR Soluciones Eléctricas — main.js
   ========================================================================== */

// ---- Config ---------------------------------------------------------------
const WHATSAPP_NUMBER = "5491157736897"; // +54 9 11 5773-6897 (sin signos)
const WHATSAPP_MESSAGE = "Hola, vengo de la web y quiero hacer una consulta";
const GMAIL_TO = "jamar.energias@gmail.com";

// Cloudinary: donde el cliente sube las fotos de trabajos (ver upload-fotos.html)
// ⚠️ Confirmar que CLOUD_NAME coincida exacto (mayúsculas/minúsculas) con
// el que figura en Cloudinary > Settings > Account.
const CLOUDINARY_CLOUD_NAME = "pzowhg5o";
const CLOUDINARY_UPLOAD_PRESET = "jamar_trabajos";
const CLOUDINARY_TAG = "trabajo"; // tag que se le pone a cada foto subida

document.addEventListener("DOMContentLoaded", () => {
  setActiveNavLink();
  wireWhatsappLinks();
  wireMobileMenu();
  wireContactForm();
  wireGmailLink();
  lazyLoadFallback();
  wireHeaderScroll();
  wireScrollReveal();
  wireButtonRipple();
  wireStatCounters();
  wireHeroCarousel();
  wireCloudinaryGallery();
});

// ---- Resalta el link de nav correspondiente a la página actual -----------
function setActiveNavLink() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a, .mobile-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

// ---- Arma todos los enlaces de WhatsApp con el número y mensaje ----------
function wireWhatsappLinks() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;
  document.querySelectorAll("[data-whatsapp-link]").forEach((el) => {
    el.setAttribute("href", url);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });
}

// ---- Menú hamburguesa (mobile) --------------------------------------------
function wireMobileMenu() {
  const burger = document.querySelector(".burger");
  const mobileNav = document.querySelector(".mobile-nav");
  if (!burger || !mobileNav) return;

  burger.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    burger.classList.toggle("open", isOpen);
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

// ---- Formulario de contacto -------------------------------------------
function wireContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("#name").value.trim();
    const phone = form.querySelector("#phone").value.trim();
    const message = form.querySelector("#message").value.trim();
    const status = form.querySelector(".form-status");

    if (!name || !phone || !message) {
      status.textContent = "Por favor completá todos los campos.";
      status.classList.remove("success");
      status.style.animation = "none";
      void status.offsetWidth; // reinicia la animación
      status.style.animation = "fadeInUp 0.4s ease";
      return;
    }

    // Arma un mensaje prellenado con los datos cargados y abre WhatsApp
    // (se abre de forma inmediata y síncrona para que el navegador no
    // bloquee la ventana emergente)
    const text = `Hola, soy ${name} (${phone}). ${message}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      text
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");

    status.textContent = "¡Listo! Te llevamos a WhatsApp con tus datos cargados.";
    status.classList.add("success");
    status.style.animation = "none";
    void status.offsetWidth;
    status.style.animation = "fadeInUp 0.5s ease";

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      const original = "ENVIAR";
      submitBtn.textContent = "¡ENVIADO!";
      submitBtn.disabled = true;
      window.setTimeout(() => {
        submitBtn.textContent = original;
        submitBtn.disabled = false;
      }, 1800);
    }

    form.reset();
  });
}

// ---- Link "Escribir por Gmail" --------------------------------------------
function wireGmailLink() {
  document.querySelectorAll("[data-gmail-link]").forEach((el) => {
    const subject = encodeURIComponent("Consulta desde la web - JAMAR");
    const body = encodeURIComponent(
      "Hola, quisiera pedir un presupuesto para..."
    );
    el.setAttribute(
      "href",
      `https://mail.google.com/mail/?view=cm&fs=1&to=${GMAIL_TO}&su=${subject}&body=${body}`
    );
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });
}

// ---- Header: agrega sombra/compacta al hacer scroll -----------------------
function wireHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const toggle = () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
}

// ---- Scroll reveal: anima secciones/tarjetas cuando entran en pantalla ---
function wireScrollReveal() {
  const targets = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger"
  );
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

// ---- Efecto ripple al hacer click en botones .btn -------------------------
function wireButtonRipple() {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height) * 1.4;
      ripple.className = "ripple-el";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
}

// ---- Contadores animados (stats bar del home) -----------------------------
function wireStatCounters() {
  const counters = document.querySelectorAll("[data-count-to]");
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.getAttribute("data-count-to"), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => observer.observe(el));
}

// ---- Carrusel del hero: 5s por imagen, fundido a negro y zoom alternado --
function wireHeroCarousel() {
  const slides = document.querySelectorAll(".hero-slide");
  if (!slides.length) return;

  const DISPLAY_MS = 5000; // tiempo que se ve cada imagen a pantalla completa
  const FADE_MS = 1000; // duración del fundido a negro entre imágenes

  let current = 0;

  const showSlide = (i) => {
    const slide = slides[i];
    slide.classList.remove("kb-in", "kb-out");
    void slide.offsetWidth; // reinicia la animación de zoom
    slide.classList.add(i % 2 === 0 ? "kb-in" : "kb-out");
    slide.classList.add("active");
  };

  const hideSlide = (i) => slides[i].classList.remove("active");

  showSlide(current);

  setInterval(() => {
    const prev = current;
    hideSlide(prev); // se funde a negro (revela el fondo oscuro del hero)
    current = (current + 1) % slides.length;
    window.setTimeout(() => showSlide(current), FADE_MS);
  }, DISPLAY_MS + FADE_MS);
}

// ---- Galería dinámica: trae las fotos que el cliente subió a Cloudinary --
async function wireCloudinaryGallery() {
  const grid = document.querySelector("[data-cloudinary-gallery]");
  if (!grid) return;

  const listUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/list/${CLOUDINARY_TAG}.json`;

  try {
    const res = await fetch(listUrl);
    if (!res.ok) return; // deja las fotos fijas de fallback tal cual están

    const data = await res.json();
    const resources = Array.isArray(data.resources) ? data.resources : [];
    if (!resources.length) return; // sin fotos subidas todavía: se mantiene el fallback

    // Más nuevas primero
    resources.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    grid.innerHTML = resources
      .map((r) => {
        const url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,c_fill,g_auto,w_800,h_800/${r.public_id}.${r.format}`;
        return `<div class="gallery-item"><img src="${url}" alt="Trabajo realizado por JAMAR Soluciones Eléctricas" loading="lazy"></div>`;
      })
      .join("");
  } catch (err) {
    // Sin conexión a Cloudinary: se mantienen las fotos fijas de fallback
    console.warn("No se pudo cargar la galería de Cloudinary:", err);
  }
}

// ---- Lazy-load fallback (por si el navegador no soporta loading="lazy") --
function lazyLoadFallback() {
  if ("loading" in HTMLImageElement.prototype) return;
  const imgs = document.querySelectorAll("img[loading='lazy']");
  imgs.forEach((img) => {
    img.src = img.getAttribute("src");
  });
}
