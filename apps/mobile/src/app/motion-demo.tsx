import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useMotionCalibration } from '@/hooks/useMotionCalibration';
import { useTheme } from '@/hooks/use-theme';

export default function MotionDemoScreen() {
    // ez meg nagyon gyorsan lett összetákolva, ocsmány.
    // nem szeretem a reanimated-et, de hát ez van
    const calibration = useMotionCalibration();
    const theme = useTheme();
    const { width, height } = useWindowDimensions();

    const completionRipple = useSharedValue(0);

    const rippleColor = theme.motionRipple;

    useEffect(() => {
        if (calibration.isCalibrated) {
            completionRipple.value = 0;
            completionRipple.value = withTiming(1, { duration: 950, easing: Easing.out(Easing.cubic) });
        }
    }, [calibration.isCalibrated, completionRipple]);

    const circleSize = Math.max(width, height) * 1.4;

    const completionRippleStyle = useAnimatedStyle(
        () => ({
            transform: [{ scale: interpolate(completionRipple.value, [0, 1], [0.2, 2.2]) }],
            opacity: interpolate(completionRipple.value, [0, 0.2, 1], [0, 0.28, 0]),
        }),
        [completionRipple],
    );

    const tiltStyle = useAnimatedStyle(
        () => ({
            transform: [
                { perspective: 700 },
                { rotateX: `${-calibration.shared.pitchDeg.value}deg` },
                { rotateY: `${calibration.shared.rollDeg.value}deg` },
            ],
        }),
        [calibration.shared.pitchDeg, calibration.shared.rollDeg],
    );

    const progressBarStyle = useAnimatedStyle(
        () => ({
            width: `${interpolate(calibration.shared.progress.value, [0, 1], [0, 100])}%`,
        }),
        [calibration.shared.progress],
    );

    const status = !calibration.isAvailable
        ? 'sensor unavailable'
        : calibration.isCalibrated
        ? 'calibration complete'
        : calibration.isStill
        ? 'capturing gravity...'
        : 'hold still to start';

    const formatValue = (value: number, digits = 2) => value.toFixed(digits);

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ThemedView style={styles.content}>
                    <ThemedText type="subtitle">Motion Calibration</ThemedText>
                    <ThemedText themeColor="textSecondary">Keep the phone steady while gravity is captured.</ThemedText>

                    <ThemedView type="backgroundElement" style={styles.tiltCard}>
                        <View style={styles.levelOuterCircle}>
                            <Animated.View style={[styles.levelPlate, { borderColor: theme.text }, tiltStyle]}>
                                <View style={[styles.levelDot, { backgroundColor: theme.text }]} />
                            </Animated.View>
                        </View>
                    </ThemedView>

                    <ThemedView type="backgroundElement" style={styles.stepContainer}>
                        <ThemedText type="subtitle">Calibration Demo</ThemedText>
                        <HintRow title="Status" hint={status} />
                        <HintRow title="Still" hint={calibration.isStill ? 'yes' : 'no'} />
                        <HintRow title="Progress" hint={`${Math.round(calibration.progress * 100)}%`} />
                        <HintRow title="Gravity |g|" hint={formatValue(calibration.gravityMagnitude, 3)} />
                        <HintRow
                            title="Gravity vector"
                            hint={`${formatValue(calibration.gravityX)}, ${formatValue(
                                calibration.gravityY,
                            )}, ${formatValue(calibration.gravityZ)}`}
                        />

                        <ThemedView type="backgroundSelected" style={styles.progressTrack}>
                            <Animated.View
                                style={[styles.progressFill, { backgroundColor: theme.text }, progressBarStyle]}
                            />
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
            </SafeAreaView>

            <View pointerEvents="none" style={styles.overlay}>
                <View style={styles.rippleCenter}>
                    <Animated.View
                        style={[
                            styles.ripple,
                            {
                                width: circleSize,
                                height: circleSize,
                                borderRadius: circleSize / 2,
                                backgroundColor: rippleColor,
                            },
                            completionRippleStyle,
                        ]}
                    />
                </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    absoluteFill: {
        ...StyleSheet.absoluteFill,
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        zIndex: 20,
    },
    rippleCenter: {
        ...StyleSheet.absoluteFill,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ripple: {
        position: 'absolute',
    },
    safeArea: {
        flex: 1,
        paddingBottom: BottomTabInset + Spacing.three,
        alignItems: 'center',
    },
    content: {
        flex: 1,
        width: '100%',
        maxWidth: MaxContentWidth,
        paddingHorizontal: Spacing.four,
        paddingTop: Spacing.four,
        gap: Spacing.three,
    },
    tiltCard: {
        borderRadius: Spacing.four,
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.four,
        alignItems: 'center',
        justifyContent: 'center',
    },
    levelOuterCircle: {
        width: 170,
        height: 170,
        borderRadius: 85,
        alignItems: 'center',
        justifyContent: 'center',
    },
    levelPlate: {
        width: 96,
        height: 96,
        borderRadius: Spacing.four,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    levelDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    stepContainer: {
        gap: Spacing.three,
        alignSelf: 'stretch',
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.four,
        borderRadius: Spacing.four,
    },
    progressTrack: {
        borderRadius: Spacing.two,
        height: Spacing.two,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
    },
});
