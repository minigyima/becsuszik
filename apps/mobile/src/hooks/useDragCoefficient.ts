import { useCallback, useMemo, useState } from 'react';
import { SharedValue, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useMotionCalibrationContext } from '@/contexts/motion-calibration-context';
import { useMotion } from '@/hooks/useMotion';

type UseDragCoefficientOptions = {
    updateInterval?: number;
    publishIntervalMs?: number;
    smoothingFactor?: number;
    startThreshold?: number;
    quietThreshold?: number;
    maxTrackRotation?: number;
    trackTimeoutMs?: number;
    quietStopMs?: number;
    minSampleThreshold?: number;
    minDragA?: number;
    maxDragA?: number;
};

type DragStatus = 'waiting' | 'calibrating' | 'tracking' | 'complete' | 'retry' | 'sensor-unavailable';

type DragCoefficientState = {
    isAvailable: boolean;
    status: DragStatus;
    isCalibrated: boolean;
    calibrationProgress: number;
    isTracking: boolean;
    muEstimate: number | null;
    dragAcceleration: number;
    gravityMagnitude: number;
    latestTangentialAcceleration: number;
    lastSpikeAcceleration: number;
    sampleCount: number;
    runCount: number;
};

type DragCoefficientSharedValues = {
    statusCode: SharedValue<number>;
    isTracking: SharedValue<boolean>;
    muEstimate: SharedValue<number>;
    dragAcceleration: SharedValue<number>;
    gravityMagnitude: SharedValue<number>;
    latestTangentialAcceleration: SharedValue<number>;
    lastSpikeAcceleration: SharedValue<number>;
    sampleCount: SharedValue<number>;
    runCount: SharedValue<number>;
};

type UseDragCoefficientResult = DragCoefficientState & {
    shared: DragCoefficientSharedValues;
    reset: () => void;
};

const STATUS_WAITING = 0;
const STATUS_TRACKING = 1;
const STATUS_COMPLETE = 2;
const STATUS_RETRY = 3;

function statusFromCode(code: number, isAvailable: boolean, isCalibrated: boolean): DragStatus {
    if (!isAvailable) {
        return 'sensor-unavailable';
    }

    if (!isCalibrated) {
        return 'calibrating';
    }

    switch (code) {
        case STATUS_TRACKING:
            return 'tracking';
        case STATUS_COMPLETE:
            return 'complete';
        case STATUS_RETRY:
            return 'retry';
        default:
            return 'waiting';
    }
}

export function useDragCoefficient(options: UseDragCoefficientOptions = {}): UseDragCoefficientResult {
    const {
        updateInterval = 16,
        publishIntervalMs = 80,
        smoothingFactor = 0.16,
        startThreshold = 0.75,
        quietThreshold = 0.25,
        maxTrackRotation = 1.6,
        trackTimeoutMs = 2600,
        quietStopMs = 300,
        minSampleThreshold = 12,
        minDragA = 0.12,
        maxDragA = 5.5,
    } = options;

    const motion = useMotion({ updateInterval });
    const calibration = useMotionCalibrationContext();

    const [state, setState] = useState<DragCoefficientState>({
        isAvailable: false,
        status: 'waiting',
        isCalibrated: false,
        calibrationProgress: 0,
        isTracking: false,
        muEstimate: null,
        dragAcceleration: 0,
        gravityMagnitude: 0,
        latestTangentialAcceleration: 0,
        lastSpikeAcceleration: 0,
        sampleCount: 0,
        runCount: 0,
    });

    const initialized = useSharedValue(0);
    const gravityX = useSharedValue(0);
    const gravityY = useSharedValue(0);
    const gravityZ = useSharedValue(9.81);

    const tickMs = useSharedValue(0);
    const lastPublishMs = useSharedValue(0);
    const hasPublished = useSharedValue(false);

    const isTrackingShared = useSharedValue(false);
    const statusCodeShared = useSharedValue(STATUS_WAITING);
    const quietMsShared = useSharedValue(0);
    const trackingElapsedMsShared = useSharedValue(0);

    const latestTangentialAShared = useSharedValue(0);
    const lastSpikeAShared = useSharedValue(0);
    const gravityMagnitudeShared = useSharedValue(9.81);
    const sampleCountShared = useSharedValue(0);
    const dragSampleCountShared = useSharedValue(0);
    const dragSumShared = useSharedValue(0);

    const muEstimateShared = useSharedValue(-1);
    const dragAccelerationShared = useSharedValue(0);
    const runCountShared = useSharedValue(0);

    const publishState = useCallback(
        (
            nextStatusCode: number,
            nextIsCalibrated: boolean,
            nextCalibrationProgress: number,
            nextIsTracking: boolean,
            nextMuEstimate: number,
            nextDragAcceleration: number,
            nextGravityMagnitude: number,
            nextLatestTangentialAcceleration: number,
            nextLastSpikeAcceleration: number,
            nextSampleCount: number,
            nextRunCount: number,
        ) => {
            setState((previous) => ({
                ...previous,
                isAvailable: motion.isAvailable,
                status: statusFromCode(nextStatusCode, motion.isAvailable, nextIsCalibrated),
                isCalibrated: nextIsCalibrated,
                calibrationProgress: nextCalibrationProgress,
                isTracking: nextIsTracking,
                muEstimate: nextMuEstimate >= 0 ? nextMuEstimate : null,
                dragAcceleration: nextDragAcceleration,
                gravityMagnitude: nextGravityMagnitude,
                latestTangentialAcceleration: nextLatestTangentialAcceleration,
                lastSpikeAcceleration: nextLastSpikeAcceleration,
                sampleCount: nextSampleCount,
                runCount: nextRunCount,
            }));
        },
        [motion.isAvailable],
    );

    const reset = useCallback(() => {
        statusCodeShared.value = STATUS_WAITING;
        isTrackingShared.value = false;
        quietMsShared.value = 0;
        trackingElapsedMsShared.value = 0;
        latestTangentialAShared.value = 0;
        lastSpikeAShared.value = 0;
        sampleCountShared.value = 0;
        dragSampleCountShared.value = 0;
        dragSumShared.value = 0;
        muEstimateShared.value = -1;
        dragAccelerationShared.value = 0;

        setState((previous) => ({
            ...previous,
            status: motion.isAvailable ? (calibration.isCalibrated ? 'waiting' : 'calibrating') : 'sensor-unavailable',
            isCalibrated: calibration.isCalibrated,
            calibrationProgress: calibration.progress,
            isTracking: false,
            muEstimate: null,
            dragAcceleration: 0,
            latestTangentialAcceleration: 0,
            lastSpikeAcceleration: 0,
            sampleCount: 0,
        }));
    }, [
        dragAccelerationShared,
        dragSampleCountShared,
        dragSumShared,
        isTrackingShared,
        lastSpikeAShared,
        latestTangentialAShared,
        calibration.isCalibrated,
        calibration.progress,
        motion.isAvailable,
        muEstimateShared,
        quietMsShared,
        sampleCountShared,
        statusCodeShared,
        trackingElapsedMsShared,
    ]);

    useDerivedValue(() => {
        const isCalibratedNow = calibration.shared.isCalibrated.value;
        const calibrationProgressNow = calibration.shared.progress.value;

        if (!motion.isAvailable) {
            if (!hasPublished.value || statusCodeShared.value !== STATUS_WAITING || isTrackingShared.value) {
                statusCodeShared.value = STATUS_WAITING;
                isTrackingShared.value = false;
                quietMsShared.value = 0;
                trackingElapsedMsShared.value = 0;

                scheduleOnRN(
                    publishState,
                    STATUS_WAITING,
                    isCalibratedNow,
                    calibrationProgressNow,
                    false,
                    -1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    runCountShared.value,
                );
                hasPublished.value = true;
                lastPublishMs.value = tickMs.value;
            }
            return;
        }

        const dtMs = motion.interval.value > 0 ? motion.interval.value : updateInterval;
        tickMs.value += dtMs;

        const gRawX = motion.accelerationWithGravityX.value;
        const gRawY = motion.accelerationWithGravityY.value;
        const gRawZ = motion.accelerationWithGravityZ.value;

        if (initialized.value === 0) {
            initialized.value = 1;
            gravityX.value = gRawX;
            gravityY.value = gRawY;
            gravityZ.value = gRawZ;
        }

        gravityX.value += smoothingFactor * (gRawX - gravityX.value);
        gravityY.value += smoothingFactor * (gRawY - gravityY.value);
        gravityZ.value += smoothingFactor * (gRawZ - gravityZ.value);

        const liveGravityNorm = Math.sqrt(
            gravityX.value * gravityX.value + gravityY.value * gravityY.value + gravityZ.value * gravityZ.value,
        );

        const calibratedGravityX = calibration.shared.gravityX.value;
        const calibratedGravityY = calibration.shared.gravityY.value;
        const calibratedGravityZ = calibration.shared.gravityZ.value;

        const calibratedGravityNorm = Math.sqrt(
            calibratedGravityX * calibratedGravityX +
                calibratedGravityY * calibratedGravityY +
                calibratedGravityZ * calibratedGravityZ,
        );

        const gravityNorm = isCalibratedNow ? calibratedGravityNorm : liveGravityNorm;
        const gravityVectorX = isCalibratedNow ? calibratedGravityX : gravityX.value;
        const gravityVectorY = isCalibratedNow ? calibratedGravityY : gravityY.value;
        const gravityVectorZ = isCalibratedNow ? calibratedGravityZ : gravityZ.value;

        const normalX = gravityNorm > 0 ? gravityVectorX / gravityNorm : 0;
        const normalY = gravityNorm > 0 ? gravityVectorY / gravityNorm : 0;
        const normalZ = gravityNorm > 0 ? gravityVectorZ / gravityNorm : 1;

        const linearX = motion.accelerationX.value;
        const linearY = motion.accelerationY.value;
        const linearZ = motion.accelerationZ.value;

        const normalProjection = linearX * normalX + linearY * normalY + linearZ * normalZ;

        const tangentialX = linearX - normalProjection * normalX;
        const tangentialY = linearY - normalProjection * normalY;
        const tangentialZ = linearZ - normalProjection * normalZ;

        const tangentialAcceleration = Math.sqrt(
            tangentialX * tangentialX + tangentialY * tangentialY + tangentialZ * tangentialZ,
        );

        const rotationRate = Math.sqrt(
            motion.rotationRateAlpha.value * motion.rotationRateAlpha.value +
                motion.rotationRateBeta.value * motion.rotationRateBeta.value +
                motion.rotationRateGamma.value * motion.rotationRateGamma.value,
        );

        latestTangentialAShared.value = tangentialAcceleration;
        gravityMagnitudeShared.value = gravityNorm;

        if (!isCalibratedNow) {
            statusCodeShared.value = STATUS_WAITING;
            isTrackingShared.value = false;
            quietMsShared.value = 0;
            trackingElapsedMsShared.value = 0;
            sampleCountShared.value = 0;
            dragSampleCountShared.value = 0;
            dragSumShared.value = 0;
            muEstimateShared.value = -1;
            dragAccelerationShared.value = 0;
        }

        if (isCalibratedNow && !isTrackingShared.value) {
            if (tangentialAcceleration > startThreshold && rotationRate < maxTrackRotation) {
                isTrackingShared.value = true;
                statusCodeShared.value = STATUS_TRACKING;
                quietMsShared.value = 0;
                trackingElapsedMsShared.value = 0;
                sampleCountShared.value = 0;
                dragSampleCountShared.value = 0;
                dragSumShared.value = 0;
                lastSpikeAShared.value = tangentialAcceleration;
            }
        } else if (isCalibratedNow) {
            trackingElapsedMsShared.value += dtMs;
            sampleCountShared.value += 1;

            if (tangentialAcceleration > lastSpikeAShared.value) {
                lastSpikeAShared.value = tangentialAcceleration;
            }

            if (
                rotationRate <= maxTrackRotation &&
                tangentialAcceleration >= minDragA &&
                tangentialAcceleration <= maxDragA
            ) {
                dragSampleCountShared.value += 1;
                dragSumShared.value += tangentialAcceleration;
            }

            if (tangentialAcceleration < quietThreshold) {
                quietMsShared.value += dtMs;
            } else {
                quietMsShared.value = 0;
            }

            const shouldStop = quietMsShared.value >= quietStopMs || trackingElapsedMsShared.value >= trackTimeoutMs;

            if (shouldStop) {
                if (dragSampleCountShared.value >= minSampleThreshold && gravityNorm >= 4) {
                    dragAccelerationShared.value = dragSumShared.value / dragSampleCountShared.value;
                    muEstimateShared.value = Math.max(0, dragAccelerationShared.value / gravityNorm);
                    runCountShared.value += 1;
                    statusCodeShared.value = STATUS_COMPLETE;
                } else {
                    dragAccelerationShared.value = 0;
                    muEstimateShared.value = -1;
                    statusCodeShared.value = STATUS_RETRY;
                }

                isTrackingShared.value = false;
                quietMsShared.value = 0;
                trackingElapsedMsShared.value = 0;
            }
        }

        if (!hasPublished.value || tickMs.value - lastPublishMs.value >= publishIntervalMs) {
            hasPublished.value = true;
            lastPublishMs.value = tickMs.value;

            scheduleOnRN(
                publishState,
                statusCodeShared.value,
                isCalibratedNow,
                calibrationProgressNow,
                isTrackingShared.value,
                muEstimateShared.value,
                dragAccelerationShared.value,
                gravityMagnitudeShared.value,
                latestTangentialAShared.value,
                lastSpikeAShared.value,
                sampleCountShared.value,
                runCountShared.value,
            );
        }
    }, [
        calibration.shared.gravityX,
        calibration.shared.gravityY,
        calibration.shared.gravityZ,
        calibration.shared.isCalibrated,
        calibration.shared.progress,
        dragAccelerationShared,
        dragSampleCountShared,
        dragSumShared,
        gravityMagnitudeShared,
        gravityX,
        gravityY,
        gravityZ,
        hasPublished,
        initialized,
        isTrackingShared,
        lastPublishMs,
        lastSpikeAShared,
        latestTangentialAShared,
        maxDragA,
        maxTrackRotation,
        minDragA,
        minSampleThreshold,
        motion.accelerationWithGravityX,
        motion.accelerationWithGravityY,
        motion.accelerationWithGravityZ,
        motion.accelerationX,
        motion.accelerationY,
        motion.accelerationZ,
        motion.interval,
        motion.isAvailable,
        motion.rotationRateAlpha,
        motion.rotationRateBeta,
        motion.rotationRateGamma,
        muEstimateShared,
        publishIntervalMs,
        publishState,
        quietMsShared,
        quietStopMs,
        quietThreshold,
        runCountShared,
        sampleCountShared,
        smoothingFactor,
        startThreshold,
        statusCodeShared,
        tickMs,
        trackingElapsedMsShared,
        trackTimeoutMs,
        updateInterval,
    ]);

    return useMemo(
        () => ({
            ...state,
            isAvailable: motion.isAvailable,
            status: statusFromCode(statusCodeShared.value, motion.isAvailable, calibration.isCalibrated),
            shared: {
                statusCode: statusCodeShared,
                isTracking: isTrackingShared,
                muEstimate: muEstimateShared,
                dragAcceleration: dragAccelerationShared,
                gravityMagnitude: gravityMagnitudeShared,
                latestTangentialAcceleration: latestTangentialAShared,
                lastSpikeAcceleration: lastSpikeAShared,
                sampleCount: sampleCountShared,
                runCount: runCountShared,
            },
            reset,
        }),
        [
            dragAccelerationShared,
            gravityMagnitudeShared,
            isTrackingShared,
            lastSpikeAShared,
            latestTangentialAShared,
            calibration.isCalibrated,
            motion.isAvailable,
            muEstimateShared,
            reset,
            runCountShared,
            sampleCountShared,
            state,
            statusCodeShared,
        ],
    );
}
