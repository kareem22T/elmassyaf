import React, { useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import Text from '../Text';

interface FourthStepInterface {
  formData: any;
  handleChange: (unitType: string, value: any) => void;
  cancellationPolicies: any;
  setCancellationPolicies: (value: any) => void;
  additionalFees: any;
  setAdditionalFees: (value: any) => void;
  longTermPolicies: any;
  setLongTermPolicies: (value: any) => void;
}

const FourthStep: React.FC<FourthStepInterface> = ({ 
  formData, handleChange, cancellationPolicies, setCancellationPolicies, additionalFees, setAdditionalFees, longTermPolicies, setLongTermPolicies
}) => {

    const addNewFee = () => {
        setAdditionalFees([...additionalFees, { name: '', value: '', type: '' }]);
    };

    const removeFee = (index) => {
        const newFees = additionalFees.filter((_, i) => i !== index);
        setAdditionalFees(newFees);
    };

    const addCancellationPolicy = () => {
        setCancellationPolicies([...cancellationPolicies, { days: '', percentage: '' }]);
    };

    const removeCancellationPolicy = (index) => {
        const newPolicies = cancellationPolicies.filter((_, i) => i !== index);
        setCancellationPolicies(newPolicies);
    };

    const addLongTermPolicy = () => {
        setLongTermPolicies([...longTermPolicies, { days: '', percentage: '' }]);
    };

    const removeLongTermPolicy = (index) => {
        const newPolicies = longTermPolicies.filter((_, i) => i !== index);
        setLongTermPolicies(newPolicies);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Terms and Conditions */}
            <Text style={styles.sectionTitle} medium>شروط و قواعد الحجز الخاصه بالوحده</Text>
            <TextInput
                style={styles.rulesInput}
                multiline
                placeholder="اكتب القواعد الخاصه بك..."
                value={formData.rules}
                onChangeText={(value) => handleChange('rules', value)}
                textAlign="right"
            />

            <View style={styles.grayCard}>
                {/* Booking Method */}
                <View style={styles.bookingMethod}>
                    <Text style={styles.sectionTitle} medium>طريقة الحجز</Text>
                    <View style={styles.methodOptions}>
                        <TouchableOpacity
                            style={[styles.methodOption, formData.reservation_type === 'direct' && styles.activeMethod]}
                            onPress={() => handleChange('reservation_type', 'direct')}
                        >
                            <Text medium style={[styles.optionText, formData.reservation_type === 'direct' && styles.activeText]}>
                                حجز مباشر
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.methodOption, formData.reservation_type === 'request' && styles.activeMethod]}
                            onPress={() => handleChange('reservation_type', 'request')}
                        >
                            <Text medium style={[styles.optionText, formData.reservation_type === 'request' && styles.activeText]}>
                                إرسال طلب اولا
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Unit Price */}
                <Text style={styles.sectionTitle} medium>سعر الوحده</Text>
                <View style={styles.priceContainer}>
                    <TextInput
                        style={styles.priceInput}
                        value={formData.price}
                        onChangeText={(value) => handleChange('price', value)}
                        placeholder='السعر بالجنية المصري'
                        keyboardType="numeric"
                        textAlign="right"
                        />
                    <Text style={styles.currencyText}>EGP</Text>
                </View>
                <Text style={styles.noteText}>
                    ملاحظه: يجب العلم بأن عموله التطبيق <Text style={{ color: '#EE50FF' }}>150 جنيه</Text> من سعر وحدتك
                </Text>
            </View>

            {/* Insurance Amount */}
            <Text style={styles.sectionTitle} medium>مبلغ التأمين</Text>
            <View style={styles.priceContainer}>
                <TextInput
                    style={styles.priceInput}
                    value={formData.insurance_amount}
                    onChangeText={(value) => handleChange('insurance_amount', value)}
                    placeholder='التامين بالجنية المصري'
                    keyboardType="numeric"
                    textAlign="right"
                />
                <Text style={styles.currencyText}>EGP</Text>
            </View>

            {/* Cancellation Policy */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle} medium>سياسيه الإلغاء الخاصه بك</Text>
                    <TouchableOpacity onPress={addCancellationPolicy}>
                        <Ionicons name='add-circle' size={24} color="#EE50FF" />
                    </TouchableOpacity>
                </View>
                {cancellationPolicies.map((policy, index) => (
                    <View key={index} style={styles.policyContainer}>
                        <View style={styles.policyCondition}>
                            <Text style={styles.policyConditionText} medium>في حاله الالغاء {'\n'} قبل اكثر من </Text>
                            <View style={styles.conditionInputContainer}>
                                <Text style={styles.policyConditionText} medium>يوم من تاريخ السفر </Text>
                                <TextInput
                                    style={styles.conditionInput}
                                    value={policy.days}
                                    onChangeText={(text) => {
                                        const newPolicies = [...cancellationPolicies];
                                        newPolicies[index].days = text;
                                        setCancellationPolicies(newPolicies);
                                    }}
                                    placeholder='1'
                                    keyboardType="numeric"
                                    textAlign="right"
                                />
                            </View>
                        </View>
                        <View style={styles.policyCondition}>
                            <Text style={styles.policyConditionText} medium>يخصم {'\n'} من قيمه مقدم الحجز </Text>
                            <View style={styles.conditionInputContainer}>
                                <TextInput
                                    style={styles.conditionInput}
                                    value={policy.percentage}
                                    onChangeText={(text) => {
                                        const newPolicies = [...cancellationPolicies];
                                        newPolicies[index].percentage = text;
                                        setCancellationPolicies(newPolicies);
                                    }}
                                    placeholder='10'
                                    keyboardType="numeric"
                                    textAlign="right"
                                />
                                <Feather name='percent' size={24} style={{ position: 'absolute', left: 10 }} color={'#E44040'} />
                            </View>
                        </View>
                        {
                            index > -1 && (
                                <TouchableOpacity style={{position: 'absolute', top: -10, left: -10}} onPress={() => removeCancellationPolicy(index)}>
                                    <Ionicons name='close-circle' size={24} color="#E44040" />
                                </TouchableOpacity>
                            )
                        }
                    </View>
                ))}
            </View>

            {/* Maximum Adults */}
            <Text style={styles.sectionTitle} medium>أقصي عدد للأفراد البالغين</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.numberInput}
                    value={formData.max_individuals}
                    onChangeText={(value) => handleChange('max_individuals', value)}
                    keyboardType="numeric"
                    textAlign="right"
                />
                <Text style={styles.unitText}>فرد</Text>
            </View>

            {/* Youth Only Toggle */}
            <View style={styles.toggleContainer}>
                <Switch
                    value={Boolean(formData.youth_only)}
                    onValueChange={(value) => handleChange('youth_only', value)}
                    trackColor={{ false: '#767577', true: '#EE50FF' }}
                    thumbColor={formData.youthOnly ? '#fff' : '#f4f3f4'}
                />
                <Text style={styles.toggleText}>متاح حجز للشباب فقط</Text>
            </View>

            <Text style={styles.sectionTitle} medium>اقل فترة للحجز</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.numberInput}
                    value={formData.min_reservation_days}
                    onChangeText={(value) => handleChange('min_reservation_days', value)}
                    keyboardType="numeric"
                    textAlign="right"
                />
                <Text style={styles.unitText}>يوم</Text>
            </View>

            {/* Additional Fees */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle} medium>رسوم إضافيه</Text>
                    <TouchableOpacity onPress={addNewFee}>
                        <Ionicons name='add-circle' size={24} color="#EE50FF" />
                    </TouchableOpacity>
                </View>
                {additionalFees.map((fee, index) => (
                    <View key={index} style={styles.feesContainer}>
                        <Text>رسوم</Text>
                        <TextInput
                            style={styles.feeInput}
                            value={fee.name}
                            onChangeText={(text) => {
                                const newFees = [...additionalFees];
                                newFees[index].name = text;
                                setAdditionalFees(newFees);
                            }}
                            placeholder='اكتب هنا نوع الرسوم'
                            textAlign="right"
                        />
                        <Text>قيمه</Text>
                        <TextInput
                            style={styles.feeInput}
                            value={fee.value}
                            onChangeText={(text) => {
                                const newFees = [...additionalFees];
                                newFees[index].value = text;
                                setAdditionalFees(newFees);
                            }}
                            keyboardType="numeric"
                            placeholder='اكتب القيمة'
                            textAlign="right"
                        />
                        {
                            index > -1 && (
                                <TouchableOpacity style={{position: 'absolute', top: -10, left: -10}} onPress={() => removeFee(index)}>
                                    <Ionicons name='close-circle' size={24} color="#E44040" />
                                </TouchableOpacity>
                            )
                        }

                    </View>
                ))}
            </View>

            {/* Payment System */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle} medium>نظام الدفع</Text>
                </View>
                <View style={[styles.policyContainer, { backgroundColor: '#FBFBFB', borderColor: '#DDDDDD' }]}>
                    <View style={styles.policyCondition}>
                        <Text style={styles.policyConditionText} medium>مقدم الحجز قيمه من {'\n'} إجمالي المبلغ </Text>
                        <View style={styles.conditionInputContainer}>
                            <TextInput
                                style={styles.conditionInput}
                                value={formData.deposit}
                                onChangeText={(text) => handleChange('deposit', text)}
                                placeholder='ادخل نسبة المقدم'
                                maxLength={100}
                                keyboardType="numeric"
                                textAlign="right"
                            />
                            <Feather name='percent' size={24} style={{ position: 'absolute', left: 10 }} color={'#E44040'} />
                        </View>
                    </View>
                    <View style={styles.policyCondition}>
                        <Text style={styles.policyConditionText} medium>ويتبقي قيمه عند الوصول </Text>
                        <View style={styles.conditionInputContainer}>
                            <TextInput
                                style={styles.conditionInput}
                                maxLength={100}
                                value={formData.upon_arival_price}
                                onChangeText={(text) => handleChange('upon_arival_price', text)}
                                placeholder='ادخل نسبة المتبقى'
                                keyboardType="numeric"
                                textAlign="right"
                            />
                            <Feather name='percent' size={24} style={{ position: 'absolute', left: 10 }} color={'#E44040'} />
                        </View>
                    </View>
                </View>
            </View>

            {/* Long Term Booking */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle} medium>حجز لمدة طويلة</Text>
                    <TouchableOpacity onPress={addLongTermPolicy}>
                        <Ionicons name='add-circle' size={24} color="#EE50FF" />
                    </TouchableOpacity>
                </View>
                {longTermPolicies.map((policy, index) => (
                    <View key={index} style={[styles.policyContainer, { backgroundColor: '#FBFBFB', borderColor: '#DDDDDD' }]}>
                        <View style={styles.policyCondition}>
                            <Text style={styles.policyConditionText} medium>حجز أكثر من</Text>
                            <View style={styles.conditionInputContainer}>
                                <TextInput
                                    style={styles.conditionInput}
                                    value={policy.days}
                                    onChangeText={(text) => {
                                        const newPolicies = [...longTermPolicies];
                                        newPolicies[index].days = text;
                                        setLongTermPolicies(newPolicies);
                                    }}
                                    maxLength={100}
                                    keyboardType="numeric"
                                    textAlign="right"
                                />
                                <Text style={{ position: 'absolute', left: 10, fontSize: 18, color: '#757575' }}>يوم</Text>
                            </View>
                        </View>
                        <View style={styles.policyCondition}>
                            <Text style={styles.policyConditionText} medium>يتم خصم من {'\n'} قيمه مقدم الحجز </Text>
                            <View style={styles.conditionInputContainer}>
                                <TextInput
                                    style={styles.conditionInput}
                                    value={policy.percentage}
                                    onChangeText={(text) => {
                                        const newPolicies = [...longTermPolicies];
                                        newPolicies[index].percentage = text;
                                        setLongTermPolicies(newPolicies);
                                    }}
                                    maxLength={100}
                                    keyboardType="numeric"
                                    textAlign="right"
                                />
                                <Feather name='percent' size={24} style={{ position: 'absolute', left: 10 }} color={'#757575'} />
                            </View>
                        </View>
                        {
                            index > -1 && (
                                <TouchableOpacity style={{position: 'absolute', top: -10, left: -10}} onPress={() => removeLongTermPolicy(index)}>
                                    <Ionicons name='close-circle' size={24} color="#E44040" />
                                </TouchableOpacity>
                            )
                        }
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    sectionTitle: {
        fontSize: 14,
        marginBottom: 12,
        textAlign: 'right',
    },
    rulesInput: {
        height: 100,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 8,
        paddingVertical: 12,
        textAlignVertical: 'top',
        fontFamily: 'NotoKufiArabic_400Regular'
    },
    grayCard: {
        padding: 12,
        backgroundColor: '#FBFBFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderStyle: 'dashed',
        marginVertical: 16
    },
    bookingMethod: {
        marginVertical: 16,
    },
    methodOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F3F3F3',
        borderRadius: 12,
        gap: 12,
    },
    methodOption: {
        flex: 1,
        padding: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        alignItems: 'center',
    },
    activeMethod: {
        flex: 1,
        padding: 8,
        backgroundColor: '#FDEEFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#EE50FF",
        alignItems: 'center',
    },
    activeText: {
        color: '#EE50FF',
    },
    buttonText: {
        color: '#EE50FF',
    },
    optionText: {
        color: '#666',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 10,
        paddingVertical: 12
    },
    priceInput: {
        flex: 1,
        fontSize: 16,
    },
    currencyText: {
        fontSize: 16,
        marginLeft: 8,
        color: '#666',
    },
    noteText: {
        fontSize: 12,
        color: '#6E6E6E',
        textAlign: 'right',
        marginTop: 10,
    },
    section: {
        marginVertical: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    feesContainer: {
        flexDirection: 'row',
        position: 'relative',
        justifyContent: 'space-between',
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#FBFBFB',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 12,
        alignItems: 'center'
    },
    feeInput: {
        fontFamily: 'NotoKufiArabic_400Regular',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
        height: 45,
        fontSize: 11,
    },
    policyContainer: {
        backgroundColor: '#FFF6F6',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFC0C0',
        padding: 12,
        marginTop: 8,
        gap: 16
    },
    policyCondition: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        gap: 16
    },
    policyConditionText: {
        fontSize: 12,
        color: '#010101',
        flex: 1,
    },
    conditionInputContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 16,
        position: 'relative',
        direction: 'ltr'
    },
    conditionInput: {
        fontSize: 14,
        fontFamily: 'NotoKufiArabic_600SemiBold',
        color: '#010101',
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D2D1D1',
        paddingHorizontal: 8,
        textAlign: 'center',
        height: 45,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 10,
        paddingVertical: 12
    },
    numberInput: {
        flex: 1,
        fontSize: 16,
    },
    unitText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#666',
    },
    toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 16,
  },
  toggleText: {
    marginRight: 8,
  },
  paymentSystem: {
    backgroundColor: '#fff2f9',
    borderRadius: 8,
    padding: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  paymentText: {
    flex: 1,
    textAlign: 'right',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  percentageValue: {
    fontSize: 16,
    marginRight: 4,
  },
  percentageSymbol: {
    color: '#666',
  },
  longTermContainer: {
    backgroundColor: '#fff2f9',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  longTermRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: 4,
  },
  longTermText: {
    marginHorizontal: 8,
  },
  longTermInput: {
    width: 50,
    height: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
});

export default FourthStep;