---
title: 'PostgreSQL Database Migration to DigitalOcean'
description: 'In this blog you will learn how to migrate data from the vercel database service to a Digital Ocean postgre database.'
pubDate: 'Nov 05 2024'
heroImage: '/blog-migrate-data/migrate-data.jpg'
author: 'Junior Ángeles'
lang: 'en'
---

In this blog you will learn how to migrate data from the vercel database service to a Digital Ocean postgre database..

## Initial Preparations

- Understanding the backup file: The database to be migrated was in a .backup file, which included both the structure and data of the original database.

- System Requirements: Ensure that the target machine (DigitalOcean) is ready to receive the database and that the user has the necessary credentials.

## 1 Connection Configuration in pgAdmin

- Open pgAdmin and configure a new connection to the DigitalOcean server:
  - Host name/address: Host address provided by DigitalOcean.
  - Port: Generally, port 25060 for DigitalOcean connections.
  - Username: doadmin (or the user that DigitalOcean provides).
  - Password: Password provided by DigitalOcean for this user.
  - Database: defaultdb (or the name of the database to which the data will be migrated).

## 2 Initial Restore with pg_restore

- An attempt was made to restore the database using the pg_restore command on the Windows command line for more control over the process:

  - ```markdown
    "C:\Program Files\PostgreSQL\16\bin\pg_restore.exe" --host "db-postgresql-nyc3-34698-do-user-16477646-0.f.db.ondigitalocean.com" --port "25060" --username "doadmin" --password --dbname "defaultdb" --no-owner --no-privileges --verbose "C:\Users\Junior\OneDrive\Escritorio\backup-inventori\inventori-back-5.backup"
    ```

## 3 Common Errors and Solutions

- 3.1 Password Not Provided Error

  - Error: pg_restore: connection to server failed: fe_sendauth: no password supplied
  - Solution: Use the --password option without specifying the password in the command so that pg_restore prompts you for it interactively.

- 3.2 Primary Key Constraints Error
  - Error: duplicate key value violates unique constraint.
  - Solution: We use the --data-only option to import only the data and --disable-triggers to avoid errors related to key restrictions. Still, if the values ​​already exist, the solution would be to delete that previously duplicated data.

## 4. Command with Options to Avoid Duplicate Errors

- ```markdown
  "C:\Program Files\PostgreSQL\16\bin\pg_restore.exe" --host "db-postgresql-nyc3-34698-do-user-16477646-0.f.db.ondigitalocean.com" --port "25060" --username "doadmin" --password --dbname "defaultdb" --no-owner --no-privileges --data-only --disable-triggers --verbose "C:\Users\Junior\OneDrive\Escritorio\backup-inventori\inventori-back-5.backup"
  ```

## 5. Using the pgAdmin Graphical Interface

- Open pgAdmin: Go to the "Restore" option from the server where you want to restore the database.
- Select the File: In the "General" tab, select the .backup file in the "Filename" option.
- Additional Options: In "Data Options", you can specify that you only want to import the data and disable restrictions to avoid duplicate errors.

## 6. Management of Triggers and Constraints

- During the restore, options were used to disable triggers and avoid problems with foreign key restrictions.
- Command Used: --disable-triggers to ensure that triggers do not interfere with data loading.

## 7. Final Considerations

- If you encounter problems related to users or roles that do not exist (e.g. role "default" does not exist), make sure that the roles defined in the backup file are present or use the --no-owner option.

- To avoid permission errors with system triggers, it is necessary to have superuser privileges or modify the pg_hba.conf configuration to allow access from your IP.

For more information, <a hfre="https://www.postgresql.org/docs/">consult the official PostgreSQL documentation</a>.
