import { Ticket } from "../models/tickets.model.ts";
import { factoryTicketService } from "../services/dao/dao.factory.ts";

const _service = factoryTicketService;

class _TicketDTO {
  ticket: Ticket;
  constructor(ticket: Ticket) {
    this.ticket = ticket;
    // Normailzar datos del Ticket
  }
}

class TicketsController {
  constructor() {}
}

export default TicketsController;
