# Safety Dashboard System Design

## 1. Executive Summary

This document outlines the system design for a comprehensive Safety Dashboard web application built with Next.js. The application will visualize safety data from two primary sources: KPA (event tracking) and Samsara (driver behavior). The dashboard will provide real-time insights into incident reports, compliance tracking, and employee training status with color-coded KPI indicators and comparison reports.

## 2. Project Overview

### 2.1 Objectives

- Create a centralized safety dashboard to replace Excel-based reporting
- Visualize incident reports, compliance tracking, and employee training status
- Implement color-coded KPI tracking (red, yellow, green) to monitor goal proximity
- Enable week-over-week and year-over-year comparison reporting
- Generate automated email reports for stakeholders
- Support workflow visualization and organizational charts
- Allow for future expansion of severity ratings and event types

### 2.2 Data Sources

1. **KPA Event Tracking**
   - Accident/incident reports
   - Property damage reports
   - Injury tracking
   - Near-miss reporting
   - Historical data dating back to 01/01/2025

2. **Samsara Driver Behavior**
   - Safety scores
   - Driving time and distance
   - Speeding events
   - Various driving behaviors (harsh braking, acceleration, etc.)
   - Historical data limited to one year back

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Data Sources   │────▶│  Next.js App    │────▶│  End Users      │
│  (KPA, Samsara) │     │  (Frontend +    │     │  (Web Browser)  │
│                 │     │   API Routes)    │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               │
                        ┌──────▼──────┐
                        │             │
                        │  Database   │
                        │  (MongoDB)  │
                        │             │
                        └─────────────┘
```

### 3.2 Technology Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Charts & Visualization**: Chart.js, D3.js
- **State Management**: React Context API, SWR for data fetching
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Deployment**: Vercel
- **Email Service**: SendGrid
- **File Processing**: xlsx library for Excel imports

## 4. Database Design

### 4.1 MongoDB Collections

#### Users Collection
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "role": "String",
  "division": "String",
  "plant": "String",
  "supervisor": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### KPA Events Collection
```json
{
  "_id": "ObjectId",
  "reportNumber": "String",
  "link": "String",
  "observer": "String",
  "employeeId": "String",
  "employeeName": "String",
  "division": "String",
  "homePlant": "String",
  "hireDate": "Date",
  "hireDuration": "String",
  "supervisor": "String",
  "eventType": "String",
  "unitNumber": "String",
  "equipmentType": "String",
  "jobNumber": "String",
  "dateTime": "Date",
  "location": "String",
  "plant": "String",
  "videoLink": "String",
  "description": "String",
  "injuries": "Boolean",
  "preventability": "String",
  "eventCategory": "String",
  "severityRating": "Number",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### Samsara Driver Records Collection
```json
{
  "_id": "ObjectId",
  "rank": "Number",
  "driverName": "String",
  "driverTags": "String",
  "tagPaths": "String",
  "driverId": "String",
  "username": "String",
  "safetyScore": "Number",
  "driveTime": "String",
  "totalDistance": "Number",
  "totalEvents": "Number",
  "totalBehaviors": "Number",
  "speedingData": {
    "lightTime": "String",
    "moderateTime": "String",
    "heavyTime": "String",
    "severeTime": "String",
    "maxSpeedTime": "String",
    "manualCount": "Number",
    "percentLight": "Number",
    "percentModerate": "Number",
    "percentHeavy": "Number",
    "percentSevere": "Number",
    "percentMax": "Number",
    "lightCount": "Number",
    "moderateCount": "Number",
    "heavyCount": "Number",
    "severeCount": "Number",
    "maxCount": "Number",
    "maxSpeed": "Number",
    "maxSpeedAt": "Date"
  },
  "events": {
    "crash": "Number",
    "followingDistance": "Number",
    "following0to2s": "Number",
    "following2to4s": "Number",
    "lateResponse": "Number",
    "defensiveDriving": "Number",
    "nearCollision": "Number",
    "harshAccel": "Number",
    "harshBrake": "Number",
    "harshTurn": "Number",
    "mobileUsage": "Number",
    "inattentiveDriving": "Number",
    "drowsy": "Number",
    "rollingStop": "Number",
    "didNotYield": "Number",
    "ranRedLight": "Number",
    "laneDeparture": "Number",
    "obstructedCameraAuto": "Number",
    "obstructedCameraManual": "Number",
    "eatingDrinking": "Number",
    "smoking": "Number",
    "noSeatBelt": "Number",
    "forwardCollisionWarning": "Number"
  },
  "weekStartDate": "Date",
  "weekEndDate": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### KPI Goals Collection
```json
{
  "_id": "ObjectId",
  "metricName": "String",
  "description": "String",
  "targetValue": "Number",
  "yellowThreshold": "Number",
  "redThreshold": "Number",
  "unit": "String",
  "division": "String",
  "plant": "String",
  "applicableTo": "String",
  "effectiveDate": "Date",
  "expirationDate": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### Training Records Collection
```json
{
  "_id": "ObjectId",
  "employeeId": "String",
  "employeeName": "String",
  "division": "String",
  "plant": "String",
  "trainingType": "String",
  "trainingName": "String",
  "completionDate": "Date",
  "expirationDate": "Date",
  "status": "String",
  "instructor": "String",
  "score": "Number",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 4.2 Data Relationships

- Users and KPA Events: One-to-many (one user can be associated with multiple events)
- Users and Samsara Records: One-to-many (one driver can have multiple weekly records)
- KPI Goals and Events/Records: Many-to-many (metrics can apply to different divisions/plants)

## 5. Frontend Components

### 5.1 Page Structure

```
pages/
├── index.js                  # Dashboard homepage
├── incidents/
│   ├── index.js              # Incident reports list
│   └── [id].js               # Individual incident details
├── drivers/
│   ├── index.js              # Driver safety list
│   └── [id].js               # Individual driver details
├── compliance/
│   └── index.js              # Compliance tracking dashboard
├── training/
│   └── index.js              # Employee training status
├── reports/
│   ├── index.js              # Report generation menu
│   ├── weekly.js             # Weekly comparison reports
│   └── yearly.js             # Yearly comparison reports
├── admin/
│   ├── index.js              # Admin dashboard
│   ├── kpi.js                # KPI goal management
│   ├── users.js              # User management
│   └── import.js             # Data import page
├── workflow/
│   └── index.js              # Workflow visualization
├── org-chart/
│   └── index.js              # Organizational chart
├── api/
│   ├── auth/                 # Authentication endpoints
│   ├── events/               # KPA events endpoints
│   ├── drivers/              # Samsara driver data endpoints
│   ├── kpi/                  # KPI management endpoints
│   ├── training/             # Training records endpoints
│   ├── reports/              # Report generation endpoints
│   ├── email/                # Email sending endpoints
│   └── import/               # Data import endpoints
└── _app.js                   # App layout and global state
```

### 5.2 Core Components

#### Dashboard Components
- **KPICard**: Displays a single KPI with color indicator
- **MetricTrend**: Shows trend data for a specific metric
- **IncidentSummary**: Summary of recent incidents
- **DriverSafetyChart**: Visualization of driver safety scores
- **ComplianceStatus**: Overview of compliance metrics
- **TrainingProgress**: Training completion status

#### Chart Components
- **BarChart**: For comparing metrics across categories
- **LineChart**: For displaying trends over time
- **PieChart**: For showing distribution of event types
- **HeatMap**: For visualizing data density by location
- **GaugeChart**: For displaying KPI progress
- **ScatterPlot**: For correlation analysis

#### Data Input Components
- **ExcelImporter**: For uploading KPA and Samsara data
- **DateRangePicker**: For selecting report timeframes
- **FilterPanel**: For filtering dashboard data
- **SearchBar**: For finding specific records
- **KPIEditor**: For setting KPI goals and thresholds

#### Report Components
- **ReportGenerator**: For creating custom reports
- **EmailTemplate**: For configuring email reports
- **ComparisonView**: For week-over-week or year-over-year comparison
- **ExportOptions**: For downloading reports in various formats

### 5.3 UI Mockups

#### Main Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ ┌───────────┐                                      ┌───────────┐ │
│ │ LOGO      │                                      │ User Menu │ │
│ └───────────┘                                      └───────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────────┐ │
│ │ Incidents │ │ Drivers   │ │Compliance │ │ Training          │ │
│ │           │ │           │ │           │ │                   │ │
│ └───────────┘ └───────────┘ └───────────┘ └───────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐ ┌─────────────────────────────────┐ │
│ │ INCIDENT TREND          │ │ DRIVER SAFETY SCORES            │ │
│ │                         │ │                                 │ │
│ │ [Line chart of          │ │ [Bar chart of top 10 drivers    │ │
│ │  incidents over time]   │ │  by safety score]               │ │
│ │                         │ │                                 │ │
│ └─────────────────────────┘ └─────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐ ┌─────────────────────────────────┐ │
│ │ KPI STATUS              │ │ RECENT INCIDENTS                │ │
│ │                         │ │                                 │ │
│ │ [Gauge charts showing   │ │ [Table of most recent          │ │
│ │  progress towards KPIs] │ │  incident reports]              │ │
│ │                         │ │                                 │ │
│ └─────────────────────────┘ └─────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐ ┌─────────────────────────────────┐ │
│ │ EVENT TYPES             │ │ TRAINING COMPLIANCE             │ │
│ │                         │ │                                 │ │
│ │ [Pie chart of           │ │ [Progress bars for different    │ │
│ │  event categories]      │ │  training categories]           │ │
│ │                         │ │                                 │ │
│ └─────────────────────────┘ └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### Incident Reports Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ ┌───────────────────────────────────────────────┐ ┌───────────┐ │
│ │ INCIDENT REPORTS                              │ │ FILTERS   │ │
│ └───────────────────────────────────────────────┘ │           │ │
├─────────────────────────────────────────────────┐ │ Date      │ │
│ ┌────────┬────────┬───────────┬────────────────┐ │ Division   │ │
│ │ Report#│ Date   │ Employee  │ Type           │ │ Plant      │ │
│ ├────────┼────────┼───────────┼────────────────┤ │ Event Type │ │
│ │ 604807 │ 6/11/25│ J.Gutierr │ Other          │ │ Severity   │ │
│ ├────────┼────────┼───────────┼────────────────┤ │ Equipment  │ │
│ │ 604793 │ 6/11/25│ G.Vazquez │ Spill          │ │           │ │
│ ├────────┼────────┼───────────┼────────────────┤ │           │ │
│ │ 604313 │ 6/10/25│ J.Jimenez │ Spill          │ │           │ │
│ ├────────┼────────┼───────────┼────────────────┤ │           │ │
│ │ 604149 │ 6/10/25│ T.Chaaban │ Stationary Obj │ │           │ │
│ └────────┴────────┴───────────┴────────────────┘ └───────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐ ┌─────────────────────────────────┐ │
│ │ INCIDENTS BY DIVISION   │ │ INCIDENTS BY TYPE               │ │
│ │                         │ │                                 │ │
│ │ [Bar chart]             │ │ [Pie chart]                     │ │
│ │                         │ │                                 │ │
│ └─────────────────────────┘ └─────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐ ┌─────────────────────────────────┐ │
│ │ PREVENTABLE VS          │ │ INCIDENT LOCATIONS              │ │
│ │ NON-PREVENTABLE         │ │                                 │ │
│ │                         │ │ [Map or heatmap visualization]  │ │
│ │ [Donut chart]           │ │                                 │ │
│ │                         │ │                                 │ │
│ └─────────────────────────┘ └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 6. API Design

### 6.1 RESTful Endpoints

#### Authentication Endpoints
- `POST /api/auth/login`: User authentication
- `POST /api/auth/logout`: User logout
- `GET /api/auth/user`: Get current user info

#### KPA Events Endpoints
- `GET /api/events`: List all events (paginated)
- `GET /api/events/:id`: Get event details
- `POST /api/events`: Create new event
- `PUT /api/events/:id`: Update event
- `DELETE /api/events/:id`: Delete event
- `GET /api/events/stats`: Get event statistics

#### Samsara Driver Endpoints
- `GET /api/drivers`: List all driver records (paginated)
- `GET /api/drivers/:id`: Get driver details
- `POST /api/drivers`: Create new driver record
- `PUT /api/drivers/:id`: Update driver record
- `DELETE /api/drivers/:id`: Delete driver record
- `GET /api/drivers/stats`: Get driver statistics
- `GET /api/drivers/rankings`: Get driver rankings

#### KPI Management Endpoints
- `GET /api/kpi`: List all KPI goals
- `GET /api/kpi/:id`: Get KPI details
- `POST /api/kpi`: Create new KPI goal
- `PUT /api/kpi/:id`: Update KPI goal
- `DELETE /api/kpi/:id`: Delete KPI goal
- `GET /api/kpi/progress`: Get KPI progress metrics

#### Training Endpoints
- `GET /api/training`: List all training records
- `GET /api/training/:id`: Get training details
- `POST /api/training`: Create new training record
- `PUT /api/training/:id`: Update training record
- `DELETE /api/training/:id`: Delete training record
- `GET /api/training/compliance`: Get training compliance stats

#### Report Generation Endpoints
- `POST /api/reports/generate`: Generate custom report
- `GET /api/reports/weekly`: Generate weekly comparison
- `GET /api/reports/yearly`: Generate yearly comparison
- `POST /api/reports/email`: Send report via email

#### Data Import Endpoints
- `POST /api/import/kpa`: Import KPA data from Excel
- `POST /api/import/samsara`: Import Samsara data from Excel

### 6.2 Response Format

All API responses will follow a standard format:

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "errors": []
}
```

## 7. Data Processing Flow

### 7.1 Data Import Process

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Upload     │────▶│  Validate   │────▶│  Transform  │────▶│  Store in   │
│  Excel File │     │  Data       │     │  Data       │     │  Database   │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                   │
                                                                   ▼
                                                           ┌─────────────┐
                                                           │             │
                                                           │  Update     │
                                                           │  Dashboard  │
                                                           │             │
                                                           └─────────────┘
```

### 7.2 KPI Calculation Process

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Retrieve   │────▶│  Calculate  │────▶│  Compare to │────▶│  Assign     │
│  Raw Data   │     │  Metrics    │     │  Thresholds │     │  Color Code │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                   │
                                                                   ▼
                                                           ┌─────────────┐
                                                           │             │
                                                           │  Display on │
                                                           │  Dashboard  │
                                                           │             │
                                                           └─────────────┘
```

### 7.3 Report Generation Process

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Select     │────▶│  Query      │────▶│  Process    │────▶│  Format     │
│  Parameters │     │  Database   │     │  Data       │     │  Report     │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                   │
                                                                   ▼
                                                           ┌─────────────┐
                                                           │             │
                                                           │  Generate   │
                                                           │  Email      │
                                                           │             │
                                                           └─────────────┘
```

## 8. Implementation Plan

### 8.1 Phase 1: Setup and Core Infrastructure
- Initialize Next.js project with TypeScript
- Set up database connection
- Implement authentication system
- Create base UI components and layouts
- Develop API endpoints for data retrieval

### 8.2 Phase 2: Data Import and Processing
- Develop Excel import functionality for KPA data
- Develop Excel import functionality for Samsara data
- Implement data validation and transformation logic
- Create data storage models and relationships
- Develop KPI calculation algorithms

### 8.3 Phase 3: Dashboard Development
- Implement main dashboard with KPI indicators
- Develop incident reports visualization
- Create driver safety dashboard
- Build compliance tracking components
- Implement training status visualization

### 8.4 Phase 4: Reporting and Analysis
- Develop comparison report functionality
- Implement email template generation
- Create export capabilities (PDF, Excel, CSV)
- Build advanced filtering and search capabilities
- Implement workflow and org chart visualizations

### 8.5 Phase 5: Testing and Deployment
- Conduct performance testing
- Implement error handling and logging
- Perform security testing
- Deploy to production environment
- Conduct user training

## 9. Email Template Design

### 9.1 Weekly Safety Report Email

```
Subject: Weekly Safety Report - [Date Range]

Dear [Recipient Name],

Here is the weekly safety report for [Date Range]:

SAFETY METRICS SUMMARY:
------------------------
Total Incidents: [Number]
Preventable Incidents: [Number] ([Percentage]%)
Non-Preventable Incidents: [Number] ([Percentage]%)

KPI STATUS:
-----------
[KPI Name 1]: [Current Value] / [Target] - [Status Color]
[KPI Name 2]: [Current Value] / [Target] - [Status Color]
[KPI Name 3]: [Current Value] / [Target] - [Status Color]

TOP INCIDENT TYPES:
------------------
1. [Type 1]: [Count] ([Percentage]%)
2. [Type 2]: [Count] ([Percentage]%)
3. [Type 3]: [Count] ([Percentage]%)

TOP SAFETY PERFORMERS:
---------------------
1. [Driver Name 1]: Safety Score [Score]
2. [Driver Name 2]: Safety Score [Score]
3. [Driver Name 3]: Safety Score [Score]

AREAS NEEDING IMPROVEMENT:
-------------------------
1. [Area 1]: [Details]
2. [Area 2]: [Details]
3. [Area 3]: [Details]

For more detailed information, please visit the Safety Dashboard at [Dashboard URL].

Thank you,
[Sender Name]
Safety Department
```

## 10. Security Considerations

### 10.1 Authentication and Authorization
- Use NextAuth.js for secure authentication
- Implement role-based access control
- Secure API routes with middleware
- Implement JWT token validation

### 10.2 Data Protection
- Encrypt sensitive data at rest
- Implement HTTPS for all communications
- Use parameterized queries to prevent SQL injection
- Sanitize user inputs to prevent XSS attacks

### 10.3 Compliance
- Implement data retention policies
- Ensure GDPR compliance where applicable
- Maintain audit logs for all data modifications
- Implement secure password policies

## 11. Future Enhancements

### 11.1 Short-Term Enhancements
- Mobile-responsive design
- Dark mode support
- Advanced notification system
- Integration with messaging platforms (Slack, Teams)

### 11.2 Medium-Term Enhancements
- Predictive analytics for incident prevention
- Machine learning for pattern recognition
- Custom dashboard creator
- Integration with other enterprise systems

### 11.3 Long-Term Enhancements
- Real-time data streaming from Samsara API
- Mobile app for field reporting
- Advanced risk assessment tools
- Gamification elements for driver safety

## 12. Conclusion

This system design provides a comprehensive framework for implementing a safety dashboard using Next.js that will meet all the client requirements. The application will centralize data from KPA and Samsara, provide insightful visualizations, track KPIs with color-coded indicators, and generate automated reports. The modular architecture allows for future enhancements and scalability as the client's needs evolve.