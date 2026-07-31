import Svg, { G, Path } from "react-native-svg";

interface MicLogoProps {
  width?: number;
  height?: number;
  color?: string; // Färg-prop som du kan ändra hur du vill
}

export default function MicLogo({
  width = 30,
  height = 30,
  color = "#fff",
}: MicLogoProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 90 90" fill={color}>
      <G
        transform="translate(31, 31) scale(0.3, 0.3)"
        fill={color}
        stroke="none"
      >
        <Path
          d="M 45 70.968 c -16.013 0 -29.042 -13.028 -29.042 -29.042 c 0 -1.712 1.388 -3.099 3.099 -3.099 c 1.712 0 3.099 1.388 3.099 3.099 C 22.157 54.522 32.404 64.77 45 64.77 c 12.595 0 22.843 -10.248 22.843 -22.843 c 0 -1.712 1.387 -3.099 3.099 -3.099 s 3.099 1.388 3.099 3.099 C 74.042 57.94 61.013 70.968 45 70.968 z"
          strokeLinecap="round"
        />
        <Path
          d="M 45 60.738 L 45 60.738 c -10.285 0 -18.7 -8.415 -18.7 -18.7 V 18.7 C 26.3 8.415 34.715 0 45 0 h 0 c 10.285 0 18.7 8.415 18.7 18.7 v 23.337 C 63.7 52.322 55.285 60.738 45 60.738 z"
          strokeLinecap="round"
        />
        <Path
          d="M 45 89.213 c -1.712 0 -3.099 -1.387 -3.099 -3.099 V 68.655 c 0 -1.712 1.388 -3.099 3.099 -3.099 c 1.712 0 3.099 1.387 3.099 3.099 v 17.459 C 48.099 87.826 46.712 89.213 45 89.213 z"
          strokeLinecap="round"
        />
        <Path
          d="M 55.451 90 H 34.549 c -1.712 0 -3.099 -1.387 -3.099 -3.099 s 1.388 -3.099 3.099 -3.099 h 20.901 c 1.712 0 3.099 1.387 3.099 3.099 S 57.163 90 55.451 90 z"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}
