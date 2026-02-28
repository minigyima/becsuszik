import React, { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useDragCoefficient } from '@/hooks/useDragCoefficient';

function format(value: number, digits = 2) {
    return Number.isFinite(value) ? value.toFixed(digits) : '0.00';
}

export default function DragDemoScreen() {
    const drag = useDragCoefficient();

    const muText = useMemo(() => {
        if (drag.muEstimate === null) {
            return '-';
        }
        return format(drag.muEstimate, 3);
    }, [drag.muEstimate]);

    const statusText =
        drag.status === 'tracking'
            ? 'push spike detected, tracking'
            : drag.status === 'complete'
            ? 'measurement complete'
            : drag.status === 'retry'
            ? 'not enough clean data, try again'
            : drag.status === 'calibrating'
            ? 'keep phone still to calibrate gravity'
            : drag.status === 'sensor-unavailable'
            ? 'sensor unavailable'
            : 'wait for a push';

    // srácok erről a componentről annyit, hogy nem volt kedvem demo-t írni, szóltam hát a codexnek hogy legyen kedves a motion-demo alapján csináljon valami demo fost, ami a useDragCoefficient hookot használja.
    // ez az eredmény

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ThemedView style={styles.content}>
                    <ThemedView type="backgroundElement" style={styles.card}>
                        <HintRow title="Status" hint={statusText} />
                        <HintRow title="Calibrated" hint={drag.isCalibrated ? 'yes' : 'no'} />
                        <HintRow title="Calibration" hint={`${Math.round(drag.calibrationProgress * 100)}%`} />
                        <HintRow title="Tracking" hint={drag.isTracking ? 'yes' : 'no'} />
                        <HintRow title="Last push spike" hint={`${format(drag.lastSpikeAcceleration, 3)} m/s²`} />
                        <HintRow title="Last μ estimate" hint={muText} />
                        <HintRow title="Drag accel" hint={`${format(drag.dragAcceleration, 3)} m/s²`} />
                        <HintRow title="Gravity |g|" hint={`${format(drag.gravityMagnitude, 3)} m/s²`} />
                        <HintRow
                            title="Live tangential a"
                            hint={`${format(drag.latestTangentialAcceleration, 3)} m/s²`}
                        />
                        <HintRow title="Samples used" hint={String(drag.sampleCount)} />
                        <HintRow title="Runs" hint={String(drag.runCount)} />
                    </ThemedView>

                    <Pressable
                        onPress={drag.reset}
                        style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}
                    >
                        <ThemedView type="backgroundSelected" style={styles.resetInner}>
                            <ThemedText type="small">Reset measurement</ThemedText>
                        </ThemedView>
                    </Pressable>
                </ThemedView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: BottomTabInset + Spacing.three,
    },
    content: {
        flex: 1,
        width: '100%',
        maxWidth: MaxContentWidth,
        paddingHorizontal: Spacing.four,
        paddingTop: Spacing.four,
        gap: Spacing.three,
    },
    card: {
        gap: Spacing.three,
        alignSelf: 'stretch',
        borderRadius: Spacing.four,
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.four,
    },
    resetButton: {
        alignSelf: 'flex-start',
    },
    resetInner: {
        borderRadius: Spacing.five,
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.two,
    },
    pressed: {
        opacity: 0.72,
    },
});
