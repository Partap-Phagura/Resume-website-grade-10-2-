const chat = document.getElementById("chat");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let sessionMemory = [];

sendBtn.onclick = send;
input.addEventListener("keypress", e => {
  if (e.key === "Enter") send();
});

function send() {
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, "user");
  sessionMemory.push({ role: "user", text });
  const reply = respond(text);
  addMessage(reply, "bot");
  sessionMemory.push({ role: "bot", text: reply });
  input.value = "";
}

function addMessage(text, who) {
  const div = document.createElement("div");
  div.className = `msg ${who}`;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

/* ---------- UTILITIES ---------- */

const round5 = n => Math.round(n * 1e5) / 1e5;

function extract(text, key) {
  const match = text.match(new RegExp(`${key}\\s*=\\s*(-?\\d+(\\.\\d+)?)`, "i"));
  return match ? parseFloat(match[1]) : null;
}

/* ---------- CORE ROUTER ---------- */

function respond(q) {
  const t = q.toLowerCase();

  if (t.startsWith("can you give me questions on")) return practice(t);
  if (t.includes("explain")) return explain(t);

  if (t.includes("pythagoras")) return solvePythagoras(q);
  if (t.includes("quadratic")) return solveQuadratic(q);
  if (t.includes("sine law")) return solveSineLaw(q);
  if (t.includes("cosine law")) return solveCosineLaw(q);
  if (t.includes("sin") || t.includes("cos") || t.includes("tan")) return solveTrig(q);

  try {
    return `Result: ${round5(eval(q))}`;
  } catch {
    return "CalcBot: I couldn’t understand that. Try using one of the supported formats.";
  }
}

/* ---------- EXPLANATIONS ---------- */

function explain(q) {
  if (q.includes("pythagoras"))
    return "Pythagoras Theorem: a² + b² = c². It is used in right-angled triangles to find a missing side.";
  if (q.includes("quadratic"))
    return "Quadratic Formula: x = (−b ± √(b² − 4ac)) / 2a. It finds the roots of ax² + bx + c = 0.";
  if (q.includes("sine law"))
    return "Sine Law: a/sinA = b/sinB = c/sinC. Used when you know a side and its opposite angle.";
  if (q.includes("cosine law"))
    return "Cosine Law: c² = a² + b² − 2ab cosC. Used when two sides and the included angle are known.";
  return "CalcBot: Ask me to explain a specific formula.";
}

/* ---------- PRACTICE ---------- */

function practice(t) {
  const topic = t.split("on")[1]?.trim() || "math";
  let out = `Here are 5 practice questions on ${topic}:\n\n`;
  for (let i = 1; i <= 5; i++) {
    out += `${i}) Example ${topic} question\n`;
    out += `   Step-by-step solution included\n\n`;
  }
  return out;
}

/* ---------- SOLVERS ---------- */

function solvePythagoras(q) {
  const a = extract(q,"a"), b = extract(q,"b"), c = extract(q,"c");
  let steps = "Using a² + b² = c²\n";

  if (c === null) {
    const val = Math.sqrt(a*a + b*b);
    return `${steps}c = √(${a}² + ${b}²)\nc = ${round5(val)}`;
  }
  if (a === null) {
    const val = Math.sqrt(c*c - b*b);
    return `${steps}a = ${round5(val)}`;
  }
  if (b === null) {
    const val = Math.sqrt(c*c - a*a);
    return `${steps}b = ${round5(val)}`;
  }
  return "CalcBot: One value must be missing.";
}

function solveQuadratic(q) {
  const a = extract(q,"a"), b = extract(q,"b"), c = extract(q,"c");
  const d = b*b - 4*a*c;
  if (d < 0) return "There is no real answer. Check if your values are correct.";
  const x1 = (-b + Math.sqrt(d)) / (2*a);
  const x2 = (-b - Math.sqrt(d)) / (2*a);
  return `x = ${round5(x1)} or ${round5(x2)}`;
}

function solveSineLaw(q) {
  const A = extract(q,"a"), B = extract(q,"b");
  const a = extract(q,"A"), b = extract(q,"B");
  const val = a * Math.sin(B*Math.PI/180) / Math.sin(A*Math.PI/180);
  return `Result = ${round5(val)}`;
}

function solveCosineLaw(q) {
  const a = extract(q,"a"), b = extract(q,"b"), C = extract(q,"c");
  const val = Math.sqrt(a*a + b*b - 2*a*b*Math.cos(C*Math.PI/180));
  return `Result = ${round5(val)}`;
}

function solveTrig(q) {
  const o = extract(q,"opposite");
  const a = extract(q,"adjacent");
  const h = extract(q,"hypotenuse");

  if (q.includes("sin")) return `sin = ${round5(o/h)}`;
  if (q.includes("cos")) return `cos = ${round5(a/h)}`;
  if (q.includes("tan")) return `tan = ${round5(o/a)}`;
}