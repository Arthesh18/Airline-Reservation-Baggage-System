package com.airline.system.service;

import com.airline.system.dao.TicketDao;
import com.airline.system.model.Ticket;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    private final TicketDao ticketDao;

    public TicketService(TicketDao ticketDao) {
        this.ticketDao = ticketDao;
    }

    public List<Ticket> getAllTickets() {
        return ticketDao.findAll();
    }

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
        return ticketDao.delete(
                reservationID,
                ticketNo
        ) > 0;
    }
}