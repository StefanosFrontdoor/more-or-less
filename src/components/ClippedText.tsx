import React, { ComponentType, PropsWithChildren, useMemo } from 'react';
import { Platform, TextLayoutLine, TextProps, TextStyle } from 'react-native';

type ClippedTextProps = PropsWithChildren<{
  linesToRender: TextLayoutLine[];
  numberOfLines: number;
  textComponent: ComponentType<TextProps>;
  textStyle?: TextStyle;
}>;

export const ClippedText = ({
  children,
  linesToRender,
  numberOfLines,
  textComponent: TextComponent,
  textStyle,
}: ClippedTextProps) => {
  const text = useMemo(
    () =>
      Platform.select({
        ios: linesToRender
          .slice(0, linesToRender.length - 1)
          .map((line) => line.text),
        android: children,
        default: children,
      }),
    [children, linesToRender]
  );

  const numberOfLinesToClip = useMemo(
    () => Math.min(numberOfLines, linesToRender.length) - 1,
    [linesToRender.length, numberOfLines]
  );

  if (linesToRender.length < 2) return null;

  return (
    <TextComponent
      style={textStyle}
      numberOfLines={numberOfLinesToClip}
      ellipsizeMode="clip"
    >
      {text}
    </TextComponent>
  );
};
