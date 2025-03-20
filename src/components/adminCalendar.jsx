import React, { useState, useEffect } from "react";
import { TitleBar, Button, Tabs, Tab } from "@react95/core";
import { Explorer103 } from "@react95/icons";
import * as S from "./layoutStyling";

function AdminCalendar({ closeAdminCalendarModal }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([
    { id: 1, time: "09:00 - 10:00", available: true },
    { id: 2, time: "11:00 - 12:00", available: true },
    { id: 3, time: "14:00 - 15:00", available: true },
    { id: 4, time: "16:00 - 17:00", available: true }
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // New state for weekly availability
  const [weeklyAvailability, setWeeklyAvailability] = useState([
    { day: "Mon", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "Tue", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "Wed", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "Thu", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "Fri", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "Sat", enabled: false, startTime: "09:00", endTime: "17:00" },
    { day: "Sun", enabled: false, startTime: "09:00", endTime: "17:00" }
  ]);
  
  // State to track which settings view is active
  const [availabilityView, setAvailabilityView] = useState('weekly'); // 'weekly' or 'specific'
  
  // Mock bookings data (in a real app, this would come from a database)
  const [bookings, setBookings] = useState([
    {
      id: 1,
      customerName: "John Doe",
      customerEmail: "john@example.com",
      date: new Date(2023, 6, 15),  // July 15, 2023
      timeSlot: "09:00 - 10:00",
      status: "confirmed"
    },
    {
      id: 2,
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      date: new Date(2023, 6, 16),  // July 16, 2023
      timeSlot: "14:00 - 15:00",
      status: "confirmed"
    },
    {
      id: 3,
      customerName: "Bob Johnson",
      customerEmail: "bob@example.com",
      date: new Date(2023, 6, 18),  // July 18, 2023
      timeSlot: "11:00 - 12:00",
      status: "pending"
    }
  ]);
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Helper functions for calendar
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  // Format date as MM/DD/YYYY
  const formatDate = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  // Format date as "Month Day, Year"
  const formatDateLong = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Get ordinal suffix for date (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  // Format current time (HH:MM AM/PM) in Central Time
  const formatTime = (date) => {
    // Format the time in Central Time (CT)
    const options = { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true, 
      timeZone: 'America/Chicago' 
    };
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  // Handle month change
  const handleMonthChange = (event) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(event.target.value));
    setCurrentDate(newDate);
  };
  
  // Handle year change
  const handleYearChange = (event) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(event.target.value));
    setCurrentDate(newDate);
  };
  
  // Day selection handler
  const handleDayClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  // Toggle availability of time slot
  const toggleTimeSlotAvailability = (slotId) => {
    setAvailableTimeSlots(slots => 
      slots.map(slot => 
        slot.id === slotId 
          ? { ...slot, available: !slot.available } 
          : slot
      )
    );
  };
  
  // Toggle day enable/disable in weekly availability
  const toggleDayEnabled = (dayIndex) => {
    setWeeklyAvailability(prev => 
      prev.map((day, index) => 
        index === dayIndex 
          ? { ...day, enabled: !day.enabled } 
          : day
      )
    );
  };
  
  // Update start time for a day in weekly availability
  const updateStartTime = (dayIndex, newTime) => {
    setWeeklyAvailability(prev => 
      prev.map((day, index) => 
        index === dayIndex 
          ? { ...day, startTime: newTime } 
          : day
      )
    );
  };
  
  // Update end time for a day in weekly availability
  const updateEndTime = (dayIndex, newTime) => {
    setWeeklyAvailability(prev => 
      prev.map((day, index) => 
        index === dayIndex 
          ? { ...day, endTime: newTime } 
          : day
      )
    );
  };
  
  // Save availability changes
  const saveAvailability = () => {
    // In a real app, this would send the data to a backend
    alert("Availability saved successfully!");
    // You could also add a visual confirmation like a success message
  };
  
  // Generate time options for dropdowns (30 min intervals)
  const generateTimeOptions = () => {
    const options = [];
    const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', 
                  '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    const minutes = ['00', '30'];
    
    hours.forEach(hour => {
      minutes.forEach(minute => {
        options.push(`${hour}:${minute}`);
      });
    });
    
    return options;
  };
  
  // Format 24h time to 12h time for display
  const formatTimeDisplay = (time24h) => {
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  // Calculate the status of a slot for the selected date
  const getSlotStatusForDate = (date, slotId) => {
    if (!date) return null;
    
    // Check if there's a booking for this date and slot
    const booking = bookings.find(b => 
      b.date.getDate() === date.getDate() && 
      b.date.getMonth() === date.getMonth() &&
      b.date.getFullYear() === date.getFullYear() &&
      b.timeSlot === availableTimeSlots.find(s => s.id === slotId)?.time
    );
    
    if (booking) {
      return booking.status === "confirmed" ? "booked" : "pending";
    }
    
    // Otherwise return the availability
    return availableTimeSlots.find(s => s.id === slotId)?.available ? "available" : "unavailable";
  };
  
  // Handle canceling a booking
  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      // In a real app, this would send a request to your backend
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    }
  };
  
  // Approve a pending booking
  const handleApproveBooking = (bookingId) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: "confirmed" } 
        : booking
    ));
  };
  
  // Generate calendar days
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    
    const days = [];
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    
    // Add day headers
    dayNames.forEach(day => {
      days.push(
        <div key={`header-${day}`} className="calendar-day-header">
          {day}
        </div>
      );
    });
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentDate.getMonth() && 
        selectedDate.getFullYear() === currentDate.getFullYear();
      
      // Check if this day has any bookings
      const hasBookings = bookings.some(booking => 
        booking.date.getDate() === day &&
        booking.date.getMonth() === currentDate.getMonth() &&
        booking.date.getFullYear() === currentDate.getFullYear()
      );
      
      days.push(
        <div 
          key={`day-${day}`}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${hasBookings ? 'has-bookings' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  // Generate month options
  const renderMonthOptions = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    return months.map((month, index) => (
      <option key={index} value={index}>{month}</option>
    ));
  };
  
  // Generate year options (current year - 1 to current year + 5)
  const renderYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const options = [];
    for (let year = currentYear - 1; year <= currentYear + 5; year++) {
      options.push(<option key={year} value={year}>{year}</option>);
    }
    return options;
  };
  
  // Render the weekly availability settings
  const renderWeeklyAvailability = () => {
    const timeOptions = generateTimeOptions();
    
    return (
      <div style={{ padding: '10px' }}>
        <div style={{ 
          fontSize: '14px', 
          fontWeight: 'bold',
          marginBottom: '15px'
        }}>
          Set Your Weekly Availability
        </div>
        
        <div style={{ fontSize: '12px', marginBottom: '15px', lineHeight: '1.4' }}>
          Set your regular working hours. Clients will only be able to book appointments during these times.
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          {weeklyAvailability.map((day, index) => (
            <div 
              key={day.day} 
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                marginBottom: '10px',
                padding: '5px',
                backgroundColor: day.enabled ? '#f0f0f0' : '#e0e0e0',
                border: '1px solid #d4d0c8'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                width: '120px',
                marginRight: '10px'
              }}>
                <input 
                  type="checkbox" 
                  id={`day-${index}`}
                  checked={day.enabled}
                  onChange={() => toggleDayEnabled(index)}
                  style={{ marginRight: '8px' }}
                />
                <label htmlFor={`day-${index}`} style={{ 
                  fontSize: '12px', 
                  fontWeight: day.enabled ? 'bold' : 'normal'
                }}>
                  {day.day}
                </label>
              </div>
              
              {day.enabled ? (
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <select 
                    value={day.startTime}
                    onChange={(e) => updateStartTime(index, e.target.value)}
                    disabled={!day.enabled}
                    className="win95-select"
                    style={{ 
                      padding: '2px',
                      marginRight: '5px',
                      width: '85px',
                      fontFamily: 'MS Sans Serif',
                      fontSize: '12px',
                      backgroundColor: 'white',
                      border: '2px inset #d4d0c8'
                    }}
                  >
                    {timeOptions.map(time => (
                      <option key={`start-${day.day}-${time}`} value={time}>
                        {formatTimeDisplay(time)}
                      </option>
                    ))}
                  </select>
                  
                  <span style={{ margin: '0 5px', fontSize: '12px' }}>to</span>
                  
                  <select 
                    value={day.endTime}
                    onChange={(e) => updateEndTime(index, e.target.value)}
                    disabled={!day.enabled}
                    className="win95-select"
                    style={{ 
                      padding: '2px',
                      width: '85px',
                      fontFamily: 'MS Sans Serif',
                      fontSize: '12px',
                      backgroundColor: 'white',
                      border: '2px inset #d4d0c8'
                    }}
                  >
                    {timeOptions.map(time => (
                      <option key={`end-${day.day}-${time}`} value={time}>
                        {formatTimeDisplay(time)}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div style={{ flex: 1, fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
                  Not Available
                </div>
              )}
            </div>
          ))}
        </div>
        
        <Button 
          onClick={saveAvailability}
          style={{
            fontFamily: 'MS Sans Serif',
            fontSize: '12px',
            padding: '4px 10px',
            width: '100%'
          }}
        >
          Save Weekly Availability
        </Button>
      </div>
    );
  };
  
  // Render the specific date availability settings
  const renderSpecificDateAvailability = () => {
    return (
      <div style={{ padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '8px' }}>
          <select 
            value={currentDate.getMonth()}
            onChange={handleMonthChange}
            className="win95-select"
            style={{ 
              width: '70%', 
              padding: '4px',
              fontFamily: 'MS Sans Serif',
              fontSize: '12px',
              backgroundColor: 'white',
              border: '2px inset #d4d0c8'
            }}
          >
            {renderMonthOptions()}
          </select>
          
          <select 
            value={currentDate.getFullYear()}
            onChange={handleYearChange}
            className="win95-select"
            style={{ 
              width: '80px', 
              padding: '4px',
              fontFamily: 'MS Sans Serif',
              fontSize: '12px',
              backgroundColor: 'white', 
              border: '2px inset #d4d0c8'
            }}
          >
            {renderYearOptions()}
          </select>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: '2px',
          textAlign: 'center',
          marginBottom: '15px' 
        }}>
          {renderCalendar()}
        </div>
        
        {selectedDate && (
          <div>
            <div style={{ marginBottom: '10px', padding: '5px', border: '1px solid #c0c0c0', background: '#efefef' }}>
              Selected date: {formatDateLong(selectedDate)}
            </div>
            
            <div style={{ 
              fontSize: '14px', 
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              Manage Availability for This Date
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              {availableTimeSlots.map(slot => {
                const status = getSlotStatusForDate(selectedDate, slot.id);
                
                return (
                  <div 
                    key={slot.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      marginBottom: '5px',
                      padding: '5px',
                      backgroundColor: 
                        status === 'booked' ? '#ffcccb' : 
                        status === 'pending' ? '#ffffcc' : 
                        status === 'available' ? '#ccffcc' : 
                        '#f0f0f0'
                    }}
                  >
                    <div style={{ flex: 1 }}>{slot.time}</div>
                    
                    {status === 'booked' ? (
                      <div style={{ fontSize: '12px', color: '#990000' }}>
                        Booked
                      </div>
                    ) : status === 'pending' ? (
                      <div style={{ fontSize: '12px', color: '#996600' }}>
                        Pending
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input 
                          type="checkbox" 
                          id={`available-${slot.id}`}
                          checked={slot.available}
                          onChange={() => toggleTimeSlotAvailability(slot.id)}
                          style={{ marginRight: '5px' }}
                        />
                        <label htmlFor={`available-${slot.id}`} style={{ fontSize: '12px' }}>
                          Available
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <Button 
              onClick={saveAvailability}
              style={{
                fontFamily: 'MS Sans Serif',
                fontSize: '12px',
                padding: '4px 10px',
                width: '100%'
              }}
            >
              Save Date Override
            </Button>
          </div>
        )}
      </div>
    );
  };
  
  // Render the calendar tab with both availability views
  const renderCalendarTab = () => {
    return (
      <div style={{ padding: '10px' }}>
        {/* Toggle between weekly and specific date availability */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #c0c0c0',
          marginBottom: '15px'
        }}>
          <div 
            onClick={() => setAvailabilityView('weekly')} 
            style={{
              padding: '4px 10px',
              cursor: 'pointer',
              backgroundColor: availabilityView === 'weekly' ? '#f0f0f0' : '#e0e0e0',
              fontFamily: 'MS Sans Serif',
              fontSize: '12px',
              fontWeight: availabilityView === 'weekly' ? 'bold' : 'normal',
              border: availabilityView === 'weekly' ? '1px solid #c0c0c0' : '1px solid #e0e0e0',
              borderBottom: availabilityView === 'weekly' ? 'none' : '1px solid #c0c0c0',
              borderTopLeftRadius: '4px',
              borderTopRightRadius: '4px',
              marginRight: '5px'
            }}
          >
            Weekly Schedule
          </div>
          <div 
            onClick={() => setAvailabilityView('specific')} 
            style={{
              padding: '4px 10px',
              cursor: 'pointer',
              backgroundColor: availabilityView === 'specific' ? '#f0f0f0' : '#e0e0e0',
              fontFamily: 'MS Sans Serif',
              fontSize: '12px',
              fontWeight: availabilityView === 'specific' ? 'bold' : 'normal',
              border: availabilityView === 'specific' ? '1px solid #c0c0c0' : '1px solid #e0e0e0',
              borderBottom: availabilityView === 'specific' ? 'none' : '1px solid #c0c0c0',
              borderTopLeftRadius: '4px',
              borderTopRightRadius: '4px'
            }}
          >
            Date Exceptions
          </div>
        </div>
        
        {availabilityView === 'weekly' ? renderWeeklyAvailability() : renderSpecificDateAvailability()}
      </div>
    );
  };
  
  // Render the bookings tab
  const renderBookingsTab = () => {
    // Group bookings by date for easier display
    const bookingsByDate = {};
    bookings.forEach(booking => {
      const dateKey = formatDate(booking.date);
      if (!bookingsByDate[dateKey]) {
        bookingsByDate[dateKey] = [];
      }
      bookingsByDate[dateKey].push(booking);
    });
    
    // Sort dates
    const sortedDates = Object.keys(bookingsByDate).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });
    
    return (
      <div style={{ padding: '10px' }}>
        <div style={{ 
          fontSize: '14px', 
          fontWeight: 'bold',
          marginBottom: '15px'
        }}>
          Upcoming Bookings ({bookings.length})
        </div>
        
        {bookings.length === 0 ? (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center',
            backgroundColor: '#f0f0f0',
            border: '1px solid #d4d0c8'
          }}>
            No bookings found.
          </div>
        ) : (
          sortedDates.map(date => (
            <div key={date} style={{ marginBottom: '20px' }}>
              <div style={{ 
                backgroundColor: '#000080', 
                color: 'white',
                padding: '5px',
                fontFamily: 'MS Sans Serif',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {formatDateLong(new Date(date))}
              </div>
              
              {bookingsByDate[date].map(booking => (
                <div 
                  key={booking.id} 
                  style={{ 
                    padding: '10px',
                    backgroundColor: booking.status === 'confirmed' ? 'white' : '#ffffcc',
                    border: '1px solid #d4d0c8',
                    marginBottom: '5px'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '5px'
                  }}>
                    <div style={{ fontWeight: 'bold' }}>{booking.timeSlot}</div>
                    <div style={{ 
                      fontSize: '11px',
                      padding: '1px 5px',
                      backgroundColor: booking.status === 'confirmed' ? '#ccffcc' : '#ffffcc',
                      border: '1px solid ' + (booking.status === 'confirmed' ? '#aaddaa' : '#ddddaa')
                    }}>
                      {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '12px', marginBottom: '3px' }}>
                    <strong>Name:</strong> {booking.customerName}
                  </div>
                  <div style={{ fontSize: '12px', marginBottom: '10px' }}>
                    <strong>Email:</strong> {booking.customerEmail}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                    <Button 
                      onClick={() => handleCancelBooking(booking.id)}
                      style={{
                        fontFamily: 'MS Sans Serif',
                        fontSize: '11px',
                        padding: '2px 8px',
                        backgroundColor: '#ffdddd'
                      }}
                    >
                      Cancel
                    </Button>
                    
                    {booking.status === 'pending' && (
                      <Button 
                        onClick={() => handleApproveBooking(booking.id)}
                        style={{
                          fontFamily: 'MS Sans Serif',
                          fontSize: '11px',
                          padding: '2px 8px',
                          backgroundColor: '#ddffdd'
                        }}
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <S.styledModal
      icon={<Explorer103 variant="16x16_4" />}
      title="Admin Calendar"
      titleBarOptions={[
        <S.styledModal.Minimize key="minimize" />,
        <TitleBar.Close onClick={closeAdminCalendarModal} key="close" />,
      ]}
      width="400px"
    >
      <S.styledModalFrame bg="white" boxShadow="$in">
        <div style={{ padding: '5px' }}>
          <div style={{ 
            fontFamily: 'MS Sans Serif', 
            fontSize: '16px', 
            fontWeight: 'bold',
            marginBottom: '8px',
            padding: '5px'
          }}>
            Alex's Calendar Management
          </div>
          
          <div style={{ marginBottom: '5px', fontSize: '12px', color: '#444', padding: '0 5px' }}>
            Current time: {formatTime(currentTime)} (Central Time US / Canada)
          </div>
          
          {/* Custom tab interface for better visibility */}
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #808080',
            marginBottom: '10px'
          }}>
            <div 
              onClick={() => setSelectedTab(0)} 
              style={{
                padding: '6px 12px',
                cursor: 'pointer',
                backgroundColor: selectedTab === 0 ? '#f0f0f0' : '#d4d0c8',
                fontFamily: 'MS Sans Serif',
                fontSize: '12px',
                fontWeight: selectedTab === 0 ? 'bold' : 'normal',
                border: selectedTab === 0 ? '2px solid #808080' : '2px solid #d4d0c8',
                borderBottom: selectedTab === 0 ? '1px solid #f0f0f0' : '1px solid #808080',
                marginBottom: selectedTab === 0 ? '-1px' : '0',
                position: 'relative',
                zIndex: selectedTab === 0 ? 1 : 0,
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px',
                textAlign: 'center',
                minWidth: '180px',
                boxShadow: selectedTab === 0 ? 'none' : 'inset 1px 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              Calendar & Availability
            </div>
            <div 
              onClick={() => setSelectedTab(1)} 
              style={{
                padding: '6px 12px',
                cursor: 'pointer',
                backgroundColor: selectedTab === 1 ? '#f0f0f0' : '#d4d0c8',
                fontFamily: 'MS Sans Serif',
                fontSize: '12px',
                fontWeight: selectedTab === 1 ? 'bold' : 'normal',
                border: selectedTab === 1 ? '2px solid #808080' : '2px solid #d4d0c8',
                borderBottom: selectedTab === 1 ? '1px solid #f0f0f0' : '1px solid #808080',
                marginBottom: selectedTab === 1 ? '-1px' : '0',
                marginLeft: '4px',
                position: 'relative',
                zIndex: selectedTab === 1 ? 1 : 0,
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px',
                textAlign: 'center',
                minWidth: '150px',
                boxShadow: selectedTab === 1 ? 'none' : 'inset 1px 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              Bookings ({bookings.length})
            </div>
          </div>
          
          <div style={{ 
            border: '2px inset #d4d0c8', 
            height: '400px', 
            overflowY: 'auto',
            backgroundColor: '#f0f0f0'
          }}>
            {selectedTab === 0 ? renderCalendarTab() : renderBookingsTab()}
          </div>
        </div>
      </S.styledModalFrame>
    </S.styledModal>
  );
}

export default AdminCalendar; 