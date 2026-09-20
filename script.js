/* =========================================================
   TSF — Teachers Students Friendship
   Main Application Script
   M-A-S • Learn • Connect • Grow Together
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     1. CONFIGURATION
     ========================================================= */

  const SUPABASE_URL = "https://bdsyjobzvwulaifpehvq.supabase.co";

  // এখানে তোমার Supabase Publishable/Anon Key বসাও
  // Gmail password বা Supabase service_role key এখানে কখনো দেবে না।
  const SUPABASE_KEY = "sb_publishable_uVJ41MtBIJbKAQvABmBCdQ_uWtrBzWP_HERE";

  const SUPER_ADMIN_EMAIL = "maksudtahsin0@gmail.com";

  const supabaseReady =
    typeof window.supabase !== "undefined" &&
    SUPABASE_KEY &&
    !SUPABASE_KEY.includes("PASTE_YOUR");

  const supabaseClient = supabaseReady
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;


  /* =========================================================
     2. DEFAULT APPLICATIONS
     These keep the website working even before database setup.
     ========================================================= */

  const DEFAULT_APPS = [
    {
      id: "story-books",
      name: "Story Books",
      icon: "📖",
      description: "Discover stories and public-domain books for enjoyable reading.",
      url: "https://www.gutenberg.org/",
      category: "Story Books",
      external: true
    },
    {
      id: "another-books",
      name: "Another Books",
      icon: "📚",
      description: "Explore a large online library and discover books from around the world.",
      url: "https://openlibrary.org/",
      category: "Another Books",
      external: true
    },
    {
      id: "islamic-books",
      name: "Islamic Books",
      icon: "☪️",
      description: "A dedicated area for Islamic learning resources and books.",
      url: "#",
      category: "Islamic Books"
    },
    {
      id: "academic-books",
      name: "Academic Books",
      icon: "🎓",
      description: "School and academic learning materials in one place.",
      url: "#",
      category: "Academic Books"
    },
    {
      id: "english-books",
      name: "English Books",
      icon: "🔤",
      description: "English learning books, reading materials and resources.",
      url: "#",
      category: "English Books"
    },
    {
      id: "notes-guides",
      name: "Notes & Guides",
      icon: "📝",
      description: "Helpful notes, guides and study materials.",
      url: "#",
      category: "Notes & Guides"
    },
    {
      id: "question-bank",
      name: "Question Bank",
      icon: "❓",
      description: "Practice questions and exam preparation materials.",
      url: "#",
      category: "Question Bank"
    },
    {
      id: "educational-videos",
      name: "Educational Videos",
      icon: "🎬",
      description: "Learn through useful educational video content.",
      url: "#",
      category: "Educational Videos"
    },
    {
      id: "audio-learning",
      name: "Audio Learning",
      icon: "🎧",
      description: "Listen and learn with educational audio resources.",
      url: "#",
      category: "Audio Learning"
    },
    {
      id: "quiz-practice",
      name: "Quiz & Practice",
      icon: "🧠",
      description: "Test your knowledge and practice what you learn.",
      url: "#",
      category: "Quiz & Practice"
    },
    {
      id: "teachers-hub",
      name: "Teachers Hub",
      icon: "👨‍🏫",
      description: "A dedicated space for teachers and teaching resources.",
      url: "#",
      category: "Teachers Hub"
    },
    {
      id: "students-hub",
      name: "Students Hub",
      icon: "🎒",
      description: "Student-focused learning tools and resources.",
      url: "#",
      category: "Students Hub"
    },
    {
      id: "announcements-app",
      name: "Announcements",
      icon: "📢",
      description: "Important TSF news and platform updates.",
      url: "#",
      category: "Announcements"
    },
    {
      id: "ask-teacher",
      name: "Ask a Teacher",
      icon: "💬",
      description: "A future-ready area for student questions and teacher support.",
      url: "#",
      category: "Ask a Teacher"
    }
  ];


  /* =========================================================
     3. STATE
     ========================================================= */

  let applications = [];
  let contentItems = [];
  let announcements = [];
  let deferredInstallPrompt = null;


  /* =========================================================
     4. DOM HELPERS
     ========================================================= */

  const $ = (selector) => document.querySelector(selector);

  const applicationGrid = $("#applicationGrid");
  const resourceGrid = $("#resourceGrid");
  const announcementList = $("#announcementList");
  const menuButton = $("#menuButton");
  const topMenu = $("#topMenu");
  const installAppButton = $("#installAppButton");
  const toastElement = $("#tsfToast");


  /* =========================================================
     5. SECURITY / TEXT ESCAPING
     ========================================================= */

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function safeURL(value) {
    const url = String(value || "").trim();

    if (!url || url === "#") {
      return "#";
    }

    if (
      url.startsWith("https://") ||
      url.startsWith("http://") ||
      url.startsWith("mailto:")
    ) {
      return url;
    }

    return "#";
  }


  /* =========================================================
     6. TOAST
     ========================================================= */

  let toastTimer = null;

  function showToast(message, type = "normal") {
    if (!toastElement) return;

    toastElement.textContent = message;

    toastElement.classList.remove(
      "show",
      "success",
      "error"
    );

    if (type === "success") {
      toastElement.classList.add("success");
    }

    if (type === "error") {
      toastElement.classList.add("error");
    }

    requestAnimationFrame(() => {
      toastElement.classList.add("show");
    });

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toastElement.classList.remove("show");
    }, 3200);
  }


  /* =========================================================
     7. LOADING / EMPTY / ERROR STATES
     ========================================================= */

  function loadingHTML(message = "Loading...") {
    return `
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <strong>${escapeHTML(message)}</strong>
        <span>Please wait a moment.</span>
      </div>
    `;
  }


  function emptyHTML(
    icon = "📂",
    title = "No files available yet",
    description = "This area is ready. Content can be added from Super Admin."
  ) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">${escapeHTML(icon)}</div>
        <strong>${escapeHTML(title)}</strong>
        <span>${escapeHTML(description)}</span>
      </div>
    `;
  }


  function errorHTML(message = "Something went wrong.") {
    return `
      <div class="error-state">
        <div class="empty-state-icon">⚠️</div>
        <strong>Unable to load this area</strong>
        <span>${escapeHTML(message)}</span>
        <button
          type="button"
          class="primary-button retry-button"
          onclick="window.location.reload()"
        >
          Retry →
        </button>
      </div>
    `;
  }


  /* =========================================================
     8. MENU
     ========================================================= */

  function setupMenu() {
    if (!menuButton || !topMenu) return;

    menuButton.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = topMenu.classList.toggle("open");

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    topMenu.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        topMenu.classList.remove("open");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    });

    document.addEventListener("click", (event) => {
      if (
        !topMenu.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        topMenu.classList.remove("open");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    });
  }


  /* =========================================================
     9. RENDER APPLICATIONS
     ========================================================= */

  function renderApplications() {
    if (!applicationGrid) return;

    if (!applications.length) {
      applicationGrid.innerHTML = emptyHTML(
        "🚀",
        "No applications available yet",
        "Applications can be added from the Super Admin panel."
      );
      return;
    }

    applicationGrid.innerHTML = applications
      .map((app, index) => {
        const id = String(app.id || `app-${index}`);

        return `
          <article class="application-card">
            <div class="application-icon">
              ${escapeHTML(app.icon || "🚀")}
            </div>

            <div class="application-card-content">
              <span class="application-number">
                ${String(index + 1).padStart(2, "0")}
              </span>

              <h3>${escapeHTML(app.name)}</h3>

              <p>
                ${escapeHTML(
                  app.description ||
                  "Open this TSF application."
                )}
              </p>

              <button
                type="button"
                class="application-open-button"
                data-app-id="${escapeHTML(id)}"
                aria-label="Open ${escapeHTML(app.name)}"
              >
                Open
                <span>→</span>
              </button>
            </div>
          </article>
        `;
      })
      .join("");

    applicationGrid
      .querySelectorAll("[data-app-id]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const appId = button.dataset.appId;

          const app = applications.find(
            (item) => String(item.id) === String(appId)
          );

          if (app) {
            openApplication(app);
          }
        });
      });
  }


  /* =========================================================
     10. APPLICATION VIEWER
     Full-screen interior experience
     ========================================================= */

  function createApplicationViewer() {
    if ($("#tsfApplicationViewer")) return;

    const viewer = document.createElement("div");

    viewer.id = "tsfApplicationViewer";

    viewer.innerHTML = `
      <div class="tsf-viewer-backdrop"></div>

      <div
        class="tsf-viewer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tsfViewerTitle"
      >
        <div class="tsf-viewer-header">
          <button
            type="button"
            class="tsf-viewer-close"
            id="tsfViewerClose"
            aria-label="Close"
          >
            ←
          </button>

          <div>
            <span id="tsfViewerIcon">🚀</span>
            <strong id="tsfViewerTitle">TSF Application</strong>
          </div>
        </div>

        <div id="tsfViewerBody" class="tsf-viewer-body"></div>
      </div>
    `;

    document.body.appendChild(viewer);

    const closeButton = $("#tsfViewerClose");
    const backdrop = viewer.querySelector(
      ".tsf-viewer-backdrop"
    );

    closeButton.addEventListener(
      "click",
      closeApplicationViewer
    );

    backdrop.addEventListener(
      "click",
      closeApplicationViewer
    );
  }


  function addViewerStyles() {
    if ($("#tsfDynamicViewerStyles")) return;

    const style = document.createElement("style");

    style.id = "tsfDynamicViewerStyles";

    style.textContent = `
      #tsfApplicationViewer {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: none;
      }

      #tsfApplicationViewer.open {
        display: block;
      }

      .tsf-viewer-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(3, 10, 20, .78);
        backdrop-filter: blur(8px);
      }

      .tsf-viewer {
        position: absolute;
        inset: 4vh 4vw;
        max-width: 1100px;
        margin: auto;
        overflow: hidden;
        border-radius: 24px;
        background: #f7f9fc;
        box-shadow: 0 30px 100px rgba(0,0,0,.35);
      }

      .tsf-viewer-header {
        min-height: 72px;
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 14px 18px;
        background: #08111f;
        color: white;
      }

      .tsf-viewer-header > div {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 18px;
      }

      .tsf-viewer-close {
        width: 44px;
        height: 44px;
        border: 1px solid rgba(255,255,255,.15);
        border-radius: 12px;
        background: rgba(255,255,255,.08);
        color: white;
        font-size: 22px;
        cursor: pointer;
      }

      .tsf-viewer-body {
        height: calc(100% - 72px);
        overflow-y: auto;
        padding: 28px;
      }

      .viewer-intro {
        max-width: 760px;
        margin-bottom: 24px;
      }

      .viewer-intro h2 {
        margin: 0 0 10px;
        font-size: clamp(25px, 4vw, 38px);
      }

      .viewer-intro p {
        margin: 0;
        color: #64748b;
        line-height: 1.7;
      }

      .viewer-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 20px;
      }

      .viewer-content-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        margin-top: 22px;
      }

      .viewer-content-card {
        background: white;
        border: 1px solid #e5eaf1;
        border-radius: 18px;
        padding: 20px;
        box-shadow: 0 10px 30px rgba(15,23,42,.06);
      }

      .viewer-content-card h3 {
        margin: 0 0 8px;
      }

      .viewer-content-card p {
        color: #64748b;
        line-height: 1.6;
      }

      .viewer-content-card a {
        display: inline-flex;
        margin-top: 12px;
        text-decoration: none;
        font-weight: 700;
      }

      .viewer-search {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #dbe3ed;
        background: white;
        border-radius: 14px;
        padding: 13px 15px;
        font-size: 15px;
        outline: none;
        margin-bottom: 8px;
      }

      .viewer-search:focus {
        border-color: #19a974;
      }

      @media (max-width: 650px) {
        .tsf-viewer {
          inset: 0;
          border-radius: 0;
        }

        .tsf-viewer-body {
          padding: 20px;
        }
      }
    `;

    document.head.appendChild(style);
  }


  async function openApplication(app) {
    createApplicationViewer();
    addViewerStyles();

    const viewer = $("#tsfApplicationViewer");
    const icon = $("#tsfViewerIcon");
    const title = $("#tsfViewerTitle");
    const body = $("#tsfViewerBody");

    if (!viewer || !body) return;

    icon.textContent = app.icon || "🚀";
    title.textContent = app.name || "TSF Application";

    viewer.classList.add("open");
    document.body.style.overflow = "hidden";

    if (
      app.url &&
      app.url !== "#" &&
      (
        app.url.startsWith("http://") ||
        app.url.startsWith("https://") ||
        app.url.startsWith("mailto:")
      )
    ) {
      body.innerHTML = `
        <div class="viewer-intro">
          <h2>${escapeHTML(app.name)}</h2>

          <p>
            ${escapeHTML(
              app.description ||
              "Open this resource to continue learning."
            )}
          </p>

          <div class="viewer-actions">
            <a
              class="primary-button"
              href="${escapeHTML(safeURL(app.url))}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Resource →
            </a>

            <button
              type="button"
              class="secondary-button"
              id="viewerBackButton"
            >
              Back to TSF
            </button>
          </div>
        </div>
      `;

      $("#viewerBackButton")?.addEventListener(
        "click",
        closeApplicationViewer
      );

      return;
    }

    body.innerHTML = loadingHTML(
      `Opening ${app.name || "application"}...`
    );

    const category =
      app.category ||
      app.name ||
      "";

    const items = await getContentByCategory(category);

    if (!items.length) {
      body.innerHTML = `
        <div class="viewer-intro">
          <h2>${escapeHTML(app.name)}</h2>

          <p>
            ${escapeHTML(
              app.description ||
              "This dedicated TSF area is ready."
            )}
          </p>
        </div>

        ${emptyHTML(
          "📂",
          "No files available yet",
          "This application is ready for content. The Super Admin can add books, videos, notes, questions or other resources."
        )}
      `;

      return;
    }

    renderViewerContent(
      app,
      items
    );
  }


  function renderViewerContent(app, items) {
    const body = $("#tsfViewerBody");

    if (!body) return;

    body.innerHTML = `
      <div class="viewer-intro">
        <h2>${escapeHTML(app.name)}</h2>

        <p>
          ${escapeHTML(
            app.description ||
            "Explore the available learning resources."
          )}
        </p>
      </div>

      <input
        type="search"
        class="viewer-search"
        id="viewerSearch"
        placeholder="Search in ${escapeHTML(app.name)}..."
        aria-label="Search ${escapeHTML(app.name)}"
      >

      <div
        class="viewer-content-grid"
        id="viewerContentGrid"
      ></div>
    `;

    const grid = $("#viewerContentGrid");
    const search = $("#viewerSearch");

    function render(list) {
      if (!list.length) {
        grid.innerHTML = emptyHTML(
          "🔎",
          "Nothing found",
          "Try another search term."
        );
        return;
      }

      grid.innerHTML = list
        .map((item) => {
          const url = safeURL(item.url);

          return `
            <article class="viewer-content-card">
              <h3>${escapeHTML(item.title)}</h3>

              <p>
                ${escapeHTML(
                  item.description ||
                  "Learning resource"
                )}
              </p>

              ${
                url !== "#"
                  ? `
                    <a
                      class="primary-button"
                      href="${escapeHTML(url)}"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open →
                    </a>
                  `
                  : `
                    <button
                      type="button"
                      class="secondary-button"
                      disabled
                    >
                      Coming soon
                    </button>
                  `
              }
            </article>
          `;
        })
        .join("");
    }

    render(items);

    search.addEventListener("input", () => {
      const query =
        search.value
          .trim()
          .toLowerCase();

      if (!query) {
        render(items);
        return;
      }

      const filtered = items.filter((item) => {
        const text = `
          ${item.title || ""}
          ${item.description || ""}
          ${item.category || ""}
        `.toLowerCase();

        return text.includes(query);
      });

      render(filtered);
    });
  }


  function closeApplicationViewer() {
    const viewer = $("#tsfApplicationViewer");

    if (!viewer) return;

    viewer.classList.remove("open");

    document.body.style.overflow = "";
  }


  /* =========================================================
     11. SUPABASE — LOAD APPLICATIONS
     ========================================================= */

  async function loadApplications() {
    if (!applicationGrid) return;

    applicationGrid.innerHTML =
      loadingHTML("Loading TSF applications...");

    if (!supabaseClient) {
      applications = DEFAULT_APPS;

      renderApplications();

      return;
    }

    try {
      const { data, error } =
        await supabaseClient
          .from("app_items")
          .select("*")
          .eq("active", true)
          .order("sort_order", {
            ascending: true
          })
          .order("created_at", {
            ascending: true
          });

      if (error) {
        console.warn(
          "TSF applications database error:",
          error
        );

        applications = DEFAULT_APPS;

        renderApplications();

        return;
      }

      applications =
        data && data.length
          ? data.map((app) => ({
              ...app,
              external:
                app.url &&
                (
                  app.url.startsWith("http://") ||
                  app.url.startsWith("https://")
                )
            }))
          : DEFAULT_APPS;

      renderApplications();

    } catch (error) {
      console.error(error);

      applications = DEFAULT_APPS;

      renderApplications();
    }
  }


  /* =========================================================
     12. SUPABASE — LOAD CONTENT
     ========================================================= */

  async function loadContent() {
    if (!resourceGrid) return;

    resourceGrid.innerHTML =
      loadingHTML("Loading resources...");

    if (!supabaseClient) {
      resourceGrid.innerHTML = emptyHTML(
        "📚",
        "Your resource library is ready",
        "Books, notes, videos and other learning files will appear here when they are added from Super Admin."
      );

      return;
    }

    try {
      const { data, error } =
        await supabaseClient
          .from("content_items")
          .select("*")
          .eq("active", true)
          .order("sort_order", {
            ascending: true
          })
          .order("created_at", {
            ascending: false
          });

      if (error) {
        console.warn(
          "TSF content database error:",
          error
        );

        resourceGrid.innerHTML =
          errorHTML(
            "The resource database could not be reached. Your applications are still available."
          );

        return;
      }

      contentItems = data || [];

      renderResources();

    } catch (error) {
      console.error(error);

      resourceGrid.innerHTML =
        errorHTML(
          "Please check your connection and try again."
        );
    }
  }


  async function getContentByCategory(category) {
    const normalized =
      String(category || "")
        .trim()
        .toLowerCase();

    if (!supabaseClient) {
      return [];
    }

    try {
      const { data, error } =
        await supabaseClient
          .from("content_items")
          .select("*")
          .eq("active", true)
          .order("sort_order", {
            ascending: true
          })
          .order("created_at", {
            ascending: false
          });

      if (error) {
        console.warn(error);
        return [];
      }

      return (data || []).filter(
        (item) =>
          String(item.category || "")
            .trim()
            .toLowerCase() === normalized
      );

    } catch (error) {
      console.error(error);
      return [];
    }
  }


  function renderResources() {
    if (!resourceGrid) return;

    if (!contentItems.length) {
      resourceGrid.innerHTML = emptyHTML(
        "📂",
        "No resources available yet",
        "Your library is ready. Books, notes, videos and other resources can be added from Super Admin."
      );

      return;
    }

    resourceGrid.innerHTML =
      contentItems
        .slice(0, 12)
        .map((item) => {
          const url = safeURL(item.url);

          return `
            <article class="application-card">
              <div class="application-icon">
                📚
              </div>

              <div class="application-card-content">
                <span class="application-number">
                  ${escapeHTML(
                    item.category || "RESOURCE"
                  )}
                </span>

                <h3>
                  ${escapeHTML(item.title)}
                </h3>

                <p>
                  ${escapeHTML(
                    item.description ||
                    "TSF learning resource."
                  )}
                </p>

                ${
                  url !== "#"
                    ? `
                      <a
                        class="application-open-button"
                        href="${escapeHTML(url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open
                        <span>→</span>
                      </a>
                    `
                    : `
                      <button
                        type="button"
                        class="application-open-button"
                        disabled
                      >
                        Available soon
                        <span>•</span>
                      </button>
                    `
                }
              </div>
            </article>
          `;
        })
        .join("");
  }


  /* =========================================================
     13. ANNOUNCEMENTS
     ========================================================= */

  async function loadAnnouncements() {
    if (!announcementList) return;

    announcementList.innerHTML =
      loadingHTML("Loading announcements...");

    if (!supabaseClient) {
      announcementList.innerHTML =
        emptyHTML(
          "📢",
          "No announcements yet",
          "Important TSF updates will appear here."
        );

      return;
    }

    try {
      const { data, error } =
        await supabaseClient
          .from("announcements")
          .select("*")
          .eq("active", true)
          .order("created_at", {
            ascending: false
          });

      if (error) {
        console.warn(error);

        announcementList.innerHTML =
          errorHTML(
            "Announcements could not be loaded."
          );

        return;
      }

      announcements = data || [];

      renderAnnouncements();

    } catch (error) {
      console.error(error);

      announcementList.innerHTML =
        errorHTML(
          "Please check your internet connection."
        );
    }
  }


  function renderAnnouncements() {
    if (!announcementList) return;

    if (!announcements.length) {
      announcementList.innerHTML =
        emptyHTML(
          "📢",
          "No announcements yet",
          "New TSF announcements will appear here."
        );

      return;
    }

    announcementList.innerHTML =
      announcements
        .map((item) => {
          const date = item.created_at
            ? new Date(
                item.created_at
              ).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                }
              )
            : "";

          return `
            <article class="announcement-card">
              <div class="announcement-icon">
                📢
              </div>

              <div>
                <span class="section-label">
                  ${escapeHTML(date)}
                </span>

                <h3>
                  ${escapeHTML(item.title)}
                </h3>

                <p>
                  ${escapeHTML(item.body)}
                </p>
              </div>
            </article>
          `;
        })
        .join("");
  }


  /* =========================================================
     14. PWA INSTALL
     ========================================================= */

  function setupInstallPrompt() {
    window.addEventListener(
      "beforeinstallprompt",
      (event) => {
        event.preventDefault();

        deferredInstallPrompt = event;

        if (installAppButton) {
          installAppButton.hidden = false;
        }
      }
    );

    if (!installAppButton) return;

    installAppButton.addEventListener(
      "click",
      async () => {
        if (!deferredInstallPrompt) {
          showToast(
            "Install is available from your browser menu when supported."
          );

          return;
        }

        deferredInstallPrompt.prompt();

        const result =
          await deferredInstallPrompt.userChoice;

        if (
          result &&
          result.outcome === "accepted"
        ) {
          showToast(
            "TSF installation started.",
            "success"
          );
        }

        deferredInstallPrompt = null;

        installAppButton.hidden = true;
      }
    );

    window.addEventListener(
      "appinstalled",
      () => {
        deferredInstallPrompt = null;

        installAppButton.hidden = true;

        showToast(
          "TSF installed successfully.",
          "success"
        );
      }
    );
  }


  /* =========================================================
     15. SERVICE WORKER
     ========================================================= */

  function registerServiceWorker() {
    if (
      "serviceWorker" in navigator &&
      location.protocol === "https:"
    ) {
      window.addEventListener(
        "load",
        () => {
          navigator.serviceWorker
            .register("./sw.js")
            .then(() => {
              console.log(
                "TSF Service Worker registered."
              );
            })
            .catch((error) => {
              console.warn(
                "TSF Service Worker registration failed:",
                error
              );
            });
        }
      );
    }
  }


  /* =========================================================
     16. CURRENT YEAR
     ========================================================= */

  function setCurrentYear() {
    const yearElement =
      $("#currentYear");

    if (yearElement) {
      yearElement.textContent =
        new Date().getFullYear();
    }
  }


  /* =========================================================
     17. SMOOTH NAVIGATION
     ========================================================= */

  function setupNavigation() {
    document
      .querySelectorAll('a[href^="#"]')
      .forEach((link) => {
        link.addEventListener(
          "click",
          (event) => {
            const targetID =
              link.getAttribute("href");

            if (
              !targetID ||
              targetID === "#"
            ) {
              return;
            }

            const target =
              document.querySelector(
                targetID
              );

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }
        );
      });
  }


  /* =========================================================
     18. KEYBOARD SUPPORT
     ========================================================= */

  function setupKeyboard() {
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") {
          closeApplicationViewer();

          if (topMenu) {
            topMenu.classList.remove("open");
          }

          if (menuButton) {
            menuButton.setAttribute(
              "aria-expanded",
              "false"
            );
          }
        }
      }
    );
  }


  /* =========================================================
     19. SUPABASE AUTH STATE
     ========================================================= */

  async function checkCurrentUser() {
    if (!supabaseClient) return;

    try {
      const {
        data: { session }
      } = await supabaseClient.auth.getSession();

      if (!session?.user) return;

      const email =
        String(
          session.user.email || ""
        ).toLowerCase();

      if (
        email ===
        SUPER_ADMIN_EMAIL.toLowerCase()
      ) {
        console.log(
          "TSF Super Admin session detected."
        );
      }

    } catch (error) {
      console.warn(
        "Could not check TSF session:",
        error
      );
    }
  }


  /* =========================================================
     20. GLOBAL APP API
     ========================================================= */

  window.TSF = {
    openApplication,
    closeApplicationViewer,
    showToast,
    reload: async () => {
      await Promise.all([
        loadApplications(),
        loadContent(),
        loadAnnouncements()
      ]);
    }
  };


  /* =========================================================
     21. INITIALIZE TSF
     ========================================================= */

  async function initTSF() {
    try {
      setCurrentYear();

      setupMenu();

      setupInstallPrompt();

      setupNavigation();

      setupKeyboard();

      createApplicationViewer();

      addViewerStyles();

      registerServiceWorker();

      await checkCurrentUser();

      await Promise.all([
        loadApplications(),
        loadContent(),
        loadAnnouncements()
      ]);

      console.log(
        "🚀 TSF — Teachers Students Friendship is ready."
      );

    } catch (error) {
      console.error(
        "TSF initialization error:",
        error
      );

      showToast(
        "TSF loaded with limited features.",
        "error"
      );
    }
  }


  /* =========================================================
     22. START
     ========================================================= */

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initTSF
    );
  } else {
    initTSF();
  }

})();/* =========================================
   TSF — Language + Dark Mode Controller
   ========================================= */

(function () {
  "use strict";

  const LANGUAGES = {
    bn: {
      name: "বাংলা",
      code: "বাং"
    },

    en: {
      name: "English",
      code: "EN"
    },

    ar: {
      name: "العربية",
      code: "ع"
    }
  };

  function getLanguage() {
    return localStorage.getItem("tsf-language") || "en";
  }

  function getTheme() {
    return localStorage.getItem("tsf-theme") || "light";
  }

  function applyTheme() {
    document.body.classList.toggle(
      "tsf-dark",
      getTheme() === "dark"
    );
  }

  function applyLanguage() {
    const language = getLanguage();

    document.documentElement.lang = language;

    if (language === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }

    const button = document.getElementById(
      "tsfLanguageButton"
    );

    if (button) {
      button.textContent =
        LANGUAGES[language].code;
    }

    document
      .querySelectorAll("[data-tsf-lang]")
      .forEach(function (item) {
        item.classList.toggle(
          "active",
          item.dataset.tsfLang === language
        );
      });
  }

  function createSettings() {

    if (
      document.getElementById(
        "tsfSettingsPanel"
      )
    ) {
      return;
    }

    const headerActions =
      document.querySelector(
        ".header-actions"
      );

    if (!headerActions) {
      return;
    }

    /* Language button */

    const languageButton =
      document.createElement("button");

    languageButton.id =
      "tsfLanguageButton";

    languageButton.className =
      "tsf-language-button";

    languageButton.type = "button";

    languageButton.title =
      "Language / اللغة / ভাষা";

    headerActions.prepend(
      languageButton
    );

    /* Settings panel */

    const panel =
      document.createElement("div");

    panel.id =
      "tsfSettingsPanel";

    panel.className =
      "tsf-settings-panel";

    panel.innerHTML = `
      <div class="tsf-settings-head">
        <strong>TSF Settings</strong>

        <button
          class="tsf-close"
          id="tsfSettingsClose"
          type="button"
        >
          ×
        </button>
      </div>

      <div class="tsf-setting-row">

        <span class="tsf-setting-label">
          Language / ভাষা / اللغة
        </span>

        <div class="tsf-choice-grid">

          <button
            class="tsf-choice"
            data-tsf-lang="bn"
            type="button"
          >
            বাংলা
          </button>

          <button
            class="tsf-choice"
            data-tsf-lang="en"
            type="button"
          >
            English
          </button>

          <button
            class="tsf-choice"
            data-tsf-lang="ar"
            type="button"
          >
            العربية
          </button>

        </div>
      </div>

      <div class="tsf-setting-row">

        <span class="tsf-setting-label">
          Theme / মোড
        </span>

        <div class="tsf-choice-grid tsf-theme-grid">

          <button
            class="tsf-choice"
            data-tsf-theme="light"
            type="button"
          >
            ☀️ Light
          </button>

          <button
            class="tsf-choice"
            data-tsf-theme="dark"
            type="button"
          >
            🌙 Dark
          </button>

        </div>
      </div>

      <p class="tsf-settings-note">
        Your preferences are saved on this device.
      </p>
    `;

    document.body.appendChild(panel);

    /* Open settings */

    languageButton.addEventListener(
      "click",
      function () {
        panel.classList.toggle(
          "open"
        );
      }
    );

    /* Close settings */

    document
      .getElementById(
        "tsfSettingsClose"
      )
      .addEventListener(
        "click",
        function () {
          panel.classList.remove(
            "open"
          );
        }
      );

    /* Language */

    panel
      .querySelectorAll(
        "[data-tsf-lang]"
      )
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            localStorage.setItem(
              "tsf-language",
              button.dataset.tsfLang
            );

            applyLanguage();
          }
        );

      });

    /* Theme */

    panel
      .querySelectorAll(
        "[data-tsf-theme]"
      )
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            localStorage.setItem(
              "tsf-theme",
              button.dataset.tsfTheme
            );

            applyTheme();

            updateThemeButtons();
          }
        );

      });

    updateThemeButtons();
  }

  function updateThemeButtons() {

    const theme =
      getTheme();

    document
      .querySelectorAll(
        "[data-tsf-theme]"
      )
      .forEach(function (button) {

        button.classList.toggle(
          "active",
          button.dataset.tsfTheme === theme
        );

      });
  }

  function startTSFSettings() {

    applyTheme();

    createSettings();

    applyLanguage();

    updateThemeButtons();
  }

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      startTSFSettings
    );

  } else {

    startTSFSettings();

  }

})();