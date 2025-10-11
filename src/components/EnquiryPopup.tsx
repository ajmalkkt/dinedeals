import React, { useState } from "react";
import { ENQUIRY_EMAIL, ENQUIRY_PHONE } from "../config/appConfig";
import { ENQUIRY_API_URL } from "../config/apiConfig";

interface EnquiryPopupProps {
  open: boolean;
  onClose: () => void;
}


const EnquiryPopup: React.FC<EnquiryPopupProps> = ({ open, onClose }) => {
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Reset form when popup is closed or opened
  React.useEffect(() => {
    if (!open) {
      setDetails("");
      setSent(false);
      setError("");
    }
  }, [open]);

  const handleSend = async () => {
    setSending(true);
    setError("");
    try {
      const res = await fetch(ENQUIRY_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ details }),
      });
      if (res.ok) {
        setSent(true);
        setDetails(""); // Clear details after successful send
      } else {
        setError("Failed to send enquiry. Please try again later.");
      }
    } catch (e) {
      setError("Failed to send enquiry. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-semibold mb-2">Send Enquiry</h2>
        <div className="mb-2">
          <span className="font-medium">Contact Phone: </span>
          <span className="text-blue-700">{ENQUIRY_PHONE}</span>
        </div>
        <div className="mb-2">
          <span className="font-medium">Enquiry Email: </span>
          <span className="text-blue-700">{ENQUIRY_EMAIL}</span>
        </div>
        <div className="text-sm text-gray-600 mb-1">
          Please enter your enquiry details, including your callback number or email, and your available time to connect during the day.
        </div>
        <textarea
          className="w-full border rounded p-2 mb-3 min-h-[80px]"
          placeholder="E.g. I would like to add my business. You can reach me at 555-1234 or email@example.com. Available 10am-4pm."
          value={details}
          onChange={e => setDetails(e.target.value)}
          disabled={sending || sent}
        />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {sent ? (
          <div className="text-green-600 font-semibold">Enquiry sent successfully!</div>
        ) : (
          <button
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-60"
            onClick={handleSend}
            disabled={sending || !details.trim()}
          >
            {sending ? "Sending..." : "Send Enquiry"}
          </button>
        )}
      </div>
    </div>
  );
};

export default EnquiryPopup;
