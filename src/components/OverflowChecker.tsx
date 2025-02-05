import React, { ComponentType } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextLayoutEventData,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

export type OverflowCheckerProps = {
  checkText: string;
  numberOfLines: number;
  onTextLayout: (event: NativeSyntheticEvent<TextLayoutEventData>) => void;
  textComponent?: ComponentType<TextProps>;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
};

export const OverflowChecker = ({
  checkText,
  numberOfLines,
  textComponent: TextComponent = Text,
  onTextLayout,
  containerStyle,
  textStyle,
}: OverflowCheckerProps) => {
  return (
    <View style={containerStyle}>
      <View>
        <TextComponent
          style={[textStyle, styles.hiddenTextAbsolute]}
          // "+ 1" because we want to see if
          // the lines include another one
          // or just fit all in numberOfLines.
          numberOfLines={numberOfLines + 1}
          onTextLayout={onTextLayout}
        >
          {checkText}
        </TextComponent>
      </View>
    </View>
  );
};

type MoreOrLessStyles = {
  hiddenTextAbsolute: TextStyle;
};

const styles = StyleSheet.create<MoreOrLessStyles>({
  hiddenTextAbsolute: {
    left: 0,
    opacity: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
