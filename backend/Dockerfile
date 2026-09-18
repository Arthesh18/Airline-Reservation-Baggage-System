FROM eclipse-temurin:25-jdk

WORKDIR /app

COPY . .

RUN chmod +x backend/mvnw
RUN ./backend/mvnw clean package -DskipTests

CMD ["sh", "-c", "java -jar backend/target/airline-system-0.0.1-SNAPSHOT.jar"]