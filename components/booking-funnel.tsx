"use client";

import { useMemo, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Step = "date" | "time" | "details";

interface AvailableDate {
  day: number;
  weekday: string;
  month: number;
  year: number;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const SHORT_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MORNING_SLOTS = ["9:30 AM", "10:30 AM", "11:30 AM", "12:30 PM"];
const AFTERNOON_SLOTS = ["1:30 PM", "3:30 PM", "4:30 PM", "5:30 PM"];

function getAvailableDates(year: number, month: number, fromDay: number): AvailableDate[] {
  const dates: AvailableDate[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let day = fromDay;
  while (dates.length < 6 && day <= daysInMonth) {
    const d = new Date(year, month, day);
    if (d.getDay() !== 0) {
      dates.push({
        day,
        weekday: SHORT_WEEKDAYS[d.getDay()],
        month,
        year,
      });
    }
    day += 1;
  }
  return dates;
}

export default function BookingFunnel() {
  const today = useMemo(() => new Date(), []);
  const router = useRouter();

  const [step, setStep] = useState<Step>("date");
  const [viewYear, setViewYear] = useState<number>(today.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<AvailableDate | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const isCurrentMonth =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();
  const startDay = isCurrentMonth ? today.getDate() + 1 : 1;
  const dates = useMemo(
    () => getAvailableDates(viewYear, viewMonth, startDay),
    [viewYear, viewMonth, startDay],
  );

  const goPrevMonth = () => {
    if (isCurrentMonth) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDateSelect = (d: AvailableDate) => {
    setSelectedDate(d);
    setStep("time");
  };

  const handleTimeSelect = (t: string) => {
    setSelectedTime(t);
    setStep("details");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    const params = new URLSearchParams({
      date: `${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`,
      time: selectedTime,
    });
    router.push(`/confirmed?${params.toString()}`);
  };

  const formatLongDate = (d: AvailableDate) =>
    `${MONTH_NAMES[d.month]} ${d.day}, ${d.year}`;

  return (
    <div className="h-dvh w-full bg-[#ffffff] flex flex-col overflow-hidden fixed inset-0 overscroll-none">
      {/* Hero image */}
      <div className="flex-shrink-0 px-3 pt-1.5 pb-1.5 sm:px-4 sm:pt-4 sm:pb-4 overflow-hidden">
        <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg max-w-2xl mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Spa treatment room"
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/spa-pic.webp`}
            className="w-full h-auto object-cover aspect-[16/7] sm:aspect-[2/1]"
          />
        </div>
      </div>

      <div className="flex-[0.1] sm:flex-[1] flex-shrink-0" />

      {/* Funnel content */}
      <div className="flex-shrink-0 px-4 pb-2 sm:pb-8 overflow-hidden">
        <div className="w-full max-w-sm mx-auto overflow-hidden">
          {step === "date" && (
            <DateStep
              address="18140 Collins Ave, Sunny Isles Beach, FL, 33160"
              monthLabel={`${MONTH_NAMES[viewMonth]} ${viewYear}`}
              dates={dates}
              onPrev={goPrevMonth}
              onNext={goNextMonth}
              prevDisabled={isCurrentMonth}
              onSelect={handleDateSelect}
            />
          )}

          {step === "time" && selectedDate && (
            <TimeStep
              dateLabel={formatLongDate(selectedDate)}
              onBack={() => setStep("date")}
              onSelect={handleTimeSelect}
            />
          )}

          {step === "details" && selectedDate && selectedTime && (
            <DetailsStep
              summary={`${formatLongDate(selectedDate)} at ${selectedTime}`}
              name={name}
              email={email}
              phone={phone}
              onName={setName}
              onEmail={setEmail}
              onPhone={setPhone}
              onBack={() => setStep("time")}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Step components -------------------- */

function DateStep({
  address,
  monthLabel,
  dates,
  onPrev,
  onNext,
  prevDisabled,
  onSelect,
}: {
  address: string;
  monthLabel: string;
  dates: AvailableDate[];
  onPrev: () => void;
  onNext: () => void;
  prevDisabled: boolean;
  onSelect: (d: AvailableDate) => void;
}) {
  const firstRow = dates.slice(0, 3);
  const secondRow = dates.slice(3, 6);

  return (
    <div className="animate-slide-in-from-right-4 overflow-hidden">
      <div className="mb-1.5 sm:mb-2 px-1">
        <p className="text-[#4e4e4e] text-xs sm:text-base">{address}</p>
      </div>
      <h1 className="text-[#000000] text-base sm:text-xl font-semibold mb-2 sm:mb-6 leading-tight px-1">
        Choose date and time for your Facial appointment
      </h1>

      <div className="flex items-center justify-between mb-2 sm:mb-6">
        <button
          aria-label="Previous month"
          onClick={onPrev}
          disabled={prevDisabled}
          className="p-2 -ml-2 touch-manipulation min-h-[40px] min-w-[40px] disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5 text-[#333333]" />
        </button>
        <span className="text-[#333333] text-sm sm:text-lg font-medium">
          {monthLabel}
        </span>
        <button
          aria-label="Next month"
          onClick={onNext}
          className="p-2 -mr-2 touch-manipulation min-h-[40px] min-w-[40px]"
        >
          <ChevronRight className="w-5 h-5 text-[#333333]" />
        </button>
      </div>

      <div>
        <h2 className="text-[#000000] text-sm sm:text-lg font-medium mb-1.5 sm:mb-4 px-1">
          Date
        </h2>
        <div className="space-y-1.5 sm:space-y-2">
          <DateRow row={firstRow} onSelect={onSelect} />
          {secondRow.length > 0 && (
            <DateRow row={secondRow} onSelect={onSelect} />
          )}
        </div>
      </div>
    </div>
  );
}

function DateRow({
  row,
  onSelect,
}: {
  row: AvailableDate[];
  onSelect: (d: AvailableDate) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-1.5 sm:mb-2 last:mb-0">
      {row.map((d) => (
        <div key={`${d.year}-${d.month}-${d.day}`} className="text-center">
          <div className="text-[#4e4e4e] text-xs sm:text-sm font-medium py-0.5 mb-0.5 sm:mb-1">
            {d.weekday}
          </div>
          <button
            onClick={() => onSelect(d)}
            className="w-full h-9 sm:h-12 rounded-full text-center font-medium transition-colors touch-manipulation text-sm sm:text-base text-[#333333] hover:bg-[#fafafa] active:bg-[#fafafa]"
          >
            {d.day}
          </button>
        </div>
      ))}
    </div>
  );
}

function TimeStep({
  dateLabel,
  onBack,
  onSelect,
}: {
  dateLabel: string;
  onBack: () => void;
  onSelect: (t: string) => void;
}) {
  return (
    <div className="animate-slide-in-from-right-4 overflow-hidden">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[#333333] text-sm font-medium mb-3 sm:mb-4 -ml-1 p-1 touch-manipulation"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="text-[#000000] text-base sm:text-xl font-semibold mb-1 leading-tight px-1">
        Select your preferred time
      </h1>
      <p className="text-[#4e4e4e] text-xs sm:text-base mb-3 sm:mb-5 px-1">
        {dateLabel}
      </p>

      <div className="space-y-3 sm:space-y-4">
        <TimeGroup label="Morning" slots={MORNING_SLOTS} onSelect={onSelect} />
        <TimeGroup label="Afternoon" slots={AFTERNOON_SLOTS} onSelect={onSelect} />
      </div>
    </div>
  );
}

function TimeGroup({
  label,
  slots,
  onSelect,
}: {
  label: string;
  slots: string[];
  onSelect: (t: string) => void;
}) {
  return (
    <div>
      <h3 className="text-[#000000] text-sm sm:text-base font-medium mb-1.5 sm:mb-2 px-1">
        {label}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => onSelect(slot)}
            className="h-10 sm:h-11 rounded-full border border-[#e5e5e5] text-[#333333] text-sm sm:text-base font-medium transition-colors touch-manipulation hover:bg-[#fafafa] active:bg-[#fafafa]"
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}

function DetailsStep({
  summary,
  name,
  email,
  phone,
  onName,
  onEmail,
  onPhone,
  onBack,
  onSubmit,
}: {
  summary: string;
  name: string;
  email: string;
  phone: string;
  onName: (v: string) => void;
  onEmail: (v: string) => void;
  onPhone: (v: string) => void;
  onBack: () => void;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <div className="animate-slide-in-from-right-4 overflow-hidden">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[#333333] text-sm font-medium mb-3 sm:mb-4 -ml-1 p-1 touch-manipulation"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="text-[#000000] text-base sm:text-xl font-semibold mb-1 leading-tight px-1">
        Enter your details
      </h1>
      <p className="text-[#4e4e4e] text-xs sm:text-base mb-3 sm:mb-5 px-1">
        {summary}
      </p>

      <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
        <Field label="Name" value={name} onChange={onName} type="text" autoComplete="name" />
        <Field label="Email" value={email} onChange={onEmail} type="email" autoComplete="email" />
        <Field label="Phone" value={phone} onChange={onPhone} type="tel" autoComplete="tel" />

        <button
          type="submit"
          className="w-full h-11 sm:h-12 rounded-full bg-[#000000] text-white text-sm sm:text-base font-medium transition-colors touch-manipulation hover:bg-[#1a1a1a] active:bg-[#1a1a1a] mt-2"
        >
          Schedule Appointment
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[#333333] text-sm font-medium mb-1 px-1">
        {label}
      </span>
      <input
        required
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-4 rounded-full border border-[#e5e5e5] text-[#333333] text-sm sm:text-base bg-white focus:outline-none focus:border-[#333333] transition-colors"
      />
    </label>
  );
}

