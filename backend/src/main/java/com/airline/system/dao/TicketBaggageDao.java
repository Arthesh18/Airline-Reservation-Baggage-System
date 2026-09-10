package com.airline.system.dao;

import com.airline.system.model.TicketBaggage;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TicketBaggageDao {

    private final JdbcTemplate jdbcTemplate;

    public TicketBaggageDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<TicketBaggage> findAll() {

        String sql = """
                SELECT ReservationID, TicketNo, BaggageID, CheckedInDate
                FROM TICKET_BAGGAGE
                ORDER BY ReservationID, TicketNo, BaggageID
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new TicketBaggage(
                        rs.getString("ReservationID"),
                        rs.getString("TicketNo"),
                        rs.getString("BaggageID"),
                        rs.getDate("CheckedInDate").toLocalDate()
                )
        );
    }

    public TicketBaggage findById(String reservationID,
                                   String ticketNo,
                                   String baggageID) {

        String sql = """
                SELECT ReservationID, TicketNo, BaggageID, CheckedInDate
                FROM TICKET_BAGGAGE
                WHERE ReservationID = ?
                  AND TicketNo = ?
                  AND BaggageID = ?
                """;

        List<TicketBaggage> records = jdbcTemplate.query(
                sql,
                (rs, rowNum) ->
                        new TicketBaggage(
                                rs.getString("ReservationID"),
                                rs.getString("TicketNo"),
                                rs.getString("BaggageID"),
                                rs.getDate("CheckedInDate").toLocalDate()
                        ),
                reservationID,
                ticketNo,
                baggageID
        );

        return records.isEmpty() ? null : records.get(0);
    }

    public int save(TicketBaggage ticketBaggage) {

        String sql = """
                INSERT INTO TICKET_BAGGAGE
                (ReservationID, TicketNo, BaggageID, CheckedInDate)
                VALUES (?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                ticketBaggage.getReservationID(),
                ticketBaggage.getTicketNo(),
                ticketBaggage.getBaggageID(),
                ticketBaggage.getCheckedInDate()
        );
    }

    public int update(String reservationID, String ticketNo,
                      String baggageID,
                      TicketBaggage ticketBaggage) {

        String sql = """
                UPDATE TICKET_BAGGAGE
                SET CheckedInDate = ?
                WHERE ReservationID = ?
                  AND TicketNo = ?
                  AND BaggageID = ?
                """;

        return jdbcTemplate.update(
                sql,
                ticketBaggage.getCheckedInDate(),
                reservationID,
                ticketNo,
                baggageID
        );
    }

    public int delete(String reservationID, String ticketNo,
                      String baggageID) {

        String sql = """
                DELETE FROM TICKET_BAGGAGE
                WHERE ReservationID = ?
                  AND TicketNo = ?
                  AND BaggageID = ?
                """;

        return jdbcTemplate.update(
                sql,
                reservationID,
                ticketNo,
                baggageID
        );
    }
}