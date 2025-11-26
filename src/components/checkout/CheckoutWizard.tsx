"use client";

import React from 'react';
import Stepper from '@/components/ui/stepper';
import { COLORS } from '@/constants/colors';
import useFormDataStore from '@/store';
import { getRepairTypeLabel, getGarmentLabel } from '@/utils/enumLabels';

interface CheckoutWizardProps {
  children: React.ReactNode;
  steps: string[];
  currentStep: number;
  showSummary?: boolean;
  shippingCost?: number;
  shippingLabel?: string;
}

const CheckoutWizard: React.FC<CheckoutWizardProps> = ({
  children,
  steps,
  currentStep,
  showSummary = true,
  shippingCost,
  shippingLabel,
}) => {
  const { cart } = useFormDataStore();

  // Static cart item (same as in cart page)
  const staticCartItem = {
    id: 'static-1',
    repairType: 1,
    garment: 1,
    price: 199,
  };

  const allItems = [staticCartItem, ...cart];
  const subtotal = allItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const total = subtotal + (shippingCost || 0);

  return (
    <div className="flex flex-col lg:flex-row lg:gap-12 w-full">
      {/* Main Content Area */}
      <div className="flex-1 lg:max-w-xl">
        {/* Stepper - Always visible */}
        <div className="mb-8">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Page Content */}
        {children}
      </div>

      {/* Desktop Sidebar - Order Summary */}
      {showSummary && (
        <aside className="hidden lg:block lg:w-80 lg:sticky lg:top-8 lg:self-start">
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: COLORS.bgDefault }}
          >
            <h2 className="font-semibold text-lg mb-4">Ordresammendrag</h2>

            {/* Items List */}
            <div className="space-y-3 mb-4">
              {allItems.map((item, index) => (
                <div key={index} className="flex justify-between items-start text-sm">
                  <span className="text-gray-600 flex-1 pr-4">
                    {getRepairTypeLabel(item.repairType)} - {getGarmentLabel(item.garment)}
                  </span>
                  <span className="font-medium whitespace-nowrap">{item.price} kr</span>
                </div>
              ))}
            </div>

            {/* Shipping */}
            {shippingCost !== undefined && (
              <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3 mb-3">
                <span className="text-gray-600">{shippingLabel || 'Frakt'}</span>
                <span className="font-medium">
                  {shippingCost === 0 ? 'Gratis' : `${shippingCost} kr`}
                </span>
              </div>
            )}

            {/* Subtotal / Total */}
            <div className="flex justify-between items-center border-t border-gray-300 pt-4">
              <span className="font-semibold">
                {shippingCost !== undefined ? 'Total' : 'Subtotal'}
                <span className="text-xs font-normal text-gray-500 ml-1">(inkl. mva.)</span>
              </span>
              <span className="font-semibold text-lg">{total} kr</span>
            </div>
          </div>

          {/* Desktop Step Indicator */}
          <div className="mt-6 p-4 rounded-xl bg-white border border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Steg {currentStep} av {steps.length}</p>
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className="h-1 flex-1 rounded-full"
                  style={{
                    backgroundColor: index + 1 <= currentStep ? COLORS.primary : COLORS.border,
                  }}
                />
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default CheckoutWizard;
