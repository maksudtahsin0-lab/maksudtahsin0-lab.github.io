/* =========================================================
   TSF — EDUCATION SYSTEM
   Class → Subject → Learning Resources
   M-A-S • Learn • Connect • Grow Together
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     SUPABASE CONFIG
     ========================================================= */

  const SUPABASE_URL =
    "https://bdsyjobzvwulaifpehvq.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_uVJ41MtBIJbKAQvABmBCdQ_uWtrBzWP";

  const db =
    window.supabase &&
    SUPABASE_KEY &&
    !SUPABASE_KEY.includes("PASTE_YOUR")
      ? window.supabase.createClient(
          SUPABASE_URL,
          SUPABASE_KEY
        )
      : null;


  /* =========================================================
     STATE
     ========================================================= */

  let classes = [];
  let subjects = [];
  let currentClass = null;
  let currentSubject = null;


  /* =========================================================
     HELPERS
     ========================================================= */

  function $(selector) {
    return document.querySelector(selector);
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  /* =========================================================
     DYNAMIC CSS
     ========================================================= */

  function addEducationStyles() {

    if ($("#tsfEducationStyles")) return;

    const style = document.createElement("style");

    style.id = "tsfEducationStyles";

    style.textContent = `

      #tsfEducation {
        padding: 70px 20px;
        background:
          linear-gradient(
            180deg,
            #f8fbff 0%,
            #ffffff 100%
          );
      }

      .education-container {
        width: min(1180px, 100%);
        margin: auto;
      }

      .education-heading {
        text-align: center;
        max-width: 760px;
        margin: 0 auto 35px;
      }

      .education-heading .section-label {
        display: inline-block;
        margin-bottom: 10px;
      }

      .education-heading h2 {
        margin: 0 0 12px;
        font-size: clamp(30px, 5vw, 48px);
        line-height: 1.1;
      }

      .education-heading p {
        margin: 0;
        color: #64748b;
        line-height: 1.7;
      }

      .education-search {
        width: 100%;
        box-sizing: border-box;
        padding: 15px 18px;
        border: 1px solid #dbe3ed;
        border-radius: 16px;
        background: white;
        font-size: 16px;
        outline: none;
        margin-bottom: 25px;
        box-shadow: 0 8px 25px rgba(15,23,42,.04);
      }

      .education-search:focus {
        border-color: #19a974;
      }

      .education-grid {
        display: grid;
        grid-template-columns:
          repeat(
            auto-fit,
            minmax(210px, 1fr)
          );
        gap: 18px;
      }

      .education-card {
        position: relative;
        overflow: hidden;
        padding: 24px;
        border-radius: 22px;
        background: white;
        border: 1px solid #e5eaf1;
        box-shadow:
          0 12px 35px
          rgba(15,23,42,.06);
        transition:
          transform .25s ease,
          box-shadow .25s ease,
          border-color .25s ease;
        cursor: pointer;
      }

      .education-card:hover {
        transform: translateY(-5px);
        box-shadow:
          0 20px 45px
          rgba(15,23,42,.11);
        border-color: #cbd5e1;
      }

      .education-card-icon {
        width: 58px;
        height: 58px;
        display: grid;
        place-items: center;
        border-radius: 17px;
        background: #f1f5f9;
        font-size: 29px;
        margin-bottom: 18px;
      }

      .education-card-number {
        display: block;
        margin-bottom: 7px;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .08em;
        text-transform: uppercase;
        color: #64748b;
      }

      .education-card h3 {
        margin: 0 0 8px;
        font-size: 21px;
        color: #0f172a;
      }

      .education-card p {
        margin: 0;
        color: #64748b;
        line-height: 1.6;
        font-size: 14px;
      }

      .education-card-arrow {
        position: absolute;
        right: 20px;
        bottom: 20px;
        font-size: 20px;
        font-weight: 800;
      }

      .education-breadcrumb {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-bottom: 24px;
        color: #64748b;
        font-size: 14px;
      }

      .education-breadcrumb button {
        border: 0;
        background: none;
        padding: 0;
        font-weight: 700;
        color: #0f172a;
        cursor: pointer;
      }

      .education-back {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: 1px solid #dbe3ed;
        background: white;
        border-radius: 12px;
        padding: 10px 14px;
        font-weight: 700;
        cursor: pointer;
        margin-bottom: 22px;
      }

      .education-subject-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 20px;
        margin-bottom: 25px;
      }

      .education-subject-header h2 {
        margin: 0 0 8px;
        font-size: clamp(27px, 4vw, 40px);
      }

      .education-subject-header p {
        margin: 0;
        color: #64748b;
        line-height: 1.6;
      }

      .resource-category-grid {
        display: grid;
        grid-template-columns:
          repeat(
            auto-fit,
            minmax(180px, 1fr)
          );
        gap: 16px;
        margin-top: 20px;
      }

      .resource-category {
        border: 1px solid #e5eaf1;
        background: white;
        border-radius: 20px;
        padding: 22px;
        cursor: pointer;
        transition: transform .2s ease;
      }

      .resource-category:hover {
        transform: translateY(-4px);
      }

      .resource-category-icon {
        font-size: 30px;
        margin-bottom: 12px;
      }

      .resource-category strong {
        display: block;
        font-size: 18px;
        margin-bottom: 5px;
      }

      .resource-category span {
        color: #64748b;
        font-size: 14px;
      }

      .education-empty {
        padding: 45px 20px;
        text-align: center;
        border: 1px dashed #cbd5e1;
        border-radius: 20px;
        background: #fff;
      }

      .education-empty-icon {
        font-size: 40px;
        margin-bottom: 12px;
      }

      .education-empty strong {
        display: block;
        font-size: 20px;
        margin-bottom: 8px;
      }

      .education-empty span {
        color: #64748b;
        line-height: 1.6;
      }

      .ai-help-card {
        margin-top: 24px;
        padding: 24px;
        border-radius: 22px;
        background: #08111f;
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        flex-wrap: wrap;
      }

      .ai-help-card h3 {
        margin: 0 0 7px;
        font-size: 23px;
      }

      .ai-help-card p {
        margin: 0;
        color: #cbd5e1;
        line-height: 1.6;
      }

      .ai-help-button {
        border: 0;
        border-radius: 13px;
        padding: 13px 18px;
        background: white;
        color: #08111f;
        font-weight: 800;
        cursor: pointer;
      }

      .resource-list {
        display: grid;
        gap: 14px;
        margin-top: 20px;
      }

      .resource-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        padding: 18px;
        background: white;
        border: 1px solid #e5eaf1;
        border-radius: 17px;
      }

      .resource-item-info {
        min-width: 0;
      }

      .resource-item-info strong {
        display: block;
        margin-bottom: 5px;
      }

      .resource-item-info span {
        color: #64748b;
        font-size: 14px;
      }

      .resource-open {
        flex-shrink: 0;
        text-decoration: none;
        font-weight: 800;
      }

      @media (max-width: 650px) {

        #tsfEducation {
          padding: 50px 16px;
        }

        .education-card {
          padding: 20px;
        }

        .education-subject-header {
          display: block;
        }

        .resource-item {
          align-items: flex-start;
          flex-direction: column;
        }

      }

    `;

    document.head.appendChild(style);
  }


  /* =========================================================
     CREATE EDUCATION SECTION
     ========================================================= */

  function createEducationSection() {

    if ($("#tsfEducation")) return;

    const main = document.querySelector("main");

    if (!main) return;

    const section = document.createElement("section");

    section.id = "tsfEducation";

    section.innerHTML = `

      <div class="education-container">

        <div class="education-heading">

          <span class="section-label">
            TSF LEARNING
          </span>

          <h2>
            Learn your way.
          </h2>

          <p>
            Choose your class, explore subjects,
            access notes, sheets, questions,
            videos and learning resources.
          </p>

        </div>

        <div id="educationContent"></div>

      </div>

    `
  const hero = main.querySelector(".hero-section");

if (hero) {
  hero.insertAdjacentElement("afterend", section);
} else {
  main.appendChild(section);
}


  /* =========================================================
     LOADING
     ========================================================= */

  function loadingHTML() {

    return `

      <div class="education-empty">

        <div class="education-empty-icon">
          ⏳
        </div>

        <strong>
          Loading learning system...
        </strong>

        <span>
          Please wait a moment.
        </span>

      </div>

    `;
  }


  /* =========================================================
     EMPTY
     ========================================================= */

  function emptyHTML(
    title,
    description
  ) {

    return `

      <div class="education-empty">

        <div class="education-empty-icon">
          📚
        </div>

        <strong>
          ${escapeHTML(title)}
        </strong>

        <span>
          ${escapeHTML(description)}
        </span>

      </div>

    `;
  }


  /* =========================================================
     LOAD CLASSES
     ========================================================= */

  async function loadClasses() {

    const container =
      $("#educationContent");

    if (!container) return;

    container.innerHTML =
      loadingHTML();

    if (!db) {

      container.innerHTML =
        emptyHTML(
          "Learning system is ready",
          "Supabase connection is not configured yet."
        );

      return;
    }

    try {

      const { data, error } =
        await db
          .from("classes")
          .select("*")
          .eq("is_active", true)
          .order(
            "display_order",
            {
              ascending: true
            }
          )
          .order(
            "class_number",
            {
              ascending: true
            }
          );

      if (error) {

        console.error(
          "TSF Classes Error:",
          error
        );

        container.innerHTML =
          emptyHTML(
            "Could not load classes",
            "Please check your Supabase connection and try again."
          );

        return;
      }

      classes = data || [];

      renderClasses();

    } catch (error) {

      console.error(error);

      container.innerHTML =
        emptyHTML(
          "Something went wrong",
          "Please refresh the page and try again."
        );

    }
  }


  /* =========================================================
     RENDER CLASSES
     ========================================================= */

  function renderClasses(
    filteredClasses = classes
  ) {

    const container =
      $("#educationContent");

    if (!container) return;

    if (!filteredClasses.length) {

      container.innerHTML =
        emptyHTML(
          "No classes found",
          "Try another search."
        );

      return;
    }

    container.innerHTML = `

      <input
        id="educationClassSearch"
        class="education-search"
        type="search"
        placeholder="🔎 Search class..."
        autocomplete="off"
      >

      <div class="education-grid">

        ${filteredClasses
          .map((item, index) => `

            <article
              class="education-card"
              data-class-id="${escapeHTML(item.id)}"
            >

              <div class="education-card-icon">
                🎓
              </div>

              <span class="education-card-number">
                CLASS ${escapeHTML(
                  item.class_number ??
                  index + 1
                )}
              </span>

              <h3>
                ${escapeHTML(item.name)}
              </h3>

              <p>
                ${escapeHTML(
                  item.description ||
                  "Explore subjects and learning resources."
                )}
              </p>

              <span class="education-card-arrow">
                →
              </span>

            </article>

          `)
          .join("")}

      </div>

    `;

    container
      .querySelectorAll("[data-class-id]")
      .forEach(card => {

        card.addEventListener(
          "click",
          () => {

            const id =
              card.dataset.classId;

            openClass(id);

          }
        );

      });

    const search =
      $("#educationClassSearch");

    if (search) {

      search.addEventListener(
        "input",
        () => {

          const query =
            search.value
              .trim()
              .toLowerCase();

          const filtered =
            classes.filter(item => {

              const text = `

                ${item.name || ""}

                ${item.class_number || ""}

                ${item.description || ""}

              `.toLowerCase();

              return text.includes(query);

            });

          renderClasses(filtered);

        }
      );

    }
  }


  /* =========================================================
     OPEN CLASS
     ========================================================= */

  async function openClass(
    classId
  ) {

    const selected =
      classes.find(
        item =>
          String(item.id) ===
          String(classId)
      );

    if (!selected) return;

    currentClass = selected;

    const container =
      $("#educationContent");

    if (!container) return;

    container.innerHTML =
      loadingHTML();

    if (!db) return;

    try {

      const { data, error } =
        await db
          .from("subjects")
          .select("*")
          .eq(
            "class_id",
            classId
          )
          .eq(
            "is_active",
            true
          )
          .order(
            "display_order",
            {
              ascending: true
            }
          );

      if (error) {

        console.error(error);

        container.innerHTML =
          emptyHTML(
            "Could not load subjects",
            "Please try again."
          );

        return;
      }

      subjects = data || [];

      renderSubjects();

    } catch (error) {

      console.error(error);

      container.innerHTML =
        emptyHTML(
          "Something went wrong",
          "Please refresh and try again."
        );

    }
  }


  /* =========================================================
     RENDER SUBJECTS
     ========================================================= */

  function renderSubjects() {

    const container =
      $("#educationContent");

    if (!container) return;

    container.innerHTML = `

      <div class="education-breadcrumb">

        <button
          type="button"
          id="educationHomeButton"
        >
          Classes
        </button>

        <span>›</span>

        <strong>
          ${escapeHTML(
            currentClass.name
          )}
        </strong>

      </div>

      <button
        type="button"
        class="education-back"
        id="educationBackButton"
      >
        ← Back to Classes
      </button>

      <div class="education-subject-header">

        <div>

          <h2>
            ${escapeHTML(
              currentClass.name
            )}
          </h2>

          <p>
            Choose a subject to explore
            learning resources.
          </p>

        </div>

      </div>

      ${
        subjects.length
          ? `

            <div class="education-grid">

              ${subjects
                .map(
                  subject => `

                    <article
                      class="education-card"
                      data-subject-id="${escapeHTML(
                        subject.id
                      )}"
                    >

                      <div class="education-card-icon">
                        ${escapeHTML(
                          subject.icon ||
                          "📘"
                        )}
                      </div>

                      <h3>
                        ${escapeHTML(
                          subject.name
                        )}
                      </h3>

                      <p>
                        ${escapeHTML(
                          subject.description ||
                          "Explore notes, sheets, questions, videos and more."
                        )}
                      </p>

                      <span class="education-card-arrow">
                        →
                      </span>

                    </article>

                  `
                )
                .join("")}

            </div>

          `
          : emptyHTML(
              "No subjects available yet",
              "Subjects can be added from the Super Admin panel."
            )
      }

    `;

    $("#educationBackButton")
      ?.addEventListener(
        "click",
        loadClasses
      );

    $("#educationHomeButton")
      ?.addEventListener(
        "click",
        loadClasses
      );

    container
      .querySelectorAll(
        "[data-subject-id]"
      )
      .forEach(card => {

        card.addEventListener(
          "click",
          () => {

            openSubject(
              card.dataset.subjectId
            );

          }
        );

      });

  }


  /* =========================================================
     OPEN SUBJECT
     ========================================================= */

  async function openSubject(
    subjectId
  ) {

    const selected =
      subjects.find(
        item =>
          String(item.id) ===
          String(subjectId)
      );

    if (!selected) return;

    currentSubject = selected;

    const container =
      $("#educationContent");

    if (!container) return;

    container.innerHTML = `

      <div class="education-breadcrumb">

        <button
          type="button"
          id="educationClassCrumb"
        >
          ${escapeHTML(
            currentClass.name
          )}
        </button>

        <span>›</span>

        <strong>
          ${escapeHTML(
            currentSubject.name
          )}
        </strong>

      </div>

      <button
        type="button"
        class="education-back"
        id="educationSubjectBack"
      >
        ← Back to Subjects
      </button>

      <div class="education-subject-header">

        <div>

          <h2>
            ${escapeHTML(
              currentSubject.name
            )}
          </h2>

          <p>
            ${escapeHTML(
              currentSubject.description ||
              "Choose what you want to learn."
            )}
          </p>

        </div>

      </div>

      <div class="resource-category-grid">

        <article
          class="resource-category"
          data-resource-category="notes"
        >

          <div class="resource-category-icon">
            📚
          </div>

          <strong>
            Notes
          </strong>

          <span>
            Class notes and study materials
          </span>

        </article>

        <article
          class="resource-category"
          data-resource-category="sheets"
        >

          <div class="resource-category-icon">
            📝
          </div>

          <strong>
            Sheets
          </strong>

          <span>
            Handouts and class sheets
          </span>

        </article>

        <article
          class="resource-category"
          data-resource-category="questions"
        >

          <div class="resource-category-icon">
            ❓
          </div>

          <strong>
            Question Bank
          </strong>

          <span>
            Practice and exam questions
          </span>

        </article>

        <article
          class="resource-category"
          data-resource-category="videos"
        >

          <div class="resource-category-icon">
            🎥
          </div>

          <strong>
            Videos
          </strong>

          <span>
            Educational video lessons
          </span>

        </article>

        <article
          class="resource-category"
          data-resource-category="other"
        >

          <div class="resource-category-icon">
            📦
          </div>

          <strong>
            Other Resources
          </strong>

          <span>
            Images, documents, audio and more
          </span>

        </article>

      </div>

      <div class="ai-help-card">

        <div>

          <h3>
            🤖 AI Help
          </h3>

          <p>
            Ask questions, upload a problem
            and get step-by-step learning help.
          </p>

        </div>

        <button
          type="button"
          class="ai-help-button"
          id="tsfAIHelpButton"
        >
          Ask AI →
        </button>

      </div>

      <div id="educationResources"></div>

    `;

    $("#educationSubjectBack")
      ?.addEventListener(
        "click",
        renderSubjects
      );

    $("#educationClassCrumb")
      ?.addEventListener(
        "click",
        renderSubjects
      );

    container
      .querySelectorAll(
        "[data-resource-category]"
      )
      .forEach(card => {

        card.addEventListener(
          "click",
          () => {

            loadMaterials(
              card.dataset.resourceCategory
            );

          }
        );

      });

    $("#tsfAIHelpButton")
      ?.addEventListener(
        "click",
        openAIHelp
      );

  }


  /* =========================================================
     LOAD MATERIALS
     ========================================================= */

  async function loadMaterials(
    category
  ) {

    const container =
      $("#educationResources");

    if (!container) return;

    container.innerHTML =
      loadingHTML();

    if (!db) {

      container.innerHTML =
        emptyHTML(
          "Resources are ready",
          "Connect Supabase to load learning materials."
        );

      return;
    }

    try {

      let query =
        db
          .from("materials")
          .select("*")
          .eq(
            "is_active",
            true
          )
          .eq(
            "class_id",
            currentClass.id
          )
          .eq(
            "subject_id",
            currentSubject.id
          )
          .eq(
            "category",
            category
          )
          .order(
            "created_at",
            {
              ascending: false
            }
          );

      const { data, error } =
        await query;

      if (error) {

        console.error(error);

        container.innerHTML =
          emptyHTML(
            "Could not load resources",
            "Please try again."
          );

        return;
      }

      renderMaterials(
        data || [],
        category
      );

    } catch (error) {

      console.error(error);

      container.innerHTML =
        emptyHTML(
          "Something went wrong",
          "Please try again."
        );

    }
  }


  /* =========================================================
     RENDER MATERIALS
     ========================================================= */

  function renderMaterials(
    materials,
    category
  ) {

    const container =
      $("#educationResources");

    if (!container) return;

    const categoryNames = {

      notes: "Notes",

      sheets: "Sheets",

      questions: "Question Bank",

      videos: "Videos",

      other: "Other Resources"

    };

    if (!materials.length) {

      container.innerHTML = `

        <div style="margin-top:24px">

          ${emptyHTML(
            "No resources yet",
            `${categoryNames[category] || "Resources"} for this subject have not been added yet.`
          )}

        </div>

      `;

      return;
    }

    container.innerHTML = `

      <div style="margin-top:30px">

        <h3>
          ${escapeHTML(
            categoryNames[category] ||
            "Resources"
          )}
        </h3>

        <div class="resource-list">

          ${materials
            .map(item => {

              const url =
                item.file_url ||
                item.external_url ||
                "#";

              return `

                <article
                  class="resource-item"
                >

                  <div
                    class="resource-item-info"
                  >

                    <strong>
                      ${escapeHTML(
                        item.title
                      )}
                    </strong>

                    <span>
                      ${escapeHTML(
                        item.description ||
                        "TSF learning resource"
                      )}
                    </span>

                  </div>

                  ${
                    url !== "#"
                      ? `

                        <a
                          class="resource-open"
                          href="${escapeHTML(
                            url
                          )}"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open →
                        </a>

                      `
                      : ""
                  }

                </article>

              `;

            })
            .join("")}

        </div>

      </div>

    `;

  }


  /* =========================================================
     AI HELP PLACEHOLDER
     ========================================================= */

  function openAIHelp() {

    alert(
      "🤖 TSF AI Help is being built. Soon you will be able to ask questions, upload a photo of a problem and receive a step-by-step explanation."
    );

  }


  /* =========================================================
     PUBLIC API
     ========================================================= */

  window.TSFEducation = {

    openClass,

    openSubject,

    loadClasses,

    loadMaterials,

    openAIHelp

  };


  /* =========================================================
     INIT
     ========================================================= */

  async function init() {

    addEducationStyles();

    createEducationSection();

    await loadClasses();

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }

})();