import { defineConfig } from "@rspack/cli";
import { resolve } from "node:path";
import { RsdoctorRspackMultiplePlugin } from "@rsdoctor/rspack-plugin";

type Options = {
  target: "web" | "node";
  output: string;
};

function createConfig(options: Options) {
  return defineConfig({
    name: options.target,
    target: options.target,
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    devtool: "source-map",
    entry: {
      main: "./src/index.ts",
    },
    output: {
      filename: "bundle.js",
      path: resolve(process.cwd(), "dist", options.output),
      clean: true,
    },
    resolve: {
      extensions: ["...", ".ts"],
    },
  });
}

export default defineConfig([
  createConfig({ target: "web", output: "web" }),
  createConfig({ target: "node", output: "node" }),
]).map((config, index) => {
  config.plugins ||= [];
  config.plugins.push(
    new RsdoctorRspackMultiplePlugin({
      stage: index,
      mode: "brief",
      disableClientServer: true,
      brief: {
        writeDataJson: true,
      },
    })
  );
  return config;
});
