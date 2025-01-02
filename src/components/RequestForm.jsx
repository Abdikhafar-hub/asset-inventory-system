import React, { useState } from 'react';

function RequestForm() {
  const [type, setType] = useState('new');
  const [quantity, setQuantity] = useState(1);
  const [urgency, setUrgency] = useState('low');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="new">New Asset</option>
        <option value="repair">Repair</option>
      </select>
      <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" />
      <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason"></textarea>
      <button type="submit">Submit Request</button>
    </form>
  );
}

export default RequestForm;
