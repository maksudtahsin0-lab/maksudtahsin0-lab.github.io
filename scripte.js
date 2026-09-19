const sections = document.querySelectorAll(".section");
const menu = document.getElementById("sideMenu");
const themeBtn = document.getElementById("themeBtn");
const toast = document.getElementById("toast");


// ================================
// YEAR
// ================================

document.getElementById("year").textContent =
  new Date().getFullYear();


// ================================
// SECTION NAVIGATION
// ================================

function showSection(id) {

  sections.forEach(section => {
    section.classList.toggle(
      "active",
      section.id === id
    );
  });

  menu.classList.remove("show");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ================================
// MENU
// ================================

document
  .getElementById("menuBtn")
  .addEventListener("click", () => {

    menu.classList.toggle("show");

  });


document
  .querySelectorAll("[data-section]")
  .forEach(button => {

    button.addEventListener("click", () => {

      showSection(
        button.dataset.section
      );

    });

  });


// ================================
// TOAST MESSAGE
// ================================

function notify(message) {

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {

    toast.classList.remove("show");

  }, 2500);

}


// ================================
// DARK / LIGHT MODE
// ================================

const savedTheme =
  localStorage.getItem("mas-theme");


if (savedTheme === "dark") {

  document.body.classList.add("dark");

  themeBtn.textContent = "☀️";

}


themeBtn.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  const dark =
    document.body.classList.contains("dark");

  localStorage.setItem(
    "mas-theme",
    dark ? "dark" : "light"
  );

  themeBtn.textContent =
    dark ? "☀️" : "🌙";

});


// ================================
// CLOSE MENU WHEN CLICKING OUTSIDE
// ================================

window.addEventListener("click", event => {

  if (
    !menu.contains(event.target) &&
    event.target.id !== "menuBtn"
  ) {

    menu.classList.remove("show");

  }

});


// ================================
// PWA INSTALL SUPPORT
// ================================

let deferredPrompt = null;


window.addEventListener(
  "beforeinstallprompt",
  event => {

    event.preventDefault();

    deferredPrompt = event;

    setTimeout(() => {

      if (deferredPrompt) {

        notify(
          "📲 M-A-S can be installed as an app."
        );

      }

    }, 3000);

  }
);


// ================================
// INSTALL APP FUNCTION
// ================================

async function installApp() {

  if (!deferredPrompt) {

    notify(
      "Use your browser's Add to Home Screen option."
    );

    return;

  }

  deferredPrompt.prompt();

  await deferredPrompt.userChoice;

  deferredPrompt = null;

}


// ================================
// SERVICE WORKER
// ================================

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register("sw.js")
        .then(() => {

          console.log(
            "M-A-S Service Worker Ready"
          );

        })
        .catch(error => {

          console.log(
            "Service Worker Error:",
            error
          );

        });

    }
  );

}
