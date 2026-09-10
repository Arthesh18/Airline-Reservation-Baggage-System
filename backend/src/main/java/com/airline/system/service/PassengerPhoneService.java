package com.airline.system.service;

import com.airline.system.dao.PassengerPhoneDao;
import com.airline.system.model.PassengerPhone;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PassengerPhoneService {

    private final PassengerPhoneDao passengerPhoneDao;

    public PassengerPhoneService(PassengerPhoneDao passengerPhoneDao) {
        this.passengerPhoneDao = passengerPhoneDao;
    }

    public List<PassengerPhone> getAllPhones() {
        return passengerPhoneDao.findAll();
    }

    public PassengerPhone getPhone(
            String passengerID,
            String phone) {

        return passengerPhoneDao.findById(
                passengerID,
                phone
        );
    }

    public void addPhone(PassengerPhone passengerPhone) {
        passengerPhoneDao.save(passengerPhone);
    }

    public boolean updatePhone(
            String passengerID,
            String phone,
            PassengerPhone passengerPhone) {

        return passengerPhoneDao.update(
                passengerID,
                phone,
                passengerPhone
        ) > 0;
    }

    public boolean deletePhone(
            String passengerID,
            String phone) {

        return passengerPhoneDao.delete(
                passengerID,
                phone
        ) > 0;
    }
}