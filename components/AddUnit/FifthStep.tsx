import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, TextInput, View } from "react-native";
import Text from "../Text";
import { Feather, Ionicons } from "@expo/vector-icons";
import IntervalPicker from "../intervalPicker";
import { CustomRadio } from "../CustomRadio";

interface FifthStepInterface {
  formData: any;
  handleChange: (unitType: string, value: any) => void;
  discounts: any;
  setDiscounts: (value: any) => void;
  specialPrices: any;
  setSpecialPrices: (any) => void;
}

const FifthStep: React.FC<FifthStepInterface> = ({ 
    formData,
    handleChange,
    discounts,
    setDiscounts,
    specialPrices,
    setSpecialPrices,
}) => {

    const addDiscount = () => {
        setDiscounts([...discounts, { value: "", startDate: "", endDate: "" }]);
    };

    const removeDiscount = (index: number) => {
        setDiscounts(discounts.filter((_, i) => i !== index));
    };

    const updateDiscountValue = (index: number, value: string) => {
        const updatedDiscounts = [...discounts];
        updatedDiscounts[index].value = value;
        setDiscounts(updatedDiscounts);
    };

    const updateDiscountDates = (index: number, startDate: string, endDate: string) => {
        const updatedDiscounts = [...discounts];
        updatedDiscounts[index].startDate = startDate;
        updatedDiscounts[index].endDate = endDate;
        setDiscounts(updatedDiscounts);
    };

        const addSpecialPrice = () => {
        setSpecialPrices([...specialPrices, { price: "", startDate: "", endDate: "", minReservationPeriod: "" }]);
    };

    const removeSpecialPrice = (index: number) => {
        setSpecialPrices(specialPrices.filter((_, i) => i !== index));
    };

    const updateSpecialPriceValues = (index: number, key: string, value: string) => {
        const updatedSpecialPrices = [...specialPrices];
        updatedSpecialPrices[index][key] = value;
        setSpecialPrices(updatedSpecialPrices);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle} medium>أضافه خصم/عرض</Text>
                    <TouchableOpacity onPress={addDiscount}>
                        <Ionicons name="add-circle" size={24} color="#EE50FF" />
                    </TouchableOpacity>
                </View>
                {discounts.map((discount, index) => (
                    <View key={index} style={styles.discountContainer}>
                        <Text style={[styles.sectionTitle, {marginBottom: 0}]} medium>تواريخ ايام الخصم</Text>
                        <IntervalPicker
                            defaultValue={(discount.startDate && discount.endDate) && discount.startDate + ' - ' + discount.endDate}                        
                            onDatesSelected={(startDate, endDate) => updateDiscountDates(index, startDate, endDate)}
                        />
                        <Text style={[styles.sectionTitle, {marginBottom: 0}]} medium>نسبه الخصم</Text>
                        <View style={styles.conditionInputContainer}>
                            <TextInput
                                style={styles.conditionInput}
                                value={discount.value}
                                onChangeText={(text) => updateDiscountValue(index, text)}
                                placeholder="10"
                                keyboardType="numeric"
                                textAlign="right"
                            />
                            <Feather name="percent" size={24} style={{ position: "absolute", left: 10 }} color={"#E44040"} />
                        </View>

                        <TouchableOpacity
                            style={{ position: "absolute", top: -10, left: -10 }}
                            onPress={() => removeDiscount(index)}
                        >
                            <Ionicons name="close-circle" size={24} color="#E44040" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <CustomRadio
                label="هل تريد عمل أسعار خاصه فتره الويك اند"
                value={formData.does_there_weekend_prices}
                options={[
                    { label: 'نعم', value: '1' },
                    { label: 'لا', value: '0' },
                ]}
                onChange={(value) => handleChange('does_there_weekend_prices', value)}
            />
            {formData.does_there_weekend_prices == 1 && (
                <View style={styles.weekendPriceContainer}>
                    <Text style={styles.sectionTitle} medium>سعر الويك اند</Text>
                    <TextInput
                        style={styles.conditionInput}
                        value={formData.weekend_price}
                        onChangeText={(text) => handleChange('weekend_price', text)}
                        placeholder="أدخل سعر الويك اند بالجنيه المصري"
                        keyboardType="numeric"
                        textAlign="right"
                    />
                </View>
            )}
                        <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle} medium>إضافة أسعار خاصة</Text>
                    <TouchableOpacity onPress={addSpecialPrice}>
                        <Ionicons name="add-circle" size={24} color="#EE50FF" />
                    </TouchableOpacity>
                </View>
                {specialPrices.map((specialPrice, index) => (
                    <View key={index} style={styles.discountContainer}>
                        <Text style={[styles.sectionTitle, {marginBottom: 0}]} medium>تاريخ السعر الخاص</Text>
                        <IntervalPicker
                            defaultValue={(specialPrice.startDate && specialPrice.endDate) && specialPrice.startDate + ' - ' + specialPrice.endDate}
                            onDatesSelected={(startDate, endDate) => updateSpecialPriceValues(index, 'startDate', startDate) || updateSpecialPriceValues(index, 'endDate', endDate)}
                        />
                        <Text style={[styles.sectionTitle, {marginBottom: 0}]} medium>السعر</Text>
                        <TextInput
                            style={styles.conditionInput}
                            value={specialPrice.price}
                            onChangeText={(text) => updateSpecialPriceValues(index, 'price', text)}
                            placeholder="أدخل السعر"
                            keyboardType="numeric"
                            textAlign="right"
                        />
                        <Text style={[styles.sectionTitle, {marginBottom: 0}]} medium>أقل مدة حجز</Text>
                        <TextInput
                            style={styles.conditionInput}
                            value={specialPrice.minReservationPeriod}
                            onChangeText={(text) => updateSpecialPriceValues(index, 'minReservationPeriod', text)}
                            placeholder="أدخل الحد الأدنى للحجز"
                            keyboardType="numeric"
                            textAlign="right"
                        />
                        <TouchableOpacity
                            style={{ position: "absolute", top: -10, left: -10 }}
                            onPress={() => removeSpecialPrice(index)}
                        >
                            <Ionicons name="close-circle" size={24} color="#E44040" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
    },
    sectionTitle: {
        fontSize: 14,
        marginBottom: 12,
        textAlign: "right",
    },
    section: {
        marginVertical: 16,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    discountContainer: {
        position: "relative",
        padding: 12,
        marginBottom: 12,
        gap: 10,
        backgroundColor: "#FBFBFB",
        borderWidth: 1,
        borderColor: "#FF2626",
        borderRadius: 12,
        borderStyle: 'dashed',
    },
    conditionInputContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 16,
        position: "relative",
        direction: "ltr",
    },
    conditionInput: {
        fontSize: 14,
        fontFamily: "NotoKufiArabic_600SemiBold",
        color: "#010101",
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#D2D1D1",
        paddingHorizontal: 10,
        textAlign: "center",
        height: 55,
    },
    weekendPriceContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: "#F8F8F8",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#D2D1D1",
    },
});

export default FifthStep;
