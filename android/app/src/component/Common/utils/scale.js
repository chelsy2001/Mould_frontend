// utils/scale.js
import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// Reference screen size bucket logic (in inches)
const DPI = PixelRatio.get(); // Dots per inch (DPI)
const diagonalInches = Math.sqrt((width / DPI) ** 2 + (height / DPI) ** 2);

// Custom scaling factor based on actual physical screen size
let scaleFactor = 1;
if (diagonalInches <= 5.0) scaleFactor = 0.8;
else if (diagonalInches <= 5.5) scaleFactor = 0.9;
else if (diagonalInches <= 6.5) scaleFactor = 1.0;
else if (diagonalInches <= 10.5) scaleFactor = 1.15;
else scaleFactor = 1.3;

export const scale = size => size * scaleFactor;
export const verticalScale = size => size * scaleFactor;
export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;
