import { Ticket } from "@models/tickets.model.js";
import { factoryTicketService } from "../services/dao/dao.factory.js";

const service = factoryTicketService;

class TicketDTO {
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
