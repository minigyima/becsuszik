import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
    const colors = useTheme();

    return (
        <NativeTabs
            backgroundColor={colors.background}
            indicatorColor={colors.backgroundSelected}
            labelStyle={{ selected: { color: colors.text }, default: { color: colors.textSecondary } }}
        >
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon src={require('@/assets/images/tabIcons/home.png')} renderingMode="template" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="explore">
                <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    src={require('@/assets/images/tabIcons/explore.png')}
                    renderingMode="template"
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="motion-demo">
                <NativeTabs.Trigger.Label>Motion</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    src={require('@/assets/images/tabIcons/explore.png')}
                    renderingMode="template"
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="drag-demo">
                <NativeTabs.Trigger.Label>Drag μ</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    src={require('@/assets/images/tabIcons/explore.png')}
                    renderingMode="template"
                />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
