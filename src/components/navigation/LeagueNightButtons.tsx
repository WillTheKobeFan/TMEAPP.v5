// src/components/navigation/LeagueNightButtons.tsx

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

type Props = {
    baseRoute: string;
};

const leagues = [
    { id: "Sunday", label: "Sunday AM • YMCA" },
    { id: "Monday", label: "Monday PM • Berlin" },
    { id: "Tuesday", label: "Tuesday PM • YMCA" },
    { id: "Wednesday", label: "Wednesday PM • Berlin" },
];

export default function LeagueNightButtons({ baseRoute }: Props) {
    const router = useRouter();

    return (
        <View style={styles.buttonGroup}>
            {leagues.map((league) => (
                <TouchableOpacity
                    key={league.id}
                    style={styles.button}
                    onPress={() =>
                        router.push({
                            pathname: `${baseRoute}/[league]` as any,
                            params: { league: league.id },
                        })
                    }
                >
                    <Text style={styles.buttonText}>{league.label}</Text>
                
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    buttonGroup: {
        width: "70%",
    },

    button: {
        backgroundColor: "#250f74ff",
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderRadius: 12,
        marginBottom: 18, // spacing between buttons 
        flexDirection: "row",
        alignItems: "center",
    },

    buttonEmoji: {
        fontSize: 18,
        width: 28,
    },

    buttonText: {
        flex: 1,
        color: "#fff",
        fontSize: 17,
        fontWeight: "600",
        textAlign: "center",
    },

    buttonArrow: {
        width: 24,
        color: "#fff",
        fontSize: 24,
        fontWeight: "600",
        textAlign: "right",
    },
});