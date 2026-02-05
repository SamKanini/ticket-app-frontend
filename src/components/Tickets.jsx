import React from "react";
import "../styles/Ticket.css";

function Tickets({
  tickets = [],
  selectedEvent,
  buyTicket,
  setShowPopup,
  handleTicketClick,
  showPopup,
}) {
  if (tickets.length === 0) {
    return <div>No tickets available for this event</div>;
  }

  return (
    <>
      <div className="tickets-container">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="ticket"
            onClick={() => handleTicketClick(ticket)}
            style={{
              backgroundColor: ticket.is_sold ? "#cccccc" : "#4CAF50",
              cursor: ticket.is_sold ? "not-allowed" : "pointer",
              opacity: ticket.is_sold ? 0.6 : 1,
            }}
          >
            <p style={{ fontWeight: "bold", fontSize: "18px" }}>
              Seat {ticket.seat_number}
            </p>
            <p style={{ fontSize: "14px" }}>
              {ticket.is_sold ? "SOLD" : "Available"}
            </p>
          </div>
        ))}
      </div>

      {/* Purchase Popup */}
      {showPopup && selectedEvent && (
        <div className="popup-overlay">
          <div className="Popup">
            <h3>Purchase Ticket?</h3>
            <p>
              <strong>Event:</strong> {selectedEvent.name}
            </p>
            <p>
              <strong>Price:</strong> ${selectedEvent.ticket_price}
            </p>

            <div style={{ marginTop: "20px" }}>
              <button
                onClick={buyTicket}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Confirm Purchase
              </button>
              <button
                onClick={() => setShowPopup(false)}
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Tickets;
