package com.airline.system.service;

import com.airline.system.dao.BaggageDao;
import com.airline.system.model.Baggage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
public class BaggageService {

    private final BaggageDao baggageDao;

    public BaggageService(BaggageDao baggageDao) {
        this.baggageDao = baggageDao;
    }

    @Transactional(readOnly = true)
    public List<Baggage> getAllBaggage() {
        return baggageDao.findAll();
    }

    @Transactional(readOnly = true)
    public Baggage getBaggage(String id) {
        return baggageDao.findById(id);
    }

    public void addBaggage(Baggage baggage) {
        baggageDao.save(baggage);
    }

    public boolean updateBaggage(String id, Baggage baggage) {
        return baggageDao.update(id, baggage) > 0;
    }

    public boolean deleteBaggage(String id) {
        if (id == null || id.trim().isEmpty()) {
            return false;
        }

        Baggage baggage = baggageDao.findById(id);
        if (baggage == null) {
            return false;
        }

        // PostgreSQL cascades deletion to BAGGAGE_TRACKING and TICKET_BAGGAGE
        return baggageDao.delete(id) > 0;
    }
}
