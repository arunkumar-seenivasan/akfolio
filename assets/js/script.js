'use strict';

// -----------------------------------
// --     CONSTANTS & SELECTORS     --
// -----------------------------------

// DOM Elements
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

const testimonialsList = document.querySelector(".testimonials-list");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");

const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");


// -----------------------------------
// --       UTILITY FUNCTIONS       --
// -----------------------------------

/**
 * Toggles the 'active' class on a given element.
 * @param {HTMLElement} elem The element to toggle.
 */
const elementToggleFunc = function(elem) {
  elem.classList.toggle("active");
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 * @param {Function} func The function to debounce.
 * @param {number} delay The number of milliseconds to delay.
 * @returns {Function} The new debounced function.
 */
const debounce = (func, delay = 250) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};


// -----------------------------------
// --       EVENT LISTENERS         --
// -----------------------------------

// Sidebar toggle for mobile
sidebarBtn.addEventListener("click", () => elementToggleFunc(sidebar));

// Testimonials modal functionality
const testimonialsModalFunc = () => {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

if (testimonialsList) {
  testimonialsList.addEventListener("click", (event) => {
    const clickedItem = event.target.closest("[data-testimonials-item]");
    if (clickedItem) {
      modalImg.src = clickedItem.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = clickedItem.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = clickedItem.querySelector("[data-testimonials-title]").innerHTML;
      modalText.innerHTML = clickedItem.querySelector("[data-testimonials-text]").innerHTML;
      testimonialsModalFunc();
    }
  });
}

modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);


// Custom select functionality
const filterFunc = (selectedValue) => {
  filterItems.forEach(item => {
    const isVisible = selectedValue === "all" || selectedValue === item.dataset.category;
    item.classList.toggle("active", isVisible);
  });
}

select.addEventListener("click", () => elementToggleFunc(select));

selectItems.forEach(item => {
  item.addEventListener("click", () => {
    let selectedValue = item.innerText.toLowerCase();
    selectValue.innerText = item.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
});

// Filter functionality for large screens
let lastClickedBtn = filterBtn[0];
filterBtn.forEach(btn => {
  btn.addEventListener("click", function() {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
});

// Form validation on input (debounced)
const handleFormInput = () => {
  const isFormValid = form.checkValidity();
  formBtn.disabled = !isFormValid;
};

formInputs.forEach(input => {
  input.addEventListener("input", debounce(handleFormInput, 300));
});


// Page navigation
navigationLinks.forEach(link => {
  link.addEventListener("click", function() {
    const targetPage = this.innerHTML.toLowerCase();
    pages.forEach(page => {
      const isTarget = page.dataset.page === targetPage;
      page.classList.toggle("active", isTarget);
    });
    navigationLinks.forEach(navLink => {
      navLink.classList.toggle("active", navLink === this);
    });
    window.scrollTo(0, 0);
  });
});


// -----------------------------------
// --    SEO & PERFORMANCE HOOKS    --
// -----------------------------------



/*===== Contact Form =====*/

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
  const button = document.getElementById("sendButton");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    button.disabled = true;
    button.querySelector("span").textContent = "Sending...";

    const formData = new FormData(form);

    // Add current date & time
    const now = new Date();
    const timestamp = now.toLocaleString();
    formData.append("submitted_at", timestamp);

    console.log("Submitted on:", timestamp);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        alert("Message sent successfully!");
        form.reset();
      } else {
        alert("Oops! Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Error submitting the form. Check your internet connection.");
    }

    button.disabled = false;
    button.querySelector("span").textContent = "Send Message";
  });
});

