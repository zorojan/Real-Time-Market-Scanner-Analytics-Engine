<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

 

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
