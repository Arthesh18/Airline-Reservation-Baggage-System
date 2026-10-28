package com.airline.system.service;

import com.airline.system.dao.BaggageTrackingDao;
import com.airline.system.model.BaggageTracking;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
public class BaggageTrackingService {

    private final BaggageTrackingDao baggageTrackingDao;

    public BaggageTrackingService(BaggageTrackingDao baggageTrackingDao) {
        this.baggageTrackingDao = baggageTrackingDao;
    }

    @Transactional(readOnly = true)
    public List<BaggageTracking> getAllTracking() {
        return baggageTrackingDao.findAll();
    }

    @Transactional(readOnly = true)
    public BaggageTracking getTracking(String baggageID, String trackingID) {
        return baggageTrackingDao.findById(baggageID, trackingID);
    }

    @Transactional(readOnly = true)
    public BaggageTracking getTracking(String baggageID, String trackingID, OffsetDateTime scanTime) {
        return baggageTrackingDao.findById(baggageID, trackingID, scanTime);
    }

    @Transactional(readOnly = true)
    public List<BaggageTracking> getBaggageTimeline(String baggageID) {
        return baggageTrackingDao.findTimelineByBaggageId(baggageID);
    }

    public void addTracking(BaggageTracking tracking) {
        baggageTrackingDao.save(tracking);
    }

    public boolean updateTracking(String baggageID, String trackingID, BaggageTracking tracking) {
        return baggageTrackingDao.update(baggageID, trackingID, tracking) > 0;
    }

    public boolean updateTracking(String baggageID, String trackingID, OffsetDateTime scanTime, BaggageTracking tracking) {
        return baggageTrackingDao.update(baggageID, trackingID, scanTime, tracking) > 0;
    }

    public boolean deleteTracking(String baggageID, String trackingID) {
        if (baggageID == null || baggageID.trim().isEmpty() ||
                trackingID == null || trackingID.trim().isEmpty()) {
            return false;
        }

        BaggageTracking existing = baggageTrackingDao.findById(baggageID, trackingID);
        if (existing == null) {
            return false;
        }

        return baggageTrackingDao.delete(baggageID, trackingID) > 0;
    }

    public boolean deleteTracking(String baggageID, String trackingID, OffsetDateTime scanTime) {
        return baggageTrackingDao.delete(baggageID, trackingID, scanTime) > 0;
    }
}
