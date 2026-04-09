📅 Interactive Wall Calendar Component

A modern, aesthetic wall calendar UI built with React (Next.js) + Tailwind CSS, inspired by a physical calendar design. This project focuses on rich UI/UX, smooth interactions, and intuitive usability.

✨ Key UI/UX Features
🎨 Dynamic Hero Section + Adaptive Theme
Displays rotating nature images as the hero section.
Extracts dominant colors from images using canvas.
Entire UI (buttons, highlights, accents) adapts dynamically to the image theme.
Users can also:
Upload their own image 📷
Reset to default images
📆 Smart Date Range Selection (Drag & Select)
Click and drag across dates to select a range.
No need for separate start/end clicks → more natural UX.
Visual feedback includes:
Start date
End date
Highlighted range
🔁 Smooth Navigation + Smart Controls
Navigate months using:
Arrow buttons ⬅️ ➡️
Keyboard keys (← →)
Swipe gestures (mobile)
Includes “Jump to Today” button:
Instantly returns user to the current month
📝 Notes System with Tagging
Add notes to any specific date via modal.
Tag options available:
💼 Work
🏠 Personal
⏰ Reminder
⚠️ Urgent
Notes are:
Saved per date
Editable & deletable
📌 Centralized Monthly Notes View
All notes automatically appear in a general notes section.
Users don’t need to click individual dates to view notes.
Features:
Clean card layout
Tag-based color indicators
Holiday highlights 🎉
📊 Smart Counters & Insights
Displays:
📍 Number of notes in the current month
📅 Number of days selected in a range
Helps users quickly understand their activity
📅 Holiday Indicators
Predefined holidays are highlighted.
Visual indicators:
Dot markers on calendar
Highlight inside notes panel
📱 Fully Responsive Design
Desktop → Side-by-side layout (Hero + Calendar)
Mobile → Stacked layout
Smooth interaction on touch devices
🛠 Tech Stack
Framework: Next.js (React)
Styling: Tailwind CSS + Inline Styling
State Management: React Hooks (useState, useEffect, useRef)
Image Processing: Canvas API (for color extraction)
Storage: Local component state (frontend-only as per requirement)
📂 Project Structure
app/
 ├── components/
 │   ├── HeroSection.tsx
 │   ├── CalendarGrid.tsx
 │   ├── NotesPanel.tsx
 │   ├── NoteModal.tsx
 │   └── utils.ts
 └── page.tsx
🚀 How to Run Locally
1️⃣ Clone the Repository
git clone https://github.com/your-username/calendar_tuf.git
cd calendar_tuf
2️⃣ Install Dependencies
npm install
3️⃣ Run Development Server
npm run dev
4️⃣ Open in Browser
http://localhost:3000