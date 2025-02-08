import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Text';

interface Step {
  number: number;
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <View style={styles.stepContainer}>
            <View
              style={[
                styles.stepCircle,
                currentStep === step.number && styles.activeStepCircle,
                currentStep > step.number && styles.completedStepCircle,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  (currentStep === step.number || currentStep > step.number) &&
                    styles.activeStepNumber,
                ]}
              >
                {step.number}
              </Text>
            </View>
            <Text
              medium
              style={[
                styles.stepTitle,
                currentStep === step.number && styles.activeStepTitle,
              ]}
            >
              {step.title}
            </Text>
          </View>
          {index < steps.length - 1 && (
            <View
              style={[
                styles.connector,
                currentStep > step.number && styles.activeConnector,
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeStepCircle: {
    borderColor: '#EE50FF',
    backgroundColor: '#EE50FF',
  },
  completedStepCircle: {
    borderColor: '#EE50FF',
    backgroundColor: '#EE50FF',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeStepNumber: {
    color: '#fff',
  },
  stepTitle: {
    fontSize: 10,
    width: 55,
    color: '#222',
    textAlign: 'center',
  },
  activeStepTitle: {
    color: '#EE50FF',
    fontWeight: '500',
  },
  connector: {
    flex: 1,
    height: 4,
    backgroundColor: '#ddd',
    marginTop: 14,
  },
  activeConnector: {
    backgroundColor: '#EE50FF',
  },
});