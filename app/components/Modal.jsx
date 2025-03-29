import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import ConsistentButton from "./ConsistentButton";

import Colours from "../utils/colours.json";
import { getIcon } from "../utils/icon";

function DefaultModal({
    open,
    onClose,
    onSelect,
    position,
    elements,
    includeBackButton = false,
} = props) {
    return (
        <Modal
            transparent={true}
            visible={open}
            onRequestClose={onClose}
            style={styles.modal}
            animationType="fade"
        >
            <View
                style={[
                    styles.modalView,
                    position.y < Dimensions.get("window").height / 2
                        ? {
                              position: "absolute",
                              top: position.y,
                              left: position.x,
                          }
                        : {
                              position: "absolute",
                              bottom:
                                  Dimensions.get("window").height - position.y,
                              left: position.x,
                          },
                ]}
            >
                <ConsistentButton
                    onClick={onClose}
                    style={[styles.modalElement, styles.modalBack]}
                >
                    {getIcon("Ionicons", "arrow-back", 25, "white")}
                </ConsistentButton>
                <ScrollView>
                    {elements.map((obj, index) => {
                        return (
                            <ConsistentButton
                                onClick={() => {
                                    onSelect(obj.key);
                                    onClose();
                                }}
                                style={styles.modalElement}
                            >
                                <Text style={styles.modalText}>{obj.name}</Text>
                            </ConsistentButton>
                        );
                    })}
                </ScrollView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        //pass
    },
    modalView: {
        backgroundColor: Colours.fgGrey,
        maxHeight: "40%",
        width: 250,
        borderRadius: 5,
        padding: 5,
    },
    modalBack: {
        padding: 5,
        margin: 0,
    },
    modalElement: {
        backgroundColor: "transparent",
        borderBottomColor: "grey",
        borderBottomWidth: 1,
        padding: 10,
        justifyContent: "center",
    },
    modalText: {
        color: "white",
    },
});

export default DefaultModal;
