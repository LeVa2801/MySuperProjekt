import type { AnimationExporter } from "./types";
import { formatNumber, toExportTracks } from "./exportTracks";

export function createCFamilyExporter(language: "C" | "C++"): AnimationExporter {
  return {
    language,
    fileExtension: language === "C" ? "c" : "cpp",
    export(project) {
      const tracks = toExportTracks(project);
      const identifiers = tracks.map((_, index) => `track_${index + 1}_frames`);
      const values = (frame: typeof tracks[number]["keyframes"][number]) =>
        [frame.time, frame.x, frame.y, frame.z, frame.rx, frame.ry, frame.rz, frame.scale].map((value) => {
          const formatted = formatNumber(value);
          return language === "C++" ? `${formatted.includes(".") ? formatted : `${formatted}.0`}f` : formatted;
        });
      const fields = `float time, x, y, z, rx, ry, rz, scale;`;
      const arrays = tracks.map((track, index) => {
        const rows = track.keyframes.map((frame) => `{${values(frame).join(", ")}}`).join(",\n    ");
        const label = JSON.stringify(`${track.name} (${track.model})`);
        return `static const Keyframe ${identifiers[index]}[] = {\n    ${rows}\n};\nstatic const char* ${identifiers[index]}_name = ${label};`;
      }).join("\n\n");
      const languageTypes = language === "C++"
        ? `#include <cstddef>\n#include <iostream>\n\nstruct Keyframe { ${fields} };`
        : `#include <stddef.h>\n#include <stdio.h>\n\ntypedef struct { ${fields} } Keyframe;`;
      const body = language === "C++"
        ? `Keyframe sample(const Keyframe* keys, std::size_t count, float time) {\n    if (time <= keys[0].time) return keys[0];\n    if (time >= keys[count - 1].time) return keys[count - 1];\n    for (std::size_t i = 1; i < count; ++i) {\n        if (time <= keys[i].time) {\n            const Keyframe a = keys[i - 1], b = keys[i];\n            const float t = (time - a.time) / (b.time - a.time);\n            return {time, a.x + (b.x-a.x)*t, a.y + (b.y-a.y)*t, a.z + (b.z-a.z)*t,\n                    a.rx + (b.rx-a.rx)*t, a.ry + (b.ry-a.ry)*t, a.rz + (b.rz-a.rz)*t,\n                    a.scale + (b.scale-a.scale)*t};\n        }\n    }\n    return keys[count - 1];\n}\n\nint main() {\n${tracks.map((_, index) => `    const Keyframe pose_${index + 1} = sample(${identifiers[index]}, sizeof(${identifiers[index]}) / sizeof(${identifiers[index]}[0]), 1.0f);\n    std::cout << ${identifiers[index]}_name << ": x=" << pose_${index + 1}.x << ", y=" << pose_${index + 1}.y << ", scale=" << pose_${index + 1}.scale << '\\n';`).join("\n")}\n    return 0;\n}`
        : `Keyframe sample(const Keyframe* keys, size_t count, float time) {\n    if (time <= keys[0].time) return keys[0];\n    if (time >= keys[count - 1].time) return keys[count - 1];\n    for (size_t i = 1; i < count; ++i) {\n        if (time <= keys[i].time) {\n            const Keyframe a = keys[i - 1], b = keys[i];\n            const float t = (time - a.time) / (b.time - a.time);\n            const Keyframe result = {time, a.x + (b.x-a.x)*t, a.y + (b.y-a.y)*t, a.z + (b.z-a.z)*t,\n                a.rx + (b.rx-a.rx)*t, a.ry + (b.ry-a.ry)*t, a.rz + (b.rz-a.rz)*t,\n                a.scale + (b.scale-a.scale)*t};\n            return result;\n        }\n    }\n    return keys[count - 1];\n}\n\nint main(void) {\n${tracks.map((_, index) => `    const Keyframe pose_${index + 1} = sample(${identifiers[index]}, sizeof(${identifiers[index]}) / sizeof(${identifiers[index]}[0]), 1.0f);\n        printf("%s: x=%.3f, y=%.3f, scale=%.3f\\n", ${identifiers[index]}_name, pose_${index + 1}.x, pose_${index + 1}.y, pose_${index + 1}.scale);`).join("\n")}\n    return 0;\n}`;
      return `${languageTypes}\n\n// Winkel sind im Bogenmass angegeben. Positionen und Skalierung sind einheitenlos.\n${arrays}\n\n${body}\n`;
    },
  };
}
