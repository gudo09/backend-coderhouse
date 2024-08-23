import { Ticket } from "../models/tickets.model.js";
import { factoryTicketService } from "../services/dao/dao.factory.js";

const _service = factoryTicketService;

class _TicketDTO {
  ticket: Ticket;
  constructor(ticket: Ticket) {
    this.ticket = ticket;
    // Normailzar datos del Ticket
  }
}

class TicketsController {
  constructor() {

  }
}

export default TicketsController;
