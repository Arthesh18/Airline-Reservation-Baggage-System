package com.airline.system.service;

import com.airline.system.dao.ReservationDao;
import com.airline.system.model.Reservation;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    private final ReservationDao reservationDao;

    public ReservationService(ReservationDao reservationDao) {
        this.reservationDao = reservationDao;
    }

    public List<Reservation> getAllReservations() {
        return reservationDao.findAll();
    }

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
        return reservationDao.delete(id) > 0;
    }
}