package com.airline.system.service;

import com.airline.system.dao.PaymentDao;
import com.airline.system.model.Payment;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentDao paymentDao;

    public PaymentService(PaymentDao paymentDao) {
        this.paymentDao = paymentDao;
    }

    public List<Payment> getAllPayments() {
        return paymentDao.findAll();
    }

    public Payment getPayment(String id) {
        return paymentDao.findById(id);
    }

    public void addPayment(Payment payment) {
        paymentDao.save(payment);
    }

    public boolean updatePayment(String id, Payment payment) {
        return paymentDao.update(id, payment) > 0;
    }

    public boolean deletePayment(String id) {
        return paymentDao.delete(id) > 0;
    }
}