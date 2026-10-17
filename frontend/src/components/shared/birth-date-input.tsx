'use client';

import React, { useState, useEffect } from 'react';
import { Sheet } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  SHAMSI_MONTHS,
  maskShamsiDateInput,
  isValidShamsiDate,
  shamsiToGregorianIso,
  gregorianToShamsiString,
  toEnglishDigits,
} from '@/lib/date-utils';
import { toFaDigits, cn } from '@/lib/utils';

interface BirthDateInputProps {
  value?: string;
  onChange: (shamsiValue: string, gregorianIso: string | null) => void;
  id?: string;
  label?: string;
  optional?: boolean;
  className?: string;
}

export function BirthDateInput({
  value = '',
  onChange,
  id = 'birth-date',
  label = 'تاریخ تولد',
  optional = true,
  className,
}: BirthDateInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Picker selection states
  const [selectedYear, setSelectedYear] = useState<number>(1375);
  const [selectedMonth, setSelectedMonth] = useState<number>(6);
  const [selectedDay, setSelectedDay] = useState<number>(21);

  // Sync external value
  useEffect(() => {
    if (value) {
      // Check if value is Gregorian (e.g. "1996-09-11") or Shamsi
      const clean = toEnglishDigits(value);
      if (clean.startsWith('19') || clean.startsWith('20')) {
        const shamsi = gregorianToShamsiString(value);
        setInputValue(shamsi);
      } else {
        const masked = maskShamsiDateInput(value);
        setInputValue(masked.displayValue);
      }
    } else {
      setInputValue('');
    }
  }, [value]);

  // Handle direct keyboard typing with auto-masking
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const { displayValue, isValid } = maskShamsiDateInput(raw, inputValue);
    setInputValue(displayValue);

    if (displayValue === '') {
      onChange('', null);
    } else if (isValid) {
      const iso = shamsiToGregorianIso(displayValue);
      onChange(displayValue, iso);
    } else {
      // Still updating the raw display text while typing
      onChange(displayValue, null);
    }
  };

  // Open datepicker modal and preset to current input or default
  const handleOpenPicker = () => {
    const clean = toEnglishDigits(inputValue);
    const match = clean.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
    if (match) {
      setSelectedYear(parseInt(match[1], 10));
      setSelectedMonth(parseInt(match[2], 10));
      setSelectedDay(parseInt(match[3], 10));
    }
    setIsPickerOpen(true);
  };

  // Apply selected date from picker
  const handleConfirmPicker = () => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const shamsi = `${toFaDigits(selectedYear)}/${toFaDigits(pad(selectedMonth))}/${toFaDigits(pad(selectedDay))}`;
    setInputValue(shamsi);

    const iso = shamsiToGregorianIso(`${selectedYear}/${pad(selectedMonth)}/${pad(selectedDay)}`);
    onChange(shamsi, iso);
    setIsPickerOpen(false);
  };

  const isComplete = toEnglishDigits(inputValue).replace(/\D/g, '').length === 8;
  const isInputValid = isComplete && isValidShamsiDate(inputValue);
  const isInputError = isComplete && !isInputValid;

  // Days in selected month for picker
  const maxDaysInMonth =
    selectedMonth <= 6
      ? 31
      : selectedMonth <= 11
      ? 30
      : selectedYear % 4 === 3
      ? 30
      : 29;

  return (
    <div className={cn('flex flex-col gap-[7px]', className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-[#465c51] text-[11px] font-medium flex items-center justify-between"
        >
          <span>{label}</span>
          {optional && (
            <small className="text-[#98a39e] text-[9px] font-normal">
              اختیاری
            </small>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="۱۳۷۵/۰۶/۲۱"
          inputMode="numeric"
          maxLength={10}
          dir="ltr"
          className={cn(
            'w-full h-[48px] border border-[#e0e8e3] rounded-[9px] outline-none bg-white px-[11px] pl-[40px] text-[#30453a] text-[12px] font-medium focus:border-sn-green transition-colors placeholder:text-[#b1bbb6] placeholder:font-light tracking-widest text-center',
            isInputError && 'border-red-400 focus:border-red-500 bg-red-50/20'
          )}
        />

        {/* Calendar Picker Icon Button */}
        <button
          type="button"
          onClick={handleOpenPicker}
          title="انتخاب از تقویم"
          className="absolute left-2.5 flex h-7 w-7 items-center justify-center rounded-[7px] text-[#788a80] hover:bg-[#edf5f0] hover:text-sn-green active:scale-95 transition-all cursor-pointer border-0 bg-transparent"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
      </div>

      {/* Validation / Format hints */}
      {isInputError ? (
        <span className="text-[9.5px] text-red-500 font-medium px-1">
          تاریخ تولد واردشده معتبر نیست (سال/ماه/روز)
        </span>
      ) : isInputValid ? (
        <span className="text-[9.5px] text-sn-green font-medium px-1 flex items-center gap-1">
          <span>✓ فرمت صحیح است</span>
        </span>
      ) : inputValue.length > 0 && inputValue.length < 10 ? (
        <span className="text-[9px] text-[#8ea095] px-1 font-light">
          فرمت: سال/ماه/روز (مثال: ۱۳۷۵/۰۶/۲۱)
        </span>
      ) : null}

      {/* Persian Date Picker Sheet */}
      <Sheet
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        title="انتخاب تاریخ تولد"
      >
        <div className="py-3 text-right" dir="rtl">
          {/* 3 Select Dropdowns: Year, Month, Day */}
          <div className="grid grid-cols-3 gap-2 my-4">
            {/* Year Selector */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-sn-muted font-bold">سال</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                className="h-10 rounded-[9px] border border-sn-line bg-white px-2 text-[11px] font-bold text-sn-text outline-none focus:border-sn-green text-center cursor-pointer"
              >
                {Array.from({ length: 90 }, (_, i) => 1410 - i).map((y) => (
                  <option key={y} value={y}>
                    {toFaDigits(y)}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Selector */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-sn-muted font-bold">ماه</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                className="h-10 rounded-[9px] border border-sn-line bg-white px-2 text-[11px] font-bold text-sn-text outline-none focus:border-sn-green text-center cursor-pointer"
              >
                {SHAMSI_MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label} ({toFaDigits(m.value)})
                  </option>
                ))}
              </select>
            </div>

            {/* Day Selector */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-sn-muted font-bold">روز</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(parseInt(e.target.value, 10))}
                className="h-10 rounded-[9px] border border-sn-line bg-white px-2 text-[11px] font-bold text-sn-text outline-none focus:border-sn-green text-center cursor-pointer"
              >
                {Array.from({ length: maxDaysInMonth }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {toFaDigits(d)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Date Summary */}
          <div className="p-3 rounded-[10px] bg-[#edf7f1] border border-[#d2edd9] text-center my-3">
            <span className="text-[10.5px] text-[#425d50]">تاریخ انتخابی: </span>
            <b className="text-[13px] font-black text-sn-green mr-1 tracking-wider">
              {toFaDigits(selectedYear)}/{toFaDigits(String(selectedMonth).padStart(2, '0'))}/
              {toFaDigits(String(selectedDay).padStart(2, '0'))}
            </b>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-sn-line">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsPickerOpen(false)}
            >
              انصراف
            </Button>
            <Button type="button" variant="default" onClick={handleConfirmPicker}>
              تایید تاریخ
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
