package com.airline.system.service;

import com.airline.system.dao.PassengerDao;
import com.airline.system.model.Passenger;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PassengerService {

    private final PassengerDao passengerDao;

    public PassengerService(PassengerDao passengerDao) {
        this.passengerDao = passengerDao;
    }

    public List<Passenger> getAllPassengers() {
        return passengerDao.findAll();
    }

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
        return passengerDao.delete(id) > 0;
    }
}