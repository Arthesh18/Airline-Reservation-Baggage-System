package com.airline.system.service;

import com.airline.system.dao.TicketBaggageDao;
import com.airline.system.model.TicketBaggage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
public class TicketBaggageService {

    private final TicketBaggageDao ticketBaggageDao;

    public TicketBaggageService(TicketBaggageDao ticketBaggageDao) {
        this.ticketBaggageDao = ticketBaggageDao;
    }

    @Transactional(readOnly = true)
    public List<TicketBaggage> getAllTicketBaggage() {
        return ticketBaggageDao.findAll();
    }

    public TicketBaggage getTicketBaggage(
            String reservationID,
            String ticketNo,
            String baggageID) {

        return ticketBaggageDao.findById(
                reservationID,
                ticketNo,
                baggageID
        );
    }

    public void addTicketBaggage(TicketBaggage ticketBaggage) {
        ticketBaggageDao.save(ticketBaggage);
    }

    public boolean updateTicketBaggage(
            String reservationID,
            String ticketNo,
            String baggageID,
            TicketBaggage ticketBaggage) {

        return ticketBaggageDao.update(
                reservationID,
                ticketNo,
                baggageID,
                ticketBaggage
        ) > 0;
    }

    public boolean deleteTicketBaggage(
            String reservationID,
            String ticketNo,
            String baggageID) {

        if (reservationID == null || reservationID.trim().isEmpty() ||
                ticketNo == null || ticketNo.trim().isEmpty() ||
                baggageID == null || baggageID.trim().isEmpty()) {
            return false;
        }

        TicketBaggage existing = ticketBaggageDao.findById(reservationID, ticketNo, baggageID);
        if (existing == null) {
            return false;
        }

        return ticketBaggageDao.delete(
                reservationID,
                ticketNo,
                baggageID
        ) > 0;
    }
}
