"use strict";

const mainBox = document.querySelector(".main");
const searchBar = document.querySelector(".search-bar-input");
const loadingBox = document.querySelector(".loading-box");

import * as MathHelper from "./math.js";

class Post {
  #randomUpvoteCount = Math.floor(Math.random() * 10000);
  #randomCommentCount = Math.floor(Math.random() * 500);
  constructor(id, url, sub, user, title, content) {
    this.sub = sub;
    this.user = user;
    this.title = title;
    this.content = content;
    this.id = id;
    this.url = url;
  }
  postTemplate() {
    const template = `<div class="post-box" data-post-id="${
      this.id
    }" data-post-url="${this.url}">
    <header class="post-header">
      <div class="sub-icon-box">
        <img src="img/logo.png" alt="Sub icon" class="icon sub-icon" />
      </div>
      <div class="sub-name-box">
        <p class="sub-name">${this.sub}</p>
      </div>
      <ul class="info-box">
        <li class="user-name">${this.user}</li>
        <li class="time">1h</li>
        <li class="other">i.redd.it</li>
      </ul>
      <div class="more-actions-box">
        <img
          src="img/dots.svg"
          alt="More actions"
          class="icon dots-icon"
        />
      </div>
    </header>
    <div class="title-box">${this.title}</div>
    <div class="content-box">
    ${this.content}
    </div>
    <div class="bottom-bar">
      <div class="reaction-box">
        <button class="btn upvote-btn">
          <img
            src="img/upvote.svg"
            alt="Upvote icon"
            class="icon upvote-icon"
          />
        </button>
        <p class="text vote-text">${
          this.#randomUpvoteCount <= 1
            ? "Vote"
            : this.#randomUpvoteCount < 1000
            ? this.#randomUpvoteCount
            : `${(this.#randomUpvoteCount / 1000).toFixed(1)}k`
        }</p>
        <button class="btn downvote-btn">
          <img
            src="img/downvote.svg"
            alt="Downvote icon"
            class="icon downvote-icon"
          />
        </button>
      </div>
      <button class="btn comment-btn">
        <img
          src="img/comments.svg"
          alt="Comment icon"
          class="icon comment-icon"
        />
        <p class="text comment-text">${this.#randomCommentCount}</p>
      </button>
      <button class="btn share-btn">
        <img
          src="img/share.svg"
          alt="Share icon"
          class="icon share-icon"
        />
        <p class="text share-text">Share</p>
      </button>
      <button class="btn award-btn">
        <img
          src="img/award.svg"
          alt="Award icon"
          class="icon award-icon"
        />
        <p class="text award-text">Award</p>
      </button>
    </div>
  </div>`;
    return template;
  }
}

class App {
  gifCount = 5;
  #defaultTags = ["meme", "memes"];
  tags = this.#defaultTags;
  #observers = [];
  constructor() {
    this.importGifsByTags(this.tags);

    searchBar.addEventListener("keydown", this._searchResult.bind(this));
    mainBox.addEventListener("click", this._setVote.bind(this));
    document
      .querySelectorAll(".tab")
      .forEach((tab) =>
        tab.addEventListener("click", (e) => e.preventDefault())
      );
    document
      .querySelector(".home-tab")
      .addEventListener("click", this._scrollToTop.bind(this));
  }
  // Creates post and inserts it into mainBox
  createPost(id, url, sub, user, title, content) {
    const post = new Post(id, url, sub, user, title, content);
    mainBox.insertAdjacentHTML("beforeend", post.postTemplate());
  }
  _searchResult(e) {
    if (e.key !== "Enter") return;
    // Enables loading screen
    this._setLoadingScreen(true);
    // Removes all gifs
    this._removeAllGifs();
    const tags = searchBar.value
      ? searchBar.value.split(" ")
      : this.#defaultTags;
    this.tags = tags;
    this.importGifsByTags(this.tags);
  }
  _removeAllGifs() {
    const posts = document.querySelectorAll(".post-box");
    posts.forEach((post) => {
      post.parentElement.removeChild(post);
    });
  }
  importGifsByTags(tags) {
    const gifFetches = this._getGifFetchesByTags(tags, this.gifCount);
    this._createNewGifPosts(gifFetches, this.gifCount);
  }
  // Gets fetches based on count and tags
  _getGifFetchesByTags(tags, count) {
    const fetches = [];
    for (let i = 0; i < count; i++) {
      const tag = tags[MathHelper.randomInt(tags.length)];
      fetches.push(
        fetch(
          `https://api.giphy.com/v1/gifs/random?api_key=8B00JY0BcYiUGxvMNkXcJJQFgCfCK7X8&tag=${tag}&rating=g`
        )
      );
    }
    // Returns unique fetches
    const uniqueFetches = new Set(fetches);
    return uniqueFetches;
  }
  async _createNewGifPosts(fetches, count) {
    Promise.all(fetches)
      .then((responses) => {
        responses.forEach(async (response, i) => {
          const data = await response.json();

          // Removes every gif/GIF and replaces By/BY with by
          let title = data.data.title
            .replace("GIF", "")
            .replace("gif", "")
            .replace("By", "by")
            .replace("BY", "by");
          // Slices title if it finds by in title
          title = title.indexOf("by")
            ? title.slice(0, title.indexOf("by") - 1)
            : title;

          // Creates new HTML file. Adds load-more-posts class when index is equal to post which is post number count / 2
          const html = `
          <video autoplay muted loop class='post-video ${
            i === count - 1 - Math.floor(count / 2) ? "load-more-posts" : ""
          }'>
          <source src='${
            data.data.images.preview.mp4
          }' type='video/mp4'></source></video>`;
          // Creates new post. If username is null then it'l use my nickname, else it'll use author's nickname
          this.createPost(
            data.data.id,
            data.data.url,
            "r/Giphy",
            data.data.username ? `u/${data.data.username}` : "u/RadzioGadzioPL",
            title ? title : "🗿🗿🗿",
            html
          );
          // Starts observing last post when loop is at the last index
          if (i >= count - 1) {
            this._observeLastPost();
          }
        });
      })
      .catch((err) => console.error(err))
      .finally(() => {
        // Disables loading screen
        this._setLoadingScreen(false);
      });
  }
  _observeLastPost() {
    const lastPost =
      mainBox.querySelectorAll(".load-more-posts")[
        mainBox.querySelectorAll(".load-more-posts").length - 1
      ];

    if (lastPost) {
      const This = this;

      // Unobserves previous observers which are currently observing something
      this.#observers.forEach((obs) => {
        if (obs.isObserving) {
          obs.observer.unobserve(obs.el);
          obs.isObserving = false;
        }
      });

      const lastPostObserver = new IntersectionObserver(
        function (e) {
          if (!e[0].isIntersecting) return;
          This.importGifsByTags(This.tags);
        },
        {
          root: null,
          threshold: 0,
        }
      );
      lastPostObserver.observe(lastPost);
      this.#observers.push({
        observer: lastPostObserver,
        el: lastPost,
        isObserving: true,
      });
    }
  }
  _setLoadingScreen(on) {
    if (on) loadingBox.classList.remove("hidden");
    else loadingBox.classList.add("hidden");
  }
  // Set's vote based on input
  _setVote(e) {
    const upvote = e.target.closest(".upvote-btn");
    const downvote = e.target.closest(".downvote-btn");
    // const post = e.target.closest(".post-box");
    if (upvote || downvote) {
      const reactionBox = e.target.closest(".reaction-box");

      if (upvote) {
        _reactToPost("upvote", reactionBox, upvote);
      }
      if (downvote) {
        _reactToPost("downvote", reactionBox, downvote);
      }
    }
    function _reactToPost(vote, reactionBox, btn) {
      let curVote = vote;

      // Checks if user clicks on button second time
      if (reactionBox.classList.contains(vote)) {
        curVote = "";
      }

      _removeAllClasses();

      // Adds class based on vote
      if (curVote) {
        reactionBox.classList.add(curVote);
        // Changes icon to filled
        btn.querySelector(".icon").src = `./img/${curVote}.fill.svg`;
      }

      function _removeAllClasses() {
        // Removes upvote/downvote class from reaction box
        reactionBox.classList.remove("upvote");
        reactionBox.classList.remove("downvote");

        // Changes icon back to unfilled
        reactionBox.querySelector(".upvote-btn").querySelector(".icon").src =
          "./img/upvote.svg";
        reactionBox.querySelector(".downvote-btn").querySelector(".icon").src =
          "./img/downvote.svg";
      }
    }
  }
  _scrollToTop() {
    this._scrollTo(document.querySelector(".post-box"));
  }
  _scrollTo(section) {
    window.scrollTo({
      left: section.left + scrollX,
      top: section.top + scrollY,
      behavior: "smooth",
    });
  }
}
const app = new App();
