import React, { createContext, ReactNode, useContext } from 'react';

import { useMotionCalibration } from '@/hooks/useMotionCalibration';

type MotionCalibrationContextValue = ReturnType<typeof useMotionCalibration>;

const MotionCalibrationContext = createContext<MotionCalibrationContextValue | null>(null);

type MotionCalibrationProviderProps = {
    children: ReactNode;
};

export function MotionCalibrationProvider({ children }: MotionCalibrationProviderProps) {
    const calibration = useMotionCalibration();

    return <MotionCalibrationContext.Provider value={calibration}>{children}</MotionCalibrationContext.Provider>;
}

export function useMotionCalibrationContext() {
    const context = useContext(MotionCalibrationContext);

    if (!context) {
        throw new Error('useMotionCalibrationContext must be used within MotionCalibrationProvider.');
    }

    return context;
}
