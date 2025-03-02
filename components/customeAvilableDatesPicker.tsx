import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import Text from './Text';
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { runOnJS } from 'react-native-reanimated';

interface DatePickerProps {
  onDatesSelected: (startDate: string | null, endDate: string | null) => void;
  defaultValue?: string | null;
  reservations: Array<{ date_from: string; date_to: string }>;
  unavailable_dates: Array<{ from: string; to: string }>;
  setEnd: (date: Date) => void;
  setStart: (date: Date) => void;
  unit: any
}

const IntervalPicker: React.FC<DatePickerProps> = ({ onDatesSelected, defaultValue, unavailable_dates, setStart, setEnd, unit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const isDateAvailable = (date: Date): boolean => {
    // First check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
    
    if (date < today) {
      return false;
    }

    // Then check if date is in unavailable ranges
    const dateTimestamp = date.getTime();
    const isUnavailable = unavailable_dates.some(unavail => {
      const unavailFrom = new Date(unavail.from).getTime();
      const unavailTo = new Date(unavail.to).getTime();
      return dateTimestamp >= unavailFrom && dateTimestamp <= unavailTo;
    });
    
    return !isUnavailable;
  };
  const isRangeAvailable = (start: Date, end: Date): boolean => {
    let current = new Date(start);
    while (current <= end) {
      if (!isDateAvailable(current)) {
        return false;
      }
      current.setDate(current.getDate() + 1);
    }
    return true;
  };

  useEffect(() => {
    if (startDate && endDate) {
      onDatesSelected(formatDate(startDate), formatDate(endDate));
    }
  }, [startDate, endDate]);

  const openDatePicker = () => setIsVisible(true);
  const closeDatePicker = () => setIsVisible(false);

  const handleDateSelection = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (!isDateAvailable(selectedDate)) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(selectedDate);
      setStart(selectedDate);
      setEndDate(null);
      setEnd(null);
    } else if (selectedDate < startDate) {
      setStartDate(selectedDate);
      setStart(selectedDate);
    } else {
      if (isRangeAvailable(startDate, selectedDate)) {
        setEndDate(selectedDate);
        setEnd(selectedDate);
      } else {
        Alert.alert('Invalid Range', 'The selected range includes unavailable dates.');
      }
    }
  };

  const isDayInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date >= startDate && date <= endDate;
  };

  const isDaySelected = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return (startDate && date.getTime() === startDate.getTime()) || (endDate && date.getTime() === endDate.getTime());
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
function getSuitablePrice(unit, date, reservationDays = 1) {
    const checkDate = new Date(date);
    const dayOfWeek = checkDate.getDay(); // 0 (Sunday) - 6 (Saturday)
    
    let basePrice = parseFloat(unit.price);
    
    // Apply special reservation time price
    const specialTime = unit.special_reservation_times.find(({ from, to }) => checkDate >= new Date(from) && checkDate <= new Date(to));
    if (specialTime) {
        basePrice = parseFloat(specialTime.price);
    }
    
    // Apply weekend price if applicable
    if (unit.weekend_prices && (dayOfWeek === 4 || dayOfWeek === 5 || dayOfWeek === 6)) { // Assuming Friday (5) & Saturday (6) as weekends
        basePrice = parseFloat(unit.weekend_price);
    }
    
    // Apply sales discount if available
    const sale = unit.sales.find(({ from, to }) => checkDate >= new Date(from) && checkDate <= new Date(to));
    if (sale) {
        basePrice -= basePrice * (parseFloat(sale.sale_percentage) / 100);
    }
    
    return parseInt(basePrice);
}


  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const days = Array.from({ length: firstDayOfWeek }, () => null).concat(
      Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );

    return days.map((day, index) => {
      const date = day ? new Date(year, month, day) : null;
      const isAvailable = date ? isDateAvailable(date) : false;
      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.day,
            day ? styles.activeDay : styles.inactiveDay,
            day && isDaySelected(day) && isAvailable ? styles.selectedDay : null,
            day && isDayInRange(day) && isAvailable ? styles.selectedDay : null,
            !isAvailable ? styles.disabledDay : null,
          ]}
          disabled={!day || !isAvailable}
          onPress={() => day && handleDateSelection(day)}
        >
          <Text style={[styles.dayText, !isAvailable ? styles.disabledDayText : null,
            day && isDaySelected(day) && isAvailable ? styles.selectedDayText : null,
            day && isDayInRange(day) && isAvailable ? styles.selectedDayText : null,
          ]}>
            {day || ''}
          </Text>
          <Text style={{fontSize: 10, color: '#ccc'}} medium>
            {getSuitablePrice(unit, date, 1)}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  const goToNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToPreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const swipeGesture = Gesture.Pan().onUpdate((event) => {
    const { translationX } = event;
    if (translationX > 150) runOnJS(goToPreviousMonth)();
    if (translationX < -150) runOnJS(goToNextMonth)();
  });

  return (
    <View>

        <View style={styles.modalContainer}>
          <GestureHandlerRootView>
            <GestureDetector gesture={swipeGesture}>
              <View style={styles.calendarContainer}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={goToPreviousMonth}>
                    <Text style={styles.navText}><Feather name='chevron-left' size={24} color={'#222222'} /></Text>
                  </TouchableOpacity>
                  <Text style={styles.monthText} bold>
                    {currentDate.toLocaleString('ar-eg', { month: 'long'})} {currentDate.getFullYear()}
                  </Text>
                  <TouchableOpacity onPress={goToNextMonth}>
                    <Text style={styles.navText}><Feather name='chevron-right' size={24} color={'#222222'} /></Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.weekDaysContainer}>
                  {['احد', 'اثنين', 'ثلاثاء', 'اربعاء', 'خميس', 'جمعة', 'سبت'].map((day, index) => (
                    <Text key={index} style={styles.weekDay}>{day}</Text>
                  ))}
                </View>

                <View style={styles.daysContainer}>{renderDays()}</View>

              </View>
            </GestureDetector>
          </GestureHandlerRootView>
        </View>
        {
          (startDate && endDate) && (
            <TouchableOpacity style={styles.dateButton}>
              <Feather name='calendar' size={16} color={'#22222'} />
              <Text style={styles.dateText}>
                {startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : (defaultValue || 'اختر التاريخ')}
              </Text>
            </TouchableOpacity>
          )
        }

    </View>
  );
};

const styles = StyleSheet.create({
  dateButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    fontSize: 14,
    fontFamily: "NotoKufiArabic_600SemiBold",
    color: "#010101",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D2D1D1",
    paddingHorizontal: 16,
    textAlign: "center",
    marginTop: 16,
    height: 55,
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    direction: 'ltr',
  },
  calendarContainer: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F1F1'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  navText: {
    fontSize: 18,
    fontWeight: '600',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
  },
  day: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#eee",
    borderWidth: 2,
    boxSizing: 'border-box',
    borderColor: '#FAFAFA'
  },
  activeDay: {},
  inactiveDay: {},
  dayText: {
    color: '#222222',
  },
  selectedDay: {
    backgroundColor: '#EE50FF',
  },
  selectedDayText: {
    color: '#fff',
  },
  disabledDay: {
    opacity: 0.5,
  },
  disabledDayText: {
    color: '#a0a0a0',
  },
  closeButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: 'gray',
    paddingHorizontal: 44,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
  },
});

export default IntervalPicker;