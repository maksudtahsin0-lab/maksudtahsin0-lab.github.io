document.addEventListener("DOMContentLoaded", () => {

  /* ================= ELEMENTS ================= */

  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  const languageBtn = document.getElementById("languageBtn");
  const themeBtn = document.getElementById("themeBtn");

  const teacherLoginBtn = document.getElementById("teacherLoginBtn");
  const askTeacherBtn = document.getElementById("askTeacherBtn");

  const loginModal = document.getElementById("loginModal");
  const closeModal = document.getElementById("closeModal");

  const year = document.getElementById("year");


  /* ================= YEAR ================= */

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* ================= MOBILE MENU ================= */

  if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("show");
    });

    mobileMenu.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {
        mobileMenu.classList.remove("show");
      });

    });

    document.addEventListener("click", event => {

      if (
        !mobileMenu.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        mobileMenu.classList.remove("show");
      }

    });

  }


  /* ================= LANGUAGE ================= */

  let currentLanguage =
    localStorage.getItem("tsf-language") || "en";


  function applyLanguage(language) {

    currentLanguage = language;

    document.documentElement.lang =
      language === "bn" ? "bn" : "en";

    document.body.classList.toggle(
      "bn",
      language === "bn"
    );


    document
      .querySelectorAll("[data-en][data-bn]")
      .forEach(element => {

        element.textContent =
          language === "bn"
            ? element.getAttribute("data-bn")
            : element.getAttribute("data-en");

      });


    if (languageBtn) {

      languageBtn.textContent =
        language === "bn"
          ? "English"
          : "বাংলা";

    }


    localStorage.setItem(
      "tsf-language",
      language
    );

  }


  applyLanguage(currentLanguage);


  if (languageBtn) {

    languageBtn.addEventListener("click", () => {

      const nextLanguage =
        currentLanguage === "en"
          ? "bn"
          : "en";

      applyLanguage(nextLanguage);

    });

  }


  /* ================= DARK / LIGHT MODE ================= */

  let darkMode =
    localStorage.getItem("tsf-theme") === "dark";


  function applyTheme() {

    document.body.classList.toggle(
      "dark",
      darkMode
    );

    if (themeBtn) {

      themeBtn.textContent =
        darkMode ? "☀" : "◐";

    }

  }


  applyTheme();


  if (themeBtn) {

    themeBtn.addEventListener("click", () => {

      darkMode = !darkMode;

      localStorage.setItem(
        "tsf-theme",
        darkMode ? "dark" : "light"
      );

      applyTheme();

    });

  }


  /* ================= LOGIN MODAL ================= */

  function openLogin() {

    if (!loginModal) return;

    loginModal.classList.add("show");

    document.body.style.overflow = "hidden";

  }


  function closeLogin() {

    if (!loginModal) return;

    loginModal.classList.remove("show");

    document.body.style.overflow = "";

  }


  if (teacherLoginBtn) {
    teacherLoginBtn.addEventListener(
      "click",
      openLogin
    );
  }


  if (closeModal) {
    closeModal.addEventListener(
      "click",
      closeLogin
    );
  }


  if (loginModal) {

    loginModal.addEventListener(
      "click",
      event => {

        if (event.target === loginModal) {
          closeLogin();
        }

      }
    );

  }


  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {
        closeLogin();
      }

    }
  );


  /* ================= ASK TEACHER ================= */

  if (askTeacherBtn) {

    askTeacherBtn.addEventListener(
      "click",
      () => {

        const message =
          encodeURIComponent(
            currentLanguage === "bn"
              ? "আসসালামু আলাইকুম। আমি TSF-এর মাধ্যমে একজন শিক্ষকের কাছে একটি প্রশ্ন করতে চাই।"
              : "Hello. I would like to ask a teacher a question through TSF."
          );

        window.open(
          `https://wa.me/8801979840081?text=${message}`,
          "_blank"
        );

      }
    );

  }


  /* ================= SMOOTH SCROLL ================= */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

      link.addEventListener(
        "click",
        event => {

          const targetId =
            link.getAttribute("href");

          if (
            !targetId ||
            targetId === "#"
          ) {
            return;
          }

          const target =
            document.querySelector(targetId);

          if (target) {

            event.preventDefault();

            target.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }

        }
      );

    });


  /* ================= GOOGLE LOGIN PLACEHOLDER ================= */

  const googleLoginButton =
    document.querySelector(".modal-login-btn");


  if (googleLoginButton) {

    googleLoginButton.addEventListener(
      "click",
      () => {

        showMessage(
          currentLanguage === "bn"
            ? "🔐 নিরাপদ Google Login শীঘ্রই চালু হবে।"
            : "🔐 Secure Google Login is coming soon."
        );

      }
    );

  }


  /* ================= MESSAGE ================= */

  window.showMessage = function(message) {

    let box =
      document.getElementById("tsfMessage");


    if (!box) {

      box =
        document.createElement("div");

      box.id = "tsfMessage";

      box.style.position = "fixed";
      box.style.left = "50%";
      box.style.bottom = "25px";
      box.style.transform =
        "translate(-50%, 100px)";

      box.style.padding =
        "14px 20px";

      box.style.borderRadius =
        "14px";

      box.style.background =
        "#111827";

      box.style.color =
        "#ffffff";

      box.style.fontSize =
        "13px";

      box.style.fontWeight =
        "700";

      box.style.boxShadow =
        "0 15px 45px rgba(0,0,0,.25)";

      box.style.zIndex =
        "999999";

      box.style.transition =
        ".3s ease";

      document.body.appendChild(box);

    }


    box.textContent = message;


    requestAnimationFrame(() => {

      box.style.transform =
        "translate(-50%, 0)";

    });


    setTimeout(() => {

      box.style.transform =
        "translate(-50%, 100px)";

    }, 2800);

  };


});