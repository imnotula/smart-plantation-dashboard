# Smart Plantation Monitoring Dashboard

A prototype full-stack dashboard for monitoring plantation soil and irrigation conditions across multiple plots. The system is designed to visualize root-zone moisture, salinity, pH, irrigation logic, weather context, and operational alerts in a single interface.

## Overview

This project was reconstructed from a combined source export and organized into a cleaner repository structure for version control and submission. It represents a **dashboard prototype** for smart plantation monitoring rather than a fully production-ready deployment.

The intended stack is:

- **Frontend:** React + Vite
- **Backend:** Express 5
- **API contract:** OpenAPI
- **Client/code generation:** Orval + Zod
- **Data fetching:** React Query

## Main Features

- Multi-plot health overview
- Multi-depth soil moisture monitoring at:
  - 10 cm
  - 30 cm
  - 60 cm
- Irrigation status and manual override logic
- Salinity and pH diagnostics
- Weather and evapotranspiration context
- Alert logging for abnormal plot conditions
- API-first structure using an OpenAPI specification

## Repository Structure

```text
.
├── README.md
├── .gitignore
├── lib/
│   └── api-spec/
│       └── openapi.yaml
├── artifacts/
│   ├── api-server/
│   │   └── src/
│   │       └── routes/
│   └── plantation-dashboard/
│       └── src/
│           ├── App.tsx
│           ├── pages/
│           └── components/
└── upload_to_github_commands.txt
