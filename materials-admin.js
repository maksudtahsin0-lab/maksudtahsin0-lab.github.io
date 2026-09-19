/* =========================================================
   TSF SUPER ADMIN — MATERIALS MANAGER
   Class → Subject → Notes / Sheets / Questions / Videos / Other
   ========================================================= */

(() => {
  "use strict";

  let selectedClassId = "";
  let selectedSubjectId = "";

  function $(id) {
    return document.getElementById(id);
  }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getDB() {
    return window.TSFAdminDB || null;
  }

  /* =========================================================
     CREATE MATERIALS SECTION
     ========================================================= */

  function createMaterialsSection() {

    if ($("materialsSection")) return;

    const main = document.querySelector(".main");

    if (!main) return;

    const section = document.createElement("section");

    section.id = "materialsSection";
    section.className = "hidden";

    section.innerHTML = `

      <h1 class="page-title">
        Learning Materials
      </h1>

      <p class="page-subtitle">
        Publish notes, sheets, question banks, videos
        and other learning resources.
      </p>

      <div class="manager">

        <h2>➕ Add Learning Resource</h2>

        <div class="form-grid">

          <div>
            <label>Class</label>

            <select id="materialClass">
              <option value="">
                Select Class
              </option>
            </select>
          </div>

          <div>
            <label>Subject</label>

            <select id="materialSubject">
              <option value="">
                Select Subject
              </option>
            </select>
          </div>

          <div>
            <label>Resource Type</label>

            <select id="materialCategory">

              <option value="notes">
                📚 Notes
              </option>

              <option value="sheets">
                📝 Sheets
              </option>

              <option value="questions">
                ❓ Question Bank
              </option>

              <option value="videos">
                🎥 Videos
              </option>

              <option value="other">
                📦 Other Resources
              </option>

            </select>
          </div>

          <div>
            <label>Title</label>

            <input
              id="materialTitle"
              placeholder="Example: Class 6 Math Notes"
            >
          </div>

          <div class="full">

            <label>Description</label>

            <textarea
              id="materialDescription"
              placeholder="Short description of this resource"
            ></textarea>

          </div>

          <div class="full">

            <label>
              Resource URL
            </label>

            <input
              id="materialURL"
              type="url"
              placeholder="PDF / Video / Document URL"
            >

            <small>
              আপাতত এখানে PDF বা Video-এর public link দিতে পারবে।
            </small>

          </div>

        </div>

        <label
          style="
            display:flex;
            align-items:center;
            gap:10px;
            margin:10px 0 18px;
          "
        >

          <input
            id="materialFeatured"
            type="checkbox"
            style="width:auto;margin:0"
          >

          ⭐ Featured Resource

        </label>

        <label
          style="
            display:flex;
            align-items:center;
            gap:10px;
            margin-bottom:18px;
          "
        >

          <input
            id="materialActive"
            type="checkbox"
            checked
            style="width:auto;margin:0"
          >

          👁️ Publish immediately

        </label>

        <button
          class="primary"
          id="addMaterialButton"
        >
          + Publish Resource
        </button>

        <div
          id="materialStatus"
          class="status"
        ></div>

      </div>


      <div class="manager">

        <div class="manager-header">

          <div>

            <h2>
              Published Resources
            </h2>

            <p
              style="
                color:#687386;
                margin-top:6px;
              "
            >
              Manage resources for the selected
              class and subject.
            </p>

          </div>

        </div>

        <div
          id="materialList"
          class="list"
        >
          Select a class and subject.
        </div>

      </div>

    `;

    main.appendChild(section);

    $("materialClass")
      .addEventListener(
        "change",
        async e => {

          selectedClassId =
            e.target.value;

          await loadMaterialSubjects();

        }
      );

    $("materialSubject")
      .addEventListener(
        "change",
        async e => {

          selectedSubjectId =
            e.target.value;

          await loadMaterials();

        }
      );

    $("materialCategory")
      .addEventListener(
        "change",
        loadMaterials
      );

    $("addMaterialButton")
      .addEventListener(
        "click",
        addMaterial
      );

  }


  /* =========================================================
     ADD NAVIGATION BUTTON
     ========================================================= */

  function addNavigation() {

    const sidebar =
      document.querySelector(".sidebar");

    if (!sidebar) return;

    if ($("materialsNavButton")) return;

    const button =
      document.createElement("button");

    button.id =
      "materialsNavButton";

    button.className =
      "nav-btn";

    button.textContent =
      "📂 Learning Materials";

    button.addEventListener(
      "click",
      () => {

        if (typeof window.showSection === "function") {
          window.showSection("materials");
        }

        document
          .querySelectorAll(
            "main > section"
          )
          .forEach(section => {

            if (
              section.id ===
              "materialsSection"
            ) {

              section.classList.remove(
                "hidden"
              );

            }

          });

        loadMaterialClasses();

      }
    );

    sidebar.appendChild(button);

  }


  /* =========================================================
     LOAD CLASSES
     ========================================================= */

  async function loadMaterialClasses() {

    const db = getDB();

    if (!db) return;

    const select =
      $("materialClass");

    if (!select) return;

    const { data, error } =
      await db
        .from("classes")
        .select("id,name,class_number")
        .eq("is_active", true)
        .order("class_number");

    if (error) {

      console.error(error);

      select.innerHTML =
        `<option value="">
          Failed to load classes
        </option>`;

      return;
    }

    select.innerHTML =
      `<option value="">
        Select Class
      </option>` +

      (data || [])
        .map(item => `

          <option value="${esc(item.id)}">
            ${esc(item.name)}
          </option>

        `)
        .join("");

  }


  /* =========================================================
     LOAD SUBJECTS
     ========================================================= */

  async function loadMaterialSubjects() {

    const db = getDB();

    const subject =
      $("materialSubject");

    if (!db || !subject) return;

    selectedSubjectId = "";

    subject.innerHTML =
      `<option value="">
        Loading subjects...
      </option>`;

    if (!selectedClassId) {

      subject.innerHTML =
        `<option value="">
          Select Subject
        </option>`;

      $("materialList").innerHTML =
        "Select a class and subject.";

      return;
    }

    const { data, error } =
      await db
        .from("subjects")
        .select("id,name")
        .eq(
          "class_id",
          selectedClassId
        )
        .eq(
          "is_active",
          true
        )
        .order("display_order");

    if (error) {

      console.error(error);

      subject.innerHTML =
        `<option value="">
          Failed to load subjects
        </option>`;

      return;
    }

    subject.innerHTML =
      `<option value="">
        Select Subject
      </option>` +

      (data || [])
        .map(item => `

          <option value="${esc(item.id)}">
            ${esc(item.name)}
          </option>

        `)
        .join("");

    $("materialList").innerHTML =
      "Select a subject to see resources.";

  }


  /* =========================================================
     ADD MATERIAL
     ========================================================= */

  async function addMaterial() {

    const db = getDB();

    if (!db) {

      showStatus(
        "Supabase connection not available.",
        true
      );

      return;
    }

    const classId =
      $("materialClass").value;

    const subjectId =
      $("materialSubject").value;

    const category =
      $("materialCategory").value;

    const title =
      $("materialTitle")
        .value
        .trim();

    const description =
      $("materialDescription")
        .value
        .trim();

    const url =
      $("materialURL")
        .value
        .trim();

    const featured =
      $("materialFeatured")
        .checked;

    const active =
      $("materialActive")
        .checked;

    if (
      !classId ||
      !subjectId ||
      !title
    ) {

      showStatus(
        "Class, Subject and Title are required.",
        true
      );

      return;
    }

    if (!url) {

      showStatus(
        "Please add the resource URL.",
        true
      );

      return;
    }

    const button =
      $("addMaterialButton");

    button.disabled = true;

    button.textContent =
      "Publishing...";

    try {

      const { error } =
        await db
          .from("materials")
          .insert({

            class_id: classId,

            subject_id: subjectId,

            category: category,

            title: title,

            description: description,

            external_url: url,

            is_featured: featured,

            is_active: active

          });

      if (error) {

        console.error(error);

        throw error;

      }

      showStatus(
        "Resource published successfully."
      );

      $("materialTitle").value = "";

      $("materialDescription").value = "";

      $("materialURL").value = "";

      $("materialFeatured").checked =
        false;

      await loadMaterials();

    } catch (error) {

      console.error(error);

      showStatus(
        error.message ||
        "Failed to publish resource.",
        true
      );

    } finally {

      button.disabled = false;

      button.textContent =
        "+ Publish Resource";

    }

  }


  /* =========================================================
     LOAD MATERIALS
     ========================================================= */

  async function loadMaterials() {

    const db = getDB();

    const list =
      $("materialList");

    if (!db || !list) return;

    if (
      !selectedClassId ||
      !selectedSubjectId
    ) {

      list.innerHTML =
        "Select a class and subject.";

      return;
    }

    list.innerHTML =
      "Loading resources...";

    let query =
      db
        .from("materials")
        .select("*")
        .eq(
          "class_id",
          selectedClassId
        )
        .eq(
          "subject_id",
          selectedSubjectId
        )
        .order(
          "created_at",
          {
            ascending:false
          }
        );

    const category =
      $("materialCategory")?.value;

    if (category) {

      query =
        query.eq(
          "category",
          category
        );

    }

    const { data, error } =
      await query;

    if (error) {

      console.error(error);

      list.innerHTML =
        `<div class="error">
          ${esc(error.message)}
        </div>`;

      return;
    }

    if (!data || !data.length) {

      list.innerHTML =
        `<div
          style="
            padding:30px;
            text-align:center;
            color:#687386;
          "
        >
          No resources added yet.
        </div>`;

      return;
    }

    list.innerHTML =
      data
        .map(renderMaterial)
        .join("");

    list
      .querySelectorAll(
        "[data-delete-material]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            deleteMaterial(
              button.dataset.deleteMaterial
            );

          }
        );

      });

  }


  /* =========================================================
     RENDER MATERIAL
     ========================================================= */

  function renderMaterial(item) {

    const categories = {

      notes: "📚 Notes",

      sheets: "📝 Sheets",

      questions: "❓ Question Bank",

      videos: "🎥 Videos",

      other: "📦 Other Resources"

    };

    const url =
      item.file_url ||
      item.external_url ||
      "";

    return `

      <div class="item">

        <div>

          <div class="item-title">

            ${esc(item.title)}

            ${
              item.is_featured
                ? " ⭐"
                : ""
            }

          </div>

          <div class="item-meta">

            ${esc(
              categories[item.category] ||
              item.category ||
              "Resource"
            )}

            •

            ${
              item.is_active
                ? "Published"
                : "Unpublished"
            }

          </div>

          ${
            item.description
              ? `
                <div
                  style="
                    margin-top:7px;
                    color:#687386;
                    font-size:14px;
                  "
                >
                  ${esc(
                    item.description
                  )}
                </div>
              `
              : ""
          }

        </div>

        <div class="actions">

          ${
            url
              ? `
                <a
                  href="${esc(url)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="secondary"
                  style="
                    text-decoration:none;
                    padding:10px 13px;
                    border-radius:10px;
                  "
                >
                  Open
                </a>
              `
              : ""
          }

          <button
            class="danger"
            data-delete-material="${esc(item.id)}"
          >
            Delete
          </button>

        </div>

      </div>

    `;

  }


  /* =========================================================
     DELETE MATERIAL
     ========================================================= */

  async function deleteMaterial(id) {

    if (
      !confirm(
        "Delete this learning resource?"
      )
    ) return;

    const db = getDB();

    if (!db) return;

    try {

      const { error } =
        await db
          .from("materials")
          .delete()
          .eq(
            "id",
            id
          );

      if (error) {

        throw error;

      }

      await loadMaterials();

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Failed to delete resource."
      );

    }

  }


  /* =========================================================
     STATUS
     ========================================================= */

  function showStatus(
    message,
    isError = false
  ) {

    const element =
      $("materialStatus");

    if (!element) return;

    element.textContent =
      message;

    element.className =
      "status " +
      (
        isError
          ? "error"
          : "success"
      );

  }


  /* =========================================================
     PUBLIC
     ========================================================= */

  window.TSFMaterialsAdmin = {

    init() {

      createMaterialsSection();

      addNavigation();

      loadMaterialClasses();

    },

    loadMaterials

  };


  /* =========================================================
     START
     ========================================================= */

  function start() {

    createMaterialsSection();

    addNavigation();

  }

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      start
    );

  } else {

    start();

  }

})();