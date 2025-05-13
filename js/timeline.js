document.addEventListener("DOMContentLoaded", () => {
  updateLastUpdated();

  const container = document.getElementById("timeline-container");
  const preview = document.getElementById("timeline-preview");
  let activeItem = null;

  timelineData.sort((a, b) => new Date(a.date) - new Date(b.date));

  timelineData.forEach(event => {
    const item = document.createElement("div");
    item.className = "timeline-item";

    const dateObj = new Date(event.date);
    const humanDate = dateObj.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

    // Generate sources HTML
    const sourcesHtml = event.sources.map(source =>
      `<a class="timeline-source" href="${source.url}" target="_blank">${source.title}</a>`
    ).join("<br>");

    item.innerHTML = `
      <div class="timeline-header">
        <div class="timeline-title">${event.title}</div>
        <div class="timeline-date">${humanDate}</div>
      </div>
      <div class="timeline-details mobile-only">
        <div class="description-html">${event.description}</div>
        ${sourcesHtml}
      </div>
    `;

    item.addEventListener("click", () => {
      if (activeItem) {
        activeItem.classList.remove("active");
      }

      item.classList.add("active");
      activeItem = item;

      if (window.innerWidth > 768) {
        preview.innerHTML = `
          <h2>${event.title}</h2>
          <div class="preview-date">${humanDate}</div>
          <p>${event.description}</p>
          ${sourcesHtml}
        `;
        preview.classList.add("visible");

        // Trigger Twitter embed rendering
        if (window.twttr && twttr.widgets && typeof twttr.widgets.load === "function") {
          twttr.widgets.load(preview);
        }
      } else {
        const details = item.querySelector(".timeline-details");
        details.style.display = details.style.display === "block" ? "none" : "block";
      }
    });

    container.appendChild(item);
  });
});

function updateLastUpdated() {
  const lastUpdatedElement = document.getElementById('last-updated');

  if (lastUpdatedElement) {
    fetch('https://api.github.com/repos/docling-project/docling/commits')
      .then(response => response.json())
      .then(commits => {
        if (commits && commits.length) {
          const lastCommit = commits[0].commit.committer.date;
          const date = new Date(lastCommit);
          lastUpdatedElement.textContent = 'Last updated: ' + date.toLocaleDateString();
        }
      })
      .catch(() => {
        lastUpdatedElement.textContent = 'Last updated: error fetching date';
      });
  }
}

