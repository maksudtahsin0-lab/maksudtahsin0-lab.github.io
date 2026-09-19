(() => {
  const db = window.TSFAdminDB;

  if (!db) {
    console.error("TSFAdminDB not found.");
    return;
  }

  const SECTION_ID = "materialsSection";

  function createSection() {
    if (document.getElementById(SECTION_ID)) return;

    const section = document.createElement("section");
    section.id = SECTION_ID;
    section.className = "hidden";

    section.innerHTML = `
      <div style="
        background:#fff;
        padding:24px;
        border-radius:18px;
        box-shadow:0 8px 30px rgba(0,0,0,.08);
        margin-top:20px;
      ">
        <h2>📂 Learning Materials</h2>
        <p style="color:#666">
          Upload PDF, DOC, DOCX, PPT, PPTX, images, videos and other learning resources.
        </p>

        <div style="display:grid;gap:14px;margin-top:20px">

          <select id="matClass">
            <option value="">Select Class</option>
          </select>

          <select id="matSubject">
            <option value="">Select Subject</option>
          </select>

          <select id="matCategory">
            <option value="notes">📘 Notes</option>
            <option value="sheets">📄 Sheets</option>
            <option value="questions">📝 Question Bank</option>
            <option value="videos">🎥 Videos</option>
            <option value="other">📁 Other Resources</option>
          </select>

          <input
            id="matTitle"
            type="text"
            placeholder="Resource title"
          >

          <textarea
            id="matDescription"
            placeholder="Description"
            rows="4"
          ></textarea>

          <input
            id="matFile"
            type="file"
            accept="
              .pdf,
              .doc,
              .docx,
              .ppt,
              .pptx,
              .jpg,
              .jpeg,
              .png,
              .webp,
              .mp4,
              .webm,
              .mp3,
              .wav
            "
          >

          <label>
            <input id="matFeatured" type="checkbox">
            ⭐ Featured Resource
          </label>

          <button
            id="matUploadBtn"
            type="button"
            style="
              padding:14px;
              border:0;
              border-radius:12px;
              background:#111827;
              color:white;
              font-size:16px;
              cursor:pointer;
            "
          >
            ⬆️ Upload Material
          </button>

          <div id="matStatus"></div>

        </div>

        <hr style="margin:30px 0">

        <h3>📚 Uploaded Materials</h3>
        <div id="materialsList">Loading...</div>
      </div>
    `;

    const main = document.querySelector(".main");

    if (main) {
      main.appendChild(section);
    } else {
      document.body.appendChild(section);
    }
  }

  function addNavigation() {
    const sidebar = document.querySelector(".sidebar");

    if (!sidebar) return;

    if (document.getElementById("materialsNavBtn")) return;

    const button = document.createElement("button");

    button.id = "materialsNavBtn";
    button.type = "button";
    button.innerHTML = "📂 Learning Materials";

    button.onclick = () => {
      document.querySelectorAll(".main > section").forEach(s => {
        s.classList.add("hidden");
      });

      const section = document.getElementById(SECTION_ID);

      if (section) {
        section.classList.remove("hidden");
      }

      loadClasses();
      loadMaterials();
    };

    sidebar.appendChild(button);
  }

  async function loadClasses() {
    const select = document.getElementById("matClass");

    if (!select) return;

    const { data, error } = await db
      .from("classes")
      .select("id,name,class_number")
      .eq("is_active", true)
      .order("display_order");

    if (error) {
      console.error(error);
      return;
    }

    select.innerHTML =
      `<option value="">Select Class</option>` +
      (data || []).map(c => `
        <option value="${c.id}">
          ${escapeHtml(c.name)}
        </option>
      `).join("");

    select.onchange = () => loadSubjects(select.value);
  }

  async function loadSubjects(classId) {
    const select = document.getElementById("matSubject");

    if (!select) return;

    select.innerHTML =
      `<option value="">Select Subject</option>`;

    if (!classId) return;

    const { data, error } = await db
      .from("subjects")
      .select("id,name")
      .eq("class_id", classId)
      .eq("is_active", true)
      .order("display_order");

    if (error) {
      console.error(error);
      return;
    }

    select.innerHTML +=
      (data || []).map(s => `
        <option value="${s.id}">
          ${escapeHtml(s.name)}
        </option>
      `).join("");
  }

  async function uploadMaterial() {
    const classId =
      document.getElementById("matClass").value;

    const subjectId =
      document.getElementById("matSubject").value;

    const category =
      document.getElementById("matCategory").value;

    const title =
      document.getElementById("matTitle").value.trim();

    const description =
      document.getElementById("matDescription").value.trim();

    const file =
      document.getElementById("matFile").files[0];

    const featured =
      document.getElementById("matFeatured").checked;

    const status =
      document.getElementById("matStatus");

    const button =
      document.getElementById("matUploadBtn");

    if (!classId) {
      status.innerHTML = "❌ Please select a class.";
      return;
    }

    if (!subjectId) {
      status.innerHTML = "❌ Please select a subject.";
      return;
    }

    if (!title) {
      status.innerHTML = "❌ Please enter a title.";
      return;
    }

    if (!file) {
      status.innerHTML = "❌ Please select a file.";
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      status.innerHTML =
        "❌ File must be smaller than 50 MB.";
      return;
    }

    button.disabled = true;
    button.innerText = "Uploading...";

    status.innerHTML =
      "⏳ Uploading material...";

    try {

      const safeName =
        file.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        );

      const path =
        `${classId}/${subjectId}/${category}/${Date.now()}-${safeName}`;

      const { error: uploadError } =
        await db.storage
          .from("tsf-materials")
          .upload(
            path,
            file,
            {
              cacheControl: "3600",
              upsert: false,
              contentType:
                file.type ||
                "application/octet-stream"
            }
          );

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicData } =
        db.storage
          .from("tsf-materials")
          .getPublicUrl(path);

      const fileUrl =
        publicData.publicUrl;

      const { error: dbError } =
        await db
          .from("materials")
          .insert({
            class_id: classId,
            subject_id: subjectId,
            category: category,
            title: title,
            description: description,
            file_url: fileUrl,
            file_type: file.type || null,
            file_size: file.size,
            is_free: true,
            is_active: true,
            is_featured: featured
          });

      if (dbError) {
        throw dbError;
      }

      status.innerHTML =
        "✅ Material uploaded successfully!";

      document.getElementById("matTitle").value = "";
      document.getElementById("matDescription").value = "";
      document.getElementById("matFile").value = "";
      document.getElementById("matFeatured").checked = false;

      await loadMaterials();

    } catch (error) {

      console.error(error);

      status.innerHTML =
        "❌ Upload failed: " +
        escapeHtml(error.message || "Unknown error");

    } finally {

      button.disabled = false;
      button.innerText = "⬆️ Upload Material";
    }
  }

  async function loadMaterials() {
    const list =
      document.getElementById("materialsList");

    if (!list) return;

    list.innerHTML = "Loading...";

    const { data, error } =
      await db
        .from("materials")
        .select(`
          id,
          title,
          description,
          category,
          file_url,
          file_type,
          file_size,
          is_featured,
          created_at
        `)
        .order("created_at", {
          ascending: false
        });

    if (error) {
      list.innerHTML =
        "❌ " + escapeHtml(error.message);
      return;
    }

    if (!data || data.length === 0) {
      list.innerHTML =
        "<p>No materials uploaded yet.</p>";
      return;
    }

    list.innerHTML =
      data.map(item => {

        const size =
          item.file_size
            ? formatFileSize(item.file_size)
            : "";

        return `
          <div style="
            border:1px solid #e5e7eb;
            padding:15px;
            border-radius:14px;
            margin-bottom:12px;
          ">

            <strong>
              ${escapeHtml(item.title)}
            </strong>

            ${item.is_featured ? " ⭐" : ""}

            <div style="color:#666;margin:5px 0">
              ${escapeHtml(item.category)}
              ${size ? " • " + size : ""}
            </div>

            <a
              href="${item.file_url}"
              target="_blank"
              rel="noopener"
            >
              🔗 Open Resource
            </a>

            <br>

            <button
              type="button"
              onclick="window.deleteTSFMaterial('${item.id}')"
              style="
                margin-top:8px;
                padding:7px 12px;
                border:0;
                border-radius:8px;
                cursor:pointer;
              "
            >
              🗑️ Delete
            </button>

          </div>
        `;
      }).join("");
  }

  window.deleteTSFMaterial = async function(id) {

    if (!confirm("Delete this material?")) {
      return;
    }

    const { error } =
      await db
        .from("materials")
        .delete()
        .eq("id", id);

    if (error) {
      alert("Delete failed: " + error.message);
      return;
    }

    loadMaterials();
  };

  function formatFileSize(bytes) {

    if (!bytes) return "";

    const units = [
      "B",
      "KB",
      "MB",
      "GB"
    ];

    let i = 0;
    let size = bytes;

    while (
      size >= 1024 &&
      i < units.length - 1
    ) {
      size /= 1024;
      i++;
    }

    return `${size.toFixed(1)} ${units[i]}`;
  }

  function escapeHtml(value) {

    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function init() {

    createSection();
    addNavigation();

    const uploadButton =
      document.getElementById("matUploadBtn");

    if (uploadButton) {
      uploadButton.onclick =
        uploadMaterial;
    }
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();