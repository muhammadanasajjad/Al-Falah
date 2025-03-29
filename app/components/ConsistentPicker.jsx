import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    Touchable,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from "react-native";
import Colours from "../utils/colours.json";
import { getIcon } from "../utils/icon";

const ConsistentPicker = ({
    extraStyles = {},
    options = [{ val: "foo", name: "Foo" }],
    originalValue = "foo",
    onValueChange = (val) => {},
    scrollOffset,
} = props) => {
    const [value, setValue] = useState(originalValue);
    const [open, setOpen] = useState(false);
    const inputRef = useRef(null);
    const position = useRef({ x: 0, y: 0 });

    function getSelectedOption(options, val) {
        for (let i = 0; i < options.length; i++) {
            if (options[i].val === val) {
                return options[i];
            }
        }
        setValue(options[0].val);
        return { val: "", name: "" };
    }

    useEffect(() => {
        if (inputRef.current) {
            setTimeout(() => {
                position.current = inputRef.current?.measure(
                    (x, y, width, height, pageX, pageY) => {
                        position.current = { x: pageX, y: pageY - height / 2 };
                    }
                );
            }, 0);
        }
    }, []);

    console.log(scrollOffset);

    return (
        <>
            <TouchableOpacity
                ref={inputRef}
                style={[styles.picker, extraStyles]}
                onPress={(event) => {
                    console.log(event.nativeEvent);
                    position.current = {
                        x:
                            event.nativeEvent.pageX -
                            event.nativeEvent.locationX,
                        y:
                            event.nativeEvent.pageY -
                            event.nativeEvent.locationY,
                    };
                    setOpen(true);
                }}
            >
                <Text
                    style={[
                        styles.text,
                        { color: open ? Colours.bgDarkGrey : Colours.fgGrey },
                    ]}
                >
                    {getSelectedOption(options, value).name}
                </Text>
                {getIcon("Ionicons", "chevron-down", 16, Colours.fgColor)}
            </TouchableOpacity>
            <Modal
                animationType="fade"
                visible={open}
                style={styles.modal}
                transparent={true}
            >
                <Pressable
                    style={styles.modalContainer}
                    onPress={() => setOpen(false)}
                ></Pressable>
                <View
                    style={[
                        styles.modalContent,
                        position.current.y < Dimensions.get("window").height / 2
                            ? {
                                  top: position.current.y,
                                  left: position.current.x,
                              }
                            : {
                                  bottom:
                                      Dimensions.get("window").height -
                                      position.current.y,
                                  left: position.current.x,
                              },
                    ]}
                >
                    {options.map((option) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    setValue(option.val);
                                    setOpen(false);
                                    onValueChange(option.val);
                                }}
                                style={styles.modalItem}
                            >
                                <Text style={styles.modalText}>
                                    {option.name}
                                </Text>
                                {option.val == value &&
                                    getIcon("Ionicons", "checkmark", 16)}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </Modal>
        </>
        // <DropDownPicker
        //     open={open}
        //     value={value}
        //     items={items}
        //     setOpen={setOpen}
        //     setValue={setValue}
        //     setItems={setItems}
        //     containerStyle={styles.picker}
        //     modalAnimationType="slide"
        //     modalContentContainerStyle={{
        //         backgroundColor: Colours.bgColour,
        //         fontSize: 35,
        //     }}
        //     modalTitle="Choose an item"
        //     modalTitleStyle={{ color: Colours.fgColor }}
        //     theme="DARK"
        //     listMode="MODAL"
        //     style={{ backgroundColor: Colours.bgDarkGrey, borderWidth: 0 }}
        // />
    );
};

const styles = StyleSheet.create({
    picker: {
        backgroundColor: Colours.bgDarkGrey,
        borderRadius: 10,
        padding: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    text: {
        color: Colours.fgGrey,
        padding: 0,
        margin: 0,
        fontSize: 16,
        marginRight: 10,
    },
    modal: {
        flex: 1,
        backgroundColor: "transparent",
    },
    modalContainer: {
        flex: 1,
        // backgroundColor: "#00000080",
    },
    modalContent: {
        backgroundColor: Colours.bgDarkGrey,
        position: "absolute",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    modalItem: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: Colours.fgGrey + "55",
        borderBottomWidth: 1,
    },
    modalText: {
        color: Colours.fgGrey,
        fontSize: 16,
        paddingRight: 20,
    },
});

export default ConsistentPicker;
