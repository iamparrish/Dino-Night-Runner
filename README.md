# 🦖 Dino Night Runner

A fast-paced endless runner set against a stunning parallax night sky. Jump over obstacles, duck under hazards, collect coins, grab power-ups, and see how far you can go before the night swallows you whole.

![JavaScript](https://img.shields.io/badge/JavaScript-65.4%25-yellow)
![CSS](https://img.shields.io/badge/CSS-19.1%25-blue)
![HTML](https://img.shields.io/badge/HTML-15.5%25-orange)

🔗 **[Play Live →](https://iamparrish.github.io/Dino-Night-Runner/)**

---

## 🎮 About the Game

Dino Night Runner is a polished browser-based endless runner inspired by the classic dino game — but cranked up with a cinematic night-time atmosphere, layered parallax scenery, a coin economy, four unique power-ups, an achievement system, and full mobile support. The game gets progressively faster, so every run is a new challenge.

---

## ✨ Features

- **Parallax Night World** — Multi-layered scrolling background with sky, stars, mountains, trees, and bushes for a deep atmospheric look
- **Jump & Duck** — Two core movement mechanics to dodge every obstacle the night throws at you
- **Coin Collection** — Pick up coins during your run for bonus scoring
- **4 Power-Ups** — Each with a real-time HUD timer:
  - 🛡️ **Shield** — Absorb one hit without dying
  - ✨ **Double** — Double your score multiplier
  - 🧲 **Magnet** — Attract nearby coins automatically
  - ⚡ **Speed** — Burst forward at increased velocity
- **Live HUD** — Always-visible Score, High Score, Distance (in meters), and Speed Level
- **Achievement System** — Unlock achievements mid-run with pop-up toast notifications
- **High Score Persistence** — Your best run is saved and displayed on the main menu and game over screen
- **Pause Menu** — Pause and resume at any point with `P` or the on-screen button
- **Game Over Stats** — Final score, high score, distance, coins collected, and unlocked achievements
- **Fullscreen Mode** — One-click fullscreen button for an immersive experience
- **Mobile Controls** — On-screen Jump and Duck buttons for touchscreen play
- **Canvas-Based Rendering** — Smooth, frame-rate-aware gameplay via HTML5 Canvas

---

## 🚀 Getting Started

### Prerequisites

Just a modern web browser. No installs, no build tools needed.

### Run Locally

```bash
git clone https://github.com/iamparrish/Dino-Night-Runner.git
cd Dino-Night-Runner
```

Open `index.html` in your browser — or play the live version at the link above.

---

## 🗂️ Project Structure

```
Dino-Night-Runner/
├── index.html      # Game layout: start screen, HUD, canvas, power-up bar, menus
├── style.css       # Full styling: parallax layers, HUD cards, screens, animations
└── script.js       # Game engine: physics, rendering, obstacles, coins, power-ups, achievements
```

---

## 🕹️ How to Play

### Controls

| Action | Keyboard | Mobile |
|--------|----------|--------|
| Jump   | `↑` Arrow Up | **Jump** button |
| Duck   | `↓` Arrow Down | **Duck** button |
| Pause  | `P` | ⏸ button |
| Fullscreen | — | **Fullscreen** button |

### Objective

- Run as far as possible without hitting an obstacle.
- Collect 🪙 **coins** along the way to boost your score.
- Grab ⚡ **power-ups** to gain temporary advantages.
- The game speeds up over time — stay sharp!
- Beat your **High Score** to prove your dominance of the night.

### Power-Up Guide

| Power-Up | Icon | Effect |
|----------|------|--------|
| Shield   | 🛡️   | Survive one obstacle hit |
| Double   | ✨   | 2× score multiplier while active |
| Magnet   | 🧲   | Auto-collect nearby coins |
| Speed    | ⚡   | Temporary speed boost |

---

## 🛠️ Built With

- **HTML5** — Game structure, screens, HUD, and canvas element
- **CSS3** — Parallax layers, animated backgrounds, responsive layout, UI components
- **Vanilla JavaScript** — Game loop, physics engine, obstacle & coin generation, power-up logic, achievement system, canvas rendering

---

## 👤 Author

**Parrish Tarak**
- GitHub: [@iamparrish](https://github.com/iamparrish)
- Portfolio: [parrishtarak.vercel.app](https://parrishtarak.vercel.app/)

---

## 🤝 Contributing

Have an idea for a new power-up, obstacle type, or game mode? Contributions are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
