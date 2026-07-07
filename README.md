# 🇮🇳 Smart Bharat – AI Powered Civic Companion

> An AI-powered civic platform that helps citizens access government services, report public issues, receive personalized assistance, and improve transparency through intelligent complaint analysis.

---

## Overview

Smart Bharat is an AI-powered web platform designed to make government services more accessible, transparent, and citizen-friendly.

Instead of being just another chatbot, Smart Bharat introduces an **AI Trust Engine** that analyzes citizen complaints, determines urgency, recommends the appropriate department, explains why a complaint received a particular priority, and provides an estimated resolution timeline.

The platform also offers an AI Civic Assistant, Scheme Recommender, and Document Checklist Assistant—all powered by Google's Gemini AI.

---

# Features

## AI Civic Assistant

Ask government-related questions in natural language.

- Passport guidance
- PAN Card
- Aadhaar
- Driving Licence
- Government Schemes
- Certificates
- Public Services

Supports multiple Indian languages.

---

## AI Complaint Trust Engine

Submit a complaint in plain language.

AI automatically:

- Detects urgency
- Detects vulnerable citizens
- Identifies department
- Explains routing decision
- Estimates SLA
- Generates citizen-friendly summary

Example:

```
Complaint:
No drinking water for 5 days.
My elderly parents are suffering.

↓

Priority:
Critical

Department:
Water Supply Board

Estimated SLA:
24 Hours
```

---

## Trust Dashboard

Track submitted complaints.

Displays:

- Complaint ID
- Department
- Priority
- Current Status
- AI Explanation
- Resolution Timeline

---

## AI Scheme Recommender

Users enter:

- Age
- Occupation
- Income
- State
- Gender

AI recommends suitable Government Schemes with:

- Benefits
- Eligibility
- Required Documents
- Application Process

---

## AI Document Checklist

Select any Government Service.

Example:

- Passport
- PAN
- Aadhaar
- Driving Licence

AI provides:

- Required Documents
- Optional Documents
- Common Mistakes
- Processing Time
- Tips

Also calculates a **Document Readiness Score**.

---

## Multilingual Support

Supports

- English
- Hindi
- Tamil
- Telugu
- Bengali

---

## Voice Input

Users can speak their questions using browser speech recognition.

---

## Accessibility

Includes simplified language mode for improved accessibility.

---

# AI Trust Engine

Unlike traditional complaint portals that simply acknowledge submissions, Smart Bharat explains:

- Why the complaint was prioritized
- Why it was routed to a department
- Expected next steps
- Estimated resolution timeline

This increases transparency and citizen trust.

---

# Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS

### AI

- Google Gemini API
- Gemini 2.5 Flash

### State Management

- React Hooks
- LocalStorage

### Deployment

- Vercel

---

# Project Structure

```
app/
│
├── api/
│   ├── chat/
│   ├── complaint/
│   ├── documents/
│   └── schemes/
│
├── chatbot/
├── complaint/
├── documents/
├── schemes/
├── tracker/
│
lib/
│
├── gemini.ts
├── prompts.ts
├── AccessibilityContext.tsx
└── useSpeechInput.ts
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/yourusername/smart-bharat.git
```

Install dependencies

```bash
npm install
```

Create

```
.env.local
```

Add

```env
GOOGLE_API_KEY=YOUR_API_KEY
```

Run

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# Demo Flow

```
Home

↓

AI Civic Assistant

↓

Report Complaint

↓

AI Trust Analysis

↓

Trust Dashboard

↓

Scheme Recommender

↓

Document Checklist
```

---

# Problem Statement

Citizens often face challenges in:

- Understanding government procedures
- Finding the correct department
- Tracking complaints
- Identifying eligible schemes
- Preparing required documents

Existing portals lack transparency and personalized assistance.

---

# Our Solution

Smart Bharat leverages Generative AI to:

- Simplify government information
- Improve complaint transparency
- Personalize scheme recommendations
- Generate document checklists
- Support multiple Indian languages
- Promote digital inclusion

---

# Future Enhancements

- Image-based complaint analysis (Gemini Vision)
- Live complaint tracking with backend database
- GIS-based issue mapping
- WhatsApp integration
- Aadhaar authentication
- SMS notifications
- Government API integrations

---


Built for the **Smart Bharat Hackathon**.

Made with using **Next.js**, **TypeScript**, **Tailwind CSS**, and **Google Gemini AI**.

---

# 📄 License

This project is developed for educational and hackathon purposes.
