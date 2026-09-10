package com.airline.system.service;

import com.airline.system.dao.BaggageDao;
import com.airline.system.model.Baggage;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BaggageService {

    private final BaggageDao baggageDao;

    public BaggageService(BaggageDao baggageDao) {
        this.baggageDao = baggageDao;
    }

    public List<Baggage> getAllBaggage() {
        return baggageDao.findAll();
    }

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
        return baggageDao.delete(id) > 0;
    }
}