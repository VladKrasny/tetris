import React from "react";
import { createRoot } from "react-dom/client";

import { GameEffector } from "./game-effector";
import { GameMobx } from "./mobx-game";

import "./game.style.css";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <GameMobx />
  </React.StrictMode>
);
