import {render} from "./modules/dom.js";
import { initGame } from "./modules/gameController.js";
import "./index.css";

const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";

  initGame();
  render();
});