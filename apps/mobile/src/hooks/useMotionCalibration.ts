import { useCallback, useMemo, useState } from 'react';
import { useDerivedValue, useSharedValue, SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useMotion } from '@/hooks/useMotion';

type UseMotionCalibrationOptions = {
    /** Sensor polling interval in milliseconds. */
    updateInterval?: number;
    /** Required still capture duration before calibration can complete (ms). */
    calibrationDurationMs?: number;
    /** Device must remain still for this long before samples are recorded (ms). */
    stillBeforeCaptureMs?: number;
    /** Minimum number of recorded samples required to accept calibration. */
    minSampleCount?: number;
    /** Minimum time between JS state publishes (ms). */
    publishIntervalMs?: number;
    /** Low-pass filter coefficient for gravity smoothing (0..1). */
    smoothingFactor?: number;
    /** Max rotation-rate magnitude for stillness detection (rad/s). */
    stillnessRotationRateThreshold?: number;
    /** Max frame-to-frame gravity delta for stillness detection (g). */
    stillnessGravityDeltaThreshold?: number;
};

type CalibrationState = {
    /** Whether motion sensors are available on this device/runtime. */
    isAvailable: boolean;
    /** Whether the device is currently considered still. */
    isStill: boolean;
    /** True while collecting still samples for baseline gravity. */
    isCalibrating: boolean;
    /** True once baseline gravity vector has been captured. */
    isCalibrated: boolean;
    /** Calibration progress from 0 to 1. */
    progress: number;
    /** Calibrated gravity X component (g). */
    gravityX: number;
    /** Calibrated gravity Y component (g). */
    gravityY: number;
    /** Calibrated gravity Z component (g). */
    gravityZ: number;
    /** Magnitude of calibrated gravity vector (g). */
    gravityMagnitude: number;
    /** Pitch angle in radians. */
    pitchRad: number;
    /** Roll angle in radians. */
    rollRad: number;
    /** Pitch angle in degrees. */
    pitchDeg: number;
    /** Roll angle in degrees. */
    rollDeg: number;
};

type CalibrationSharedValues = {
    /** Reanimated mirror of `isStill`. */
    isStill: SharedValue<boolean>;
    /** Reanimated mirror of `isCalibrating`. */
    isCalibrating: SharedValue<boolean>;
    /** Reanimated mirror of `isCalibrated`. */
    isCalibrated: SharedValue<boolean>;
    /** Reanimated mirror of progress in range [0, 1]. */
    progress: SharedValue<number>;
    /** Reanimated mirror of calibrated gravity X (g). */
    gravityX: SharedValue<number>;
    /** Reanimated mirror of calibrated gravity Y (g). */
    gravityY: SharedValue<number>;
    /** Reanimated mirror of calibrated gravity Z (g). */
    gravityZ: SharedValue<number>;
    /** Reanimated mirror of gravity vector magnitude (g). */
    gravityMagnitude: SharedValue<number>;
    /** Reanimated mirror of pitch in radians. */
    pitchRad: SharedValue<number>;
    /** Reanimated mirror of roll in radians. */
    rollRad: SharedValue<number>;
    /** Reanimated mirror of pitch in degrees. */
    pitchDeg: SharedValue<number>;
    /** Reanimated mirror of roll in degrees. */
    rollDeg: SharedValue<number>;
};

type UseMotionCalibrationResult = CalibrationState & {
    shared: CalibrationSharedValues;
};

const RAD_TO_DEG = 180 / Math.PI;

export function useMotionCalibration(options: UseMotionCalibrationOptions = {}): UseMotionCalibrationResult {
    const {
        updateInterval = 5,
        calibrationDurationMs = 3500,
        stillBeforeCaptureMs = 700,
        minSampleCount = 450,
        publishIntervalMs = 120,
        smoothingFactor = 0.18,
        stillnessRotationRateThreshold = 0.4,
        stillnessGravityDeltaThreshold = 0.8,
    } = options;

    const motion = useMotion({ updateInterval });

    const [state, setState] = useState<CalibrationState>({
        isAvailable: false,
        isStill: false,
        isCalibrating: true,
        isCalibrated: false,
        progress: 0,
        gravityX: 0,
        gravityY: 0,
        gravityZ: 0,
        gravityMagnitude: 0,
        pitchRad: 0,
        rollRad: 0,
        pitchDeg: 0,
        rollDeg: 0,
    });

    const initialized = useSharedValue(0);
    const lastRawGravityX = useSharedValue(0);
    const lastRawGravityY = useSharedValue(0);
    const lastRawGravityZ = useSharedValue(0);
    const stillElapsedMs = useSharedValue(0);
    const captureElapsedMs = useSharedValue(0);
    const sampleCount = useSharedValue(0);
    const sumGravityX = useSharedValue(0);
    const sumGravityY = useSharedValue(0);
    const sumGravityZ = useSharedValue(0);

    const tickMs = useSharedValue(0);
    const lastPublishMs = useSharedValue(0);
    const lastPublishedCalibrated = useSharedValue(false);
    const lastPublishedStill = useSharedValue(false);
    const hasPublished = useSharedValue(false);

    const isStillSv = useSharedValue(false);
    const isCalibratingSv = useSharedValue(true);
    const isCalibratedSv = useSharedValue(false);
    const progressSv = useSharedValue(0);
    const gravityXSv = useSharedValue(0);
    const gravityYSv = useSharedValue(0);
    const gravityZSv = useSharedValue(0);
    const gravityMagnitudeSv = useSharedValue(0);
    const pitchRadSv = useSharedValue(0);
    const rollRadSv = useSharedValue(0);
    const pitchDegSv = useSharedValue(0);
    const rollDegSv = useSharedValue(0);

    const publishState = useCallback(
        (
            isStill: boolean,
            isCalibrating: boolean,
            isCalibrated: boolean,
            progress: number,
            gravityX: number,
            gravityY: number,
            gravityZ: number,
            gravityMagnitude: number,
            pitchRad: number,
            rollRad: number,
            pitchDeg: number,
            rollDeg: number,
        ) => {
            setState((previous) => ({
                ...previous,
                isAvailable: motion.isAvailable,
                isStill,
                isCalibrating,
                isCalibrated,
                progress,
                gravityX,
                gravityY,
                gravityZ,
                gravityMagnitude,
                pitchRad,
                rollRad,
                pitchDeg,
                rollDeg,
            }));
        },
        [motion.isAvailable],
    );

    useDerivedValue(() => {
        const dt = motion.interval.value > 0 ? motion.interval.value : updateInterval;
        tickMs.value += dt;

        const rawGx = motion.accelerationWithGravityX.value;
        const rawGy = motion.accelerationWithGravityY.value;
        const rawGz = motion.accelerationWithGravityZ.value;

        if (initialized.value === 0) {
            initialized.value = 1;
            gravityXSv.value = rawGx;
            gravityYSv.value = rawGy;
            gravityZSv.value = rawGz;
            lastRawGravityX.value = rawGx;
            lastRawGravityY.value = rawGy;
            lastRawGravityZ.value = rawGz;
        }

        const filteredX = gravityXSv.value + smoothingFactor * (rawGx - gravityXSv.value);
        const filteredY = gravityYSv.value + smoothingFactor * (rawGy - gravityYSv.value);
        const filteredZ = gravityZSv.value + smoothingFactor * (rawGz - gravityZSv.value);

        const deltaX = rawGx - lastRawGravityX.value;
        const deltaY = rawGy - lastRawGravityY.value;
        const deltaZ = rawGz - lastRawGravityZ.value;
        const gravityDeltaNorm = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);

        lastRawGravityX.value = rawGx;
        lastRawGravityY.value = rawGy;
        lastRawGravityZ.value = rawGz;

        const rateAlpha = motion.rotationRateAlpha.value;
        const rateBeta = motion.rotationRateBeta.value;
        const rateGamma = motion.rotationRateGamma.value;
        const rotationRateNorm = Math.sqrt(rateAlpha * rateAlpha + rateBeta * rateBeta + rateGamma * rateGamma);

        isStillSv.value =
            rotationRateNorm <= stillnessRotationRateThreshold && gravityDeltaNorm <= stillnessGravityDeltaThreshold;

        if (!isCalibratedSv.value) {
            gravityXSv.value = filteredX;
            gravityYSv.value = filteredY;
            gravityZSv.value = filteredZ;

            if (isStillSv.value) {
                stillElapsedMs.value += dt;

                if (stillElapsedMs.value >= stillBeforeCaptureMs) {
                    captureElapsedMs.value += dt;
                    sampleCount.value += 1;
                    sumGravityX.value += filteredX;
                    sumGravityY.value += filteredY;
                    sumGravityZ.value += filteredZ;
                }
            } else {
                stillElapsedMs.value = 0;
                captureElapsedMs.value = 0;
                sampleCount.value = 0;
                sumGravityX.value = 0;
                sumGravityY.value = 0;
                sumGravityZ.value = 0;
            }

            progressSv.value = Math.min(captureElapsedMs.value / calibrationDurationMs, 1);

            if (progressSv.value >= 1 && sampleCount.value >= minSampleCount) {
                gravityXSv.value = sumGravityX.value / sampleCount.value;
                gravityYSv.value = sumGravityY.value / sampleCount.value;
                gravityZSv.value = sumGravityZ.value / sampleCount.value;
                isCalibratedSv.value = true;
                isCalibratingSv.value = false;
            }
        }

        const gx = gravityXSv.value;
        const gy = gravityYSv.value;
        const gz = gravityZSv.value;

        gravityMagnitudeSv.value = Math.sqrt(gx * gx + gy * gy + gz * gz);
        rollRadSv.value = Math.atan2(gy, gz);
        pitchRadSv.value = Math.atan2(-gx, Math.sqrt(gy * gy + gz * gz));
        rollDegSv.value = rollRadSv.value * RAD_TO_DEG;
        pitchDegSv.value = pitchRadSv.value * RAD_TO_DEG;

        if (
            !hasPublished.value ||
            tickMs.value - lastPublishMs.value >= publishIntervalMs ||
            isCalibratedSv.value !== lastPublishedCalibrated.value ||
            isStillSv.value !== lastPublishedStill.value
        ) {
            hasPublished.value = true;
            lastPublishMs.value = tickMs.value;
            lastPublishedCalibrated.value = isCalibratedSv.value;
            lastPublishedStill.value = isStillSv.value;

            scheduleOnRN(
                publishState,
                isStillSv.value,
                isCalibratingSv.value,
                isCalibratedSv.value,
                progressSv.value,
                gx,
                gy,
                gz,
                gravityMagnitudeSv.value,
                pitchRadSv.value,
                rollRadSv.value,
                pitchDegSv.value,
                rollDegSv.value,
            );
        }
    }, [
        calibrationDurationMs,
        motion.accelerationWithGravityX,
        motion.accelerationWithGravityY,
        motion.accelerationWithGravityZ,
        motion.interval,
        motion.rotationRateAlpha,
        motion.rotationRateBeta,
        motion.rotationRateGamma,
        minSampleCount,
        publishIntervalMs,
        publishState,
        stillBeforeCaptureMs,
        stillnessGravityDeltaThreshold,
        stillnessRotationRateThreshold,
        smoothingFactor,
        updateInterval,
    ]);

    return useMemo(
        () => ({
            ...state,
            isAvailable: motion.isAvailable,
            shared: {
                isStill: isStillSv,
                isCalibrating: isCalibratingSv,
                isCalibrated: isCalibratedSv,
                progress: progressSv,
                gravityX: gravityXSv,
                gravityY: gravityYSv,
                gravityZ: gravityZSv,
                gravityMagnitude: gravityMagnitudeSv,
                pitchRad: pitchRadSv,
                rollRad: rollRadSv,
                pitchDeg: pitchDegSv,
                rollDeg: rollDegSv,
            },
        }),
        [
            motion.isAvailable,
            state,
            isStillSv,
            isCalibratingSv,
            isCalibratedSv,
            progressSv,
            gravityXSv,
            gravityYSv,
            gravityZSv,
            gravityMagnitudeSv,
            pitchRadSv,
            rollRadSv,
            pitchDegSv,
            rollDegSv,
        ],
    );
}
