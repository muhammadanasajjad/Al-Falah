import { Redirect, router, Slot } from "expo-router";
import { Text, View } from "react-native";
import Colours from "./utils/colours.json";
import { useContext, useEffect, useState } from "react";
import { SuperContext } from "./_layout";
import LoadingScreen from "./components/LoadingScreen";

export default function Page() {
    // const [, , , , , fontsLoaded] = useContext(SuperContext);
    const [redirect, setRedirect] = useState(true);

    // useEffect(() => {
    //     if (fontsLoaded) {
    //         setRedirect(true);
    //         console.log("redirecting");
    //     }
    // }, [fontsLoaded]);

    return (
        <View
            style={{
                flex: 1,
                paddingBottom: 100,
                backgroundColor: Colours.bgColour,
            }}
        >
            {/* <Slot /> */}
            <LoadingScreen />
            {redirect ? (
                <Redirect href="/(tabs)/home" />
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
}
