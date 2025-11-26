import React from 'react';
import { COLORS } from '@/constants/colors';

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
  variant?: 'horizontal' | 'vertical';
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  className = "",
  variant = 'horizontal'
}) => {
  const isVertical = variant === 'vertical';

  return (
    <div
      className={`
        flex w-full
        ${isVertical ? 'flex-col gap-4' : 'items-center justify-between'}
        ${className}
      `}
    >
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={index}>
            <div className={`flex ${isVertical ? 'items-center gap-3' : 'flex-col items-center'}`}>
              {/* Step circle */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                style={{
                  backgroundColor: isCompleted || isActive ? COLORS.primary : COLORS.bgInactive,
                  color: isCompleted || isActive ? 'white' : COLORS.textDisabled,
                  border: !isCompleted && !isActive ? `1px solid ${COLORS.border}` : 'none',
                }}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>

              {/* Step label */}
              <span
                className={`
                  text-xs text-center transition-colors
                  ${isVertical ? '' : 'mt-2'}
                  ${isActive ? 'font-bold' : 'font-medium'}
                `}
                style={{
                  color: isActive || isCompleted ? COLORS.primary : COLORS.textDisabled,
                }}
              >
                {step}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={`
                  transition-colors
                  ${isVertical
                    ? 'w-0.5 h-6 ml-4'
                    : 'flex-1 h-0.5 mx-2 mt-[-16px]'
                  }
                `}
                style={{
                  backgroundColor: stepNumber < currentStep ? COLORS.primary : COLORS.border,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper; 