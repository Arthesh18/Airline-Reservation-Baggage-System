
package com.airline.system.service;

import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class RouteService {

    private final Neo4jClient neo4jClient;

    public RouteService(Neo4jClient neo4jClient) {
        this.neo4jClient = neo4jClient;
    }

    public List<Map<String, Object>> searchRoutes(
            String source,
            String destination) {

        






String cypher = """
    MATCH path =
      (start:Airport {code: $source})
      -[:HAS_FLIGHT]->(:Flight)
      -[:ARRIVES_AT]->(destination:Airport)
    WHERE destination.code = $destination
    RETURN
      [node IN nodes(path) |
        CASE
          WHEN node:Airport THEN {
            type: 'Airport',
            code: node.code,
            name: node.name
          }
          WHEN node:Flight THEN {
            type: 'Flight',
            flightNo: node.flightNo
          }
          ELSE properties(node)
        END
      ] AS route

    UNION

    MATCH path =
      (start:Airport {code: $source})
      -[:HAS_FLIGHT]->(:Flight)
      -[:ARRIVES_AT]->(:Airport)
      -[:HAS_FLIGHT]->(:Flight)
      -[:ARRIVES_AT]->(destination:Airport)
    WHERE destination.code = $destination
    RETURN
      [node IN nodes(path) |
        CASE
          WHEN node:Airport THEN {
            type: 'Airport',
            code: node.code,
            name: node.name
          }
          WHEN node:Flight THEN {
            type: 'Flight',
            flightNo: node.flightNo
          }
          ELSE properties(node)
        END
      ] AS route
    """;






        try {
            return neo4jClient.query(cypher)
                    .bind(source).to("source")
                    .bind(destination).to("destination")
                    .fetch()
                    .all()
                    .stream()
                    .toList();

        } catch (Exception e) {
            System.err.println(
                    "ERROR while searching routes: "
                            + source + " -> " + destination
            );

            e.printStackTrace();

            throw e;
        }
    }
}
