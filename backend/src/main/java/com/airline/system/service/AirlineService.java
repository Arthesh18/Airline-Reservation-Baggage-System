package com.airline.system.service;

import com.airline.system.dao.AirlineDao;
import com.airline.system.model.Airline;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
public class AirlineService {

    private final AirlineDao airlineDao;

    public AirlineService(AirlineDao airlineDao) {
        this.airlineDao = airlineDao;
    }

    @Transactional(readOnly = true)
    public List<Airline> getAllAirlines() {
        return airlineDao.findAll();
    }

    @Transactional(readOnly = true)
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
        if (id == null || id.trim().isEmpty()) {
            return false;
        }

        Airline airline = airlineDao.findById(id);
        if (airline == null) {
            return false;
        }

        int flightCount = airlineDao.countFlightsByAirlineId(id);
        if (flightCount > 0) {
            throw new IllegalStateException(
                    "Cannot delete airline " + id + " because " +
                            flightCount + " flight(s) are assigned to it. Remove or reassign flights before deleting this airline."
            );
        }

        return airlineDao.delete(id) > 0;
    }
}
