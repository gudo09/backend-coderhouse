import { execSync } from "child_process";

const commitMessage = process.argv[2];

if (!commitMessage) {
  console.error("Error: Necesitas proporcionar un mensaje para el commit.");
  process.exit(1);
}

try {
  execSync("git add .");
  execSync(`git commit -m "${commitMessage}"`);
  execSync("git push origin HEAD");
  console.log("Cambios empujados exitosamente.");
} catch (error) {
  console.error("Error durante el proceso de commit:", error.message);
}