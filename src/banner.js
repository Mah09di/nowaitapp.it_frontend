import chalk from "chalk";
import figlet from "figlet";

export function showBanner(): void {
    console.clear();

    // Header line (enterprise style)
    console.log(
        chalk.gray("────────────────────────────────────────────────────────")
    );

    // Logo (centered feel)
    const logo = figlet.textSync("NOWAIT", {
        font: "ANSI Shadow",
        horizontalLayout: "default",
    });

    console.log(chalk.cyanBright.bold(logo));

    // Tagline (enterprise positioning)
    console.log(
        chalk.whiteBright.bold("\n  Intelligent Development Infrastructure")
    );

    console.log(
        chalk.gray("  Powered by Nowait Systems • Enterprise Edition\n")
    );

    // System status block
    console.log(chalk.greenBright("✔ System Status: ONLINE"));
    console.log(chalk.greenBright("✔ Dev Server: ACTIVE"));
    console.log(chalk.greenBright("✔ Hot Reload: ENABLED"));

    console.log("");

    // Network info block
    console.log(chalk.yellowBright("➜ Local:   http://localhost:5173"));
    console.log(chalk.yellowBright("➜ Network:  http://192.168.x.x:5173"));

    console.log("");

    // Footer
    console.log(
        chalk.gray("────────────────────────────────────────────────────────")
    );

    console.log(
        chalk.gray("© " + new Date().getFullYear() + " Nowait Organization")
    );

    console.log("\n");
}