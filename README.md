<div align="center">
  <a href="https://taapi.io/">
    <img src="https://taapi.io/wp-content/themes/taapi/images/logo-taapi.svg" alt="Taapi.io Logo" height="50" />
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://sdh.global/">
    <img src="https://sdh.global/s/1-57-1/img/logo.svg" alt="SDH.global Logo" height="50" />
  </a>
</div>

# Real-Time Market Scanner & Analytics Engine

## Run Locally

**Prerequisites:**  Node.js

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Configure API Key:**
    -   Create a `.env` file in the root directory (copy from `.env.example` if available, or just create it).
    -   Add your `taapi.io` API key:
        ```env
        VITE_TAAPI_SECRET=your_taapi_secret_here
        ```
    -   *Note: The app is configured to respect the Free Tier rate limits (1 request every 1.5s). If you have a paid plan, you can adjust the delay in `App.tsx`.*

3.  **Run the app:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```

---

### For Developers
Want to build this yourself? We have released the core logic as an open-source blueprint. [Link to GitHub Repository]

### For Enterprise
Need a turnkey version of this scanner for your exchange or fund? This solution was architected by **SDH.global**, a certified Taapi.io integration partner. [Contact SDH.global for Custom Development](https://sdh.global/)
