package com.airline.system.service;

import com.airline.system.dao.AirportDao;
import com.airline.system.model.Airport;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AirportService {

    private final AirportDao airportDao;

    public AirportService(AirportDao airportDao) {
        this.airportDao = airportDao;
    }

    public List<Airport> getAllAirports() {
        return airportDao.findAll();
    }

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
        return airportDao.delete(id) > 0;
    }
}