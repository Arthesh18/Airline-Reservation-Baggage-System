package com.airline.system.service;

import com.airline.system.dao.BaggageDao;
import com.airline.system.dao.PassengerDao;
import com.airline.system.dao.TicketDao;
import com.airline.system.model.Ticket;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
public class TicketService {

    private final TicketDao ticketDao;
    private final PassengerDao passengerDao;
    private final BaggageDao baggageDao;

    public TicketService(TicketDao ticketDao,
                         PassengerDao passengerDao,
                         BaggageDao baggageDao) {
        this.ticketDao = ticketDao;
        this.passengerDao = passengerDao;
        this.baggageDao = baggageDao;
    }

    @Transactional(readOnly = true)
    public List<Ticket> getAllTickets() {
        return ticketDao.findAll();
    }

    @Transactional(readOnly = true)
    public Ticket getTicket(String reservationID, String ticketNo) {
        return ticketDao.findById(reservationID, ticketNo);
    }

    public void addTicket(Ticket ticket) {
        ticketDao.save(ticket);
    }

    public boolean updateTicket(String reservationID,
                                String ticketNo,
                                Ticket ticket) {
        return ticketDao.update(
                reservationID,
                ticketNo,
                ticket
        ) > 0;
    }

    public boolean deleteTicket(String reservationID,
                                String ticketNo) {
        if (reservationID == null || reservationID.trim().isEmpty() ||
                ticketNo == null || ticketNo.trim().isEmpty()) {
            return false;
        }

        Ticket ticket = ticketDao.findById(reservationID, ticketNo);
        if (ticket == null) {
            return false;
        }

        // Identify baggage items linked to this ticket
        List<String> baggageIds = ticketDao.findBaggageIdsByTicket(reservationID, ticketNo);

        // Delete ticket: MySQL cascades to payment and ticket_baggage
        ticketDao.delete(reservationID, ticketNo);

        // Clean up orphaned baggage and their tracking records
        for (String baggageId : baggageIds) {
            if (passengerDao.countTicketBaggageByBaggageId(baggageId) == 0) {
                baggageDao.delete(baggageId);
            }
        }

        return true;
    }
}
