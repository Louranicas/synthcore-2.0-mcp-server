# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend application code into the container at /app
COPY . .

# Make port 5001 available to the world outside this container
EXPOSE 5001

# Define environment variables (if any, for Gunicorn or Flask)
# ENV FLASK_APP app.py # Not strictly needed if using Gunicorn directly with module:app
# ENV FLASK_RUN_HOST 0.0.0.0 # For flask dev server, Gunicorn uses its own binding

# Command to run the application using Gunicorn
# The User and Item models need the database to be created.
# The current app.py runs db.create_all() only when __name__ == '__main__'.
# For Gunicorn, this won't run automatically.
# A separate script or command might be needed to initialize the DB in a deployed environment.
# For now, this Dockerfile assumes the DB is initialized externally or via a one-off command.
# Gunicorn command: gunicorn [OPTIONS] MODULE_NAME:VARIABLE_NAME
# Assuming app.py has an 'app' Flask instance.
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "app:app"]
