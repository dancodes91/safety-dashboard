# Safety Dashboard - Implementation Guide

## Overview

This Safety Dashboard is a comprehensive web application built with Next.js that processes and visualizes safety data from KPA (event tracking) and Samsara (driver behavior) systems. The application provides real-time insights, KPI tracking with color-coded indicators, and automated reporting capabilities.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Environment variables configured

### Installation

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd safety-dashboard
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file with the following variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/safety-dashboard
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/safety-dashboard

   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here

   # Optional: Email configuration for reports
   SENDGRID_API_KEY=your-sendgrid-api-key
   FROM_EMAIL=noreply@yourcompany.com
   ```

3. **Database Initialization**
   ```bash
   node scripts/init-db.js
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📊 CSV Data Import

### Supported File Formats
- CSV files (.csv)
- Excel files (.xlsx, .xls)

### KPA Events Import

**File Structure Expected:**
The KPA CSV should contain the following columns:
```
Report #, Link, Observer, Employee:, Division:, Home Plant:,
Employee: - Hire Date, Employee: - Hire Duration, Employee: - Supervisor,
Is this an Accident, Incident, Near Miss?, Unit #:, Holliday Equipment Type:,
Job#, Date & Time of Accident/Incident:, Place of Accident/Incident:,
Plant:, Attach Video, Description of Event:, Any Injuries Involved?,
Please Select One:, Choose type of event
```

**Import Process:**
1. Navigate to Admin Panel → Data Import
2. Select "KPA Events" tab
3. Choose your CSV/Excel file
4. Click "Import Data"
5. Review import results and any errors

### Samsara Driver Records Import

**File Structure Expected:**
The Samsara CSV should contain the following columns:
```
Rank, Driver Name, Driver Tags, Tag Paths, Driver ID, Username,
Safety Score, Drive Time (hh:mm:ss), Total Distance (mi), Total Events,
Total Behaviors, [Speeding Columns], [Event Columns]
```

**Import Process:**
1. Navigate to Admin Panel → Data Import
2. Select "Driver Records" tab
3. Choose your CSV/Excel file
4. Click "Import Data"
5. Review import results and any errors

## 🧪 Testing the System

### Automated Testing

Run the comprehensive test suite:
```bash
# Make sure the development server is running first
npm run dev

# In another terminal, run the tests
node scripts/test-csv-import.js
```

This will test:
- CSV import functionality for both KPA and Samsara data
- Data retrieval endpoints
- Statistics generation
- Error handling

### Manual Testing

1. **Test with Sample Data**
   - Use the provided sample CSV files in the root directory
   - Import them through the web interface
   - Verify data appears in the dashboard

2. **Verify Dashboard Functionality**
   - Check that charts update with imported data
   - Verify KPI indicators show correct colors
   - Test filtering and search functionality

3. **Test API Endpoints**
   ```bash
   # Test KPA events endpoint
   curl http://localhost:3000/api/kpa-events

   # Test driver records endpoint
   curl http://localhost:3000/api/driver-records

   # Test statistics
   curl http://localhost:3000/api/kpa-events/stats
   ```

## 📈 Dashboard Features

### Main Dashboard
- **KPI Cards**: Color-coded indicators for key metrics
- **Incident Trends**: Line charts showing incident patterns over time
- **Driver Safety Scores**: Bar charts of top-performing drivers
- **Event Distribution**: Pie charts showing incident types
- **Recent Activity**: Tables of latest incidents and updates

### Incident Management
- **Incident List**: Paginated table with filtering options
- **Incident Details**: Detailed view of individual incidents
- **Analytics**: Charts showing trends by division, type, and preventability
- **Export Options**: Download reports in various formats

### Driver Safety
- **Driver Rankings**: Sortable list of drivers by safety score
- **Performance Metrics**: Detailed driving behavior analysis
- **Trend Analysis**: Historical performance tracking
- **Alert System**: Notifications for drivers needing attention

### Compliance Tracking
- **Training Status**: Employee training completion rates
- **Certification Tracking**: Expiration dates and renewals
- **Compliance Reports**: Automated compliance status reports

## 🎯 KPI Configuration

### Setting Up KPIs

1. Navigate to Admin Panel → KPI Management
2. Create new KPI goals with:
   - **Target Value**: The desired performance level
   - **Yellow Threshold**: Warning level (approaching target)
   - **Red Threshold**: Critical level (action required)
   - **Applicable Divisions/Plants**: Scope of the KPI

### Default KPI Thresholds

| Metric | Green (Target) | Yellow (Warning) | Red (Critical) |
|--------|---------------|------------------|----------------|
| Incident Rate | < 2/month | 2-4/month | > 4/month |
| Driver Safety Score | > 95 | 90-95 | < 90 |
| Preventable Incidents | < 30% | 30-50% | > 50% |
| Training Compliance | > 95% | 85-95% | < 85% |

## 📧 Automated Reporting

### Weekly Reports

The system automatically generates weekly safety reports that include:
- Executive summary with key metrics
- Incident analysis and trends
- Driver performance highlights
- Recommendations for improvement

### Email Configuration

To enable automated email reports:
1. Configure SendGrid API key in environment variables
2. Set up email templates in the admin panel
3. Configure recipient lists by role/division
4. Schedule report frequency (weekly, monthly, etc.)

## 🔧 API Reference

### Import Endpoints
```
POST /api/import/kpa-events
POST /api/import/driver-records
POST /api/import/training-records
```

### Data Endpoints
```
GET /api/kpa-events
GET /api/driver-records
GET /api/training-records
GET /api/kpi-goals
```

### Statistics Endpoints
```
GET /api/kpa-events/stats
GET /api/driver-records/stats
GET /api/kpis/incidents
GET /api/kpis/drivers
```

### Chart Data Endpoints
```
GET /api/charts/incidents/[chartType]
GET /api/charts/drivers/[chartType]
GET /api/charts/compliance/[chartType]
```

## 🛠️ Troubleshooting

### Common Issues

1. **Import Fails with "Missing Columns" Error**
   - Verify CSV column headers match expected format exactly
   - Check for extra spaces or special characters in headers
   - Ensure all required columns are present

2. **Database Connection Issues**
   - Verify MongoDB is running
   - Check MONGODB_URI in environment variables
   - Ensure database permissions are correct

3. **Charts Not Loading**
   - Check browser console for JavaScript errors
   - Verify API endpoints are responding
   - Clear browser cache and reload

4. **Authentication Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your domain
   - Clear browser cookies and re-login

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=true
```

### Log Files

Check application logs for detailed error information:
- Browser console for frontend issues
- Terminal output for backend issues
- MongoDB logs for database issues

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://...
   NEXTAUTH_URL=https://yourdomain.com
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel (Recommended)**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

4. **Alternative: Docker Deployment**
   ```bash
   docker build -t safety-dashboard .
   docker run -p 3000:3000 safety-dashboard
   ```

### Performance Optimization

- Enable MongoDB Atlas for production database
- Configure CDN for static assets
- Set up monitoring and alerting
- Implement caching strategies

## 📞 Support

### Getting Help

1. **Documentation**: Check this README and system design documents
2. **Logs**: Review application logs for error details
3. **Testing**: Use the test scripts to verify functionality
4. **Issues**: Report bugs through the issue tracking system

### Maintenance

- **Daily**: Monitor system performance and error logs
- **Weekly**: Review import success rates and data quality
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Review KPI thresholds and user feedback

## 🎉 Success Metrics

The system is working correctly when:
- ✅ CSV files import without errors
- ✅ Dashboard displays real-time data
- ✅ KPI indicators show correct colors
- ✅ Charts update automatically
- ✅ Reports generate successfully
- ✅ Users can filter and search data
- ✅ System performance is responsive

## 📋 Next Steps

After successful deployment:
1. Train users on the system functionality
2. Set up regular data import schedules
3. Configure automated reporting
4. Monitor system performance
5. Gather user feedback for improvements
6. Plan for future enhancements

The Safety Dashboard is now ready to transform your safety data into actionable insights!
