// bookingService.js - Handles booking data storage and retrieval

// Constants
const BOOKINGS_STORAGE_KEY = 'calendar_bookings';
const ADMIN_EMAIL = 'cryptodemon.eng@gmail.com';
export { ADMIN_EMAIL };

// Generate a unique ID for bookings
const generateBookingId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Save a booking to localStorage
export const saveBooking = (bookingData) => {
  try {
    // Retrieve existing bookings
    const existingBookings = getBookings();
    
    // Add ID and status to the booking
    const newBooking = {
      ...bookingData,
      id: generateBookingId(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Add to bookings array and save back to localStorage
    existingBookings.push(newBooking);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(existingBookings));
    
    console.log('Booking saved successfully:', newBooking);
    return newBooking;
  } catch (error) {
    console.error('Error saving booking:', error);
    throw new Error('Failed to save booking. Please try again.');
  }
};

// Get all bookings from localStorage
export const getBookings = () => {
  try {
    const bookingsJson = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!bookingsJson) {
      return [];
    }
    return JSON.parse(bookingsJson);
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    return [];
  }
};

// Get bookings for a specific user (admin sees all, clients see only their own)
export const getUserBookings = (userEmail) => {
  const allBookings = getBookings();
  
  // Admin can see all bookings
  if (userEmail === ADMIN_EMAIL) {
    return allBookings;
  }
  
  // Regular users can only see their own bookings
  return allBookings.filter(booking => booking.email === userEmail);
};

// Update booking status (approve/cancel)
export const updateBookingStatus = (bookingId, newStatus) => {
  try {
    const allBookings = getBookings();
    const updatedBookings = allBookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() } 
        : booking
    );
    
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updatedBookings));
    console.log(`Booking ${bookingId} status updated to ${newStatus}`);
    return true;
  } catch (error) {
    console.error('Error updating booking status:', error);
    return false;
  }
};

// Check if a time slot is available for booking
export const isTimeSlotAvailable = (date, timeSlot) => {
  const allBookings = getBookings();
  
  // Format date to string for comparison
  const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
  
  // Check if there's any booking with this date and time slot that's not cancelled
  const conflictingBooking = allBookings.find(booking => {
    const bookingDateStr = new Date(booking.date).toISOString().split('T')[0];
    return bookingDateStr === dateStr && 
           booking.timeSlot.time === timeSlot.time && 
           booking.status !== 'cancelled';
  });
  
  return !conflictingBooking;
};

// Format date for display
export const formatBookingDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const options = { 
    weekday: 'short',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return d.toLocaleDateString('en-US', options);
};

export default {
  saveBooking,
  getBookings,
  getUserBookings,
  updateBookingStatus,
  isTimeSlotAvailable,
  formatBookingDate,
  ADMIN_EMAIL
}; 