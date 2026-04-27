const fs = require("fs");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ExternalHyperlink,
  AlignmentType,
} = require("docx");

// Helpers
const bold = (text, size = 28) =>
  new Paragraph({
    children: [new TextRun({ text, bold: true, size })],
    spacing: { before: 200, after: 120 },
  });

const italic = (text) =>
  new Paragraph({
    children: [new TextRun({ text, italics: true })],
    spacing: { after: 200 },
  });

const plain = (text) =>
  new Paragraph({
    children: [new TextRun({ text })],
  });

const bullet = (text) =>
  new Paragraph({
    text,
    bullet: { level: 0 },
  });

// Cell with plain text
function textCell(text, { bold: isBold = false } = {}) {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: isBold })],
      }),
    ],
  });
}

// Cell with a hyperlink
function linkCell(url) {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: url,
                style: "Hyperlink",
              }),
            ],
            link: url,
          }),
        ],
      }),
    ],
  });
}

// Build a table from header + rows. Each row is an array; each item is either
// a string (text cell) or {url: "..."} (link cell).
function buildTable(headers, rows) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h) => textCell(h, { bold: true })),
  });

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map((c) =>
          typeof c === "string" ? textCell(c) : linkCell(c.url)
        ),
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });
}

const children = [];

// Title
children.push(
  new Paragraph({
    children: [
      new TextRun({
        text: "ECO 210 ECONLAB — Deployed Labs Summary",
        bold: true,
        size: 32,
      }),
    ],
    spacing: { after: 120 },
  })
);
children.push(italic("Last updated: April 24, 2026"));

// --- Course Hub ---
children.push(bold("Course Hub"));
children.push(
  buildTable(
    ["Item", "URL", "Asset ID", "Status"],
    [
      [
        "ECO 210 Hub",
        { url: "https://www.perplexity.ai/computer/a/econlab-hub-JgrfOPjHQ5iSYovw19FfIg" },
        "260adf38",
        "✓ LOCKED",
      ],
    ]
  )
);
children.push(new Paragraph({ text: "" }));

// --- Individual Chapter Labs ---
children.push(bold("Individual Chapter Labs"));
children.push(
  buildTable(
    ["Chapter", "Topic", "URL", "Asset ID", "Status"],
    [
      ["Ch1", "Introduction to Economics", { url: "https://www.perplexity.ai/computer/a/eco210-lab-ch1-dist-public-xUGKV9_3Q0KToOAmM0Is4Q" }, "c5418a57", "needs testing"],
      ["Ch2", "Choice In A World Of Scarcity", { url: "https://www.perplexity.ai/computer/a/eco210-lab-ch2-dist-public-KRbtDsODQ8.eEfMihpMb7A" }, "2916ed0e", "needs testing"],
      ["Ch6", "GDP", { url: "https://www.perplexity.ai/computer/a/eco-210-econlab-chapter-6-gdp-b4YmobDPSmyijNq5ssJ.wA" }, "6f8626a1", "✓ LOCKED"],
      ["Ch7", "Economic Growth", { url: "https://www.perplexity.ai/computer/a/eco-210-econlab-chapter-7-econ-lf9uJ_8bRlCc.9gvUtfUWg" }, "95ff6e27", "✓ LOCKED"],
      ["Ch8", "Unemployment", { url: "https://www.perplexity.ai/computer/a/eco-210-econlab-chapter-8-unem-OYbSU0EpSfaI5J8VHHIPqA" }, "3986d253", "✓ LOCKED"],
      ["Ch9", "Inflation", { url: "https://www.perplexity.ai/computer/a/eco-210-econlab-chapter-9-infl-Ae_nq32ySfu.muqTOUGNtg" }, "01efe7ab", "✓ LOCKED"],
      ["Ch11", "AD-AS Model", { url: "https://www.perplexity.ai/computer/a/eco-210-econlab-chapter-11-ad-1kct90oSRI6ewOkgNmikYg" }, "d6472df7", "✓ LOCKED"],
      ["Ch12+13", "Keynesian & Neoclassical", { url: "https://www.perplexity.ai/computer/a/eco-210-econlab-chapter-12-13-KIYjJzdKT0WCQ9mnU_mJyg" }, "28862327", "✓ LOCKED"],
      ["Ch14", "Money & Banking", { url: "https://www.perplexity.ai/computer/a/econ-lab-ch14-dist-public-9i2t1qz7QcCm4m.Egpnydg" }, "f62dadd6", "✓ LOCKED"],
      ["Ch15", "Monetary Policy", { url: "https://www.perplexity.ai/computer/a/econ-lab-ch15-dist-public-1p_a402eReqJptapbXneuQ" }, "d69fdae3", "✓ LOCKED"],
      ["Ch17", "Fiscal Policy", { url: "https://www.perplexity.ai/computer/a/econ-lab-ch17-dist-public-hzOJqpbDRhy83Ckk5wKoDQ" }, "873389aa", "✓ LOCKED"],
    ]
  )
);
children.push(new Paragraph({ text: "" }));

// --- Review Labs ---
children.push(bold("Review Labs"));
children.push(
  buildTable(
    ["Item", "Chapters", "URL", "Asset ID", "Status"],
    [
      ["Review Lab 2", "Ch6–9", { url: "https://www.perplexity.ai/computer/a/econ-lab-review-ch69-dist-publ-gnMEko43SOy.POtWVA_p8w" }, "82730492", "✓ LOCKED"],
      ["Review Lab 3", "Ch11–17", { url: "https://www.perplexity.ai/computer/a/econ-lab-review-ch1117-dist-pu-bZAOg6CLSP6evPwbHtnXsw" }, "6d900e83", "✓ LOCKED"],
    ]
  )
);
children.push(new Paragraph({ text: "" }));

// --- Practice Final ---
children.push(bold("Practice Final"));
children.push(
  buildTable(
    ["Item", "URL", "Asset ID", "Status"],
    [
      ["Practice Final Exam", { url: "https://www.perplexity.ai/computer/a/eco210-practice-final-dist-pub-SHaeFsRQSFmz4eJswNj_cQ" }, "48769e16", "✓ LOCKED"],
    ]
  )
);
children.push(new Paragraph({ text: "" }));

// --- Full Course Roadmap ---
children.push(bold("Full Course Roadmap"));
const roadmap = [
  "Ch1 (needs testing)",
  "→ Ch2 (needs testing)",
  "→ Ch3 (not built)",
  "→ Ch20 (not built)",
  "→ Review Lab 1 Ch1-3+20 (not built)",
  "→ Ch6 ✓ LOCKED",
  "→ Ch7 ✓ LOCKED",
  "→ Practice Midterm (not built)",
  "→ Ch8 ✓ LOCKED",
  "→ Ch9 ✓ LOCKED",
  "→ Review Lab 2 Ch6-9 ✓ LOCKED",
  "→ Ch11 ✓ LOCKED",
  "→ Ch12+13 ✓ LOCKED",
  "→ Ch14 ✓ LOCKED",
  "→ Ch15 ✓ LOCKED",
  "→ Ch17 ✓ LOCKED",
  "→ Review Lab 3 Ch11-17 ✓ LOCKED",
  "→ Practice Final ✓ LOCKED",
];
roadmap.forEach((line) => children.push(plain(line)));
children.push(new Paragraph({ text: "" }));

// --- Labs Still Needing Testing ---
children.push(bold("Labs Still Needing Testing"));
["Ch1", "Ch2"].forEach((t) => children.push(bullet(t)));
children.push(new Paragraph({ text: "" }));

// --- Labs Not Yet Built ---
children.push(bold("Labs Not Yet Built"));
[
  "Ch3 (shared with ECO 211)",
  "Ch20 International Trade",
  "Review Lab 1 (Ch1-3+20)",
  "Practice Midterm",
].forEach((t) => children.push(bullet(t)));
children.push(new Paragraph({ text: "" }));

// --- Future Development Ideas ---
children.push(bold("Future Development Ideas"));
[
  "Ch14 Compound Growth Station: Age 20 vs Age 40 start scenarios, \"The one advantage you have is time!\"",
  "Video + 3-question quiz station (pilot Ch14 or Ch8)",
  "Expand quiz pools to 15-20 questions",
  "Minimum time gates on stations (60-90 sec)",
  "Exit ticket: make required before printing",
  "Single-origin rebuild / custom domain (post-pilot)",
  "Student analytics + instructor dashboard (post-pilot)",
  "Add Ch12+13 questions to Practice Final Midterm when built",
  "Labs to build: Ch3, Ch20, Review Lab 1, Practice Midterm",
].forEach((t) => children.push(bullet(t)));

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 22 },
      },
    },
  },
  sections: [{ children }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("/home/user/workspace/ECO210-Summary-Table.docx", buf);
  console.log("Wrote ECO210-Summary-Table.docx:", buf.length, "bytes");
});
