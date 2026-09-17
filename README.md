<div align="center">

# ⚡ DirectHire

**Bypass résumé bias. Prove technical competence. Connect directly.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=flat-square&logo=bun&logoColor=white)](https://bun.sh/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker Sandbox](https://img.shields.io/badge/Execution_Sandbox-Docker%20%2F%20gVisor-blue?style=flat-square&logo=docker&logoColor=white)](https://github.com/google/gvisor)

[Explore Features](#-core-features) • [Workflow](#-end-to-end-workflow) • [System Architecture](#-system-architecture) • [Getting Started](#-getting-started) • [Database Schema](#-core-database-schema)

---

</div>

## 📌 Overview

**DirectHire** bridges the gap between ambitious students from non-tier-1 / under-represented universities and corporate recruiters. Conventional applicant tracking systems (ATS) discard thousands of qualified candidates based solely on institutional pedigree. DirectHire replaces the static résumé screen with **custom, verified skill assessments**—unlocking candidate profiles and direct interview scheduling only when domain competence is proven.

### 🎯 Key Objectives
* **Eliminate Screening Bias:** Verified assessment performance serves as the primary discovery filter.
* **40% Faster Time-to-Interview:** Automate pre-qualification directly to recruiter dashboards.
* **Company-Tailored Benchmarks:** Build targeted MCQ and sandboxed code execution challenges with custom cutoffs.

---

## 🚀 Core Features

### 🎓 For Candidates (Students)
* **Verified Onboarding:** Authenticate via `.edu` credentials or institutional ID review.
* **Live Assessment Arena:** Timed coding environments powered by the Monaco Editor alongside randomized MCQ sets.
* **Integrity Engine:** Fullscreen enforcement, tab-switch monitoring, and webcam snapshot auditing during attempts.
* **Direct Match Pipeline:** Clear the company cutoff to bypass the ATS and surface directly on recruiter dashboards.

### 💼 For Recruiters
* **Domain Authentication:** Corporate-verified portal access.
* **Custom Assessment Builder:** Configure passing thresholds, test durations, and sandbox test cases[cite: 1].
* **Scorecard Insights:** Inspect code submissions, test metrics, and detailed answer breakdowns[cite: 1].
* **Integrated Scheduling:** Direct calendar booking for first-round technical interviews[cite: 1].

---

## 🔄 End-to-End Workflow

```mermaid
flowchart TD
    A[Recruiter Creates Role & Test] -->|Define Cutoff & Problems| B[Assessment Published]
    C[Student Onboards & Verifies ID] --> D[Browse & Start Assessment]
    B --> D
    D -->|Fullscreen & Proctoring Active| E{Automated Sandbox Scoring}
    E -->|< Cutoff| F[Feedback Provided & 30-Day Cooldown]
    E -->|>= Cutoff| G[Profile & Scorecard Unlocked on Dashboard]
    G --> H[Direct Calendar Interview Invitation Sent]
