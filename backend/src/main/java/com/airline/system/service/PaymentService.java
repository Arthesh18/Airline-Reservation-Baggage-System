package com.airline.system.service;

import com.airline.system.dao.PaymentDao;
import com.airline.system.model.Payment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
public class PaymentService {

    private final PaymentDao paymentDao;

    public PaymentService(PaymentDao paymentDao) {
        this.paymentDao = paymentDao;
    }

    @Transactional(readOnly = true)
    public List<Payment> getAllPayments() {
        return paymentDao.findAll();
    }

    @Transactional(readOnly = true)
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
        if (id == null || id.trim().isEmpty()) {
            return false;
        }

        Payment payment = paymentDao.findById(id);
        if (payment == null) {
            return false;
        }

        return paymentDao.delete(id) > 0;
    }
}
