import React, { useEffect, useState } from "react";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";



const hexToHsv = (hex: string) => {
  const valid = /^#[0-9A-Fa-f]{6}$/.test(hex);

  if (!valid) {
    return { h: 120, s: 100, v: 75 };
  }

  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;

  if (delta !== 0) {
    if (max === r) h = 60 * (((g - b) / delta) % 6);
    else if (max === g) h = 60 * ((b - r) / delta + 2);
    else h = 60 * ((r - g) / delta + 4);
  }

  if (h < 0) h += 360;

  return {
    h: Math.round(h),
    s: Math.round(max === 0 ? 0 : (delta / max) * 100),
    v: Math.round(max * 100),
  };
};

const hsvToHex = (h: number, s: number, v: number): string => {
  const saturation = s / 100;
  const brightness = v / 100;
  const chroma = brightness * saturation;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = brightness - chroma;

  let rgb = [0, 0, 0];

  if (h < 60) rgb = [chroma, x, 0];
  else if (h < 120) rgb = [x, chroma, 0];
  else if (h < 180) rgb = [0, chroma, x];
  else if (h < 240) rgb = [0, x, chroma];
  else if (h < 300) rgb = [x, 0, chroma];
  else rgb = [chroma, 0, x];

  return (
    "#" +
    rgb
      .map((channel) =>
        Math.round((channel + m) * 255)
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
      .toUpperCase()
  );
};

const PRESETS = [
  { name: "Red", hex: "#DC2626" },
  { name: "Orange", hex: "#EA580C" },
  { name: "Yellow", hex: "#FACC15" },
  { name: "Gold", hex: "#EAB308" },
  { name: "Green", hex: "#16A34A" },
  { name: "Lime Green", hex: "#84CC16" },
  { name: "Forest Green", hex: "#228B22" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Light Blue", hex: "#7DD3FC" },
  { name: "Dark Blue", hex: "#1E3A8A" },
  { name: "Purple", hex: "#663399" },
  { name: "Pink", hex: "#DB2777" },
  { name: "Black", hex: "#171717" },
  { name: "Gray", hex: "#737373" },
  { name: "White", hex: "#FFFFFF" },
];

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textColor: string;
  borderColor: string;
  backgroundColor: string;
};

export default function SportSyncColorPicker({
  label,
  value,
  onChange,
  textColor,
  borderColor,
  backgroundColor,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [customHex, setCustomHex] = useState("");
  const [resetBaseline, setResetBaseline] = useState(value);
  const [hue, setHue] = useState(() => hexToHsv(value).h);
  const [saturation, setSaturation] = useState(
    () => hexToHsv(value).s
  );
  const [brightness, setBrightness] = useState(
    () => hexToHsv(value).v
  );

  useEffect(() => {
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      const next = hexToHsv(value);
      setHue(next.h);
      setSaturation(next.s);
      setBrightness(next.v);
    }
  }, [value]);

  const precisionHex = hsvToHex(hue, saturation, brightness);

  const saturationStart = hsvToHex(hue, 0, brightness);
  const saturationEnd = hsvToHex(hue, 100, brightness);
  const brightnessEnd = hsvToHex(hue, saturation, 100);

  const validColor = /^#[0-9A-Fa-f]{6}$/.test(value);
  const validCustom = /^#[0-9A-Fa-f]{6}$/.test(customHex.trim());

  const selected = PRESETS.find(
    (item) => item.hex.toLowerCase() === value.toLowerCase()
  );

  const chooseColor = (hex: string) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      const next = hexToHsv(hex);
      setHue(next.h);
      setSaturation(next.s);
      setBrightness(next.v);
    }

    setResetBaseline(hex);
    onChange(hex);
  };

  const baselineHsv = hexToHsv(resetBaseline);

  const resetHue = () => {
    setHue(baselineHsv.h);
    onChange(hsvToHex(baselineHsv.h, saturation, brightness));
  };

  const resetSaturation = () => {
    setSaturation(baselineHsv.s);
    onChange(hsvToHex(hue, baselineHsv.s, brightness));
  };

  const resetBrightness = () => {
    setBrightness(baselineHsv.v);
    onChange(hsvToHex(hue, saturation, baselineHsv.v));
  };

  const resetAll = () => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(resetBaseline)) return;

    const original = hexToHsv(resetBaseline);
    setHue(original.h);
    setSaturation(original.s);
    setBrightness(original.v);
    onChange(resetBaseline);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: textColor }]}>
        {label} (Optional)
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Choose ${label}`}
        onPress={() => setExpanded(!expanded)}
        style={[styles.selectedRow, { borderColor, backgroundColor }]}
      >
        <View
          style={[
            styles.preview,
            {
              borderColor,
              backgroundColor: validColor ? value : "transparent",
            },
          ]}
        />

        <View style={{ flex: 1 }}>
          <Text style={{ color: textColor, fontWeight: "600" }}>
            {validColor
              ? selected?.name ?? "Custom Color"
              : "Choose a color"}
          </Text>

          {validColor && (
            <Text style={{ color: textColor, opacity: 0.7 }}>
              {value.toUpperCase()}
            </Text>
          )}
        </View>

        <Text style={{ color: textColor }}>
          {expanded ? "▲" : "▼"}
        </Text>
      </Pressable>

      {expanded && (
        <View style={[styles.options, { borderColor }]}>
          <View style={styles.palette}>
            {PRESETS.map((color) => (
              <Pressable
                key={color.hex}
                accessibilityRole="button"
                accessibilityLabel={`Select ${color.name}`}
                onPress={() => chooseColor(color.hex)}
                style={styles.colorOption}
              >
                <View
                  style={[
                    styles.swatch,
                    {
                      backgroundColor: color.hex,
                      borderColor,
                    },
                  ]}
                />

                <Text
                  style={[styles.colorName, { color: textColor }]}
                >
                  {color.name}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.resetHeading}>
            <Text
              style={[
                styles.label,
                { color: textColor, flex: 1 },
              ]}
            >
              Rainbow & Precision Color Picker
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reset all color adjustments"
              disabled={!/^#[0-9A-Fa-f]{6}$/.test(resetBaseline)}
              onPress={resetAll}
              style={[styles.resetButton, { borderColor }]}
            >
              <Text style={{ color: textColor }}>Reset All</Text>
            </Pressable>
          </View>

          <View style={styles.precisionPreviewRow}>
            <View
              style={[
                styles.precisionPreview,
                { backgroundColor: precisionHex, borderColor },
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ color: textColor, fontWeight: "600" }}>
                {precisionHex}
              </Text>
              <Text style={{ color: textColor, opacity: 0.7 }}>
                Preview before applying
              </Text>
            </View>
          </View>

          <View style={styles.resetHeading}>
            <Text style={{ color: textColor, flex: 1 }}>
              Rainbow Hue: {Math.round(hue)}°
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reset hue"
              onPress={resetHue}
              style={[styles.resetButton, { borderColor }]}
            >
              <Text style={{ color: textColor }}>Reset</Text>
            </Pressable>
          </View>
          <View style={styles.gradientSliderContainer}>
              <LinearGradient
                colors={["#FF0000", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF", "#FF0000"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                pointerEvents="none"
                style={styles.gradientTrack}
              />
              <Slider
            minimumValue={0}
            maximumValue={359}
            step={1}
            value={hue}
            onValueChange={(nextHue) => {
              setHue(nextHue);
              onChange(hsvToHex(nextHue, saturation, brightness));
            }}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
            thumbTintColor={precisionHex}
            accessibilityLabel="Rainbow hue"
          />
            </View>

          <View style={styles.resetHeading}>
            <Text style={{ color: textColor, flex: 1 }}>
              Saturation: {Math.round(saturation)}%
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reset saturation"
              onPress={resetSaturation}
              style={[styles.resetButton, { borderColor }]}
            >
              <Text style={{ color: textColor }}>Reset</Text>
            </Pressable>
          </View>
          <View style={styles.gradientSliderContainer}>
              <LinearGradient
                colors={[saturationStart, saturationEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                pointerEvents="none"
                style={styles.gradientTrack}
              />
              <Slider
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={saturation}
            onValueChange={(nextSaturation) => {
              setSaturation(nextSaturation);
              onChange(hsvToHex(hue, nextSaturation, brightness));
            }}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
            thumbTintColor={precisionHex}
            accessibilityLabel="Color saturation"
          />
            </View>

          <View style={styles.resetHeading}>
            <Text style={{ color: textColor, flex: 1 }}>
              Brightness: {Math.round(brightness)}%
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reset brightness"
              onPress={resetBrightness}
              style={[styles.resetButton, { borderColor }]}
            >
              <Text style={{ color: textColor }}>Reset</Text>
            </Pressable>
          </View>
          <View style={styles.gradientSliderContainer}>
              <LinearGradient
                colors={["#000000", brightnessEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                pointerEvents="none"
                style={styles.gradientTrack}
              />
              <Slider
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={brightness}
            onValueChange={(nextBrightness) => {
              setBrightness(nextBrightness);
              onChange(hsvToHex(hue, saturation, nextBrightness));
            }}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
            thumbTintColor={precisionHex}
            accessibilityLabel="Color brightness"
          />
            </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => chooseColor(precisionHex)}
            style={[styles.action, { borderColor }]}
          >
            <Text style={{ color: textColor }}>Apply Precision Color</Text>
          </Pressable>

          <Text style={[styles.label, { color: textColor }]}>
            Custom HEX
          </Text>

          <TextInput
            value={customHex}
            onChangeText={setCustomHex}
            placeholder="#123ABC"
            placeholderTextColor={textColor}
            autoCapitalize="characters"
            maxLength={7}
            style={[
              styles.input,
              { borderColor, color: textColor, backgroundColor },
            ]}
          />

          <Pressable
            accessibilityRole="button"
            disabled={!validCustom}
            onPress={() =>
              chooseColor(customHex.trim().toUpperCase())
            }
            style={[
              styles.action,
              { borderColor, opacity: validCustom ? 1 : 0.4 },
            ]}
          >
            <Text style={{ color: textColor }}>
              Apply Custom Color
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => chooseColor("")}
            style={[styles.action, { borderColor }]}
          >
            <Text style={{ color: textColor }}>Clear Color</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  gradientSliderContainer: {
    height: 40,
    justifyContent: "center",
  },
  gradientTrack: {
    position: "absolute",
    left: 15,
    right: 15,
    height: 8,
    borderRadius: 4,
  },
  label: { fontSize: 14, fontWeight: "600" },
  selectedRow: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  preview: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
  },
  options: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  palette: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorOption: {
    width: "30%",
    alignItems: "center",
    gap: 4,
  },
  swatch: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
  },
  colorName: {
    fontSize: 11,
    textAlign: "center",
  },
  resetHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  resetButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
  },
  precisionPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  precisionPreview: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  action: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
});
