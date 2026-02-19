import { useNavigate } from "react-router-dom";
import api from "../api";
import Tickets from "../components/Tickets";
import { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";

function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch events on mount
  useEffect(() => {
    api
      .get("/api/events/")
      .then((res) => {
        console.log("Events loaded:", res.data);
        setEvents(res.data);

        // Auto-select first event and load its tickets
        if (res.data.length > 0) {
          loadEventTickets(res.data[0].id);
          setSelectedEvent(res.data[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error loading events:", err);
        alert("Error loading events");
        setLoading(false);
      });
  }, []);

  // Load tickets for a specific event
  const loadEventTickets = (eventId) => {
    api
      .get(`/api/events/${eventId}/tickets/`)
      .then((res) => {
        // console.log("Tickets loaded:", res.data);
        setTickets(res.data);
      })
      .catch((err) => {
        console.log("Error loading tickets:", err);
        alert("Error loading tickets");
      });
  };

  // When user clicks on a ticket
  const handleTicketClick = (ticket) => {
    console.log("Ticket clicked:", ticket);

    if (ticket.is_sold) {
      alert("This ticket is already sold");
      return;
    }

    setSelectedTicket(ticket);
    setShowPopup(true);
  };

  // Purchase the selected ticket
  const buyTicket = () => {
    //check if logged in
    const token = localStorage.getItem("access");

    if (!token) {
      //Give options to register
      
      const shouldRegsister = window.confirm(
        "You need an account to register \n\n" +
        "Click Ok to Regsister (create account) \n" +
        "Click Cancel to Login (If you have an account)"
      )

      if (shouldRegsister) {
        navigate("/register") //navigate to register
      } else {
        navigate("/login") //navigate to login
      }
      return
   }

      if (!selectedTicket) {
        alert("No ticket selected");
        return;
      }
      console.log("Purchasing ticket:", selectedTicket.id);

      api
        .post(`/api/tickets/${selectedTicket.id}/purchase/`)
        .then((res) => {
          console.log("Purchase successful:", res.data);

          // Update the tickets list to mark this ticket as sold
          setTickets(
            tickets.map((ticket) =>
              ticket.id === selectedTicket.id
                ? { ...ticket, is_sold: true, customer: res.data.customer }
                : ticket,
            ),
          );

          // Update event's available count
          if (selectedEvent) {
            setSelectedEvent({
              ...selectedEvent,
              available_tickets: selectedEvent.available_tickets - 1,
            });
          }

          setShowPopup(false);
          setSelectedTicket(null);
          alert("Ticket purchased successfully!");
        })
        .catch((err) => {
          console.log("Purchase error:", err);
          console.log("Error response:", err.response);
          alert(err.response?.data?.error || "Error purchasing ticket");
        });
    }
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (events.length === 0) {
    return <div>No events available</div>;
  }

  return (
    <div>
      {/* Event selector (if you have multiple events) */}
      {events.length > 1 && (
        <div style={{ marginBottom: "20px" }}>
          <label>Select Event: </label>
          <select
            value={selectedEvent?.id || ""}
            onChange={(e) => {
              const event = events.find(
                (ev) => ev.id === parseInt(e.target.value),
              );
              setSelectedEvent(event);
              loadEventTickets(event.id);
            }}
          >
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Event info */}
      {selectedEvent && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h2>{selectedEvent.name}</h2>
          <p>
            <strong>Venue:</strong> {selectedEvent.venue}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(selectedEvent.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Price:</strong> ${selectedEvent.ticket_price}
          </p>
          <p>
            <strong>Available:</strong> {selectedEvent.available_tickets} /{" "}
            {selectedEvent.total_seats}
          </p>
        </div>
      )}

      {/* Tickets grid */}
      <Tickets
        tickets={tickets}
        selectedEvent={selectedEvent}
        buyTicket={buyTicket}
        showPopup={showPopup}
        handleTicketClick={handleTicketClick}
        setShowPopup={setShowPopup}
      />
    </div>
  );
}

export default Home;
