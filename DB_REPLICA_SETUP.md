# Database Read Replica Setup

This document provides instructions on how to set up a read replica for your Supabase Postgres database. Using a read replica can significantly improve the performance of your application by offloading read-heavy queries from your primary database.

## 1. Create a Read Replica in Supabase

1.  **Go to your Supabase dashboard:** Select your project.
2.  **Navigate to Infrastructure > Read Replicas:** In the left sidebar, go to the "Infrastructure" section and click on "Read Replicas".
3.  **Launch a new Read Replica:** Click on the "Launch new read replica" button.
4.  **Choose a region:** Select a region for your read replica. It's usually best to choose a region that is geographically close to your users or your application server.
5.  **Launch:** Click "Launch" to create the read replica. This process may take a few minutes.

## 2. Get the Read Replica Connection String

Once the read replica is created, you will need to get its connection string.

1.  **Go to the Read Replicas page:** In your Supabase dashboard, go to **Infrastructure > Read Replicas**.
2.  **Select your read replica:** Click on the read replica you just created.
3.  **Find the connection string:** In the "Connection info" section, you will find the connection string for your read replica. It will look something like this: `postgres://postgres:[YOUR-PASSWORD]@[REGION].pooler.supabase.com:6543/postgres`.

## 3. Configure the Application to Use the Read Replica

Now, you need to configure the application to use the read replica for read-only queries. This involves creating a new environment variable for the read replica's connection string and updating the database client initialization.

1.  **Add a new environment variable:** In your `.env` file (and in your hosting provider's environment variables), add a new variable called `READ_REPLICA_DATABASE_URL` with the connection string you got from the Supabase dashboard.
2.  **Update the application code:** I will handle this part of the process. I will modify the Supabase client initialization to create a separate client for the read replica and use it for read-only queries.
