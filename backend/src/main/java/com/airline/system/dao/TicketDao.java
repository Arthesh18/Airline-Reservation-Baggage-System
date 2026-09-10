package com.airline.system.dao;

import com.airline.system.model.Ticket;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TicketDao {

    private final JdbcTemplate jdbcTemplate;

    public TicketDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Ticket> findAll() {

        String sql = """
                SELECT ReservationID, TicketNo, SeatNo, Fare
                FROM TICKET
                ORDER BY ReservationID, TicketNo
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Ticket(
                        rs.getString("ReservationID"),
                        rs.getString("TicketNo"),
                        rs.getString("SeatNo"),
                        rs.getBigDecimal("Fare")
                )
        );
    }

    public Ticket findById(String reservationID, String ticketNo) {

        String sql = """
                SELECT ReservationID, TicketNo, SeatNo, Fare
                FROM TICKET
                WHERE ReservationID = ?
                  AND TicketNo = ?
                """;

        List<Ticket> tickets = jdbcTemplate.query(sql, (rs, rowNum) ->
                new Ticket(
                        rs.getString("ReservationID"),
                        rs.getString("TicketNo"),
                        rs.getString("SeatNo"),
                        rs.getBigDecimal("Fare")
                ), reservationID, ticketNo);

        return tickets.isEmpty() ? null : tickets.get(0);
    }

    public int save(Ticket ticket) {

        String sql = """
                INSERT INTO TICKET
                (ReservationID, TicketNo, SeatNo, Fare)
                VALUES (?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                ticket.getReservationID(),
                ticket.getTicketNo(),
                ticket.getSeatNo(),
                ticket.getFare()
        );
    }

    public int update(String reservationID, String ticketNo,
                      Ticket ticket) {

        String sql = """
                UPDATE TICKET
                SET SeatNo = ?,
                    Fare = ?
                WHERE ReservationID = ?
                  AND TicketNo = ?
                """;

        return jdbcTemplate.update(
                sql,
                ticket.getSeatNo(),
                ticket.getFare(),
                reservationID,
                ticketNo
        );
    }

    public int delete(String reservationID, String ticketNo) {

        String sql = """
                DELETE FROM TICKET
                WHERE ReservationID = ?
                  AND TicketNo = ?
                """;

        return jdbcTemplate.update(
                sql,
                reservationID,
                ticketNo
        );
    }
}