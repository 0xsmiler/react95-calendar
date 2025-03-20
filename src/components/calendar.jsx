import React, { useState, useEffect } from "react";
import { TitleBar, Cursor, Button } from "@react95/core";
import { Explorer103 } from "@react95/icons";
import * as S from "./layoutStyling";

function CalendarApp({ closeCalendarModal, user }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({ 
    name: user?.name || '', 
    email: user?.email || '' 
  });
  const [emailError, setEmailError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Update form fields when user data changes
  useEffect(() => {
    if (user) {
      setBookingInfo(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);
  
  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  // Mock time slots (4 slots per day)
  const timeSlots = [
    { id: 1, time: "09:00 - 10:00", available: true },
    { id: 2, time: "11:00 - 12:00", available: true },
    { id: 3, time: "14:00 - 15:00", available: true },
    { id: 4, time: "16:00 - 17:00", available: true }
  ];
  
  // Helper functions for calendar
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  // Format date as MM/DD/YYYY
  const formatDate = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  // Format date as "Month Day(Weekday)"
  const formatDateWithDay = (date) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", 
                    "August", "September", "October", "November", "December"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    const month = months[date.getMonth()];
    const day = date.getDate();
    const weekday = days[date.getDay()];
    
    return `${month} ${day}${getOrdinalSuffix(day)}(${weekday})`;
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

  // Time slot selection handler
  const handleTimeSlotClick = (slot) => {
    setSelectedTimeSlot(slot);
  };
  
  // Handle confirm click - show time slots
  const handleConfirmDate = () => {
    if (selectedDate) {
      setShowTimeSlots(true);
    }
  };

  // Handle back to calendar
  const handleBackToCalendar = () => {
    setShowTimeSlots(false);
    setSelectedTimeSlot(null);
    setShowBookingForm(false);
    setShowSuccessMessage(false);
  };
  
  // Handle showing booking form
  const handleShowBookingForm = () => {
    if (selectedTimeSlot) {
      setShowBookingForm(true);
    }
  };
  
  // Handle input change for booking form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingInfo(prev => ({ ...prev, [name]: value }));
    
    // Validate email format when email field changes
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }
  };
  
  // Handle form submission
  const handleSubmitBooking = () => {
    // Extract time from the time slot string (format: "HH:00 - HH:00")
    const startTime = selectedTimeSlot.time.split(' - ')[0];
    const [hours, minutes] = startTime.split(':').map(num => parseInt(num, 10));
    
    // Create a new date object with the combined date and time
    const bookingDateTime = new Date(selectedDate);
    bookingDateTime.setHours(hours, minutes, 0, 0);
    
    // Here you would typically send the booking data to your backend
    console.log('Booking submitted:', {
      date: bookingDateTime,
      timeSlot: selectedTimeSlot,
      name: bookingInfo.name,
      email: bookingInfo.email,
      userId: user?.id || 'anonymous'
    });
    
    // Show success message instead of closing immediately
    setShowSuccessMessage(true);
    
    // Auto-close after 30 seconds
    setTimeout(() => {
      closeCalendarModal();
    }, 30000);
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
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentDate.getMonth() && 
        selectedDate.getFullYear() === currentDate.getFullYear();
      
      days.push(
        <div 
          key={`day-${day}`}
          className={`calendar-day ${isSelected ? 'selected' : ''}`}
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
  
  // Generate year options (1950-2099)
  const renderYearOptions = () => {
    const options = [];
    for (let year = 1950; year <= 2099; year++) {
      options.push(<option key={year} value={year}>{year}</option>);
    }
    return options;
  };

  // Render header content
  const renderHeaderContent = () => {
    return (
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          fontFamily: 'MS Sans Serif', 
          fontSize: '16px', 
          fontWeight: 'bold',
          marginBottom: '8px',
          borderBottom: '1px solid #868a8e',
          paddingBottom: '5px'
        }}>
          {showSuccessMessage ? "Booking Confirmed" : showBookingForm ? "60 min with Alex" : "Alex's openings"}
        </div>
        
        <div style={{ 
          fontFamily: 'MS Sans Serif', 
          fontSize: '14px',
          marginBottom: '3px'
        }}>
          {selectedDate && formatDateWithDay(selectedDate)}
        </div>
        
        <div style={{ 
          fontFamily: 'MS Sans Serif', 
          fontSize: '12px',
          color: '#444',
          marginBottom: (showBookingForm || showSuccessMessage) && selectedTimeSlot ? '3px' : '15px'
        }}>
          Central Time US / Canada ({formatTime(currentTime)})
        </div>
        
        {(showBookingForm || showSuccessMessage) && selectedTimeSlot && (
          <div style={{ 
            fontFamily: 'MS Sans Serif', 
            fontSize: '12px',
            color: '#444',
            fontWeight: 'bold',
            marginBottom: '15px'
          }}>
            {selectedTimeSlot.time}
          </div>
        )}
      </div>
    );
  };

  // Render time slots
  const renderTimeSlots = () => {
    return (
      <div style={{ padding: '10px' }}>
        {/* Title and date info */}
        {renderHeaderContent()}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '10px' }}>
          {timeSlots.map(slot => (
            <div 
              key={slot.id}
              onClick={() => handleTimeSlotClick(slot)}
              className={`time-slot ${selectedTimeSlot && selectedTimeSlot.id === slot.id ? 'selected' : ''}`}
              style={{
                padding: '10px',
                border: selectedTimeSlot && selectedTimeSlot.id === slot.id 
                  ? '2px solid #000080' 
                  : '2px outset #d4d0c8',
                backgroundColor: selectedTimeSlot && selectedTimeSlot.id === slot.id 
                  ? '#000080' 
                  : '#d4d0c8',
                color: selectedTimeSlot && selectedTimeSlot.id === slot.id 
                  ? 'white' 
                  : 'black',
                fontFamily: 'MS Sans Serif',
                fontSize: '12px',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              {slot.time}
            </div>
          ))}
        </div>
        
        <div style={{ 
          marginTop: '20px', 
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <Button 
            onClick={handleBackToCalendar}
            style={{
              fontFamily: 'MS Sans Serif',
              fontSize: '12px',
              padding: '4px 10px', 
              cursor: 'pointer',
              width: '50%'
            }}
          >
            Back
          </Button>
          <Button 
            onClick={handleShowBookingForm}
            disabled={!selectedTimeSlot}
            style={{
              fontFamily: 'MS Sans Serif',
              fontSize: '12px',
              padding: '4px 10px',
              cursor: selectedTimeSlot ? 'pointer' : 'not-allowed',
              opacity: selectedTimeSlot ? 1 : 0.5,
              width: '50%'
            }}
          >
            Book
          </Button>
        </div>
      </div>
    );
  };
  
  // Render booking form
  const renderBookingForm = () => {
    // Check if form is valid (both fields filled and email valid)
    const isFormValid = bookingInfo.name && bookingInfo.email && !emailError;
    
    return (
      <div style={{ padding: '10px' }}>
        {/* Title and date info */}
        {renderHeaderContent()}
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px' 
        }}>
          {/* User profile info if authenticated */}
          {user && user.imageUrl && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '10px',
              padding: '10px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #d4d0c8'
            }}>
              <img 
                src={user.imageUrl} 
                alt="Profile" 
                style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '4px',
                  border: '1px solid #d4d0c8',
                  marginRight: '10px'
                }} 
              />
              <div>
                <div style={{ fontFamily: 'MS Sans Serif', fontSize: '12px', fontWeight: 'bold' }}>
                  Booking as:
                </div>
                <div style={{ fontFamily: 'MS Sans Serif', fontSize: '12px' }}>
                  {user.name}
                </div>
              </div>
            </div>
          )}
          
          {/* Name input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label 
              htmlFor="name"
              style={{
                fontFamily: 'MS Sans Serif',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              Your name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={bookingInfo.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              style={{
                padding: '5px 8px',
                fontFamily: 'MS Sans Serif',
                fontSize: '12px',
                border: '2px inset #d4d0c8',
                backgroundColor: 'white'
              }}
            />
          </div>
          
          {/* Email input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label 
              htmlFor="email"
              style={{
                fontFamily: 'MS Sans Serif',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={bookingInfo.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              style={{
                padding: '5px 8px',
                fontFamily: 'MS Sans Serif',
                fontSize: '12px',
                border: '2px inset #d4d0c8',
                backgroundColor: 'white',
                borderColor: emailError ? '#ff0000' : undefined
              }}
            />
            {emailError && (
              <div style={{
                fontFamily: 'MS Sans Serif',
                fontSize: '11px',
                color: '#ff0000',
                marginTop: '2px'
              }}>
                {emailError}
              </div>
            )}
          </div>
        </div>
        
        <div style={{ 
          marginTop: '25px', 
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <Button 
            onClick={() => setShowBookingForm(false)}
            style={{
              fontFamily: 'MS Sans Serif',
              fontSize: '12px',
              padding: '4px 10px', 
              cursor: 'pointer',
              width: '50%'
            }}
          >
            Back
          </Button>
          <Button 
            onClick={handleSubmitBooking}
            disabled={!isFormValid}
            style={{
              fontFamily: 'MS Sans Serif',
              fontSize: '12px',
              padding: '4px 10px',
              cursor: isFormValid ? 'pointer' : 'not-allowed',
              opacity: isFormValid ? 1 : 0.5,
              width: '50%'
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    );
  };
  
  // Render success message
  const renderSuccessMessage = () => {
    return (
      <div style={{ padding: '10px' }}>
        {/* Title and date info */}
        {renderHeaderContent()}
        
        <div style={{ 
          backgroundColor: '#efefef',
          border: '2px inset #d4d0c8',
          padding: '15px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{
            fontFamily: 'MS Sans Serif',
            fontSize: '14px',
            marginBottom: '10px'
          }}>
            Your booking has been confirmed!
          </div>
          
          <div style={{
            fontFamily: 'MS Sans Serif',
            fontSize: '12px',
            marginBottom: '10px'
          }}>
            A calendar invitation has been sent to your email:
          </div>
          
          <div style={{
            fontFamily: 'MS Sans Serif',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {bookingInfo.email}
          </div>
        </div>
        
        <div style={{
          fontFamily: 'MS Sans Serif',
          fontSize: '12px',
          marginBottom: '5px'
        }}>
          <strong>Name:</strong> {bookingInfo.name}
        </div>
        
        <div style={{
          fontFamily: 'MS Sans Serif',
          fontSize: '12px',
          marginBottom: '20px'
        }}>
          <strong>Meeting:</strong> 60 min with Alex
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center'
        }}>
          <Button 
            onClick={closeCalendarModal}
            style={{
              fontFamily: 'MS Sans Serif',
              fontSize: '12px',
              padding: '4px 15px', 
              cursor: 'pointer',
              width: '50%'
            }}
          >
            Close
          </Button>
        </div>
        
        <div style={{
          textAlign: 'center',
          fontFamily: 'MS Sans Serif',
          fontSize: '11px',
          color: '#666',
          marginTop: '15px'
        }}>
          This window will close automatically in 30 seconds...
        </div>
      </div>
    );
  };

  return (
    <S.styledModal
      icon={<Explorer103 variant="16x16_4" />}
      title="Calendar"
      titleBarOptions={[
        <S.styledModal.Minimize key="minimize" />,
        <TitleBar.Close onClick={closeCalendarModal} key="close" />,
      ]}
      width="350px"
    >
      <S.styledModalFrame bg="white" boxShadow="$in">
        {!showTimeSlots ? (
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
              textAlign: 'center' 
            }}>
              {renderCalendar()}
            </div>
            
            {selectedDate && (
              <div style={{ marginTop: '15px', padding: '5px', border: '1px solid #c0c0c0', background: '#efefef' }}>
                Selected date: {formatDate(selectedDate)}
              </div>
            )}
            
            {/* Action Buttons */}
            <div style={{ 
              marginTop: '20px', 
              display: 'flex', 
              justifyContent: 'flex-end',
              gap: '10px'
            }}>
              <Button 
                onClick={closeCalendarModal}
                style={{
                  fontFamily: 'MS Sans Serif',
                  fontSize: '12px',
                  padding: '4px 10px', 
                  cursor: 'pointer',
                  width: '50%'
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmDate}
                disabled={!selectedDate}
                style={{
                  fontFamily: 'MS Sans Serif',
                  fontSize: '12px',
                  padding: '4px 10px',
                  cursor: selectedDate ? 'pointer' : 'not-allowed',
                  opacity: selectedDate ? 1 : 0.5,
                  width: '50%'
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        ) : (
          showSuccessMessage ? renderSuccessMessage() : 
          showBookingForm ? renderBookingForm() : renderTimeSlots()
        )}
      </S.styledModalFrame>
    </S.styledModal>
  );
}

export default CalendarApp; 