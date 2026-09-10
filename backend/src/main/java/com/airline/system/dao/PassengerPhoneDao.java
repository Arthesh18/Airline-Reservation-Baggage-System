package com.airline.system.dao;

import com.airline.system.model.PassengerPhone;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PassengerPhoneDao {

    private final JdbcTemplate jdbcTemplate;

    public PassengerPhoneDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<PassengerPhone> findAll() {

        String sql = """
                SELECT PassengerID, Phone
                FROM PASSENGER_PHONE
                ORDER BY PassengerID, Phone
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new PassengerPhone(
                        rs.getString("PassengerID"),
                        rs.getString("Phone")
                )
        );
    }

    public PassengerPhone findById(
            String passengerID,
            String phone) {

        String sql = """
                SELECT PassengerID, Phone
                FROM PASSENGER_PHONE
                WHERE PassengerID = ?
                  AND Phone = ?
                """;

        List<PassengerPhone> phones = jdbcTemplate.query(
                sql,
                (rs, rowNum) ->
                        new PassengerPhone(
                                rs.getString("PassengerID"),
                                rs.getString("Phone")
                        ),
                passengerID,
                phone
        );

        return phones.isEmpty() ? null : phones.get(0);
    }

    public int save(PassengerPhone passengerPhone) {

        String sql = """
                INSERT INTO PASSENGER_PHONE
                (PassengerID, Phone)
                VALUES (?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                passengerPhone.getPassengerID(),
                passengerPhone.getPhone()
        );
    }

    public int update(
            String passengerID,
            String phone,
            PassengerPhone passengerPhone) {

        String sql = """
                UPDATE PASSENGER_PHONE
                SET Phone = ?
                WHERE PassengerID = ?
                  AND Phone = ?
                """;

        return jdbcTemplate.update(
                sql,
                passengerPhone.getPhone(),
                passengerID,
                phone
        );
    }

    public int delete(
            String passengerID,
            String phone) {

        String sql = """
                DELETE FROM PASSENGER_PHONE
                WHERE PassengerID = ?
                  AND Phone = ?
                """;

        return jdbcTemplate.update(
                sql,
                passengerID,
                phone
        );
    }
}