package com.airline.system.service;

import com.airline.system.dao.AirportDao;
import com.airline.system.model.Airport;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
public class AirportService {

    private final AirportDao airportDao;

    public AirportService(AirportDao airportDao) {
        this.airportDao = airportDao;
    }

    @Transactional(readOnly = true)
    public List<Airport> getAllAirports() {
        return airportDao.findAll();
    }

    @Transactional(readOnly = true)
    public Airport getAirport(String id) {
        return airportDao.findById(id);
    }

    public void addAirport(Airport airport) {
        airportDao.save(airport);
    }

    public boolean updateAirport(String id, Airport airport) {
        return airportDao.update(id, airport) > 0;
    }

    public boolean deleteAirport(String id) {
        if (id == null || id.trim().isEmpty()) {
            return false;
        }

        Airport airport = airportDao.findById(id);
        if (airport == null) {
            return false;
        }

        int reservationCount = airportDao.countReservationsByAirportId(id);
        if (reservationCount > 0) {
            throw new IllegalStateException(
                    "Cannot delete airport " + id + " because it is referenced by " +
                            reservationCount + " existing reservation(s). Airports with active reservations cannot be deleted."
            );
        }

        return airportDao.delete(id) > 0;
    }
}
