# SAHAYAK

AI-Powered Digital Public Safety Intelligence Platform

## Overview

SAHAYAK is an intelligence-driven cybercrime investigation platform designed to assist citizens, investigators, and law enforcement agencies in detecting, analyzing, and responding to financial fraud and digital scam networks.

The platform combines fraud detection, scam intelligence, network analysis, geospatial crime insights, evidence generation, and AI-assisted investigation workflows into a unified command center.

SAHAYAK focuses on high-impact cybercrime categories such as Digital Arrest Scams, UPI Fraud, Financial Impersonation, Vishing Attacks, and Organized Fraud Networks.

---

## Problem Statement

Cybercriminals increasingly exploit digital communication channels to conduct large-scale financial fraud through impersonation, fear tactics, social engineering, and coordinated money movement networks.

Investigators often face challenges including:

* Fragmented fraud intelligence
* Lack of link analysis across cases
* Delayed identification of fraud clusters
* Limited evidence standardization
* Difficulty in identifying emerging scam patterns

SAHAYAK addresses these challenges through AI-assisted fraud intelligence and investigation support.

---

## Core Features

### Digital Arrest Scam Detector

Detects scam narratives involving authority impersonation, fear-based coercion, urgency tactics, and payment demands.

Outputs:

* Risk Score
* Verdict
* Scam Indicators

### Citizen Fraud Shield

Citizen-facing fraud analysis module.

Supports:

* SMS Messages
* WhatsApp Messages
* Call Transcripts

Outputs:

* Risk Assessment
* Fraud Indicators
* Safety Recommendations

### Fraud DNA Engine

Generates unique Fraud DNA profiles from fraud reports.

Outputs:

* Fraud DNA ID
* Fraud Type
* Authority Score
* Urgency Score
* Payment Score
* Confidence Score
* Fraud Cluster Assignment

### Fraud Network Graph Intelligence

Identifies relationships among:

* Phone Numbers
* UPI IDs
* Bank Accounts
* Fraud Clusters

Provides graph-based intelligence for investigative workflows.

### AI Investigator Copilot

Natural language investigation assistant.

Capabilities:

* Query fraud clusters
* Retrieve linked entities
* Explore related cases
* Summarize intelligence findings

### Evidence Package Generator

Generates structured investigation reports suitable for documentation and legal workflows.

Outputs:

* Case Summary
* Fraud Intelligence
* Investigator Notes
* Recommended Actions
* PDF Evidence Reports

### Geospatial Crime Intelligence

Maps cybercrime activity geographically.

Capabilities:

* Crime Hotspot Detection
* City-Level Fraud Monitoring
* Regional Risk Analysis

### Counterfeit Currency Detector

Supporting module for counterfeit currency identification and classification.

---

```text
Citizen Reports
       │
       ▼
Fraud Detection Layer
       │
       ▼
Fraud DNA Engine
       │
       ▼
Fraud Network Intelligence
       │
       ▼
AI Investigator Copilot
       │
       ▼
Evidence Package Generator
       │
       ▼
Command Center Dashboard
```


---

## Technology Stack

### Backend

* FastAPI
* Python
* SQLAlchemy
* MySQL
* Pydantic

### Frontend

* React
* Vite
* Tailwind CSS
* Recharts
* Axios
* React Router

### Data Layer

* MySQL
* Fraud Intelligence Repository

### Reporting

* ReportLab
* PDF Evidence Generation

---

## Project Structure

```text
Sahayak/
│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── database/
│   └── app.py
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── layouts/
│   │   └── services/
│   │
│   └── package.json
│
├── README.md
└── .gitignore
```

## Installation

### Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn app:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## API Modules

| Module               | Endpoint            |
| -------------------- | ------------------- |
| Scam Detection       | /analyze-scam       |
| Citizen Shield       | /citizen-shield     |
| Fraud DNA            | /generate-dna       |
| Fraud Network        | /fraud-network      |
| Investigator Copilot | /copilot            |
| Evidence Package     | /evidence/{case_id} |
| Crime Hotspots       | /crime-hotspots     |
| Dashboard Summary    | /dashboard-summary  |

---

## Evaluation Focus

The platform is designed around the following evaluation objectives:

* Digital arrest scam detection precision and recall
* Fraud pattern identification accuracy
* Fraud network detection lead time
* Counterfeit detection capability
* Citizen-facing false positive minimization
* Investigative auditability
* Evidence traceability
* Legal admissibility support

---

## Future Enhancements

* Real-time fraud intelligence feeds
* Graph database integration
* Multi-agency intelligence sharing
* Voice-based scam analysis
* Large language model powered investigations
* National fraud risk monitoring
* Automated case prioritization

---
