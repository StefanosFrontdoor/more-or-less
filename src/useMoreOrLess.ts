import React, { useCallback, useEffect } from 'react';
import {
  LayoutAnimation,
  NativeSyntheticEvent,
  TextLayoutEventData,
  TextLayoutLine,
} from 'react-native';
import { usePrevious, useToggle } from './hooks';
import { UseMoreOrLessProps } from './MoreOrLess.types';

export const useMoreOrLess = ({
  children,
  animated,
  numberOfLines,
  customOnMorePress,
  customOnLessPress,
}: UseMoreOrLessProps) => {
  const {
    value: isExpanded,
    setTrue: expandText,
    setFalse: shrinkText,
  } = useToggle(false);
  const [lines, setLines] = React.useState<TextLayoutLine[] | null>(null);
  const [hasOverflow, setHasOverflow] = React.useState(false);
  const previousChildren = usePrevious(children);
  const previousNumberOfLines = usePrevious(numberOfLines);
  const previousLines = usePrevious(lines);

  useEffect(() => {
    if (numberOfLines < 1) {
      throw new Error('Number of lines must be greater than zero');
    }
    if (lines !== null && numberOfLines !== previousNumberOfLines) {
      setLines(null);
    }
  }, [lines, numberOfLines, previousNumberOfLines]);

  useEffect(() => {
    if (animated)
      LayoutAnimation.configureNext({
        duration: 600,
        create: { type: 'linear', property: 'opacity' },
        update: { type: 'spring', springDamping: 2 },
        delete: { type: 'linear', property: 'opacity' },
      });
  }, [animated, isExpanded]);

  const onTextLayoutGetLines = useCallback(
    (event: NativeSyntheticEvent<TextLayoutEventData>) => {
      const _lines = [...event.nativeEvent.lines];
      const measuredLines = _lines.length;

      if (measuredLines > numberOfLines) {
        // Determine if showMore is shown or not and
        if (_lines[numberOfLines]?.text) {
          setHasOverflow(true);
        }
        // restore the array to be its original numberOfLines.
        while (measuredLines > numberOfLines) {
          const extraLine = _lines.pop()?.text ?? '';
          const prevLineIndex = numberOfLines - 1;
          if (_lines[prevLineIndex]?.text) {
            _lines[prevLineIndex].text += extraLine;
          }
        }
      }
      setLines(_lines);
    },
    [numberOfLines]
  );

  const onMorePress = useCallback(() => {
    if (hasOverflow) {
      return () => {
        if (customOnMorePress) {
          customOnMorePress();
        }
        expandText();
      };
    }
    return;
  }, [customOnMorePress, expandText, hasOverflow]);

  const onLessPress = useCallback(() => {
    if (hasOverflow) {
      return () => {
        if (customOnLessPress) {
          customOnLessPress();
        }
        shrinkText();
      };
    }
    return;
  }, [customOnLessPress, shrinkText, hasOverflow]);

  return {
    linesToRender: lines ?? previousLines,
    firstRenderOrUpdate: lines === null || previousChildren !== children,
    isExpanded,
    onTextLayoutGetLines,
    onMorePress,
    onLessPress,
  };
};
