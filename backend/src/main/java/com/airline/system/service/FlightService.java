package com.airline.system.service;

import com.airline.system.dao.FlightDao;
import com.airline.system.model.Flight;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightService {

    private final FlightDao flightDao;

    public FlightService(FlightDao flightDao) {
        this.flightDao = flightDao;
    }

    public List<Flight> getAllFlights() {
        return flightDao.findAll();
    }

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
        return flightDao.delete(id) > 0;
    }
}