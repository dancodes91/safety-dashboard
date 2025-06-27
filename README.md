# Safety Dashboard

A comprehensive web-based dashboard for monitoring and managing safety metrics, driver behavior, regulatory compliance, and training records.

## Overview

This safety dashboard provides a centralized platform for monitoring and managing safety-related data across your organization. It integrates data from KPA (event tracking) and Samsara (driver behavior) systems to provide actionable insights on incidents, driver safety, compliance status, and training records.

## Features

- **Incident Tracking**: Monitor safety incidents with detailed information and status updates
- **Driver Safety Monitoring**: Track driver behavior metrics from Samsara including speeding, harsh events, and safety scores
- **Compliance Management**: Monitor regulatory compliance status with upcoming deadlines and requirements
- **Training Records**: Track employee training completions, certifications, and upcoming expirations
- **Visual Analytics**: Interactive charts and color-coded KPI indicators for at-a-glance performance monitoring
- **Data Import**: Import data from Excel files for easy integration with existing systems
- **Report Generation**: Export reports and data for compliance documentation and analysis

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Data Visualization**: Chart.js, D3.js
- **Backend**: Next.js API routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js

## Prerequisites

- Node.js (v16.x or later)
- npm or yarn
- MongoDB database

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-org/safety-dashboard.git
   cd safety-dashboard
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following environment variables:
   ```
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/safety_dashboard
   
   # NextAuth.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret_key
   
   # Email Configuration (for reports)
   EMAIL_SERVER=smtp://username:password@smtp.example.com:587
   EMAIL_FROM=safety-dashboard@example.com
   
   # External API Keys (if needed)
   KPA_API_KEY=your_kpa_api_key
   SAMSARA_API_KEY=your_samsara_api_key
   ```

4. Initialize the database (this will create initial admin user):
   ```
   npm run init-db
   # or
   yarn init-db
   ```

5. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
safety-dashboard/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── incidents/        # Incident tracking dashboard
│   ├── drivers/          # Driver safety dashboard
│   ├── compliance/       # Compliance monitoring dashboard
│   └── training/         # Training records dashboard
├── components/           # Reusable UI components
├── lib/                  # Utility functions and helpers
├── models/               # MongoDB models
├── public/               # Static assets
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## Dashboard Pages

### Incidents Dashboard
- Track safety incidents from the KPA system
- Monitor incident metrics including total incidents, incident rate, and closure time
- Visualize incident trends and distribution by type
- Filter and search incident records

### Drivers Dashboard
- Monitor driver safety metrics from the Samsara system
- Track safety scores, speeding events, harsh driving events, and more
- Visualize safety trends and driver performance over time
- Filter and search driver records

### Compliance Dashboard
- Track regulatory compliance requirements and deadlines
- Monitor overall compliance rates and audit readiness
- Highlight upcoming deadlines and required actions
- Organize compliance documents and verification records

### Training Dashboard
- Monitor employee training completion rates and certification status
- Track upcoming certification expirations
- Visualize training distribution by type and department
- Manage training records and requirements

## Data Import

The dashboard supports importing data from Excel files:

1. Navigate to the appropriate dashboard page (Incidents, Drivers, Compliance, or Training)
2. Click the "Import Data" button
3. Select or drag-and-drop your Excel file
4. The system will validate and process the data
5. Review the import results for any errors or warnings

## Authentication

The system uses NextAuth.js for authentication. Default credentials for the initial admin user:

- Email: admin@example.com
- Password: SafetyFirst!123

(Make sure to change these credentials after the first login)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please contact support@example.com.