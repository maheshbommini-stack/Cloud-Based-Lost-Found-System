☁️ FindBack — Cloud-Based Lost & Found System

FindBack is a cloud-based Lost & Found management system designed to help students, staff, and organizations report lost or found belongings and discover potential matches.

The system uses cloud authentication, cloud database storage, cloud image storage, and serverless backend functions to provide a scalable Lost & Found platform.

🌐 Project Overview

Traditional Lost & Found systems often depend on manual registers or physical notices.

FindBack digitizes this process:

Report Lost Item
       ↓
Cloud Database
       ↓
Report Found Item
       ↓
Automatic Matching
       ↓
Potential Match
       ↓
Claim Verification
       ↓
Item Returned

✨ Features

🔐 User authentication

🔍 Lost item reporting

📦 Found item reporting

🖼️ Cloud image upload

☁️ Cloud database

🎯 Automatic lost/found matching

📊 Match scoring

🔔 Potential-match notifications

📝 Claim requests

👨‍💼 Admin verification

📈 Dashboard statistics

🔎 Item search

📱 Responsive interface

🔒 Firebase security rules

⚡ Serverless backend

🌐 Cloud deployment

🛠️ Technology Stack
Frontend

HTML5

CSS3

JavaScript

Responsive Web Design

Firebase Web SDK

Cloud Platform

Firebase Authentication

Cloud Firestore

Firebase Storage

Firebase Cloud Functions

Firebase Hosting

Backend

Node.js

Firebase Cloud Functions

JavaScript

Firestore triggers

☁️ Cloud Architecture
                       USER
                         │
                         ▼
                ┌────────────────┐
                │    Frontend    │
                │ HTML/CSS/JS    │
                └───────┬────────┘
                        │
                        ▼
                ┌────────────────┐
                │ Firebase Auth  │
                └───────┬────────┘
                        │
                        ▼
                ┌────────────────┐
                │ Cloud Firestore│
                └───────┬────────┘
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
       ┌──────────────┐   ┌──────────────┐
       │ Cloud Storage│   │Cloud Function│
       │ Item Images  │   │Match Engine  │
       └──────────────┘   └───────┬──────┘
                                  │
                                  ▼
                           ┌────────────┐
                           │  Matches   │
                           └────────────┘

📂 Project Structure
Cloud-Lost-Found/
│
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── report.html
│   ├── search.html
│   ├── admin.html
│   ├── style.css
│   ├── app.js
│   ├── auth.js
│   └── firebase-config.js
│
├── functions/
│   ├── index.js
│   ├── matching.js
│   └── package.json
│
├── firestore.rules
├── storage.rules
├── firebase.json
├── .firebaserc
├── .gitignore
└── README.md

🔄 System Workflow
1. User Registration
User
 ↓
Register
 ↓
Firebase Authentication
 ↓
Account Created
 ↓
Dashboard

2. Lost Item
Lost Item Form
 ↓
Item Information
 ↓
Image Upload
 ↓
Cloud Storage
 ↓
Firestore
 ↓
Status = LOST

3. Found Item
Found Item Form
 ↓
Item Information
 ↓
Image Upload
 ↓
Cloud Storage
 ↓
Firestore
 ↓
Status = FOUND

4. Matching

The system compares:

Item name

Category

Color

Location

Description

Example scoring:

Category Match       30 points
Color Match          20 points
Location Match       25 points
Item Name Match      25 points
───────────────────────────────
Maximum              100 points


A match with a score of 60 or above can be marked as a potential match.

🗄️ Firestore Data Model
Users
users/
 └── userId
      ├── name
      ├── email
      ├── role
      └── createdAt

Items
items/
 └── itemId
      ├── type
      ├── itemName
      ├── category
      ├── description
      ├── color
      ├── location
      ├── date
      ├── imageUrl
      ├── status
      └── createdAt

Matches
matches/
 └── matchId
      ├── itemId
      ├── matchedItemId
      ├── score
      ├── status
      └── createdAt

☁️ Cloud Storage

Item images are stored separately from Firestore.

Firebase Storage
│
└── items/
    ├── wallet.jpg
    ├── phone.png
    ├── bag.jpg
    └── keys.jpg


Firestore stores the image URL instead of storing the actual image.

⚡ Serverless Backend

FindBack uses Firebase Cloud Functions instead of maintaining a traditional server.

When a new item is created:

New Firestore Document
        ↓
Cloud Function Trigger
        ↓
Load Existing Items
        ↓
Compare Attributes
        ↓
Calculate Match Score
        ↓
Create Match Record

🔐 Security

The project uses Firebase security rules to control access.

Security features include:

Authentication required for reports

Image upload restrictions

File-size restrictions

Cloud database rules

Protected backend operations

Environment-specific configuration

🚀 Installation
1. Clone Repository
git clone https://github.com/YOUR-USERNAME/Cloud-Lost-Found.git

2. Install Firebase CLI
npm install -g firebase-tools

3. Login
firebase login

4. Install Backend Dependencies
cd functions
npm install

5. Configure Firebase

Create a Firebase project and enable:

Authentication
Firestore
Storage
Cloud Functions
Hosting


Add your Firebase configuration to:

frontend/firebase-config.js

6. Run Locally
firebase emulators:start


Or open the frontend through a local development server.

🚀 Deployment

Deploy the complete cloud application:

firebase deploy


Or deploy individual services:

firebase deploy --only hosting

firebase deploy --only functions

firebase deploy --only firestore

firebase deploy --only storage

📊 Dashboard

The dashboard can display:

Total Lost Items
Total Found Items
Potential Matches
Returned Items
Pending Claims


This provides administrators with a quick overview of the system.

👨‍💼 Admin Workflow
Admin Login
    ↓
Admin Dashboard
    ↓
View Reports
    ↓
Review Potential Matches
    ↓
Review Claims
    ↓
Approve / Reject
    ↓
Mark Item Returned

🔮 Future Improvements

🤖 AI-powered image matching

📧 Email notifications

📱 Push notifications

🗺️ Location/map integration

📍 GPS-based matching

🔎 Advanced search filters

👤 Role-based access control

📊 Advanced analytics

📷 Image similarity detection

🏫 Multi-campus support

📱 Progressive Web App

🔔 Real-time notifications

⚠️ Disclaimer

FindBack is an educational cloud computing and Web Technology project.

The matching system provides potential matches based on available item information and should not be considered a definitive identification system.

👨‍💻 Author

Mahesh Bommini

Built as a Cloud Computing / Web Technology project.

📌 Project Highlights
☁️ Cloud-Based
🔐 Authentication
🗄️ Cloud Database
🖼️ Cloud Storage
⚡ Serverless Backend
🎯 Smart Matching
📊 Dashboard
🔒 Security Rules
📱 Responsive UI
🌐 Cloud Deployment
