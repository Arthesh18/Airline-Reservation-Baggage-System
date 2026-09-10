package com.airline.system.service;

import com.airline.system.dao.BaggageTrackingDao;
import com.airline.system.model.BaggageTracking;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BaggageTrackingService {

    private final BaggageTrackingDao baggageTrackingDao;

    public BaggageTrackingService(BaggageTrackingDao baggageTrackingDao) {
        this.baggageTrackingDao = baggageTrackingDao;
    }

    public List<BaggageTracking> getAllTracking() {
        return baggageTrackingDao.findAll();
    }

    public BaggageTracking getTracking(String baggageID, String trackingID) {
        return baggageTrackingDao.findById(baggageID, trackingID);
    }

    public void addTracking(BaggageTracking tracking) {
        baggageTrackingDao.save(tracking);
    }

    public boolean updateTracking(String baggageID, String trackingID,
                                  BaggageTracking tracking) {
        return baggageTrackingDao.update(
                baggageID,
                trackingID,
                tracking
        ) > 0;
    }

    public boolean deleteTracking(String baggageID, String trackingID) {
        return baggageTrackingDao.delete(
                baggageID,
                trackingID
        ) > 0;
    }
}