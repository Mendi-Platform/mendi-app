import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, className = "" }) => {
  return (
    <div className={`flex items-center justify-between w-full ${className}`}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              {/* Step circle */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${isCompleted 
                    ? 'bg-[#006EFF] text-white' 
                    : isActive 
                    ? 'bg-[#006EFF] text-white' 
                    : 'bg-[#F5F5F5] text-[#A7A7A7] border border-[#E5E5E5]'
                  }
                `}
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
                  mt-2 text-xs text-center
                  ${isActive 
                    ? 'text-[#006EFF] font-bold' 
                    : isCompleted 
                    ? 'text-[#006EFF] font-medium' 
                    : 'text-[#A7A7A7] font-medium'
                  }
                `}
              >
                {step}
              </span>
            </div>
            
            {/* Connector line */}
            {!isLast && (
              <div 
                className={`
                  flex-1 h-0.5 mx-2 mt-[-16px]
                  ${stepNumber < currentStep ? 'bg-[#006EFF]' : 'bg-[#E5E5E5]'}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper; 