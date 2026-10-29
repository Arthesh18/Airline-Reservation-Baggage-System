package com.airline.system.service;

import com.airline.system.dao.BaggageDao;
import com.airline.system.dao.PassengerDao;
import com.airline.system.dao.ReservationDao;
import com.airline.system.model.Reservation;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
public class ReservationService {

    private final ReservationDao reservationDao;
    private final PassengerDao passengerDao;
    private final BaggageDao baggageDao;

    public ReservationService(ReservationDao reservationDao,
                              PassengerDao passengerDao,
                              BaggageDao baggageDao) {
        this.reservationDao = reservationDao;
        this.passengerDao = passengerDao;
        this.baggageDao = baggageDao;
    }

    @Transactional(readOnly = true)
    public List<Reservation> getAllReservations() {
        return reservationDao.findAll();
    }

    @Transactional(readOnly = true)
    public Reservation getReservation(String id) {
        return reservationDao.findById(id);
    }

    public void addReservation(Reservation reservation) {
        reservationDao.save(reservation);
    }

    public boolean updateReservation(String id, Reservation reservation) {
        return reservationDao.update(id, reservation) > 0;
    }

    public boolean deleteReservation(String id) {
        if (id == null || id.trim().isEmpty()) {
            return false;
        }

        Reservation reservation = reservationDao.findById(id);
        if (reservation == null) {
            return false;
        }

        // Identify baggage items linked to this reservation's tickets
        List<String> baggageIds = reservationDao.findBaggageIdsByReservationId(id);

        // Delete reservation: PostgreSQL cascades to ticket -> payment, ticket_baggage
        reservationDao.delete(id);

        // Clean up orphaned baggage and their tracking records
        for (String baggageId : baggageIds) {
            if (passengerDao.countTicketBaggageByBaggageId(baggageId) == 0) {
                baggageDao.delete(baggageId);
            }
        }

        return true;
    }
}
