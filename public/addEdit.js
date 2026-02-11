import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showProjects } from "./projects.js";

let addEditDiv = null;
let title = null;
let description = null;
let status = null;
let addingProject = null;
let editCancel = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-project");
  title = document.getElementById("title");
  description = document.getElementById("description");
  status = document.getElementById("status");
  addingProject = document.getElementById("adding-project");
  editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingProject) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/projects";

        if (addingProject.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/projects/${addEditDiv.dataset.id}`;
        }

        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: title.value,
              description: description.value,
              status: status.value,
            }),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
              message.textContent = "The project entry was updated.";
            } else {
              message.textContent = "The project entry was created.";
            }

            title.value = "";
            description.value = "";
            status.value = "active"; // default value from your schema
            showProjects();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showProjects();
      }
    }
  });
};

export const showAddEdit = async (projectId) => {
  if (!projectId) {
    title.value = "";
    description.value = "";
    status.value = "active";
    addingProject.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/projects/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        title.value = data.project.title;
        description.value = data.project.description || "";
        status.value = data.project.status;
        addingProject.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = projectId;

        setDiv(addEditDiv);
      } else {
        message.textContent = "The project entry was not found";
        showProjects();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showProjects();
    }

    enableInput(true);
  }
};
