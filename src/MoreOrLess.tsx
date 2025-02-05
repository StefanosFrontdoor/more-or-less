import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  UIManager,
  View,
} from 'react-native';
import { ClippedText } from './components/ClippedText';
import { OverflowChecker } from './components/OverflowChecker';
import { useMoreOrLess } from './useMoreOrLess';
import { MoreOrLessProps } from './MoreOrLess.types';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MoreOrLess = ({
  animated = false,
  children,
  containerStyle,
  numberOfLines,
  onMorePress: customOnMorePress,
  onLessPress: customOnLessPress,
  moreText = 'more',
  lessText = 'less',
  textButtonStyle,
  textComponent: TextComponent = Text,
  textStyle,
}: MoreOrLessProps) => {
  const {
    linesToRender,
    firstRenderOrUpdate,
    isExpanded,
    onTextLayoutGetLines,
    onMorePress,
    onLessPress,
  } = useMoreOrLess({
    children,
    animated,
    numberOfLines,
    customOnMorePress,
    customOnLessPress,
  });
  const buttonStyles = [textStyle, styles.bold, textButtonStyle];

  if (!children) return null;

  if (firstRenderOrUpdate)
    return (
      <OverflowChecker
        checkText={children}
        numberOfLines={numberOfLines + 1}
        onTextLayout={onTextLayoutGetLines}
        textComponent={TextComponent}
        containerStyle={containerStyle}
        textStyle={textStyle}
      />
    );

  if (linesToRender)
    return (
      <View style={containerStyle}>
        {isExpanded ? (
          <TextComponent style={textStyle}>
            <TextComponent style={textStyle}>{children}</TextComponent>
            <TextComponent style={buttonStyles} onPress={onLessPress}>
              {' '}
              {lessText}
            </TextComponent>
          </TextComponent>
        ) : (
          <View>
            <ClippedText
              linesToRender={linesToRender}
              numberOfLines={numberOfLines}
              textComponent={TextComponent}
              textStyle={textStyle}
            >
              {children}
            </ClippedText>
            <View style={styles.lastLine}>
              <View style={styles.ellipsedText}>
                <TextComponent style={textStyle} numberOfLines={1}>
                  {linesToRender[linesToRender.length - 1]?.text}
                </TextComponent>
              </View>
              {onMorePress && (
                <TextComponent style={buttonStyles} onPress={onMorePress}>
                  {moreText}
                </TextComponent>
              )}
            </View>
          </View>
        )}
      </View>
    );

  return null;
};

type MoreOrLessStyles = {
  ellipsedText: TextStyle;
  lastLine: TextStyle;
  bold: TextStyle;
};

const styles = StyleSheet.create<MoreOrLessStyles>({
  bold: {
    fontWeight: 'bold',
  },
  ellipsedText: {
    flex: 1,
  },
  lastLine: {
    flexDirection: 'row',
  },
});

export default MoreOrLess;
