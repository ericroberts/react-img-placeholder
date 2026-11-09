import * as React from 'react';
import { useImage } from './use-image';

function getInt(x) {
  if (typeof x === 'number') {
    return x;
  }
  if (typeof x === 'string') {
    return parseInt(x, 10); // returns NaN if string does not starts with number
  }
  return undefined;
}

/**
 * React Component for images which shows
 * placeholder while image is loading
 */
const Image = React.forwardRef((props, ref) => {
  const {
    placeholderSrc,
    placeholder,
    placeholderColor = 'gray',
    ignorePlaceholder = false,
    onLoad,
    onError,

    src,
    loading,
    crossOrigin,
    height,
    width,
    ...rest
  }: any = props;

  const intWidth = getInt(width);
  const intHeight = getInt(height);

  const shared = { ref, width, height, ...rest };

  // if loading (`lazy` | `eager`) is provided ignore adding placeholder
  const shouldIgnore = loading || ignorePlaceholder;

  const { isLoaded } = useImage({
    ...props,
    ignorePlaceholder: shouldIgnore,
  });

  // conditions for, `src` loading and if `src` fails
  if (!isLoaded) {
    if (placeholderSrc) return <img src={placeholderSrc} {...shared} />;

    // react element
    if (placeholder) return placeholder;

    // default placeholder if source and element is not provided
    // if styles are there in shared it can override
    const { style = {} } = shared;
    return (
      <div
        {...shared}
        style={{
          height: `${intHeight}px`,
          width: `${intWidth}px`,
          background: placeholderColor,
          ...style,
        }}
      ></div>
    );
  }

  // shows up after loading of `src`
  return (
    <img
      src={src}
      loading={loading}
      crossOrigin={crossOrigin}
      onLoad={onLoad}
      onError={onError}
      {...shared}
    />
  );
});

export { Image };
