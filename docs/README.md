---
title: "Abren ERP Frontend - Map of the Territory"
description: "A centralized reading path to navigate the Frontend documentation."
tier: frontend
tags: [readme, index, overview]
---

# Abren ERP Frontend - Map of the Territory

Welcome to the Abren ERP UI documentation. This frontend is built with Vue 3 (Composition API), Pinia, and TypeScript, and strictly adheres to an "Operational-First" design philosophy. 

Below are the primary paths to navigate the UI ecosystem.

## 🧭 Reading Paths

### 🎨 1. Core Architecture & Philosophy
Start here to understand the structural layout of the Single Page Application.
*   [Architecture Overview](./ARCHITECTURE.md)
*   [State Management](./STATE_MANAGEMENT.md) (Pinia & API Query usage)
*   [Routing Strategy](./ROUTING.md)

### 🧱 2. Multi-Pane & UI Components
The most crucial UI pattern in our system is the Multi-Pane Split View constraint. Read these documents to learn how to build screens correctly.
*   [Multi-Pane Implementation](./components/MULTI_PANE.md)
*   [Component Library Guidelines](./components/GUIDELINES.md)
*   [Reactivity Gotchas](./components/REACTIVITY.md)

### 🛠️ 3. Integration & Networking
For developers connecting the UI to the backend:
*   [API Integration](./integration/API.md)
*   [Error Handling & Envelopes](./integration/ERRORS.md)

---

> [!NOTE]
> For heavy architectural constraints (such as `uuid7` usage, Backend Idempotency, or Schema doctrines), please refer to the backend's `/abren-api/docs/` repository.
