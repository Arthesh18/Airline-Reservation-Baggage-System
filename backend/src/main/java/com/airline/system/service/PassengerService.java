package com.airline.system.service;

import com.airline.system.dao.BaggageDao;
import com.airline.system.dao.PassengerDao;
import com.airline.system.model.Passenger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
public class PassengerService {

    private final PassengerDao passengerDao;
    private final BaggageDao baggageDao;

    public PassengerService(PassengerDao passengerDao, BaggageDao baggageDao) {
        this.passengerDao = passengerDao;
        this.baggageDao = baggageDao;
    }

    @Transactional(readOnly = true)
    public List<Passenger> getAllPassengers() {
        return passengerDao.findAll();
    }

    @Transactional(readOnly = true)
    public Passenger getPassenger(String id) {
        return passengerDao.findById(id);
    }

    public void addPassenger(Passenger passenger) {
        passengerDao.save(passenger);
    }

    public boolean updatePassenger(String id, Passenger passenger) {
        return passengerDao.update(id, passenger) > 0;
    }

    public boolean deletePassenger(String id) {
        if (id == null || id.trim().isEmpty()) {
            return false;
        }

        Passenger passenger = passengerDao.findById(id);
        if (passenger == null) {
            return false;
        }

        // Identify baggage items linked to this passenger's tickets before cascading deletion
        List<String> baggageIds = passengerDao.findBaggageIdsByPassengerId(id);

        // Delete passenger: MySQL cascades to passenger_phone, reservation -> ticket -> payment, ticket_baggage
        passengerDao.delete(id);

        // Clean up orphaned baggage and their tracking records
        for (String baggageId : baggageIds) {
            if (passengerDao.countTicketBaggageByBaggageId(baggageId) == 0) {
                baggageDao.delete(baggageId);
            }
        }

        return true;
    }
}
