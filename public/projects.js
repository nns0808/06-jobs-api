import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let projectsDiv = null;
let projectsTable = null;
let projectsTableHeader = null;

export const handleProjects = () => {
  projectsDiv = document.getElementById("projects");
  const logoff = document.getElementById("logoff");
  const addProject = document.getElementById("add-project");
  projectsTable = document.getElementById("projects-table");
  projectsTableHeader = document.getElementById("projects-table-header");

  projectsDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addProject) {
        showAddEdit(null);
      } else if (e.target === logoff) {
        setToken(null);

        message.textContent = "You have been logged off.";

        projectsTable.replaceChildren(projectsTableHeader);

        showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      } 
      // Delete
      else if (e.target.classList.contains("deleteButton")) {
        enableInput(false);
        message.textContent = "";

        try {
          const response = await fetch(`/api/v1/projects/${e.target.dataset.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();
          if (response.status === 200) {
            message.textContent = data.msg || "The project was deleted.";
            showProjects(); // Refresh list after deletion
          } else {
            message.textContent = data.msg || "Failed to delete the project.";
          }
        } catch (err) {
          console.error(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      }
    }
  });
};

export const showProjects = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/projects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [projectsTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        projectsTable.replaceChildren(...children); // clear for safety
      } else {
        for (let i = 0; i < data.projects.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<td><button type="button" class="editButton" data-id=${data.projects[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.projects[i]._id}>delete</button></td>`;
          let rowHTML = `
            <td>${data.projects[i].title}</td>
            <td>${data.projects[i].description || ''}</td>
            <td>${data.projects[i].status}</td>
            <div>${editButton}${deleteButton}</div>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        projectsTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(projectsDiv);
};
