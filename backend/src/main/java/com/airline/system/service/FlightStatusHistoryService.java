package com.airline.system.service;

import com.airline.system.dao.FlightStatusHistoryDao;
import com.airline.system.model.FlightStatusHistory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
public class FlightStatusHistoryService {

    private final FlightStatusHistoryDao flightStatusHistoryDao;

    public FlightStatusHistoryService(FlightStatusHistoryDao flightStatusHistoryDao) {
        this.flightStatusHistoryDao = flightStatusHistoryDao;
    }

    @Transactional(readOnly = true)
    public List<FlightStatusHistory> getAllStatusHistory() {
        return flightStatusHistoryDao.findAll();
    }

    @Transactional(readOnly = true)
    public List<FlightStatusHistory> getHistoryByFlightId(String flightID) {
        return flightStatusHistoryDao.findByFlightId(flightID);
    }

    @Transactional(readOnly = true)
    public FlightStatusHistory getHistoryById(Long historyID) {
        return flightStatusHistoryDao.findById(historyID);
    }

    public void recordStatusChange(FlightStatusHistory history) {
        flightStatusHistoryDao.save(history);
    }

    public boolean deleteHistory(Long historyID) {
        return flightStatusHistoryDao.delete(historyID) > 0;
    }
}
