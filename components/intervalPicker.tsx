import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet } from 'react-native';
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
}

const IntervalPicker: React.FC<DatePickerProps> = ({ onDatesSelected, defaultValue }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // New function to format date as DD-MM-YYYY
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (startDate && endDate) {
      onDatesSelected(formatDate(startDate), formatDate(endDate));
    }
  }, [startDate, endDate]);

  const openDatePicker = () => setIsVisible(true);
  const closeDatePicker = () => setIsVisible(false);

  const handleDateSelection = (day: number) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    if (!startDate || (startDate && endDate)) {
      setStartDate(selectedDate);
      setEndDate(null);
    } else if (selectedDate < startDate) {
      setStartDate(selectedDate);
    } else {
      setEndDate(selectedDate);
    }
  };

  const isDayInRange = (day: number) => {
    if (!startDate || !endDate) return false;

    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date >= startDate && date <= endDate;
  };

  const isDaySelected = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return (
      (startDate && date.getTime() === startDate.getTime()) ||
      (endDate && date.getTime() === endDate.getTime())
    );
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days.map((day, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.day,
          day ? styles.activeDay : styles.inactiveDay,
          day && isDaySelected(day) ? styles.selectedDay : null,
          day && isDayInRange(day) ? styles.selectedDay : null,
        ]}
        disabled={!day}
        onPress={() => day && handleDateSelection(day)}
      >
        <Text
          style={[
            styles.dayText,
            day && isDaySelected(day) ? styles.selectedDayText : null,
          ]}
        >
          {day || ''}
        </Text>
      </TouchableOpacity>
    ));
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const swipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      const { translationX } = event;
      if (translationX > 150) {
        runOnJS(goToPreviousMonth)();
      }
      if (translationX < -150) {
        runOnJS(goToNextMonth)();
      }
    });

  return (
    <View>
      <TouchableOpacity onPress={openDatePicker} style={styles.dateButton}>
        <Feather name='calendar' size={16} color={'#22222'} />
        <Text style={styles.dateText}>
          {startDate && endDate
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : (defaultValue || 'اختر التاريخ')}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={closeDatePicker}
      >
        <View style={styles.modalContainer}>
          <GestureHandlerRootView>
            <GestureDetector gesture={swipeGesture}>
              <View style={styles.calendarContainer}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={goToPreviousMonth}>
                    <Text style={styles.navText}>
                      <Feather name='chevron-left' size={24} color={'#222222'} />
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.monthText}>
                    {currentDate.toLocaleString('default', {
                      month: 'long',
                    })}{' '}
                    {currentDate.getFullYear()}
                  </Text>
                  <TouchableOpacity onPress={goToNextMonth}>
                    <Text style={styles.navText}>
                      <Feather name='chevron-right' size={24} color={'#222222'} />
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.weekDaysContainer}>
                  {['احد', 'اثنين', 'ثلاثاء', 'اربعاء', 'خميس', 'جمعة', 'سبت'].map(
                    (day, index) => (
                      <Text key={index} style={styles.weekDay}>
                        {day}
                      </Text>
                    )
                  )}
                </View>

                <View style={styles.daysContainer}>{renderDays()}</View>

                <View style={{flexDirection: 'row', gap: 10}}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeDatePicker}
                  >
                    <Text style={styles.closeButtonText}>الغاء</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.closeButton, {backgroundColor: '#EE50FF'}]}
                    onPress={closeDatePicker}
                  >
                    <Text style={styles.closeButtonText}>حسنا</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </GestureDetector>
          </GestureHandlerRootView>
        </View>
      </Modal>
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
        height: 55,
},
dateText: {
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    direction: 'ltr',
  },
  calendarContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
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
    width: '100%', // Ensures the grid spans the entire container width
  },
  day: {
    width: `${100 / 7}%`, // Ensures 7 days fit in a row (14.28% of width each)
    aspectRatio: 1, // Keeps the day square-shaped
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4, // Adds vertical spacing between rows
    borderRadius: 20,
  },
  activeDay: {
  },
  inactiveDay: {
  },
  dayText: {
    color: '#222222',
  },
  selectedDay: {
    borderWidth: 2,
    borderColor: '#EE50FF',
  },
  selectedDayText: {
    color: '#EE50FF',
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
