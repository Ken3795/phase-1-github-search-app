document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const repoList = document.getElementById("repos-list");
    const toggleButton = document.getElementById("toggle-search");
    
    let searchType = "user"; // Toggle between "user" and "repo"
  
    // Toggle search type
    toggleButton.addEventListener("click", () => {
      searchType = searchType === "user" ? "repo" : "user";
      toggleButton.textContent = `Search by: ${searchType === "user" ? "Repositories" : "Users"}`;
    });
  
    // Handle form submission
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        if (searchType === "user") {
          searchUsers(query);
        } else {
          searchRepositories(query);
        }
      }
      searchInput.value = "";
    });
  
    // Fetch and display users matching the search query
    function searchUsers(query) {
      const url = `https://api.github.com/search/users?q=${query}`;
      fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          userList.innerHTML = ""; // Clear previous results
          repoList.innerHTML = ""; // Clear repository list
          data.items.forEach((user) => renderUser(user));
        })
        .catch((error) => console.error("Error fetching users:", error));
    }
  
    // Render a user card to the DOM
    function renderUser(user) {
      const userCard = document.createElement("li");
      userCard.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}'s avatar" width="50" />
        <a href="${user.html_url}" target="_blank">${user.login}</a>
        <button class="view-repos" data-username="${user.login}">View Repositories</button>
      `;
      userList.appendChild(userCard);
  
      // Add event listener for viewing repositories
      const repoButton = userCard.querySelector(".view-repos");
      repoButton.addEventListener("click", () => fetchUserRepos(user.login));
    }
  
    // Fetch and display repositories for a specific user
    function fetchUserRepos(username) {
      const url = `https://api.github.com/users/${username}/repos`;
      fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      })
        .then((response) => response.json())
        .then((repos) => {
          repoList.innerHTML = ""; // Clear previous repositories
          repos.forEach((repo) => renderRepo(repo));
        })
        .catch((error) => console.error("Error fetching repositories:", error));
    }
  
    // Render a repository to the DOM
    function renderRepo(repo) {
      const repoItem = document.createElement("li");
      repoItem.innerHTML = `
        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      `;
      repoList.appendChild(repoItem);
    }
  
    // Fetch and display repositories matching the search query
    function searchRepositories(query) {
      const url = `https://api.github.com/search/repositories?q=${query}`;
      fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          userList.innerHTML = ""; // Clear user list
          repoList.innerHTML = ""; // Clear previous results
          data.items.forEach((repo) => renderRepo(repo));
        })
        .catch((error) => console.error("Error fetching repositories:", error));
    }
  });
  