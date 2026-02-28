import { useEffect, useMemo, useState } from 'react';
import { DeviceMotion } from 'expo-sensors';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

type MotionSharedValues = {
    accelerationX: SharedValue<number>;
    accelerationY: SharedValue<number>;
    accelerationZ: SharedValue<number>;
    accelerationWithGravityX: SharedValue<number>;
    accelerationWithGravityY: SharedValue<number>;
    accelerationWithGravityZ: SharedValue<number>;
    rotationAlpha: SharedValue<number>;
    rotationBeta: SharedValue<number>;
    rotationGamma: SharedValue<number>;
    rotationRateAlpha: SharedValue<number>;
    rotationRateBeta: SharedValue<number>;
    rotationRateGamma: SharedValue<number>;
    orientation: SharedValue<number>;
    interval: SharedValue<number>;
};

type UseMotionOptions = {
    updateInterval?: number;
};

type UseMotionResult = MotionSharedValues & {
    isAvailable: boolean;
};

export function useMotion(options: UseMotionOptions = {}): UseMotionResult {
    const { updateInterval = 5 } = options;
    const [isAvailable, setIsAvailable] = useState(false);

    const accelerationX = useSharedValue(0);
    const accelerationY = useSharedValue(0);
    const accelerationZ = useSharedValue(0);
    const accelerationWithGravityX = useSharedValue(0);
    const accelerationWithGravityY = useSharedValue(0);
    const accelerationWithGravityZ = useSharedValue(0);
    const rotationAlpha = useSharedValue(0);
    const rotationBeta = useSharedValue(0);
    const rotationGamma = useSharedValue(0);
    const rotationRateAlpha = useSharedValue(0);
    const rotationRateBeta = useSharedValue(0);
    const rotationRateGamma = useSharedValue(0);
    const orientation = useSharedValue(0);
    const interval = useSharedValue(0);

    useEffect(() => {
        let isMounted = true;
        let subscription: ReturnType<typeof DeviceMotion.addListener> | null = null;

        const subscribe = async () => {
            const permissionResponse = await DeviceMotion.requestPermissionsAsync();
            const hasPermission = permissionResponse.granted;
            const available = await DeviceMotion.isAvailableAsync();

            if (!isMounted || !hasPermission || !available) {
                setIsAvailable(false);
                return;
            }

            setIsAvailable(true);
            DeviceMotion.setUpdateInterval(updateInterval);

            subscription = DeviceMotion.addListener((motion) => {
                accelerationX.value = motion.acceleration?.x ?? 0;
                accelerationY.value = motion.acceleration?.y ?? 0;
                accelerationZ.value = motion.acceleration?.z ?? 0;
                accelerationWithGravityX.value = motion.accelerationIncludingGravity?.x ?? 0;
                accelerationWithGravityY.value = motion.accelerationIncludingGravity?.y ?? 0;
                accelerationWithGravityZ.value = motion.accelerationIncludingGravity?.z ?? 0;
                rotationAlpha.value = motion.rotation?.alpha ?? 0;
                rotationBeta.value = motion.rotation?.beta ?? 0;
                rotationGamma.value = motion.rotation?.gamma ?? 0;
                rotationRateAlpha.value = motion.rotationRate?.alpha ?? 0;
                rotationRateBeta.value = motion.rotationRate?.beta ?? 0;
                rotationRateGamma.value = motion.rotationRate?.gamma ?? 0;
                orientation.value = motion.orientation ?? 0;
                interval.value = motion.interval ?? 0;
            });
        };

        subscribe().catch(() => {
            if (isMounted) {
                setIsAvailable(false);
            }
        });

        return () => {
            isMounted = false;
            subscription?.remove();
        };
    }, [
        accelerationX,
        accelerationY,
        accelerationZ,
        accelerationWithGravityX,
        accelerationWithGravityY,
        accelerationWithGravityZ,
        rotationAlpha,
        rotationBeta,
        rotationGamma,
        rotationRateAlpha,
        rotationRateBeta,
        rotationRateGamma,
        orientation,
        interval,
        updateInterval,
    ]);

    return useMemo(
        () => ({
            accelerationX,
            accelerationY,
            accelerationZ,
            accelerationWithGravityX,
            accelerationWithGravityY,
            accelerationWithGravityZ,
            rotationAlpha,
            rotationBeta,
            rotationGamma,
            rotationRateAlpha,
            rotationRateBeta,
            rotationRateGamma,
            orientation,
            interval,
            isAvailable,
        }),
        [
            accelerationX,
            accelerationY,
            accelerationZ,
            accelerationWithGravityX,
            accelerationWithGravityY,
            accelerationWithGravityZ,
            rotationAlpha,
            rotationBeta,
            rotationGamma,
            rotationRateAlpha,
            rotationRateBeta,
            rotationRateGamma,
            orientation,
            interval,
            isAvailable,
        ],
    );
}
