# Deployment Notes & Environment Configuration

This document outlines how environment-specific configurations are handled for this application.

## General Principles

For security and flexibility, environment-specific configurations should **not** be hardcoded into the application code or committed to the version control repository. Instead, they should be supplied to the application at runtime.

## Backend Configuration (Flask App)

The backend application requires the following configurations:

1.  **`SECRET_KEY`**: Used by Flask for session management and signing.
    *   **Handling**: Set as an environment variable (e.g., `SECRET_KEY`). The application (in `app.py`) should read this from `os.environ.get('SECRET_KEY', 'default-fallback-for-dev')`.
    *   **Dockerfile**: The `Dockerfile` can accept this environment variable at runtime using the `docker run -e SECRET_KEY="your_secret_value"` flag.
    *   **Gunicorn**: Gunicorn passes environment variables to the Flask application.

2.  **`SQLALCHEMY_DATABASE_URI`**: The connection string for the database.
    *   **Handling**: Set as an environment variable (e.g., `DATABASE_URL` or `SQLALCHEMY_DATABASE_URI`). The application should prioritize reading this from the environment. The current `app.py` constructs this path based on file locations, which is suitable for development but needs to be adaptable for production.
        *   For production, a typical `DATABASE_URL` might look like `postgresql://user:password@host:port/dbname`.
        *   The `app.py` should be modified to prefer `os.environ.get('DATABASE_URL')` if available, falling back to the local SQLite path for development.
    *   **Dockerfile**: Can be passed via `docker run -e DATABASE_URL="..."`.
    *   **Note**: The database file itself (`database.db` for SQLite) needs persistent storage using Docker volumes in a production-like deployment. The `deploy_backend.sh` script mentions this.

3.  **`FLASK_ENV` / `FLASK_DEBUG`**: Controls Flask's operating mode.
    *   **Handling**: Set as environment variables.
        *   `FLASK_ENV=production` (or `FLASK_DEBUG=0`) for production.
        *   `FLASK_ENV=development` (or `FLASK_DEBUG=1`) for development.
    *   **Gunicorn**: Gunicorn is typically used for production, and Flask's debug mode should be off. Gunicorn configurations (like number of workers) can also be set via its command-line arguments or a Gunicorn config file.

**Example `app.py` modification for `DATABASE_URL`:**
```python
# Inside backend/app.py
import os

# ... other imports ...

# Database Configuration
# Prioritize DATABASE_URL from environment for production
database_url = os.environ.get('DATABASE_URL')
if database_url:
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # Fallback to local SQLite for development
    db_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'database')
    if not os.path.exists(db_dir):
        os.makedirs(db_dir) # Ensure database directory exists
    db_path = os.path.join(db_dir, 'database.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'a_very_secret_key_for_dev_only') # Ensure a default for dev
```

## Frontend Configuration (React App)

The React frontend typically needs to know the **API endpoint for the backend**.

1.  **Backend API URL**:
    *   **Handling**: This can be managed in several ways:
        1.  **Build-time substitution**: Use environment variables during the build process (e.g., `REACT_APP_API_URL` for Create React App, or Parcel's environment variable handling). The `Dockerfile` for the frontend would need to accept build arguments or have environment variables set during the `npm run build` phase.
        2.  **Runtime configuration**: Place a `config.js` file in the `public` folder (or a similar static assets location) that is *not* part of the build. This file can be created/modified during deployment to contain the correct API URL. The `index.html` would load this config, and the React app would read from it.
            Example `public/config.js`: `window.API_CONFIG = { API_URL: 'http://localhost:5001/api' };`
            The Nginx container could have this file volume-mounted or created by an entrypoint script.
        3.  **Relative Path / Proxy**: If frontend and backend are served under the same domain (e.g., backend at `/api`), the frontend can use relative paths. Nginx can act as a reverse proxy for the backend API calls. This is often a clean solution. The `nginx.conf` would need a `location /api { proxy_pass http://backend-service-name:5001; }` block.
    *   **Current `api.js`**: The frontend `api.js` currently has `const API_URL = 'http://localhost:5001';`. This needs to be made dynamic.
        *   Using build-time environment variables (e.g., via Parcel) is common. If using Parcel, environment variables prefixed with `PARCEL_` (e.g., `PARCEL_API_URL`) can be accessed in the code as `process.env.PARCEL_API_URL`.

**Example modification for `frontend/api.js` using build-time variable:**
```javascript
// Inside frontend/api.js
import axios from 'axios';

// Default for local development, can be overridden by build-time env variable
const API_URL = process.env.PARCEL_API_URL || 'http://localhost:5001';

const apiClient = axios.create({ // ... });
// ...
```
The frontend `Dockerfile`'s build stage would then look like:
```dockerfile
# Stage 1: Build the React application
FROM node:18-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Pass the API_URL as a build-time argument if not using system env vars directly
ARG PARCEL_API_URL
ENV PARCEL_API_URL=${PARCEL_API_URL}
RUN npm run build
# ...
```
And the `docker build` command: `docker build --build-arg PARCEL_API_URL="http://your.prod.api/url" -t react-frontend-app .`

## CI/CD Pipeline Integration

-   The GitHub Actions workflow (`.github/workflows/ci_cd_pipeline.yml`) should be configured to use GitHub Secrets for sensitive information like `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `SECRET_KEY`, production `DATABASE_URL`, and any API keys.
-   These secrets would be injected as environment variables during the Docker build process (for build-time args like `PARCEL_API_URL`) or during the `docker run` / container deployment phase for runtime configurations.

This approach ensures that sensitive data is kept out of the codebase and configurations can be managed per environment.

## Logging Strategy

Effective logging is crucial for debugging, monitoring, and auditing application behavior.

**1. Backend (Flask/Gunicorn):**
    *   **Collection**:
        *   Flask and Gunicorn should be configured to output logs to `stdout` and `stderr`. This is standard practice for Dockerized applications.
        *   Gunicorn access logs provide details on incoming requests. Flask's application logger can be used for custom application logs (e.g., errors, specific business events).
        *   The Docker container's log driver can then forward these logs to a centralized logging system. Options include:
            *   **ELK Stack (Elasticsearch, Logstash, Kibana)**: A powerful open-source solution for log aggregation, searching, and visualization.
            *   **Cloud Provider Services**: AWS CloudWatch Logs, Google Cloud Logging, Azure Monitor Logs. These integrate easily if the application is hosted on these platforms.
            *   **Other SaaS solutions**: Datadog, Splunk, Logz.io.
    *   **Key Information to Log**:
        *   **Requests**: Timestamp, HTTP method, path, status code, response time, user agent, IP address (Gunicorn access logs cover much of this).
        *   **Errors**: Timestamp, error message, stack trace, request context (e.g., user ID if available, request parameters). Flask's exception logging should be captured.
        *   **Application Events**: Important business logic steps, user authentication events (login success/failure, registration), critical state changes.
        *   **Audit Trails**: For sensitive operations, log who did what and when.
        *   **Log Levels**: Use appropriate log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL) to filter logs based on severity and verbosity needs.

**2. Frontend (React/Nginx):**
    *   **Collection**:
        *   **Nginx Access and Error Logs**: Nginx logs requests and errors to files by default. In a Dockerized setup, these can also be configured to output to `stdout`/`stderr` to be captured by the Docker logging driver.
        *   **Client-Side JavaScript Errors**:
            *   Capture unhandled JavaScript errors in the React application.
            *   Send these errors to a client-side error tracking service (e.g., Sentry, Rollbar, Datadog RUM, New Relic Browser). These services provide detailed error reports, including stack traces and browser context.
            *   Can also be logged to the browser console (less useful for production monitoring) or sent to a custom backend logging endpoint (requires careful implementation).
    *   **Key Information to Log**:
        *   **Nginx**: Standard access log format (request, status, size, user agent, IP), Nginx errors.
        *   **React App (Client-Side)**: JS error messages, stack traces, component context where the error occurred, browser version, OS, user session information (if available and privacy-compliant).
        *   **API Call Failures**: Log failures of API calls made from the frontend to the backend, including the endpoint, status code, and error response if available.

## Monitoring Strategy

Monitoring provides insights into the health, performance, and availability of the application.

**1. Backend (Flask/Gunicorn):**
    *   **Key Metrics**:
        *   **Request Rate**: Number of requests per second/minute.
        *   **Error Rate**: Percentage of requests resulting in errors (e.g., HTTP 5xx, 4xx). Track specific error codes.
        *   **Response Times (Latency)**: Average, median, 95th/99th percentile response times for API endpoints.
        *   **Resource Usage**: CPU utilization, memory usage, disk I/O (if applicable for the container/host).
        *   **Database Performance**: Query latency, number of active connections (if using a more advanced DB).
        *   **Gunicorn Worker Status**: Number of active/idle workers, worker restarts.
    *   **Tools**:
        *   **Prometheus**: An open-source monitoring system that scrapes metrics from configured targets. Flask apps can expose metrics using a client library (e.g., `prometheus_flask_exporter`).
        *   **Grafana**: For visualizing metrics collected by Prometheus (or other data sources) in dashboards.
        *   **Application Performance Monitoring (APM)**: Tools like Sentry APM, New Relic, Datadog APM can provide distributed tracing, detailed performance breakdowns, and error tracking.
        *   **Cloud Provider Monitoring**: AWS CloudWatch Metrics, Google Cloud Monitoring, Azure Monitor.

**2. Frontend (React/Nginx):**
    *   **Key Metrics**:
        *   **Page Load Times**: Core Web Vitals (LCP, FID, CLS), Time to Interactive (TTI).
        *   **JavaScript Errors**: Rate and count of client-side JS errors.
        *   **API Call Performance**: Success/failure rates of API calls from the frontend, latency of these calls as perceived by the client.
        *   **User Interactions**: Track key user flows or feature usage if relevant (product analytics).
        *   **Nginx Metrics**: Active connections, requests per second, error rates (from Nginx logs or status modules).
    *   **Tools**:
        *   **Client-Side Error Tracking**: Sentry, Rollbar, LogRocket.
        *   **Real User Monitoring (RUM)**: Datadog RUM, New Relic Browser, Google Analytics (for basic metrics). These tools collect performance data directly from users' browsers.
        *   **Synthetic Monitoring**: Tools that simulate user traffic to proactively check site availability and performance (e.g., Pingdom, UptimeRobot, Datadog Synthetic Monitoring).
        *   **Prometheus/Grafana**: Nginx can expose metrics for Prometheus (e.g., using `nginx-prometheus-exporter`).

**3. Alerting Strategy:**
    Alerts notify the team when critical issues arise, enabling prompt response.
    *   **Setup**: Define alert rules based on thresholds for key metrics.
    *   **Critical Alerts Examples**:
        *   High backend error rate (e.g., >5% of requests are 5xx errors for 5 minutes).
        *   Backend service down (e.g., health check endpoint failing).
        *   High response times (e.g., 95th percentile latency > 2 seconds for critical endpoints).
        *   High CPU/memory usage (e.g., >80% for a sustained period).
        *   Spike in client-side JavaScript errors.
        *   Database connection issues or high latency.
        *   Nginx upstream errors (if Nginx acts as a reverse proxy).
    *   **Tools**:
        *   **Alertmanager**: Integrates with Prometheus to handle deduplication, grouping, and routing of alerts via email, Slack, PagerDuty, etc.
        *   **APM/Error Tracking Tools**: Sentry, New Relic, Datadog often have built-in alerting features.
        *   **Cloud Provider Alerting**: AWS CloudWatch Alarms, Google Cloud Alerts, Azure Alerts.

## Backup and Disaster Recovery

Ensuring data durability and service restorability in case of failures.

**1. Database Backups:**
    *   **Current (SQLite)**:
        *   For a file-based database like SQLite, backups involve copying the database file.
        *   **Strategy**: Regular, automated backups of the `database.db` file. This can be done using a cron job on the host if the DB file is on a mounted volume, or via a script that uses `docker exec` to run `sqlite3 .backup` inside the container.
        *   **Frequency**: Depends on data change rate and recovery point objective (RPO). Could be daily, hourly, etc.
        *   **Storage**: Store backups in a separate, secure location (e.g., cloud storage like AWS S3, Google Cloud Storage).
    *   **If using PostgreSQL/MySQL (Future Consideration)**:
        *   **Strategy**: Utilize database-native backup tools (e.g., `pg_dump` for PostgreSQL, `mysqldump` for MySQL).
        *   **Point-in-Time Recovery (PITR)**: Implement Write-Ahead Logging (WAL) archiving for PostgreSQL, or binary logging for MySQL, to enable restoration to any point in time.
        *   **Managed Database Services**: Cloud providers often offer automated backup and PITR capabilities for their managed database services (e.g., AWS RDS, Google Cloud SQL).

**2. Application State/Code:**
    *   Application code is version-controlled in Git, serving as its own backup.
    *   Docker images built by the CI/CD pipeline are stored in a Docker registry, allowing for quick redeployment of specific versions.

**3. Disaster Recovery (DR) Considerations:**
    *   **Objective**: Define Recovery Time Objective (RTO) and Recovery Point Objective (RPO).
    *   **Process**:
        1.  **Restore Database**: Restore the database from the latest viable backup. For PITR, restore to the desired point.
        2.  **Re-deploy Applications**: Deploy the backend and frontend Docker containers using the deployment scripts (`deploy_backend.sh`, `deploy_frontend.sh`) and the images from the Docker registry.
        3.  **Configuration**: Ensure all necessary environment variables and configurations are applied to the new deployments.
        4.  **Testing**: Verify the restored application is functioning correctly.
    *   **Infrastructure**: Consider infrastructure-as-code (e.g., Terraform, CloudFormation) to quickly rebuild the hosting environment if necessary.
    *   **Regional DR**: For high availability, consider deploying across multiple availability zones or regions (more complex, involves data replication and traffic management).

## Updates and Bug Fixes Process

A structured process for deploying changes to production.

**1. Development and Testing:**
    *   All changes (new features, bug fixes, dependency updates) are developed in feature branches.
    *   Code is reviewed via pull requests.
    *   Automated tests (unit, integration) are run by the CI/CD pipeline on every push/PR.
    *   Changes are merged into the main branch after successful review and tests.

**2. Staging Environment:**
    *   The CI/CD pipeline automatically deploys changes from the main branch to a staging environment.
    *   The staging environment should mirror production as closely as possible (configurations, infrastructure).
    *   Thorough testing is performed in staging:
        *   QA testing (manual or automated end-to-end tests).
        *   User Acceptance Testing (UAT) if applicable.
        *   Performance/load testing for significant changes.

**3. Production Deployment:**
    *   Deployments to production are triggered from the main branch (often after staging verification, sometimes requiring manual approval or specific tagging).
    *   The CI/CD pipeline handles the deployment process.
    *   **Deployment Strategies**:
        *   **Rolling Updates**: Gradually replace old versions of containers with new ones. Docker Swarm or Kubernetes manage this by default.
        *   **Blue/Green Deployment**: Deploy the new version alongside the old one, then switch traffic. Allows for quick rollback.
        *   **Canary Releases**: Release the new version to a small subset of users first, monitor, then gradually roll out to everyone.
        *   For this project's current setup (simple Docker run), deployment involves stopping the old container and starting a new one with the updated image. This incurs brief downtime. More advanced orchestrators are needed for zero-downtime strategies.
    *   **Dependency Updates**: Regularly update dependencies (OS packages, Python/Node.js libraries) to patch security vulnerabilities and get improvements. Test these updates thoroughly in staging. Tools like Dependabot can automate PRs for dependency updates.

**4. Post-Deployment Monitoring:**
    *   Closely monitor application performance and error rates after deployment to quickly identify and address any issues introduced by the update.

**5. Rollback Plan:**
    *   Have a clear procedure for rolling back to the previous stable version if a deployment introduces critical issues.
    *   This typically involves re-deploying the previous Docker image version.
    *   Database schema changes might require more complex rollback procedures (e.g., reverse migrations).

This structured approach minimizes risks and ensures stability.
