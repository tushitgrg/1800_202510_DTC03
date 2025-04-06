# Well Circle

## Overview

WellCircle is a mental health community platform designed to provide users with a supportive environment for mental well-being. It features a variety of tools and resources that promote mental health awareness, self-care, and peer support. Users can connect with others through forums, chat, access valuable resources, and engage in an AI-driven mental health quiz to gain insights into their emotional state.

Developed for the Project 1800 course, applying User-Centred Design practices, agile project management processes, integrating gemini API, and Firebase backend services.

---

## Features

- Forum: A space for users to discuss mental health topics, share experiences, and support one another.

- Chat: Real-time messaging feature that allows users to connect and converse privately.

- User Profiles: Personal profiles where users can track their progress, interact with others, and share relevant information.

- Resources: A curated list of mental health resources, including articles, videos, and helpful links.

- AI Mental Health Quiz: An interactive quiz that uses AI to provide users with insights into their mental well-being.

---

## Technologies Used

Example:

- **Frontend**: HTML, CSS, JavaScript (with jQuery), Bootstrap, Tailwind CSS
- **Backend**: Firebase, Cloudflare Worker for AI integration
- **Database**: Firestore
- **API**: Gemini API, Webios Image Storage API

---

## Installation

To run the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/tushitgrg/1800_202510_DTC03.git
   ```

2. **Navigate into the project directory**:

   ```bash
   cd 1800_202510_DTC03
   ```

3. **Store Firebase keys**:  
   In order to integrate Firebase with the app, create a file called `firebaseAPI_TEAMDTC03.js` in the `scripts` folder of the project. Add your Firebase configuration keys to this file:

   ```js
   // scripts/firebaseAPI_TEAMDTC03.js

   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id",
   };

   // Initialize Firebase
   const app = firebase.initializeApp(firebaseConfig);
   const db = firebase.firestore();
   ```

   **Important**: Make sure to replace the placeholders with your actual Firebase configuration keys.

4. **Open the `index.html` file**:  
   You can now open the `index.html` file in your preferred browser to start interacting with the app.

## Project Structure

```
Well Circle/
├── README.md
├── api
│   └── cloudflare-worker.js
├── assets
│   ├── icon.ico
│   └── lofioen.mp3
├── chat
│   ├── index.html
│   └── open.html
├── components
│   ├── footer.html
│   ├── header.html
│   └── login_header.html
├── forum
│   ├── index.html
│   ├── new
│   │   └── index.html
│   └── post.html
├── images
│   ├── logo.png
│   ├── people.jpg
│   └── pfp.jpg
├── index.html
├── quiz
│   ├── index.html
│   └── report.html
├── resources
│   ├── index.html
│   └── support
│       └── index.html
├── scripts
│   ├── NotProctectedRoute.js
│   ├── ProtectedRoute.js
│   ├── allForums.js
│   ├── authentication.js
│   ├── eachPost.js
│   ├── firebaseAPI_TEAMDTC03.js
│   ├── musiclogic.js
│   ├── newPost.js
│   ├── profile.js
│   ├── quizReport.js
│   ├── renderer.js
│   ├── resources.js
│   └── tailwind.config.js
├── styles
│   └── style.css
├── template.html
└── user
    ├── index.html
    ├── login.html
    └── logout.html
```

---

## Contributors

- **Tushit Garg** - BCIT CST Student who loves making and breaking things.
- **Stanislav** - BCIT CST Student who loves anime.
- **Ruthanna** - BCIT CST Student who loves dogs.

## Acknowledgments

- **Bootstrap Icons**:  
   Open-source icon library for Bootstrap and other frameworks.

  - Source: [Bootstrap Icons](https://icons.getbootstrap.com/)

- **Material Icons**:  
   Open-source icons following Material Design guidelines.

  - Source: [Material Icons](https://material.io/resources/icons/)

- **Gemini API**:  
   API for accessing financial services and cryptocurrency data.

  - Source: [Gemini API](https://docs.gemini.com/)

- **HealthLine**:  
   Expert-reviewed health information and wellness advice.

  - Source: [HealthLine](https://www.healthline.com/)

- **Better Health (Victoria, Australia)**:  
   Trusted health resource for physical and mental health topics.

  - Source: [BetterHealth.vic.gov.au](https://www.betterhealth.vic.gov.au/)

- **Harvard Health**:  
   Health information and articles developed by medical professionals.

  - Source: [Harvard Health](https://www.health.harvard.edu/)

- **McLean Hospital**:  
   Leading provider of mental health services and information.
  - Source: [McLean Hospital](https://www.mcleanhospital.org/)

---

## Limitations and Future Work

### Limitations

- The AI-powered mental health quiz is relatively simple and lacks advanced features like personalized recommendations or ongoing progress tracking.

- Though Firebase handles authentication and storage, more measures could be taken to ensure that sensitive user data is more securely handled, especially regarding mental health information.

- As the user base grows, the platform might face performance issues with scaling the real-time chat and data storage aspects, especially using Firebase.

### Future Work

- Improve the AI-driven quiz to provide more detailed insights, personalized recommendations, and track user progress over time for a more tailored mental health journey.

- Integrate audio and video communication features for users to have real-time voice or video-based conversations, enhancing support and connection within the community.

- Introduce gamification elements to engage users, such as earning points for participation, completing mental health quizzes, and achieving personal well-being milestones.

- Enable users to contribute mental health resources, articles, or tools that could benefit others, helping build a more collaborative and dynamic community.

---

## License

Example:
This project is licensed under the MIT License. See the LICENSE file for details.
