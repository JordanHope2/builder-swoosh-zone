import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  User,
  FileText,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Star,
  Video,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

import { Navigation } from "../components/Navigation";
import { useLanguage } from "../contexts/LanguageContext";


interface TimeSlot {
  time: string;
  available: boolean;
  price: number;
  type: "standard" | "premium" | "video";
}

interface BookingData {
  date: Date | null;
  time: string;
  type: "standard" | "premium" | "video";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experience: string;
  goals: string;
  currentRole: string;
}

const timeSlots: TimeSlot[] = [
  { time: "09:00", available: true, price: 149, type: "standard" },
  { time: "09:30", available: false, price: 149, type: "standard" },
  { time: "10:00", available: true, price: 149, type: "standard" },
  { time: "10:30", available: true, price: 199, type: "premium" },
  { time: "11:00", available: true, price: 149, type: "standard" },
  { time: "11:30", available: false, price: 149, type: "standard" },
  { time: "14:00", available: true, price: 149, type: "standard" },
  { time: "14:30", available: true, price: 249, type: "video" },
  { time: "15:00", available: true, price: 199, type: "premium" },
  { time: "15:30", available: true, price: 149, type: "standard" },
  { time: "16:00", available: true, price: 199, type: "premium" },
  { time: "16:30", available: false, price: 149, type: "standard" },
];

const reviewTypes = {
  standard: {
    name: "Standard Review",
    duration: "45 minutes",
    price: 149,
    features: [
      "CV Analysis & Feedback",
      "Skills Assessment",
      "Written Report",
      "Industry Insights",
    ],
    icon: FileText,
    color: "from-blue-500 to-blue-600",
  },
  premium: {
    name: "Premium Review",
    duration: "60 minutes",
    price: 199,
    features: [
      "Everything in Standard",
      "LinkedIn Profile Review",
      "Cover Letter Template",
      "Interview Tips",
      "Salary Negotiation Guide",
    ],
    icon: Star,
    color: "from-purple-500 to-purple-600",
  },
  video: {
    name: "Video Consultation",
    duration: "90 minutes",
    price: 249,
    features: [
      "Everything in Premium",
      "Live Video Session",
      "Mock Interview",
      "Career Coaching",
      "Personalized Action Plan",
    ],
    icon: Video,
    color: "from-green-500 to-green-600",
  },
};

export default function CVReviewBooking() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [booking, setBooking] = useState<BookingData>({
    date: null,
    time: "",
    type: "standard",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    experience: "",
    goals: "",
    currentRole: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  // Generate calendar days for current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const isToday = currentDate.toDateString() === new Date().toDateString();
      const isPast = currentDate < new Date(new Date().setHours(0, 0, 0, 0));
      const isWeekend =
        currentDate.getDay() === 0 || currentDate.getDay() === 6;

      days.push({
        date: currentDate,
        day,
        isToday,
        isPast,
        isWeekend,
        available: !isPast && !isWeekend,
      });
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
    setBooking((prev) => ({ ...prev, date }));
  };

  const selectTimeSlot = (slot: TimeSlot) => {
    setBooking((prev) => ({ ...prev, time: slot.time, type: slot.type }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setStep(4); // Success step
  };

  const getSlotTypeIcon = (type: string) => {
    switch (type) {
      case "premium":
        return <Star className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getSlotTypeColor = (type: string) => {
    switch (type) {
      case "premium":
        return "border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700";
      case "video":
        return "border-green-200 bg-green-50 hover:bg-green-100 text-green-700";
      default:
        return "border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-jobequal-text dark:text-white mb-4">
            Book Your CV Review
          </h1>
          <p className="text-lg text-jobequal-text-muted dark:text-gray-300 max-w-2xl mx-auto">
            Get expert feedback on your CV from Swiss recruitment professionals.
            Choose your preferred time and review type.
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= stepNumber
                      ? "bg-jobequal-green text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step > stepNumber ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      step > stepNumber
                        ? "bg-jobequal-green"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Date & Time */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6">
                Select Date & Time
              </h2>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-jobequal-text dark:text-white">
                      Choose Date
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-lg font-medium text-jobequal-text dark:text-white min-w-[140px] text-center">
                        {monthNames[currentMonth.getMonth()]}{" "}
                        {currentMonth.getFullYear()}
                      </span>
                      <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="p-2 text-center text-sm font-medium text-jobequal-text-muted dark:text-gray-400"
                        >
                          {day}
                        </div>
                      ),
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => (
                      <div key={index} className="aspect-square">
                        {day && (
                          <button
                            onClick={() =>
                              day.available && selectDate(day.date)
                            }
                            disabled={!day.available}
                            className={`w-full h-full rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                              selectedDate?.toDateString() ===
                              day.date.toDateString()
                                ? "bg-jobequal-green text-white shadow-lg scale-105"
                                : day.available
                                  ? "hover:bg-jobequal-green-light dark:hover:bg-jobequal-green/20 text-jobequal-text dark:text-white hover:scale-105"
                                  : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                            } ${day.isToday ? "ring-2 ring-jobequal-green ring-opacity-50" : ""}`}
                          >
                            {day.day}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <h3 className="text-lg font-semibold text-jobequal-text dark:text-white mb-4">
                    Available Times
                    {selectedDate && (
                      <span className="text-sm font-normal text-jobequal-text-muted dark:text-gray-400 ml-2">
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </h3>

                  {!selectedDate ? (
                    <div className="text-center py-8 text-jobequal-text-muted dark:text-gray-400">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Please select a date first</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {timeSlots.map((slot, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => slot.available && selectTimeSlot(slot)}
                          disabled={!slot.available}
                          className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                            booking.time === slot.time
                              ? "border-jobequal-green bg-jobequal-green-light dark:bg-jobequal-green/20 scale-105"
                              : slot.available
                                ? getSlotTypeColor(slot.type)
                                : "border-gray-200 bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getSlotTypeIcon(slot.type)}
                              <div className="text-left">
                                <div className="font-semibold">{slot.time}</div>
                                <div className="text-sm opacity-75">
                                  {reviewTypes[slot.type].duration}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">CHF {slot.price}</div>
                              <div className="text-sm opacity-75">
                                {reviewTypes[slot.type].name}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={!booking.date || !booking.time}
                  className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-8 py-3 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6">
                Your Information
              </h2>

              {/* Selected Appointment Summary */}
              <div className="bg-jobequal-green-light dark:bg-jobequal-green/20 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-jobequal-green-dark dark:text-jobequal-green mb-2">
                  Your Appointment
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-jobequal-text-muted dark:text-gray-400">
                      Date
                    </div>
                    <div className="font-medium text-jobequal-text dark:text-white">
                      {booking.date?.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-jobequal-text-muted dark:text-gray-400">
                      Time
                    </div>
                    <div className="font-medium text-jobequal-text dark:text-white">
                      {booking.time}
                    </div>
                  </div>
                  <div>
                    <div className="text-jobequal-text-muted dark:text-gray-400">
                      Service
                    </div>
                    <div className="font-medium text-jobequal-text dark:text-white">
                      {reviewTypes[booking.type].name} - CHF{" "}
                      {reviewTypes[booking.type].price}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={booking.firstName}
                    onChange={(e) =>
                      setBooking((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={booking.lastName}
                    onChange={(e) =>
                      setBooking((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={booking.email}
                    onChange={(e) =>
                      setBooking((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={booking.phone}
                    onChange={(e) =>
                      setBooking((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                    placeholder="+41 76 123 45 67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                    Current Role
                  </label>
                  <input
                    type="text"
                    value={booking.currentRole}
                    onChange={(e) =>
                      setBooking((prev) => ({
                        ...prev,
                        currentRole: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                    Years of Experience
                  </label>
                  <select
                    value={booking.experience}
                    onChange={(e) =>
                      setBooking((prev) => ({
                        ...prev,
                        experience: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="2-3">2-3 years</option>
                    <option value="4-5">4-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                  Career Goals & Expectations
                </label>
                <textarea
                  value={booking.goals}
                  onChange={(e) =>
                    setBooking((prev) => ({ ...prev, goals: e.target.value }))
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent resize-none"
                  placeholder="Tell us about your career goals, target roles, or specific areas you'd like feedback on..."
                />
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-jobequal-text dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={
                    !booking.firstName ||
                    !booking.lastName ||
                    !booking.email ||
                    !booking.phone
                  }
                  className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-8 py-3 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Review & Book</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review & Confirm */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6">
                Review & Confirm
              </h2>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Appointment Details */}
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h3 className="font-semibold text-jobequal-text dark:text-white mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-jobequal-green" />
                      Appointment Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-jobequal-text-muted dark:text-gray-400">
                          Date:
                        </span>
                        <span className="font-medium text-jobequal-text dark:text-white">
                          {booking.date?.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-jobequal-text-muted dark:text-gray-400">
                          Time:
                        </span>
                        <span className="font-medium text-jobequal-text dark:text-white">
                          {booking.time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-jobequal-text-muted dark:text-gray-400">
                          Duration:
                        </span>
                        <span className="font-medium text-jobequal-text dark:text-white">
                          {reviewTypes[booking.type].duration}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-jobequal-text-muted dark:text-gray-400">
                          Service:
                        </span>
                        <span className="font-medium text-jobequal-text dark:text-white">
                          {reviewTypes[booking.type].name}
                        </span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                        <span className="font-semibold text-jobequal-text dark:text-white">
                          Total:
                        </span>
                        <span className="font-bold text-xl text-jobequal-green">
                          CHF {reviewTypes[booking.type].price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h3 className="font-semibold text-jobequal-text dark:text-white mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-jobequal-green" />
                      Your Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Name:</strong> {booking.firstName}{" "}
                        {booking.lastName}
                      </div>
                      <div>
                        <strong>Email:</strong> {booking.email}
                      </div>
                      <div>
                        <strong>Phone:</strong> {booking.phone}
                      </div>
                      {booking.currentRole && (
                        <div>
                          <strong>Current Role:</strong> {booking.currentRole}
                        </div>
                      )}
                      {booking.experience && (
                        <div>
                          <strong>Experience:</strong> {booking.experience}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div>
                  <div className="bg-gradient-to-br from-jobequal-green-light to-jobequal-blue-light dark:from-jobequal-green/20 dark:to-jobequal-blue/20 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${reviewTypes[booking.type].color} flex items-center justify-center text-white mr-4`}
                      >
                        {(() => {
                          const IconComponent = reviewTypes[booking.type].icon;
                          return <IconComponent className="w-6 h-6" />;
                        })()}
                      </div>
                      <div>
                        <h3 className="font-bold text-jobequal-text dark:text-white text-lg">
                          {reviewTypes[booking.type].name}
                        </h3>
                        <p className="text-jobequal-text-muted dark:text-gray-400">
                          {reviewTypes[booking.type].duration}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-jobequal-text dark:text-white mb-3">
                        What's included:
                      </h4>
                      {reviewTypes[booking.type].features.map(
                        (feature, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm text-jobequal-text dark:text-white"
                          >
                            <CheckCircle className="w-4 h-4 text-jobequal-green mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {booking.goals && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mt-6">
                      <h3 className="font-semibold text-jobequal-text dark:text-white mb-3">
                        Your Goals:
                      </h3>
                      <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                        {booking.goals}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mt-6">
                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                      What happens next?
                    </p>
                    <p className="text-blue-700 dark:text-blue-300">
                      You'll receive a confirmation email with meeting details
                      and a secure upload link for your CV. Our expert will
                      review your documents before the session for maximum
                      efficiency.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-jobequal-text dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-8 py-3 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Confirm Booking</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-jobequal-text dark:text-white mb-4">
                Booking Confirmed!
              </h2>

              <p className="text-lg text-jobequal-text-muted dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Thank you {booking.firstName}! Your CV review appointment has
                been successfully booked. You'll receive a confirmation email
                shortly with all the details.
              </p>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6 max-w-md mx-auto">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3">
                  Appointment Summary
                </h3>
                <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                  <div>
                    📅{" "}
                    {booking.date?.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div>⏰ {booking.time}</div>
                  <div>💼 {reviewTypes[booking.type].name}</div>
                  <div>💰 CHF {reviewTypes[booking.type].price}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-6 py-3 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all duration-200"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="border border-gray-300 dark:border-gray-600 text-jobequal-text dark:text-white px-6 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
