FROM eclipse-temurin:25-jdk

WORKDIR /app

COPY backend/ .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

CMD ["sh", "-c", "java -jar target/airline-system-0.0.1-SNAPSHOT.jar"]