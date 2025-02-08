import React from "react";
import { TextStyle, Text as TextMain } from "react-native";

// Define the props type
type TextComponentProps = {
    children: React.ReactNode; // Allow text content as children
    style?: TextStyle | TextStyle[]; // Optional style for customization
    bold?: boolean; // Bold font
    medium?: boolean; // Medium font
    thin?: boolean; // Thin font
    regular?: boolean; // Regular font
};

const Text: React.FC<TextComponentProps> = ({ 
    children, 
    style, 
    bold, 
    thin, 
    medium
}) => {

    return (
        <TextMain style={[{fontFamily: bold ? 'NotoKufiArabic_700Bold' : (thin ? 'NotoKufiArabic_300Light' : (medium ? 'NotoKufiArabic_500Medium' : 'NotoKufiArabic_400Regular')), direction: 'ltr', textAlign: 'right', color: '#222222'}, style]}>
            {children}
        </TextMain>
    );
};

export default Text;
