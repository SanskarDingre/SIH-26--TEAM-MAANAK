const rules = require('../config/rules.json');

function textMatches(text, patterns) {
  const lower = text.toLowerCase();
  return patterns.some((pattern) => new RegExp(pattern, 'i').test(lower));
}

function getYCenter(box) {
  const ys = box.map((p) => p[1]);
  return (Math.min(...ys) + Math.max(...ys)) / 2;
}
function getHeight(box) {
  const ys = box.map((p) => p[1]);
  return Math.max(...ys) - Math.min(...ys);
}
function getXLeft(box) {
  return Math.min(...box.map((p) => p[0]));
}

function groupIntoRows(ocrLines) {
  const sorted = [...ocrLines].sort((a, b) => getYCenter(a.box) - getYCenter(b.box));
  const rows = [];

  sorted.forEach((line) => {
    const yCenter = getYCenter(line.box);
    const threshold = Math.max(getHeight(line.box) * 0.7, 10);
    const row = rows.find((r) => Math.abs(r.yCenter - yCenter) <= threshold);
    if (row) {
      row.lines.push(line);
      row.yCenter = (row.yCenter * (row.lines.length - 1) + yCenter) / row.lines.length;
    } else {
      rows.push({ yCenter, lines: [line] });
    }
  });

  return rows.map((row) => {
    const orderedLeftToRight = [...row.lines].sort((a, b) => getXLeft(a.box) - getXLeft(b.box));
    return {
      text: orderedLeftToRight.map((l) => l.text).join(' '),
      confidence: row.lines.reduce((sum, l) => sum + l.confidence, 0) / row.lines.length,
      box: orderedLeftToRight[0].box,
    };
  });
}

function checkCompliance(ocrLines) {
  const rows = groupIntoRows(ocrLines);
  const candidates = [...rows, ...ocrLines];

  const extractedFields = {};
  const missingFields = [];
  const evidence = {};

  rules.requiredFields.forEach((field) => {
    const match = candidates.find((c) => textMatches(c.text, field.patterns));
    if (match) {
      extractedFields[field.key] = 'Present';
      evidence[field.key] = { text: match.text, confidence: match.confidence, box: match.box };
    } else {
      extractedFields[field.key] = 'Missing';
      missingFields.push(field.label);
      evidence[field.key] = null;
    }
  });

  const status = missingFields.length === 0 ? 'compliant' : 'non-compliant';
  const rawText = ocrLines.map((line) => line.text).join(' ');

  return { extractedFields, missingFields, status, rawText, evidence };
}

module.exports = { checkCompliance };
