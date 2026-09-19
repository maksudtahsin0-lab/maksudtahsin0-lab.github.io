/* =========================================
   TSF — Teachers Students Friendship
   Core Website Functions
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     MOBILE MENU
  ========================================= */

  const menuButton =
    document.getElementById("menuButton");

  const mobileMenu =
    document.getElementById("mobileMenu");


  if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", () => {

      mobileMenu.classList.toggle("show");

    });


    document
      .querySelectorAll(".mobile-menu a")
      .forEach(link => {

        link.addEventListener("click", () => {

          mobileMenu.classList.remove("show");

        });

      });

  }


  /* =========================================
     YEAR
  ========================================= */

  const year =
    document.getElementById("year");

  if (year) {

    year.textContent =
      new Date().getFullYear();

  }


  /* =========================================
     MODAL
  ========================================= */

  const loginModal =
    document.getElementById("loginModal");


  window.openLogin = function () {

    if (loginModal) {

      loginModal.classList.add("show");

      document.body.style.overflow = "hidden";

    }

  };


  window.closeLogin = function () {

    if (loginModal) {

      loginModal.classList.remove("show");

      document.body.style.overflow = "";

    }

  };


  if (loginModal) {

    loginModal.addEventListener("click", event => {

      if (event.target === loginModal) {

        window.closeLogin();

      }

    });

  }


  /* =========================================
     START LEARNING
  ========================================= */

  window.startLearning = function () {

    showMessage(
      "🎓 TSF Learning Space is coming soon."
    );

  };


  /* =========================================
     JOIN AS TEACHER
  ========================================= */

  window.joinAsTeacher = function () {

    showMessage(
      "👨‍🏫 Teacher Space is coming soon."
    );

  };


  /* =========================================
     ESC KEY
  ========================================= */

  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

      window.closeLogin();

    }

  });


  /* =========================================
     SMOOTH INTERNAL NAVIGATION
  ========================================= */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

      link.addEventListener("click", event => {

        const targetId =
          link.getAttribute("href");

        if (!targetId || targetId === "#") {

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

      });

    });


  /* =========================================
     REVEAL ANIMATION
  ========================================= */

  const animatedElements =
    document.querySelectorAll(
      ".about-card, .feature-card, .stat"
    );


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                "visible"
              );

              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.12
        }
      );


    animatedElements.forEach(element => {

      observer.observe(element);

    });

  }


  /* =========================================
     CLOSE MOBILE MENU OUTSIDE
  ========================================= */

  document.addEventListener("click", event => {

    if (
      mobileMenu &&
      menuButton &&
      !mobileMenu.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {

      mobileMenu.classList.remove("show");

    }

  });

});


/* =========================================
   SIMPLE MESSAGE SYSTEM
========================================= */

function showMessage(message) {

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
      "#0f172a";

    box.style.color =
      "#ffffff";

    box.style.fontSize =
      "14px";

    box.style.fontWeight =
      "600";

    box.style.boxShadow =
      "0 15px 40px rgba(0,0,0,0.25)";

    box.style.zIndex =
      "99999";

    box.style.transition =
      "0.3s ease";

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

}