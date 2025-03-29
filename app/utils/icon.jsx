import React from "react";
import {
    MaterialIcons,
    MaterialCommunityIcons,
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    Fontisto,
    Foundation,
    Ionicons,
    Octicons,
    SimpleLineIcons,
    Zocial,
} from "@expo/vector-icons";
import { Text } from "react-native";

export function getIcon(
    reference,
    icon,
    size = 25,
    color = "white",
    style = {}
) {
    if (reference == "MaterialIcons")
        return (
            <MaterialIcons
                name={icon}
                size={size}
                color={color}
                style={style}
            />
        );
    if (reference == "MaterialCommunityIcons")
        return (
            <MaterialCommunityIcons
                name={icon}
                size={size}
                color={color}
                style={style}
            />
        );
    if (reference == "AntDesign")
        return (
            <AntDesign name={icon} size={size} color={color} style={style} />
        );
    if (reference === "Entypo")
        return <Entypo name={icon} size={size} color={color} style={style} />;
    if (reference === "EvilIcons")
        return (
            <EvilIcons name={icon} size={size} color={color} style={style} />
        );
    if (reference === "Feather")
        return <Feather name={icon} size={size} color={color} style={style} />;
    if (reference === "FontAwesome")
        return (
            <FontAwesome name={icon} size={size} color={color} style={style} />
        );
    if (reference === "FontAwesome5")
        return (
            <FontAwesome5 name={icon} size={size} color={color} style={style} />
        );
    if (reference === "FontAwesome6")
        return (
            <FontAwesome6 name={icon} size={size} color={color} style={style} />
        );
    if (reference === "Fontisto")
        return <Fontisto name={icon} size={size} color={color} style={style} />;
    if (reference === "Foundation")
        return (
            <Foundation name={icon} size={size} color={color} style={style} />
        );
    if (reference === "Ionicons")
        return <Ionicons name={icon} size={size} color={color} style={style} />;
    if (reference === "Octicons")
        return <Octicons name={icon} size={size} color={color} style={style} />;
    if (reference === "SimpleLineIcons")
        return (
            <SimpleLineIcons
                name={icon}
                size={size}
                color={color}
                style={style}
            />
        );
    if (reference === "Zocial")
        return <Zocial name={icon} size={size} color={color} style={style} />;
    if (reference === "Custom") {
        let iconMap = {
            "home-outline": "⌂",
            "quran-outline": "🕮",
            quran: "🕯",
            hadiths: "🕰",
            "hadiths-outline": "🕱",
            "praying-outline": "🕲",
            praying: "🕳",
            "albums-outline": "🕴",
            albums: "🕵",
            "tasbih-outline": "🕶",
            tasbih: "🕷",
        };
        return (
            <Text
                style={[
                    style,
                    {
                        fontSize: size,
                        color: color,
                        fontFamily: "custom-icons",
                    },
                ]}
            >
                {iconMap[icon]}
            </Text>
        );
    }
}
