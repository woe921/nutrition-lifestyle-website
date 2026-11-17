function initCarousel() {
  const slides = document.querySelectorAll(".slide");
  const dotsWrap = document.querySelector(".carousel-dots");
  if (!slides.length || !dotsWrap) return;

  let index = 0;
  let timer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.addEventListener("click", () => {
      goTo(i);
      restart();
    });
    dotsWrap.appendChild(dot);
  });

  const dots = dotsWrap.querySelectorAll("button");

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle("active", n === index));
    dots.forEach((d, n) => d.classList.toggle("active", n === index));
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), 5000);
  }

  const prev = document.querySelector(".carousel-arrow.prev");
  const next = document.querySelector(".carousel-arrow.next");
  if (prev) prev.addEventListener("click", () => { goTo(index - 1); restart(); });
  if (next) next.addEventListener("click", () => { goTo(index + 1); restart(); });

  goTo(0);
  restart();
}

function initWorkoutTracker() {
  const counter = document.getElementById("counter");
  if (!counter) return;

  let workouts = Number(localStorage.getItem("workouts") || 0);

  function render() {
    counter.textContent = workouts;
    const message = document.getElementById("message");
    const badge = document.getElementById("badge");
    const list = document.getElementById("foodList");

    let text = "";
    let foods = [];

    if (workouts === 0) {
      text = "Complete your first workout to get food recommendations!";
    } else if (workouts <= 2) {
      text = "Great start! Keep going!";
      foods = ["Bananas 🍌", "Yogurt 🥛", "Oatmeal 🥣"];
    } else if (workouts <= 4) {
      text = "You're building a strong habit!";
      foods = ["Eggs 🍳", "Whole grain toast 🍞", "Fruit smoothie 🍓"];
    } else {
      text = "Amazing work! Badge unlocked!";
      badge.textContent = "🏆 Badge Unlocked!";
      foods = ["Grilled chicken 🍗", "Brown rice 🍚", "Vegetables 🥦"];
    }

    if (workouts < 5) badge.textContent = "";
    message.textContent = text;
    list.innerHTML = "";
    foods.forEach((food) => {
      const li = document.createElement("li");
      li.textContent = food;
      list.appendChild(li);
    });
  }

  document.getElementById("workoutBtn").addEventListener("click", () => {
    workouts++;
    localStorage.setItem("workouts", workouts);
    render();
  });

  render();
}

function initMyths() {
  const toggle = document.getElementById("mythsToggle");
  const panel = document.getElementById("mythsPanel");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", () => {
    const hidden = panel.hasAttribute("hidden");
    if (hidden) {
      panel.removeAttribute("hidden");
      toggle.textContent = "Hide Myths & Facts";
    } else {
      panel.setAttribute("hidden", "");
      toggle.textContent = "View Myths & Facts";
    }
  });
}

function initNutritionTracker() {
  const form = document.getElementById("foodForm");
  if (!form) return;

  const tbody = document.getElementById("foodTable");
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

  function renderTotals() {
    document.getElementById("totalCalories").textContent = totals.calories;
    document.getElementById("totalProtein").textContent = totals.protein + "g";
    document.getElementById("totalCarbs").textContent = totals.carbs + "g";
    document.getElementById("totalFat").textContent = totals.fat + "g";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const food = document.getElementById("food").value.trim();
    const calories = Number(document.getElementById("calories").value) || 0;
    const protein = Number(document.getElementById("protein").value) || 0;
    const carbs = Number(document.getElementById("carbs").value) || 0;
    const fat = Number(document.getElementById("fat").value) || 0;

    if (!food) return;

    const row = tbody.insertRow();
    [food, calories, protein + "g", carbs + "g", fat + "g"].forEach((value) => {
      row.insertCell().textContent = value;
    });

    totals.calories += calories;
    totals.protein += protein;
    totals.carbs += carbs;
    totals.fat += fat;
    renderTotals();
    form.reset();
    document.getElementById("food").focus();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCarousel();
  initWorkoutTracker();
  initMyths();
  initNutritionTracker();
});
