"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatSummary(dateParam: string | null, timeParam: string | null): string | null {
  if (!dateParam || !timeParam) return null;
  const parts = dateParam.split("-");
  if (parts.length !== 3) return null;
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (isNaN(month) || isNaN(day) || month < 0 || month > 11) return null;
  return `${MONTH_NAMES[month]} ${day} at ${timeParam}`;
}

function ConfirmedContent() {
  const searchParams = useSearchParams();
  const summary = formatSummary(
    searchParams.get("date"),
    searchParams.get("time"),
  );

  return (
    <div className="animate-fade-in text-center px-2">
      <div className="flex justify-center mb-3 sm:mb-4">
        <CheckCircle2
          className="w-12 h-12 sm:w-14 sm:h-14 text-[#000000]"
          strokeWidth={1.5}
        />
      </div>
      <h2 className="text-[#000000] text-lg sm:text-2xl font-semibold mb-2 leading-tight">
        Appointment Scheduled!
      </h2>
      {summary ? (
        <p className="text-[#4e4e4e] text-sm sm:text-base mb-1 leading-snug">
          Your facial appointment for {summary} has been confirmed.
        </p>
      ) : (
        <p className="text-[#4e4e4e] text-sm sm:text-base mb-1 leading-snug">
          Your facial appointment has been confirmed.
        </p>
      )}
      <p className="text-[#4e4e4e] text-sm sm:text-base mb-5 sm:mb-6 leading-snug">
        You will receive a confirmation shortly.
      </p>
      <Link
        href="/"
        className="text-[#000000] text-sm sm:text-base font-medium underline underline-offset-4 touch-manipulation"
      >
        Book Another Appointment
      </Link>
    </div>
  );
}

export default function ConfirmedPage() {
  return (
    <div className="h-dvh w-full bg-[#ffffff] flex flex-col overflow-hidden fixed inset-0 overscroll-none">
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

      <div className="flex-shrink-0 px-4 pb-2 sm:pb-8 overflow-hidden">
        <div className="w-full max-w-sm mx-auto overflow-hidden">
          <Suspense fallback={null}>
            <ConfirmedContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
