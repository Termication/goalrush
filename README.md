# ⚽ GoalRush - Football News Website

[![Screenshot-2026-03-13-at-20-10-40-Goal-Rush-Your-Daily-Football-Fix.png](https://i.postimg.cc/jSkRSCGj/Screenshot-2026-03-13-at-20-10-40-Goal-Rush-Your-Daily-Football-Fix.png)](https://postimg.cc/G4YWM330)

**GoalRush** is a full-stack, modern football news website built with Next.js and the TALL stack (Tailwind CSS, Alpine.js-like interactivity via React, Laravel-like API routes via Next.js, and Livewire-like components via React Server Components). It features a dynamic homepage, individual article pages, and a secure admin panel for creating and managing content, complete with a rich text editor and image uploading capabilities.

------

# ✨ Core Features

## 📰 Advanced Content Delivery

- Threaded "Live" Articles: Articles support continuous timeline updates (similar to live match text commentary). Threaded articles are automatically prioritized on the homepage with a pulsing "Live Updates" badge.

- Dynamic Homepage Routing: An algorithmic homepage that automatically highlights breaking news and filters the latest headlines based on publication dates and update statuses.

- Smart "Read Next" Engine: Keeps users engaged by dynamically suggesting related articles based on category and tags at the bottom of every story.

## 📈 SmartBet & Live Odds Integration

- Real-Time Odds Tracking: Integrates with external football APIs to fetch live match data, standings, and fluctuating H2H (Head-to-Head) betting odds.

- Accumulator Bet Slip: A fully functional, interactive bet slip that allows users to add selections, input a stake, and instantly calculate total odds and potential returns.

- Dynamic Team Assets: Custom React hooks that intelligently fuzzy-match team names to automatically pull and render the correct club crests or international flags.

## 🛡️ Secure Admin Panel & CMS

- Protected Dashboard: Secured via NextAuth.js, allowing only authorized personnel to draft, edit, and delete content.

- Rich Media Editor: Integrated TinyMCE editor customized with tailored CSS to ensure headings, quotes, and tables look identical in the editor and on the live site.

- Cloudinary Integration: Seamless drag-and-drop image uploading for featured thumbnails and in-article assets.

- On-the-Fly SEO Management: Manage Meta tags, JSON-LD structured data, and OpenGraph images directly from the admin dashboard.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) & [DaisyUI](https://daisyui.com/) (for the FAQ accordion)
- **Rich Text Editor**: [TimyMCE](https://TimyMCE.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **ORM**: [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js (Auth.js)](https://next-auth.js.org/)
- **Image Hosting**: [Cloudinary](https://cloudinary.com/)
- **RichEditorThis**: (RichTextEditor component powered by TinyMCE.)
- **Deployment**: [Vercel](https://goal-rush.live)

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
