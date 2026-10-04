# 🌃 Night Escape

<p align="center">
  <img src="./preview.gif" alt="Night Escape gameplay preview">
</p>

<p align="center">
  <strong>A 3D browser game about escaping a police pursuit at night.</strong>
</p>

<p align="center">
  <a href="https://kaoru965.github.io/night-escape/">🎮 Play Now</a>
  ·
  <a href="https://github.com/kaoru965/night-escape">💻 Source Code</a>
</p>

---

## 🚗 About

**Night Escape** is a browser-based 3D driving game built with **HTML5, CSS3, JavaScript and Three.js**.

You are behind the wheel of a car in a dark city.
Police are chasing you.

There is only one objective:

# **Don't get caught.**

You cannot leave the car.
You cannot hide.

**Just keep driving. 🌃🚓**

---

## 🎮 Gameplay

Drive through the nighttime city while trying to survive the police pursuit for as long as possible.

The game features:

* 🚗 **3D vehicle driving**
* 🚓 **Police pursuit**
* 🌃 **Nighttime city environment**
* 🏢 **Building collisions**
* 🌳 **Trees and environmental objects**
* 💡 **Street lights**
* 🖱️ **Mouse camera control**
* ⏱️ **Survival time**
* 💥 **Collision detection**
* 🌐 **Runs directly in the browser**

Your survival time is your score.

---

## 🕹️ Controls

| Input                        | Action              |
| ---------------------------- | ------------------- |
| `W`                          | Accelerate          |
| `A`                          | Turn left           |
| `S`                          | Reverse / slow down |
| `D`                          | Turn right          |
| `Space`                      | Brake               |
| `Right Mouse Button + Mouse` | Look around         |

> Controls may change as the game continues to receive updates.

---

## 🌐 Play Online

### ▶️ [Play Night Escape](https://kaoru965.github.io/night-escape/)

No installation required.

Open the page, start the game and **drive**.

---

## 🛠️ Built With

Night Escape uses a lightweight browser-based stack:

* **HTML5** — application structure
* **CSS3** — interface and styling
* **JavaScript** — game logic
* **Three.js** — 3D rendering
* **WebGL** — hardware-accelerated graphics

Three.js is included locally in the repository rather than being loaded from an external CDN.

---

## 📁 Project Structure

```text
nightescape/
│
├── .ascode/
│   ├── launch.jsonc
│   └── settings.jsonc
│
├── src/
│   ├── favicon.svg
│   ├── game.js
│   ├── style.css
│   └── three.min.js
│
├── preview.gif
├── index.html
├── LICENSE
└── README.md
```

### `.ascode/`

Project configuration files for **ASCode**.

### `src/game.js`

The main game code, including gameplay logic, vehicle controls, police pursuit, collisions and the 3D environment.

### `src/style.css`

Styles for the game's interface and visual elements.

### `src/three.min.js`

A local copy of Three.js used for rendering the 3D game world.

### `src/favicon.svg`

The game's favicon.

### `preview.gif`

A gameplay preview displayed in this README.

### `index.html`

The main entry point of the game.

---

## ▶️ Run Locally

Clone the repository:

```bash
git clone https://github.com/kaoru965/night-escape.git
cd night-escape
```

Then serve the project using a local HTTP server.

For example, you can use **VS Code Live Server**, Python's built-in HTTP server, or another static web server.

### Python

```bash
python -m http.server
```

Then open:

```text
http://localhost:8000
```

> Opening `index.html` directly may work, but using a local HTTP server is recommended.

---

## 📸 Preview

The repository contains a short gameplay recording in `preview.gif`.

It shows the actual game running in the browser, including the nighttime environment and driving gameplay.

---

## 📜 License

Night Escape is distributed under the license specified in [`LICENSE`](./LICENSE).

Please read the license before redistributing or modifying the project.

---

## 🤝 Contributing

Contributions, ideas and bug reports are welcome.

If you find a problem or have an idea for improving Night Escape:

1. Open an **Issue**, or
2. Fork the repository.
3. Create a branch for your changes.
4. Make your changes.
5. Open a **Pull Request**.

---

## 🗺️ Roadmap

Possible future improvements include:

* 🚓 More advanced police AI
* 🌆 Larger city environments
* 🚗 Additional vehicles
* 🌧️ Weather effects
* 🌙 Improved night lighting
* 💥 More detailed collision effects
* 🎵 Sound effects and music
* 🏆 High-score system
* ⚙️ Additional graphics settings

The roadmap may change as development continues.

---

## 👤 Author

Created by **kaoru965**.

Built for the web with JavaScript and Three.js.

---

<p align="center">
  <strong>🌃 NIGHT ESCAPE</strong>
  <br>
  <em>Keep driving. Don't get caught.</em>
</p>
