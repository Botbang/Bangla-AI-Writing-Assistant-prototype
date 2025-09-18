# Gemini Bangla Assistant

An AI-powered assistant to help you write accurate and grammatically correct Bengali. The spell checker runs continuously, highlighting mistakes and offering suggestions with explanations.

This project is built with React, TypeScript, and Tailwind CSS, and it uses the Google Gemini API for its AI capabilities.

![Gemini Bangla Assistant Screenshot](https://i.imgur.com/example.png) <!-- It's good practice to add a screenshot of your app -->

## ✨ Features

-   **Real-time Correction**: Analyzes your Bengali text as you type.
-   **AI-Powered Suggestions**: Leverages the Gemini API to provide intelligent spelling and grammar corrections.
-   **Clear Explanations**: Understand *why* a correction is needed with simple explanations in Bengali.
-   **Personal Dictionary**: Add words to a dictionary to have the checker ignore them.
-   **Client-Side Privacy**: Your API key is stored securely in your browser's local storage and is never sent to any server except Google's.
-   **Modern UI**: Clean, responsive, and easy-to-use interface with a dark mode theme.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI**: [Google Gemini API](https://ai.google.dev/) (`@google/genai`)

## 📋 Prerequisites

Before you begin, you will need two things:

1.  **A Google Gemini API Key**: This is required to use the AI features.
    -   You can get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  **Node.js**: This is needed to run a simple local web server.
    -   Download and install it from the official [Node.js website](https://nodejs.org/). Installing Node.js will also install `npm`, which we'll use.

## 🚀 Running the App Locally

This application is a "static" website, which means it doesn't need a complex backend. The easiest way to run it is with a simple local web server.

### Step-by-Step Guide

1.  **Clone the Repository**
    Open your terminal or command prompt and run the following command to download the project files to your computer:
    ```bash
    git clone https://github.com/your-username/gemini-bangla-assistant.git
    ```
    *(Replace `https://github.com/your-username/gemini-bangla-assistant.git` with the actual URL of your Git repository.)*

2.  **Navigate to the Project Directory**
    ```bash
    cd gemini-bangla-assistant
    ```

3.  **Install a Local Web Server**
    We will use a simple package called `http-server`. Install it globally using npm by running this command:
    ```bash
    npm install -g http-server
    ```

4.  **Start the Server**
    Now, start the web server from within your project folder:
    ```bash
    http-server .
    ```

5.  **Open the App in Your Browser**
    The terminal will show you a message with one or more local URLs. It will look something like this:
    ```
    Starting up http-server, serving .
    Available on:
      http://127.0.0.1:8080
      http://192.168.1.100:8080
    Hit CTRL-C to stop the server
    ```
    Open your web browser (like Chrome or Firefox) and go to one of those addresses, for example: **http://127.0.0.1:8080**

6.  **Enter Your API Key**
    The first time you open the app, it will ask for your Gemini API Key. Paste the key you got from Google AI Studio and click "Save and Continue". You're all set!

## 🌐 Deploying to the Web

Deploying this app is easy because it's a static site. You can host it for free on services like Netlify, Vercel, or GitHub Pages.

Here’s how to deploy it using **GitHub Pages**, a free and straightforward option.

### Step-by-Step Guide for GitHub Pages

1.  **Create a GitHub Repository**
    If you haven't already, create a new repository on [GitHub](https://github.com) and push your project code to it.

2.  **Go to Repository Settings**
    In your repository on GitHub, click on the **"Settings"** tab.

3.  **Navigate to Pages**
    In the left sidebar, click on **"Pages"**.

4.  **Configure the Deployment Source**
    -   Under "Build and deployment", for the "Source", select **"Deploy from a branch"**.
    -   Under "Branch", select your main branch (usually `main` or `master`).
    -   Keep the folder as `/ (root)`.
    -   Click **"Save"**.

5.  **Wait for Deployment**
    GitHub will now start deploying your website. This might take a minute or two. Once it's done, a green message will appear at the top of the "Pages" settings with the URL for your live site. It will look like: `https://<your-username>.github.io/<your-repository-name>/`.

That's it! Your Gemini Bangla Assistant is now live on the web for anyone to use.
