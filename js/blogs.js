const API_URL =
  "https://elister-2.staging.everydayhost.net/wp-json/wp/v2/posts";
const POSTS_PER_PAGE = 6;

let allPosts = [];
let currentPage = 1;
let isLoading = false;

async function fetchPosts(page = 1, perPage = POSTS_PER_PAGE) {
  try {
    isLoading = true;
    showLoadingSpinner();

    const url = `${API_URL}?_embed&page=${page}&per_page=${perPage}&orderby=date&order=desc`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const posts = await response.json();
    const totalPosts = response.headers.get("X-WP-Total");
    const totalPages = response.headers.get("X-WP-TotalPages");

    return {
      posts: posts,
      totalPosts: parseInt(totalPosts),
      totalPages: parseInt(totalPages),
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    showErrorMessage();
    return null;
  } finally {
    isLoading = false;
    hideLoadingSpinner();
  }
}

async function fetchSinglePost(postId) {
  try {
    showLoadingSpinner();
    const url = `${API_URL}/${postId}?_embed`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const post = await response.json();
    return post;
  } catch (error) {
    console.error("Error fetching single post:", error);
    return null;
  } finally {
    hideLoadingSpinner();
  }
}

function getExcerpt(content, maxLength = 150) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  const text = tempDiv.textContent || tempDiv.innerText || "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

function getFeaturedImage(post) {
  if (
    post._embedded &&
    post._embedded["wp:featuredmedia"] &&
    post._embedded["wp:featuredmedia"][0]
  ) {
    const media = post._embedded["wp:featuredmedia"][0];
    return media.source_url || media.media_details?.sizes?.medium?.source_url;
  }

  if (post.featured_media_url) {
    return post.featured_media_url;
  }

  return "/assets/images/blog-placeholder.webp";
}

function getCategories(post) {
  const categories = [];
  if (post._embedded && post._embedded["wp:term"]) {
    post._embedded["wp:term"].forEach((termArray) => {
      termArray.forEach((term) => {
        if (term.taxonomy === "category") {
          categories.push(term.name);
        }
      });
    });
  }
  return categories;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function createBlogCard(post) {
  const imageUrl = getFeaturedImage(post);
  const categories = getCategories(post);
  const excerpt = getExcerpt(
    post.excerpt?.rendered || post.content?.rendered || "",
    120,
  );
  const date = formatDate(post.date);

  return `
        <article class="blog-card" data-post-id="${post.id}">
            <div class="blog-card-image">
                <img src="${imageUrl}" alt="${post.title.rendered}" loading="lazy">
                ${categories.length > 0 ? `<div class="blog-category">${categories[0]}</div>` : ""}
            </div>
            <div class="blog-card-content">
                <div class="blog-meta">
                    <span class="blog-date">
                        <i class="far fa-calendar-alt"></i> ${date}
                    </span>
                    <span class="blog-read-time">
                        <i class="far fa-clock"></i> ${Math.ceil(excerpt.split(" ").length / 200)} min read
                    </span>
                </div>
                <h3 class="blog-title">${post.title.rendered}</h3>
                <p class="blog-excerpt">${excerpt}</p>
                <a href="/blog-post.html?id=${post.id}" class="blog-read-more">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `;
}

function renderPosts(posts, container) {
  if (!posts || posts.length === 0) {
    container.innerHTML = '<div class="no-posts">No blog posts found.</div>';
    return;
  }

  const postsHTML = posts.map((post) => createBlogCard(post)).join("");
  container.innerHTML = postsHTML;

  document.querySelectorAll(".blog-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".blog-read-more")) {
        const postId = card.dataset.postId;
        window.location.href = `/blog-post.html?id=${postId}`;
      }
    });
  });
}

async function loadMorePosts() {
  if (isLoading) return;

  currentPage++;
  const result = await fetchPosts(currentPage, POSTS_PER_PAGE);

  if (result && result.posts && result.posts.length > 0) {
    const container = document.querySelector(".blogs-grid");
    const newPostsHTML = result.posts
      .map((post) => createBlogCard(post))
      .join("");
    container.insertAdjacentHTML("beforeend", newPostsHTML);

    if (currentPage >= result.totalPages) {
      const loadMoreBtn = document.querySelector(".load-more-btn");
      if (loadMoreBtn) {
        loadMoreBtn.style.display = "none";
      }
    }
  }
}

function setupInfiniteScroll() {
  const loadMoreBtn = document.createElement("button");
  loadMoreBtn.className = "load-more-btn";
  loadMoreBtn.textContent = "Load More Posts";
  loadMoreBtn.style.display = "none";

  const container = document.querySelector(".blogs-grid");
  container.parentNode.insertBefore(loadMoreBtn, container.nextSibling);

  loadMoreBtn.addEventListener("click", loadMorePosts);

  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const loadMoreBtn = document.querySelector(".load-more-btn");
      if (!loadMoreBtn || loadMoreBtn.style.display === "none") return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 500;

      if (scrollPosition >= threshold && !isLoading) {
        loadMorePosts();
      }
    }, 200);
  });
}

function showLoadingSpinner() {
  let spinner = document.querySelector(".blog-loader");
  if (!spinner) {
    spinner = document.createElement("div");
    spinner.className = "blog-loader";
    spinner.innerHTML = '<div class="spinner"></div>';
    const container = document.querySelector(".blogs-grid");
    if (container) container.parentNode.insertBefore(spinner, container);
  }
  spinner.style.display = "flex";
}

function hideLoadingSpinner() {
  const spinner = document.querySelector(".blog-loader");
  if (spinner) {
    spinner.style.display = "none";
  }
}

function showErrorMessage() {
  const container = document.querySelector(".blogs-grid");
  if (container) {
    container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Unable to load blog posts</h3>
                <p>Please check your connection and try again.</p>
                <button onclick="location.reload()" class="retry-btn">Retry</button>
            </div>
        `;
  }
}

async function initBlogPage() {
  const blogContainer = document.querySelector(".blogs-grid");
  if (!blogContainer) return;

  const result = await fetchPosts(1, POSTS_PER_PAGE);

  if (result && result.posts) {
    allPosts = result.posts;
    renderPosts(allPosts, blogContainer);

    if (result.totalPages > 1) {
      const loadMoreBtn = document.querySelector(".load-more-btn");
      if (loadMoreBtn) {
        loadMoreBtn.style.display = "block";
      }
    }
  }
}

async function initSinglePostPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

  if (!postId) {
    window.location.href = "/blog.html";
    return;
  }

  showSinglePostLoader();

  const post = await fetchSinglePost(postId);

  if (!post) {
    hideSinglePostLoader();
    document.querySelector(".blog-post-container").innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Post not found</h3>
                <a href="/blog.html" class="back-to-blog">Back to Blog</a>
            </div>
        `;
    return;
  }

  hideSinglePostLoader();
  renderSinglePost(post);
}

function showSinglePostLoader() {
  const container = document.querySelector(".blog-post-container");
  if (container) {
    container.innerHTML = `
            <div class="single-post-loader">
                <div class="spinner"></div>
            </div>
        `;
  }
}

function hideSinglePostLoader() {
  const loader = document.querySelector(".single-post-loader");
  if (loader) {
    loader.remove();
  }
}

function renderSinglePost(post) {
  const imageUrl = getFeaturedImage(post);
  const categories = getCategories(post);
  const date = formatDate(post.date);
  const content = post.content?.rendered || "<p>Content not available</p>";

  const container = document.querySelector(".blog-post-container");
  if (!container) return;

  container.innerHTML = `
        <article class="blog-post">
            <div class="blog-post-header">
                <div class="blog-post-categories">
                    ${categories.map((cat) => `<span class="post-category">${cat}</span>`).join("")}
                </div>
                <h1 class="blog-post-title">${post.title.rendered}</h1>
                <div class="blog-post-meta">
                    <span><i class="far fa-calendar-alt"></i> ${date}</span>
                    <span><i class="far fa-clock"></i> ${Math.ceil(content.split(" ").length / 200)} min read</span>
                </div>
            </div>
            
            ${
              imageUrl
                ? `
                <div class="blog-post-image">
                    <img src="${imageUrl}" alt="${post.title.rendered}">
                </div>
            `
                : ""
            }
            
            <div class="blog-post-content">
                ${content}
            </div>
            
            <div class="blog-post-footer">
                <div class="post-share">
                    <span>Share this post:</span>
                    <a href="#" onclick="sharePost('facebook', '${post.link}')"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" onclick="sharePost('twitter', '${post.link}', '${post.title.rendered}')"><i class="fab fa-twitter"></i></a>
                    <a href="#" onclick="sharePost('linkedin', '${post.link}')"><i class="fab fa-linkedin-in"></i></a>
                </div>
                <a href="/blog.html" class="back-to-blog">
                    <i class="fas fa-arrow-left"></i> Back to Blog
                </a>
            </div>
        </article>
    `;

  document.title = `${post.title.rendered} | Elitser Technologies`;
}

window.sharePost = (platform, url, title = "") => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  let shareUrl = "";
  switch (platform) {
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      break;
    case "twitter":
      shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
      break;
    case "linkedin":
      shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`;
      break;
  }

  if (shareUrl) {
    window.open(shareUrl, "_blank", "width=600,height=400");
  }
  return false;
};

if (document.querySelector(".blogs-grid")) {
  document.addEventListener("DOMContentLoaded", () => {
    initBlogPage();
    setupInfiniteScroll();
  });
} else if (document.querySelector(".blog-post-container")) {
  document.addEventListener("DOMContentLoaded", initSinglePostPage);
}
