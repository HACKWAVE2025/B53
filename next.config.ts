import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // When multiple lockfiles are present Next.js warns about output tracing.
  // Setting `outputFileTracingRoot` to the repository root silences the warning.
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
