# ⚽ GoalRush - Football News Website

[![Screenshot-2025-07-10-at-19-08-21-Goal-Rush-Your-Daily-Football-Fix.png](https://i.postimg.cc/Ghj5FhD9/Screenshot-2025-07-10-at-19-08-21-Goal-Rush-Your-Daily-Football-Fix.png)](https://postimg.cc/ZCCHZmVh)


**GoalRush** is a full-stack, modern football news website built with Next.js and the TALL stack (Tailwind CSS, Alpine.js-like interactivity via React, Laravel-like API routes via Next.js, and Livewire-like components via React Server Components). It features a dynamic homepage, individual article pages, and a secure admin panel for creating and managing content, complete with a rich text editor and image uploading capabilities.

----

## ✨ Features

- **Dynamic Homepage**: Displays a featured article and a grid of recent headlines, fetched directly from the database.
- **Responsive Design**: A clean, modern UI that looks great on all devices, from mobile phones to desktop monitors.
- **Individual Article Pages**: Dynamically generated pages for each news story using slugs for clean, SEO-friendly URLs.
- **"Read Next" Suggestions**: Keeps users engaged by showing related articles at the bottom of each news page.
- **Secure Admin Panel**: A protected route at `/admin/create-article` for content creation, secured by NextAuth.js.
- **Rich Text Editor**: A WordPress-like Tiptap editor for writing articles with formatting options like headings, lists, bold, and italics.
- **Image Uploading**: Seamlessly upload featured images and images within the article body directly to Cloudinary.
- **Skeleton Loading States**: Improves user experience by showing a content skeleton while data is being fetched.
- **Email & Password Authentication**: A simple but secure login system for the admin panel.

---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) & [DaisyUI](https://daisyui.com/) (for the FAQ accordion)
- **Rich Text Editor**: [TimyMCE](https://TimyMCE.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **ORM**: [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js (Auth.js)](https://next-auth.js.org/)
- **Image Hosting**: [Cloudinary](https://cloudinary.com/)
- **RichEditorThis is the RichTextEditor component powered by TinyMCE.
- **Deployment**: [Upcoming](https://)

---

## 🛠️ Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

- Node.js (v18.x or later)
- npm or yarn
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- A free [Cloudinary](https://cloudinary.com/) account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Termication/goalrush.git](https://github.com/Termication/goalrush.git)
    cd goalrush
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of your project and add the following variables.

    ```env
    # MongoDB Connection String from Atlas
    MONGODB_URI=mongodb+srv://...

    # Cloudinary URL from your dashboard
    CLOUDINARY_URL=cloudinary://...

    # NextAuth.js secret key (generate with `openssl rand -base64 32`)
    NEXTAUTH_SECRET=your_super_secret_key

    # Admin credentials for the login page
    ADMIN_EMAIL=admin@goalrush.com
    ADMIN_PASSWORD=your_secure_password
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can access the admin panel at `/admin/create-article` and log in with the credentials you set in your `.env.local` file.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.


## Authors


<details>
    <summary>Innocent Karabo Mohlala</summary>
    <ul>
    <li><a href="https://www.github.com/termication">Github</a></li>
    <li><a href="https://www.twitter.com/Termication_">Twitter</a></li>
    <li><a href="mailto:terminalkarabo@gmail.com">e-mail</a></li>
    </ul>



