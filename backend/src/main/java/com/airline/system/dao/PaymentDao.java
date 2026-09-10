package com.airline.system.dao;

import com.airline.system.model.Payment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PaymentDao {

    private final JdbcTemplate jdbcTemplate;

    public PaymentDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Payment> findAll() {

        String sql = """
                SELECT PaymentID, ReservationID, TicketNo,
                       Amount, PaymentMethod
                FROM PAYMENT
                ORDER BY PaymentID
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Payment(
                        rs.getString("PaymentID"),
                        rs.getString("ReservationID"),
                        rs.getString("TicketNo"),
                        rs.getBigDecimal("Amount"),
                        rs.getString("PaymentMethod")
                )
        );
    }

    public Payment findById(String id) {

        String sql = """
                SELECT PaymentID, ReservationID, TicketNo,
                       Amount, PaymentMethod
                FROM PAYMENT
                WHERE PaymentID = ?
                """;

        List<Payment> payments = jdbcTemplate.query(sql, (rs, rowNum) ->
                new Payment(
                        rs.getString("PaymentID"),
                        rs.getString("ReservationID"),
                        rs.getString("TicketNo"),
                        rs.getBigDecimal("Amount"),
                        rs.getString("PaymentMethod")
                ), id);

        return payments.isEmpty() ? null : payments.get(0);
    }

    public int save(Payment payment) {

        String sql = """
                INSERT INTO PAYMENT
                (PaymentID, ReservationID, TicketNo,
                 Amount, PaymentMethod)
                VALUES (?, ?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                payment.getPaymentID(),
                payment.getReservationID(),
                payment.getTicketNo(),
                payment.getAmount(),
                payment.getPaymentMethod()
        );
    }

    public int update(String id, Payment payment) {

        String sql = """
                UPDATE PAYMENT
                SET ReservationID = ?,
                    TicketNo = ?,
                    Amount = ?,
                    PaymentMethod = ?
                WHERE PaymentID = ?
                """;

        return jdbcTemplate.update(
                sql,
                payment.getReservationID(),
                payment.getTicketNo(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                id
        );
    }

    public int delete(String id) {

        String sql = """
                DELETE FROM PAYMENT
                WHERE PaymentID = ?
                """;

        return jdbcTemplate.update(sql, id);
    }
}