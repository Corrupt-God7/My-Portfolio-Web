# My-First-Portfolio-Web
Personal portfolio website built with HTML &amp; CSS — showcasing my Azure cloud skills, AZ-900 certification, and DevOps projects. Hosted on Azure Static Web Apps.


# Chirag Deviputra — Portfolio Website

A full-stack portfolio built with **Python Flask** (backend) + **HTML/CSS/JS** (frontend).
Includes a working contact form that sends emails to your Gmail inbox.

---

## Project Structure

```
chirag-portfolio/
├── app.py                  # Flask backend (main server)
├── requirements.txt        # Python dependencies
├── .env                    # Your secret config (never commit this!)
├── templates/
│   └── index.html          # Main HTML page
└── static/
    ├── css/
    │   └── style.css       # All styles
    └── js/
        └── main.js         # Frontend JS (form, animations, nav)
```

---

## Setup & Run (Step by Step)

### Step 1 — Install Python
Make sure Python 3.8+ is installed. Check with:
```bash
python --version
```

### Step 2 — Install dependencies
Open terminal in the project folder and run:
```bash
pip install -r requirements.txt
```

### Step 3 — Set up Gmail App Password
The contact form sends emails via Gmail. You need an **App Password** (not your normal password):

1. Go to your Google Account → **Security**
2. Enable **2-Step Verification** (if not already on)
3. Go to **App Passwords** → Select "Mail" → Generate
4. Copy the 16-character password

### Step 4 — Configure your .env file
Open `.env` and fill in:
```
SENDER_EMAIL=your_email
SENDER_PASSWORD=your_16_char_app_password
RECEIVER_EMAIL=your_email
```

### Step 5 — Run the server
```bash
python app.py
```

Open your browser at: **http://localhost:5000**

---

## Deploy for Free

### Option A — Azure Static Web Apps (Recommended — it's on-brand!)
1. Push this project to GitHub
2. Go to Azure Portal → Create **Static Web App**
3. Connect your GitHub repo
4. Azure auto-deploys on every git push

### Option B — Railway.app (Easiest)
1. Push to GitHub
2. Go to railway.app → New Project → Deploy from GitHub
3. Add your `.env` variables in Railway's dashboard
4. Done — live URL in 2 minutes

### Option C — Render.com (Free tier)
1. Push to GitHub
2. New Web Service on render.com → connect repo
3. Build command: `pip install -r requirements.txt`
4. Start command: `python app.py`
5. Add environment variables from your `.env`

---

## Customisation Tips

- **Add a project**: Edit the projects section in `templates/index.html`
- **Change colours**: Edit CSS variables at the top of `static/css/style.css`
- **Update skills**: Find the skills section in `index.html` and add/remove `<span class="stag">` tags
- **Add certifications**: Copy a `.cert-card` block in `index.html`
