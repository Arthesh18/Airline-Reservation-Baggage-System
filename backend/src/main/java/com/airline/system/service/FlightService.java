package com.airline.system.service;

import com.airline.system.dao.FlightDao;
import com.airline.system.model.Flight;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
public class FlightService {

    private final FlightDao flightDao;

    public FlightService(FlightDao flightDao) {
        this.flightDao = flightDao;
    }

    @Transactional(readOnly = true)
    public List<Flight> getAllFlights() {
        return flightDao.findAll();
    }

    @Transactional(readOnly = true)
    public Flight getFlight(String id) {
        return flightDao.findById(id);
    }

    public void addFlight(Flight flight) {
        flightDao.save(flight);
    }

    public boolean updateFlight(String id, Flight flight) {
        return flightDao.update(id, flight) > 0;
    }

    public boolean deleteFlight(String id) {
        if (id == null || id.trim().isEmpty()) {
            return false;
        }

        Flight flight = flightDao.findById(id);
        if (flight == null) {
            return false;
        }

        return flightDao.delete(id) > 0;
    }
}
