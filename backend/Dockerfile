FROM eclipse-temurin:25-jdk

WORKDIR /app

# Copy all files from build context
COPY . .

# If building from repo root, sync frontend into static and enter backend directory
RUN if [ -d "backend" ]; then \
      if [ -d "frontend" ] && [ -d "backend/src/main/resources/static" ]; then \
        cp -r frontend/* backend/src/main/resources/static/; \
      fi; \
      cd backend; \
    fi && \
    chmod +x mvnw && \
    ./mvnw clean package -DskipTests && \
    mkdir -p /app/target && \
    cp target/*.jar /app/target/airline-system-0.0.1-SNAPSHOT.jar 2>/dev/null || true

CMD ["sh", "-c", "if [ -f backend/target/airline-system-0.0.1-SNAPSHOT.jar ]; then java -jar backend/target/airline-system-0.0.1-SNAPSHOT.jar; else java -jar target/airline-system-0.0.1-SNAPSHOT.jar; fi"]
