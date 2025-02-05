import { ComponentType } from 'react';
import { TextProps, TextStyle, ViewStyle } from 'react-native';

export type MoreOrLessProps = {
  children: string;
  containerStyle?: ViewStyle;
  numberOfLines: number;
  onMorePress?: () => void;
  onLessPress?: () => void;
  moreText?: string;
  lessText?: string;
  textButtonStyle?: TextStyle;
  textComponent?: ComponentType<TextProps>;
  textStyle?: TextStyle;
  animated?: boolean;
} & Pick<TextProps, 'ellipsizeMode'>;

export type UseMoreOrLessProps = {
  children: string;
  animated?: boolean;
  numberOfLines: number;
  customOnMorePress?: () => void;
  customOnLessPress?: () => void;
};
