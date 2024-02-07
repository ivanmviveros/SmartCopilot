## Despliegue con docker compose
0. Instalar Docker y Docker compose
1. Ir a la carpeta deployment
2. Configurar el entorno
   1. Configurar el entorno de compilación
      - crear un archivo .env en la carpeta deployment, la misma carpeta donde se encuentra docker-compose.yml
      - agregar las variables requeridas al archivo .env como se muestra en el siguiente ejemplo:
      ```
      DATABASE_NAME=ebpm
      DATABASE_USER=ebpm
      DATABASE_PASSWORD=ebpm
      DATABASE_HOST=db
      DATABASE_PORT=5432
      ```
   2. Configurar el entorno de React
      - crear un archivo react.env en la carpeta deployment, la misma carpeta donde se encuentra docker-compose.yml
      - agregar las variables requeridas al archivo react.env como se muestra en el siguiente ejemplo:
      ```
      REACT_APP_API_HOST="http://localhost/backend"
      ```
3. Compilar Docker Compose
   ```
   docker-compose -p ebpm --env-file ./.env build --no-cache
   ```

4. Iniciar Docker Compose
   ```
   docker-compose -p ebpm --env-file ./.env up -d db migration
   docker-compose -p ebpm --env-file ./.env up
   ```

5. Ir a la página de inicio en http://localhost:80



## Docker compose deployment
0. Install Docker and Docker compose
1. Go to deployment folder
2. Set up environment
   1. Set up build environment
      - create .env file at the deployment folder, the same folder where docker-compose.yml is located
      - add required variables to .env file like the example below:
      ```
      DATABASE_NAME=ebpm
      DATABASE_USER=ebpm
      DATABASE_PASSWORD=ebpm
      DATABASE_HOST=db
      DATABASE_PORT=5432
      ```
   2. Set React environment   
      - create react.env file at the deployment folder, the same folder where docker-compose.yml is located
      - add required variables to react.env file like the example below:
      ```
      REACT_APP_API_HOST="http://localhost/backend"
      ```

3. Build docker compose
   ```
   docker-compose -p ebpm --env-file ./.env build --no-cache
   ```
4. Start docker compose
   ```
   docker-compose -p ebpm --env-file ./.env up -d db migration
   docker-compose -p ebpm --env-file ./.env up
   ```
5. Go to homepage at http://localhost:80