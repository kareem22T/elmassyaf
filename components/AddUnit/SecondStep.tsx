import { CustomSelect } from '@/components/CustomSelect';
import { CustomRadio } from '@/components/CustomRadio';
import {
  View,
} from 'react-native';
import Text from '../Text';
import CustomCheckBox from '../CustomCheckBox';
import CustomIncrementInput from '../CustomIncrmeantInput';
import CustomInputWithUnit from '../CustomInputWithUnit';
const transportOptions = [
{ label: 'سير علي الاقدام', value: 'walking' },
{ label: 'بالسيارة', value: 'car' },
];
interface CheckboxItem {
    id: string
    text: string
    checked: boolean
}

interface Bed {
    width: number
}

interface Room {
  id: number;
  bedsNumber: number;
  beds: Bed[];
  features: CheckboxItem[];
}

interface SecondStepInterface {
  styles: any;
  formData: any;
  handleChange: (unitType: string, value: any) => void;
  selectedUnitType: string;
  setUnitAccessories: any;
  unitAccessories: CheckboxItem[];
  receptions: CheckboxItem[];
  roomsItems: CheckboxItem[];
  setReception: any;
  kitchenItems: CheckboxItem[];
  setKitchenItems: any;
  rooms: Room[];
  updateRoom: (roomId: number, field: keyof Room, value: any) => void;
}


const SecondStep: React.FC<SecondStepInterface> = ({
  formData,
  styles,
  selectedUnitType,
  handleChange,
  setUnitAccessories,
  unitAccessories,
  roomsItems,
  receptions,
  setReception,
  kitchenItems,
  setKitchenItems,
  rooms,
  updateRoom
}) => {
    return (
        <View style={styles.content}>
            <CustomCheckBox 
                items={unitAccessories}
                setItems={setUnitAccessories}
                type={selectedUnitType}
                label='كماليات الوحدة'
                add_btn_text='اضافة كمالية جديدة'
                add_placeholder='اسم الكمالية'
            />
            <CustomIncrementInput
            label={selectedUnitType == 'unit' ? 'عدد الغرف' : 'عدد غرف النوم'}
            value={formData.roomsNumber}
            setValue={(value:any) => handleChange('roomsNumber', value)}
            />
            {
                rooms.map((room, index) => (
                    <View key={room.id} style={styles.roomCard}>
                        <Text style={styles.roomCardTitle} medium>{ 'غرفة ' + (index + 1) }</Text>
                        <View style={styles.roomCardRow}>
                            <Text style={[styles.roomCardRowItem, styles.roomCardRowItemText]} medium>عدد الاسرة</Text>
                            <View style={styles.roomCardRowItem}>
                                <CustomIncrementInput
                                label=""
                                value={room.bedsNumber}
                                setValue={(value: any) => updateRoom(room.id, "bedsNumber", value)}
                                />
                            </View>
                        </View>
                        {
                            room.beds.map((bed, index) => (
                                <View key={index} style={styles.roomCardRow}>
                                    <Text style={[styles.roomCardRowItem, styles.roomCardRowItemText]} medium>{ 'عرض السرير ' + (index + 1) }</Text>
                                    <View style={styles.roomCardRowItem}>
                                        <CustomInputWithUnit
                                            label=''
                                            unit='CM'
                                            value={bed.width}
                                            setValue={(value: any) => updateRoom(room.id, 'bedWidth', value, index)} // Pass bed index
                                        />
                                    </View>
                                </View>
                            ))
                        }
                        <View style={styles.line}></View>
                        <CustomCheckBox 
                            items={room.features}
                            setItems={ rooms => updateRoom(room.id, 'features', rooms)}
                            label='كماليات الغرفة'
                            type='room'
                            add_btn_text='اضافة كمالية جديدة'
                            add_placeholder='اسم الكمالية'
                        />
                    </View>
                ))
            }
            <CustomIncrementInput
            label='عدد الحمامات'
            value={formData.bathroomsNumber}
            setValue={(value:any) => handleChange('bathroomsNumber', value)}
            />
            <CustomCheckBox 
                items={receptions}
                setItems={setReception}
                type='reception'
                label='الريسبشن'
                add_btn_text='اضافة كمالية جديدة'
                add_placeholder='اسم الكمالية'
            />
            <CustomCheckBox 
                items={kitchenItems}
                setItems={setKitchenItems}
                type='kitchen'
                label='محتويات المطبخ'
                add_btn_text='اضافة كمالية جديدة'
                add_placeholder='اسم الكمالية'
            />

        </View>
    )
}

export default SecondStep;