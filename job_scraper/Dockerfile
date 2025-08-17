# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the scraper code into the container at /app
COPY . .

# Set environment variables for Supabase and Adzuna (to be passed at runtime)
ENV SUPABASE_URL=""
ENV SUPABASE_SERVICE_ROLE_KEY=""
ENV ADZUNA_APP_ID=""
ENV ADZUNA_API_KEY=""

# Run main.py when the container launches
CMD ["python", "main.py"]
