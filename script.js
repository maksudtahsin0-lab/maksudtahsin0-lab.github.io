document.addEventListener("DOMContentLoaded", () => {

  const SUPABASE_URL =
    "https://bdsyjobzvwulaifpehvq.supabase.co";

  const SUPABASE_KEY =
    "তোমার_PUBLISHABLE_KEY";

  const supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

  const teacherLoginBtn =
    document.getElementById("teacherLoginBtn");

  const loginModal =
    document.getElementById("loginModal");

  const closeModal =
    document.getElementById("closeModal");

  const languageBtn =
    document.getElementById("languageBtn");

  const themeBtn =
    document.getElementById("themeBtn");

  const menuButton =
    document.getElementById("menuButton");

  const mobileMenu =
    document.getElementById("mobileMenu");

  const year =
    document.getElementById("year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }

  /* =========================
     MOBILE MENU
  ========================= */

  if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("show");
    });

    mobileMenu
      .querySelectorAll("a")
      .forEach(link => {

        link.addEventListener("click", () => {
          mobileMenu.classList.remove("show");
        });

      });

  }

  /* =========================
     LANGUAGE
  ========================= */

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

      applyLanguage(
        currentLanguage === "en"
          ? "bn"
          : "en"
      );

    });

  }

  /* =========================
     THEME
  ========================= */

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

  /* =========================
     LOGIN MODAL
  ========================= */

  function openLogin() {

    if (!loginModal) return;

    loginModal.classList.add("show");

    document.body.style.overflow =
      "hidden";

  }

  function closeLogin() {

    if (!loginModal) return;

    loginModal.classList.remove("show");

    document.body.style.overflow =
      "";

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

  /* =========================
     GOOGLE / LOGIN BUTTON
  ========================= */

  const loginButton =
    document.querySelector(
      ".modal-login-btn"
    );

  if (loginButton) {

    loginButton.addEventListener(
      "click",
      async () => {

        try {

          const {
            data,
            error
          } =
            await supabaseClient.auth.signInWithPassword({

              email:
                prompt(
                  currentLanguage === "bn"
                    ? "আপনার Super Admin email দিন:"
                    : "Enter your Super Admin email:"
                ),

              password:
                prompt(
                  currentLanguage === "bn"
                    ? "আপনার password দিন:"
                    : "Enter your password:"
                )

            });

          if (error) {
            throw error;
          }

          await checkUserRole(
            data.user
          );

        } catch (error) {

          showMessage(
            currentLanguage === "bn"
              ? "❌ Login সফল হয়নি।"
              : "❌ Login failed."
          );

          console.error(error);

        }

      }
    );

  }

  /* =========================
     CHECK ADMIN ROLE
  ========================= */

  async function checkUserRole(user) {

    if (!user) return;

    const {
      data,
      error
    } =
      await supabaseClient
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) {

      console.error(error);

      showMessage(
        "❌ Permission check failed."
      );

      return;

    }

    if (
      data &&
      data.role === "super_admin"
    ) {

      showMessage(
        currentLanguage === "bn"
          ? "✅ Super Admin হিসেবে অনুমোদিত।"
          : "✅ Super Admin access approved."
      );

      closeLogin();

      setTimeout(() => {

        window.location.href =
          "admin.html";

      }, 1000);

    } else {

      await supabaseClient.auth.signOut();

      showMessage(
        currentLanguage === "bn"
          ? "⛔ আপনার Super Admin permission নেই।"
          : "⛔ You do not have Super Admin permission."
      );

    }

  }

  /* =========================
     MESSAGE
  ========================= */

  window.showMessage =
    function(message) {

      let box =
        document.getElementById(
          "tsfMessage"
        );

      if (!box) {

        box =
          document.createElement("div");

        box.id =
          "tsfMessage";

        box.style.position =
          "fixed";

        box.style.left =
          "50%";

        box.style.bottom =
          "25px";

        box.style.transform =
          "translate(-50%, 100px)";

        box.style.padding =
          "14px 20px";

        box.style.borderRadius =
          "14px";

        box.style.background =
          "#111827";

        box.style.color =
          "#fff";

        box.style.fontWeight =
          "700";

        box.style.zIndex =
          "999999";

        box.style.transition =
          ".3s ease";

        document.body.appendChild(
          box
        );

      }

      box.textContent =
        message;

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