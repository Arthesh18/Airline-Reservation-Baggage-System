package com.airline.system.service;

import com.airline.system.dao.AirlineDao;
import com.airline.system.model.Airline;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AirlineService {

    private final AirlineDao airlineDao;

    public AirlineService(AirlineDao airlineDao) {
        this.airlineDao = airlineDao;
    }

    public List<Airline> getAllAirlines() {
        return airlineDao.findAll();
    }

    public Airline getAirline(String id) {
        return airlineDao.findById(id);
    }

    public void addAirline(Airline airline) {
        airlineDao.save(airline);
    }

    public boolean updateAirline(String id, Airline airline) {
        return airlineDao.update(id, airline) > 0;
    }

    public boolean deleteAirline(String id) {
        return airlineDao.delete(id) > 0;
    }
}