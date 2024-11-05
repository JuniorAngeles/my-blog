---
title: 'Guía de Migración de Base de Datos PostgreSQL'
description: 'Esta guía documenta todos los pasos realizados durante la migración de la base de datos desde un archivo de respaldo hacia un servidor de PostgreSQL, incluyendo los comandos utilizados, errores comunes y sus soluciones.'
pubDate: 'Nov 05 2024'
heroImage: '/blog-migrate-data/migrate-data.jpg'
author: 'Junior Ángeles'
lang: 'es'
---

Esta guía documenta todos los pasos realizados durante la migración de la base de datos desde un archivo de respaldo hacia un servidor de PostgreSQL, incluyendo los comandos utilizados, errores comunes y sus soluciones..

## Preparativos iniciales

- Comprensión del archivo de copia de seguridad: la base de datos que se iba a migrar estaba en un archivo .backup, que incluía tanto la estructura como los datos de la base de datos original.

- Requisitos del sistema: asegúrese de que la máquina de destino (DigitalOcean) esté lista para recibir la base de datos y que el usuario tenga las credenciales necesarias.

## 1 Configuración de conexión en pgAdmin

- Abra pgAdmin y configure una nueva conexión al servidor de DigitalOcean:
  - Nombre/dirección del host: dirección del host proporcionada por DigitalOcean.
  - Puerto: Generalmente, puerto 25060 para conexiones de DigitalOcean.
  - Nombre de usuario: doadmin (o el usuario que DigitalOcean proporcione).
  - Contraseña: Contraseña proporcionada por DigitalOcean para este usuario.
  - Base de datos: defaultdb (o el nombre de la base de datos a la que se migrarán los datos).

## 2 Restauración inicial con pg_restore

- Se intentó restaurar la base de datos usando el comando pg_restore en la línea de comando de Windows para tener más control sobre el proceso:

  - ```markdown
    "C:\Program Files\PostgreSQL\16\bin\pg_restore.exe" --host "db-postgresql-nyc3-34698-do-user-16477646-0.f.db.ondigitalocean.com" --port "25060" --username "doadmin" --password --dbname "defaultdb" --no-owner --no-privileges --verbose "C:\Users\Junior\OneDrive\Escritorio\backup-inventori\inventori-back-5.backup"
    ```

## 3 Errores comunes y soluciones

- 3.1 Contraseña no proporcionada

  - Error: pg_restore: falló la conexión al servidor: fe_sendauth: no se proporcionó contraseña
  - Solución: utilice la opción --password sin especificar la contraseña en el comando para que pg_restore se la solicite de forma interactiva.

- 3.2 restricciones de clave principal
  - Error: el valor de clave duplicado viola la restricción única.
  - Solución: Usamos la opción --data-only para importar solo los datos y --disable-triggers para evitar errores relacionados con restricciones clave. Aún así, si los valores ya existen, la solución sería eliminar esos datos previamente duplicados.

## 4. Comando con opciones para evitar errores duplicados

- ```markdown
  "C:\Program Files\PostgreSQL\16\bin\pg_restore.exe" --host "db-postgresql-nyc3-34698-do-user-16477646-0.f.db.ondigitalocean.com" --port "25060" --username "doadmin" --password --dbname "defaultdb" --no-owner --no-privileges --data-only --disable-triggers --verbose "C:\Users\Junior\OneDrive\Escritorio\backup-inventori\inventori-back-5.backup"
  ```

## 5. Usando la interfaz gráfica de pgAdmin

- Abra pgAdmin: Vaya a la opción "Restaurar" desde el servidor donde desea restaurar la base de datos.
- Seleccione el Archivo: En la pestaña "General", seleccione el archivo .backup en la opción "Nombre de archivo".
- Opciones adicionales: En "Opciones de datos", puedes especificar que solo deseas importar los datos y desactivar las restricciones para evitar errores duplicados.

## 6. Gestión de desencadenantes y restricciones

- Durante la restauración, se utilizaron opciones para deshabilitar los activadores y evitar problemas con restricciones de claves externas.
- Comando utilizado: --disable-triggers para garantizar que los activadores no interfieran con la carga de datos.

## 7. Consideraciones finales

- Si encuentra problemas relacionados con usuarios o roles que no existen (por ejemplo, el rol "predeterminado" no existe), asegúrese de que los roles definidos en el archivo de respaldo estén presentes o use la opción --no-owner.

- Para evitar errores de permisos con disparadores del sistema, es necesario tener privilegios de superusuario o modificar la configuración de pg_hba.conf para permitir el acceso desde su IP.

Para obtener más información, <a hfre="https://www.postgresql.org/docs/">consulte la documentación oficial de PostgreSQL</a>.
