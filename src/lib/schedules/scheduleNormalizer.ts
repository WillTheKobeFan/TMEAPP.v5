// src/lib/schedules/scheduleNormalizer.ts

export type NormalizeOptions = {
  autoFix?: boolean;
  strict?: boolean;
};

export type NormalizationIssue = {
  line: string;
  issue: string;
};

export type NormalizationResult = {
  output: string;
  issues: NormalizationIssue[];
};

const cleanLine = (line: string) =>
  line.replace(/\s+/g, " ").trim();

const fixBye = (line: string) => {
  if (line.startsWith("BYE:")) {
    return line.replace("BYE:", "BYE |");
  }
  return line;
};

const fixNulls = (line: string) => {
  return line
    .replace(/WINNER:\s*null/gi, "WINNER: N/A")
    .replace(/SCORE:\s*null/gi, "SCORE: N/A")
    .replace(/WINNER:\s*$/g, "WINNER: N/A")
    .replace(/SCORE:\s*$/g, "SCORE: N/A");
};

const fixPlayoffType = (line: string) => {
  return line.replace(/type:\s*playoffs/g, "type: playoff");
};

const validate = (line: string): string[] => {
  const issues: string[] = [];

  if (line.includes("type: playoffs")) {
    issues.push("Invalid type: playoffs (must be playoff)");
  }

  if (line.includes("BYE:")) {
    issues.push("Invalid BYE format (must be BYE |)");
  }

  if (line.includes("WINNER: null")) {
    issues.push("WINNER is null (must be N/A)");
  }

  if (line.includes("SCORE: null")) {
    issues.push("SCORE is null (must be N/A)");
  }

  return issues;
};

export function normalizeSchedule(
  input: string,
  options: NormalizeOptions = { autoFix: true, strict: false }
): NormalizationResult {
  const lines = input.split("\n");

  const issues: NormalizationIssue[] = [];

  const output = lines.map((raw) => {
    if (!raw.trim()) return raw;

    const original = raw;

    let line = raw;

    // STEP 1: FIXES (only if autoFix enabled)
    if (options.autoFix) {
      line = fixBye(line);
      line = fixNulls(line);
      line = fixPlayoffType(line);
      line = cleanLine(line);
    }

    // STEP 2: VALIDATION (run AFTER fixes so we validate final state)
    const found = validate(line);

    found.forEach((msg) => {
      issues.push({
        line: original,
        issue: msg,
      });
    });

    // STEP 3: STRICT MODE (fixed properly)
    if (options.strict && found.length > 0) {
      throw new Error(
        "Schedule validation failed:\n" +
          found.map((f) => `- ${f} (${original})`).join("\n")
      );
    }

    return line;
  });

  return {
    output: output.join("\n"),
    issues,
  };
}